import { expect, test } from "@app/hoot";
import { check, click, queryRect } from "@app/hoot-dom";
import { animationFrame } from "@app/hoot-mock";
import {
    clickSave,
    defineModels,
    fields,
    models,
    mountView,
    onRpc,
} from "@web/../tests/web_test_helpers";

class Partner extends models.Model {
    bar = fields.Boolean({ default: true });
    int_field = fields.Integer();
    trululu = fields.Many2one({ relation: "partner" });
    product_id = fields.Many2one({ relation: "product" });
    color = fields.Selection({
        selection: [
            ["red", "Red"],
            ["black", "Black"],
        ],
        default: "red",
    });
    _records = [
        {
            id: 1,
            display_name: "first record",
            bar: true,
            int_field: 10,
        },
        {
            id: 2,
            display_name: "second record",
        },
        {
            id: 3,
            display_name: "third record",
        },
    ];
}

class Product extends models.Model {
    display_name = fields.Char();
    _records = [
        {
            id: 37,
            display_name: "xphone",
        },
        {
            id: 41,
            display_name: "xpad",
        },
    ];
}

defineModels([Partner, Product]);

test("radio field on a many2one in a new record", async () => {
    await mountView({
        type: "form",
        resModel: "partner",
        arch: /* xml */ `<form><field name="product_id" widget="radio"/></form>`,
    });

    expect("div.app_radio_item").toHaveCount(2);
    expect("input.app_radio_input").toHaveCount(2);
    expect(".app_field_radio:first").toHaveText("xphone\nxpad");
    expect("input.app_radio_input:checked").toHaveCount(0);
});

test("required radio field on a many2one", async () => {
    await mountView({
        type: "form",
        resModel: "partner",
        arch: /* xml */ `<form><field name="product_id" widget="radio" required="1"/></form>`,
    });

    expect(".app_field_radio input:checked").toHaveCount(0);
    await clickSave();
    expect(".app_notification_content:first").toHaveText("Missing required fields");
    expect(".app_notification_bar:first").toHaveClass("bg-danger");
});

test("radio field change value by onchange", async () => {
    Partner._fields.bar = fields.Boolean({
        default: true,
        onChange: (obj) => {
            obj.product_id = obj.bar ? [41] : [37];
            obj.color = obj.bar ? "red" : "black";
        },
    });

    await mountView({
        type: "form",
        resModel: "partner",
        arch: /* xml */ `
            <form>
                <field name="bar" />
                <field name="product_id" widget="radio" />
                <field name="color" widget="radio" />
            </form>
        `,
    });

    await click(".app_field_boolean input[type='checkbox']");
    await animationFrame();
    expect("input.app_radio_input[data-value='37']").toBeChecked();
    expect("input.app_radio_input[data-value='black']").toBeChecked();

    await click(".app_field_boolean input[type='checkbox']");
    await animationFrame();
    expect("input.app_radio_input[data-value='41']").toBeChecked();
    expect("input.app_radio_input[data-value='red']").toBeChecked();
});

test("radio field on a selection in a new record", async () => {
    await mountView({
        type: "form",
        resModel: "partner",
        arch: /* xml */ `<form><field name="color" widget="radio"/></form>`,
    });

    expect("div.app_radio_item").toHaveCount(2);
    expect("input.app_radio_input").toHaveCount(2, { message: "should have 2 possible choices" });
    expect(".app_field_radio").toHaveText("Red\nBlack");

    // click on 2nd option
    await click("input.app_radio_input:eq(1)");
    await animationFrame();

    await clickSave();

    expect("input.app_radio_input[data-value=black]").toBeChecked({
        message: "should have saved record with correct value",
    });
});

test("two radio field with same selection", async () => {
    Partner._fields.color_2 = { ...Partner._fields.color };
    Partner._records[0].color = "black";
    Partner._records[0].color_2 = "black";

    await mountView({
        type: "form",
        resModel: "partner",
        resId: 1,
        arch: /* xml */ `
            <form>
                <group>
                    <field name="color" widget="radio"/>
                </group>
                <group>
                    <field name="color_2" widget="radio"/>
                </group>
            </form>
        `,
    });

    expect("[name='color'] input.app_radio_input[data-value=black]").toBeChecked();
    expect("[name='color_2'] input.app_radio_input[data-value=black]").toBeChecked();

    // click on Red
    await click("[name='color_2'] label");
    await animationFrame();

    expect("[name='color'] input.app_radio_input[data-value=black]").toBeChecked();
    expect("[name='color_2'] input.app_radio_input[data-value=red]").toBeChecked();
});

test("radio field has app_horizontal or app_vertical class", async () => {
    Partner._fields.color2 = Partner._fields.color;

    await mountView({
        type: "form",
        resModel: "partner",
        arch: /* xml */ `
            <form>
                <group>
                    <field name="color" widget="radio" />
                    <field name="color2" widget="radio" options="{'horizontal': True}" />
                </group>
            </form>
        `,
    });

    expect(".app_field_radio > div.app_vertical").toHaveCount(1, {
        message: "should have app_vertical class",
    });

    const verticalRadio = ".app_field_radio > div.app_vertical:first";
    expect(`${verticalRadio} .app_radio_item:first`).toHaveRect({
        right: queryRect(`${verticalRadio} .app_radio_item:last`).right,
    });
    expect(".app_field_radio > div.app_horizontal").toHaveCount(1, {
        message: "should have app_horizontal class",
    });
    const horizontalRadio = ".app_field_radio > div.app_horizontal:first";
    expect(`${horizontalRadio} .app_radio_item:first`).toHaveRect({
        top: queryRect(`${horizontalRadio} .app_radio_item:last`).top,
    });
});

test("radio field with numerical keys encoded as strings", async () => {
    Partner._fields.selection = fields.Selection({
        selection: [
            ["0", "Red"],
            ["1", "Black"],
        ],
    });

    onRpc("partner", "web_save", ({ args }) => expect.step(args[1].selection));

    await mountView({
        type: "form",
        resModel: "partner",
        resId: 1,
        arch: /* xml */ `<form><field name="selection" widget="radio"/></form>`,
    });
    expect(".app_field_widget").toHaveText("Red\nBlack");
    expect(".app_radio_input:checked").toHaveCount(0);

    await check("input.app_radio_input:last");
    await animationFrame();
    await clickSave();

    expect(".app_field_widget").toHaveText("Red\nBlack");
    expect(".app_radio_input[data-value='1']").toBeChecked();

    expect.verifySteps(["1"]);
});

test("radio field is empty", async () => {
    await mountView({
        type: "form",
        resModel: "partner",
        resId: 2,
        arch: /* xml */ `
            <form edit="0">
                <field name="trululu" widget="radio" />
            </form>
        `,
    });

    expect(".app_field_widget[name=trululu]").toHaveClass("app_field_empty");
    expect(".app_radio_input").toHaveCount(3);
    expect(".app_radio_input:disabled").toHaveCount(3);
    expect(".app_radio_input:checked").toHaveCount(0);
});
