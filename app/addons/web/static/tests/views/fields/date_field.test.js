import { expect, queryFirst, test } from "@app/hoot";
import { click, edit, press, queryAllTexts, queryOne, scroll } from "@app/hoot-dom";
import { Deferred, animationFrame, mockDate, mockTimeZone } from "@app/hoot-mock";
import {
    assertDateTimePicker,
    getPickerCell,
    zoomOut,
} from "@web/../tests/core/datetime/datetime_test_helpers";
import {
    clickSave,
    contains,
    defineModels,
    defineParams,
    fieldInput,
    fields,
    models,
    mountView,
    onRpc,
    serverState,
} from "@web/../tests/web_test_helpers";

class Partner extends models.Model {
    _name = "res.partner";

    date = fields.Date();
    char_field = fields.Char({ string: "Char" });

    _records = [
        {
            id: 1,
            date: "2017-02-03",
            char_field: "first char field",
        },
    ];

    _views = {
        form: /* xml */ `
            <form>
                <sheet>
                    <group>
                        <field name="date"/>
                        <field name="char_field"/>
                    </group>
                </sheet>
            </form>
        `,
    };
}

defineModels([Partner]);

test("toggle datepicker", async () => {
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    expect(".app_datetime_picker").toHaveCount(0);
    await contains(".app_field_date button").click();
    await animationFrame();
    expect(".app_datetime_picker").toHaveCount(1);

    await fieldInput("char_field").click();
    expect(".app_datetime_picker").toHaveCount(0);
});

test("datepicker is automatically closed after selecting a value", async () => {
    Partner._onChanges.date = () => {};
    const def = new Deferred();
    onRpc("onchange", () => def);

    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    expect(".app_datetime_picker").toHaveCount(0);
    await contains(".app_field_date button").click();
    await animationFrame();
    expect(".app_datetime_picker").toHaveCount(1);

    await contains(getPickerCell(22)).click();
    await animationFrame();
    // The picker shouldn't be reopened, even if the onChange RPC is slow.
    expect(".app_datetime_picker").toHaveCount(0);
    def.resolve();
});

test("Ensure only one datepicker is open", async () => {
    Partner._fields.date_start = fields.Date();

    await mountView({
        type: "form",
        resModel: "res.partner",
        arch: `
            <form>
                <field name="date_start"/>
                <field name="date"/>
            </form>`,
        resId: 1,
    });

    await queryFirst("[data-field='date_start']").click();
    await queryFirst("[data-field='date']").click();
    await animationFrame();
    expect(".app_datetime_picker").toHaveCount(1);
});

test.tags("desktop");
test("open datepicker on Control+Enter", async () => {
    defineParams({
        lang_parameters: {
            date_format: "%d/%m/%Y",
            time_format: "%H:%M:%S",
        },
    });
    await mountView({
        resModel: "res.partner",
        type: "form",
        arch: `
            <form>
                <field name="date"/>
            </form>
        `,
    });

    expect(".app_field_date input").toHaveCount(1);

    await press(["ctrl", "enter"]);
    await animationFrame();
    expect(".app_datetime_picker").toHaveCount(1);

    //edit the input and open the datepicker again with ctrl+enter
    await contains(".app_field_date .app_input").click();
    await edit("09/01/1997");
    await press(["ctrl", "enter"]);
    await animationFrame();
    assertDateTimePicker({
        title: "January 1997",
        date: [
            {
                cells: [
                    [29, 30, 31, 1, 2, 3, 4],
                    [5, 6, 7, 8, [9], 10, 11],
                    [12, 13, 14, 15, 16, 17, 18],
                    [19, 20, 21, 22, 23, 24, 25],
                    [26, 27, 28, 29, 30, 31, 1],
                    [2, 3, 4, 5, 6, 7, 8],
                ],
                daysOfWeek: ["", "S", "M", "T", "W", "T", "F", "S"],
                weekNumbers: [1, 2, 3, 4, 5, 6],
            },
        ],
    });
});
test("toggle datepicker far in the future", async () => {
    Partner._records[0].date = "9999-12-31";
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    expect(".app_datetime_picker").toHaveCount(0);
    await contains(".app_field_date button").click();
    expect(".app_datetime_picker").toHaveCount(1);

    // focus another field
    await fieldInput("char_field").click();
    expect(".app_datetime_picker").toHaveCount(0);
});

test("date field is empty if no date is set", async () => {
    Partner._records[0].date = false;
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    expect(".app_field_date input").toHaveCount(1);
    expect(".app_field_date input").toHaveValue("");
});

test("set an invalid date when the field is already set", async () => {
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    await contains(".app_field_widget[name='date'] button").click();
    expect(".app_field_widget[name='date'] input").toHaveValue("02/03/2017");
    await fieldInput("date").edit("invalid date");
    await contains(".app_field_widget[name='date'] button").click();
    expect(".app_field_widget[name='date'] input").toHaveValue("02/03/2017", {
        message: "Should have been reset to the original value",
    });
});

test("set an invalid date when the field is not set yet", async () => {
    Partner._records[0].date = false;
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    expect(".app_field_widget[name='date'] input").toHaveValue("");
    await fieldInput("date").edit("invalid date");
    expect(".app_field_widget[name='date'] input").toHaveValue("");
});

test("value should not set on first click", async () => {
    Partner._records[0].date = false;
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    await contains(".app_field_date input").click();
    expect(".app_field_widget[name='date'] input").toHaveValue("");
    await contains(getPickerCell(22)).click();

    await contains(".app_field_date button").click();
    expect(".app_date_item_cell.app_selected").toHaveText("22");
});

test("date field in form view (with positive time zone offset)", async () => {
    mockTimeZone(2); // should be ignored by date fields
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    onRpc("web_save", ({ args }) => {
        expect.step(args[1].date);
    });

    expect(".app_field_date").toHaveText("Feb 3, 2017");

    // open datepicker and select another value
    await contains(".app_field_date button").click();
    expect(".app_datetime_picker").toHaveCount(1);
    expect(".app_date_item_cell.app_selected").toHaveCount(1);

    // select 22 Feb 2017
    await zoomOut();
    await zoomOut();
    await contains(getPickerCell("2017")).click();
    await contains(getPickerCell("Feb")).click();
    await contains(getPickerCell("22")).click();
    expect(".app_datetime_picker").toHaveCount(0);
    expect(".app_field_date").toHaveText("Feb 22, 2017");

    await clickSave();
    expect.verifySteps(["2017-02-22"]);
    expect(".app_field_date").toHaveText("Feb 22, 2017");
});

test("date field in form view (with negative time zone offset)", async () => {
    mockTimeZone(-2); // should be ignored by date fields
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    expect(".app_field_date button").toHaveText("Feb 3, 2017");
});

test("date field dropdown doesn't dissapear on scroll", async () => {
    await mountView({
        type: "form",
        resModel: "res.partner",
        resId: 1,
        arch: `
                <form>
                    <div class="scrollable overflow-auto" style="height: 50px;">
                        <div style="height: 2000px;">
                            <field name="date" />
                        </div>
                    </div>
                </form>`,
    });

    await contains(".app_field_date button").click();
    expect(".app_datetime_picker").toHaveCount(1);
    await scroll(".scrollable", { top: 50 });
    expect(".scrollable").toHaveProperty("scrollTop", 50);
    expect(".app_datetime_picker").toHaveCount(1);
});

test("date field with label opens datepicker on click", async () => {
    await mountView({
        type: "form",
        resModel: "res.partner",
        resId: 1,
        arch: `
            <form>
                <label for="date" string="What date is it" />
                <field name="date" />
            </form>`,
    });

    await contains("label.app_form_label").click();
    expect(".app_datetime_picker").toHaveCount(1);
});

test("date field with warn_future option ", async () => {
    Partner._records[0] = { id: 1 };
    await mountView({
        type: "form",
        resModel: "res.partner",
        resId: 1,
        arch: `
            <form>
                <field name="date" options="{'warn_future': true}" />
            </form>`,
    });

    await contains(".app_field_date input").click();
    await zoomOut();
    await zoomOut();
    await contains(getPickerCell("2020")).click();
    await contains(getPickerCell("Dec")).click();
    await contains(getPickerCell("22")).click();
    expect(".app_field_date button").toHaveClass("text-danger");
    await contains(".app_field_date button").click();
    await fieldInput("date").clear();
    expect(".app_field_date input").not.toHaveClass("text-danger");
});

test("date field with warn_future option: do not overwrite datepicker option", async () => {
    Partner._onChanges.date = () => {};

    await mountView({
        type: "form",
        resModel: "res.partner",
        resId: 1,
        // Do not let the date field get the focus in the first place
        arch: `
                <form>
                    <group>
                        <field name="char_field" />
                        <field name="date" options="{'warn_future': true}" />
                    </group>
                </form>`,
    });

    expect(".app_field_widget[name='date']").toHaveText("Feb 3, 2017");
    await contains(".app_form_button_create").click();
    expect(".app_field_widget[name='date'] input").toHaveValue("");
});

test.tags("desktop");
test("date field in editable list view", async () => {
    onRpc("has_group", () => true);
    await mountView({
        type: "list",
        resModel: "res.partner",
        arch: `
                <list editable="bottom">
                    <field name="date"/>
                </list>`,
    });

    const cell = queryOne("tr.app_data_row td:not(.app_list_record_selector)");
    expect(cell).toHaveText("Feb 3, 2017");
    await contains(cell).click();
    expect(".app_field_date button").toHaveCount(1);
    expect(".app_field_date button").toHaveText("Feb 3, 2017");

    // open datepicker and select another value
    await contains(".app_field_date button").click();
    expect(".app_datetime_picker").toHaveCount(1);
    await zoomOut();
    await zoomOut();
    await contains(getPickerCell("2017")).click();
    await contains(getPickerCell("Feb")).click();
    await contains(getPickerCell("22")).click();
    expect(".app_datetime_picker").toHaveCount(0);
    expect(".app_field_date button").toHaveText("Feb 22, 2017");

    await contains(".app_list_button_save").click();
    expect("tr.app_data_row td:not(.app_list_record_selector)").toHaveText("Feb 22, 2017");
});

test.tags("desktop");
test("multi edition of date field in list view: clear date in input", async () => {
    onRpc("has_group", () => true);
    Partner._records = [
        { id: 1, date: "2017-02-03" },
        { id: 2, date: "2017-02-03" },
    ];

    await mountView({
        type: "list",
        resModel: "res.partner",
        arch: `
            <list multi_edit="1">
                <field name="date"/>
            </list>`,
    });

    await contains(".app_data_row:eq(0) .app_list_record_selector input").click();
    await contains(".app_data_row:eq(1) .app_list_record_selector input").click();
    await contains(".app_data_row:eq(0) .app_data_cell").click();

    expect(".app_field_date button").toHaveCount(1);
    await contains(".app_field_date button").click();
    await fieldInput("date").clear();

    expect(".modal").toHaveCount(1);
    await contains(".modal .modal-footer .btn-primary").click();

    expect(".app_data_row:first-child .app_data_cell").toHaveText("");
    expect(".app_data_row:nth-child(2) .app_data_cell").toHaveText("");
});

test("date field remove value", async () => {
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });
    onRpc("web_save", ({ args }) => {
        expect.step(args[1].date);
    });

    expect(".app_field_date").toHaveText("Feb 3, 2017");

    await contains(".app_field_date button").click();
    await fieldInput("date").clear();
    expect(".app_field_date input").toHaveValue("");

    await clickSave();
    expect(".app_field_date").toHaveText("");
    expect.verifySteps([false]);
});

test("date field should select its content onclick when there is one", async () => {
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    await contains(".app_field_date button").click();
    await contains(".app_field_date input").click();
    expect(".app_datetime_picker").toHaveCount(1);
    const active = document.activeElement;
    expect(active.tagName).toBe("INPUT");
    expect(active.value.slice(active.selectionStart, active.selectionEnd)).toBe("02/03/2017");
});

test("date field supports custom formats", async () => {
    defineParams({ lang_parameters: { date_format: "%d-%m-%Y" } });
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    expect(".app_field_date").toHaveText("Feb 3, 2017");
    await contains(".app_field_date button").click();
    expect(".app_field_date input").toHaveValue("03-02-2017");

    await contains(getPickerCell("22")).click();
    await clickSave();
    expect(".app_field_date").toHaveText("Feb 22, 2017");
});

test("date field supports internationalization", async () => {
    serverState.lang = "nb_NO";
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });

    expect(".app_field_date").toHaveText("3. feb. 2017");
    await contains(".app_field_date button").click();
    expect(".app_field_date input").toHaveValue("02/03/2017");
    expect(".app_zoom_out strong").toHaveText("februar 2017");

    await contains(getPickerCell("22")).click();
    await clickSave();
    expect(".app_field_date").toHaveText("22. feb. 2017");
});

test("hit enter should update value", async () => {
    mockTimeZone(2);
    await mountView({ type: "form", resModel: "res.partner", resId: 1 });
    await contains(".app_field_date button").click();
    await contains(".app_field_date input").edit("01/08");
    expect(".app_field_widget[name='date']").toHaveText("Jan 8");
    await contains(".app_field_date button").click();
    await contains(".app_field_date input").edit("08/01");
    expect(".app_field_widget[name='date']").toHaveText("Aug 1");
});

test("allow to use compute dates (+5d for instance)", async () => {
    mockDate({ year: 2021, month: 2, day: 15 });

    Partner._fields.date.default = "2019-09-15";
    await mountView({ type: "form", resModel: "res.partner" });

    expect(".app_field_date").toHaveText("Sep 15, 2019");
    await contains(".app_field_date button").click();
    await fieldInput("date").edit("+5d");
    expect(".app_field_date").toHaveText("Feb 20");

    // Discard and do it again
    await contains(".app_form_button_cancel").click();
    expect(".app_field_date").toHaveText("Sep 15, 2019");
    await contains(".app_field_date button").click();
    await fieldInput("date").edit("+5d");
    expect(".app_field_date").toHaveText("Feb 20");

    // Save and do it again
    await clickSave();
    expect(".app_field_date").toHaveText("Feb 20");
    await contains(".app_field_date button").click();
    await fieldInput("date").edit("+5d");
    expect(".app_field_date").toHaveText("Feb 20");
});

test("date field with min_precision option", async () => {
    await mountView({
        type: "form",
        resModel: "res.partner",
        resId: 1,
        // Do not let the date field get the focus in the first place
        arch: `
                <form>
                    <group>
                        <field name="date" options="{'min_precision': 'months'}" />
                    </group>
                </form>`,
    });

    await click(".app_field_date button");
    await animationFrame();
    expect(".app_date_item_cell").toHaveCount(12);
    expect(queryAllTexts(".app_date_item_cell")).toEqual([
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]);
    expect(".app_date_item_cell.app_selected").toHaveText("Feb");

    await click(getPickerCell("Jan"));
    await animationFrame();
    // The picker should be closed
    expect(".app_date_item_cell").toHaveCount(0);
    expect(".app_field_widget[name='date']").toHaveText("Jan 1, 2017");
});

test("date field with max_precision option", async () => {
    await mountView({
        type: "form",
        resModel: "res.partner",
        resId: 1,
        // Do not let the date field get the focus in the first place
        arch: `
                <form>
                    <group>
                        <field name="date" options="{'max_precision': 'months'}" />
                    </group>
                </form>`,
    });

    await click(".app_field_date button");
    await animationFrame();
    // Try to zoomOut twice to be in the year selector
    await zoomOut();
    // Currently in the month selector
    expect(".app_datetime_picker_header").toHaveText("2017");
    await zoomOut();
    // Stay in the month selector according to the max precision value
    expect(".app_datetime_picker_header").toHaveText("2017");
    expect(".app_date_item_cell.app_selected").toHaveText("Feb");

    await click(getPickerCell("Jan"));
    await animationFrame();
    await click(getPickerCell("12"));
    await animationFrame();
    expect(".app_field_widget[name='date']").toHaveText("Jan 12, 2017");
});

test("DateField with onchange forcing a specific date", async () => {
    mockDate("2009-05-04 10:00:00", +1);

    Partner._onChanges.date = (obj) => {
        if (obj.char_field === "force today") {
            obj.date = "2009-05-04";
        }
    };

    await mountView({
        type: "form",
        resModel: "res.partner",
        arch: /* xml */ `
            <form>
                <field name="char_field"/>
                <field name="date"/>
            </form>`,
    });

    expect(".app_field_date input").toHaveValue("");

    // enable the onchange
    await contains(".app_field_widget[name=char_field] input").edit("force today");

    // open the picker and try to set a value different from today
    await click(".app_field_date input");
    await animationFrame();
    expect(".app_datetime_picker").toHaveCount(1);
    await contains(getPickerCell("22")).click(); // 22 May 2009
    expect(".app_field_date").toHaveText("May 4"); // value forced by the onchange

    // do it again (the technical flow is a bit different as now the current value is already today)
    await click(".app_field_date button");
    await animationFrame();
    expect(".app_datetime_picker").toHaveCount(1);
    await contains(getPickerCell("22")).click(); // 22 May 2009
    expect(".app_field_date").toHaveText("May 4"); // value forced by the onchange
});
