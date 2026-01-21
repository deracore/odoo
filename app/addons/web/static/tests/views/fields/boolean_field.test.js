import { expect, test } from "@app/hoot";
import { check, click, press, uncheck } from "@app/hoot-dom";
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

    _records = [
        { id: 1, bar: true },
        { id: 2, bar: true },
        { id: 3, bar: true },
        { id: 4, bar: true },
        { id: 5, bar: false },
    ];
}

defineModels([Partner]);

test("boolean field in form view", async () => {
    await mountView({
        resModel: "partner",
        resId: 1,
        type: "form",
        arch: `
            <form>
                <label for="bar" string="Awesome checkbox"/>
                <field name="bar"/>
            </form>
        `,
    });
    expect(`.app_field_boolean input`).toBeChecked();
    expect(`.app_field_boolean input`).toBeEnabled();

    await uncheck(`.app_field_boolean input`);
    await animationFrame();
    expect(`.app_field_boolean input`).not.toBeChecked();

    await clickSave();
    expect(`.app_field_boolean input`).not.toBeChecked();

    await check(`.app_field_boolean input`);
    await animationFrame();
    expect(`.app_field_boolean input`).toBeChecked();

    await uncheck(`.app_field_boolean input`);
    await animationFrame();
    expect(`.app_field_boolean input`).not.toBeChecked();

    await click(`.app_form_view label:not(.form-check-label)`);
    await animationFrame();
    expect(`.app_field_boolean input`).toBeChecked();

    await click(`.app_form_view label:not(.form-check-label)`);
    await animationFrame();
    expect(`.app_field_boolean input`).not.toBeChecked();

    await press("enter");
    await animationFrame();
    expect(`.app_field_boolean input`).toBeChecked();

    await press("enter");
    await animationFrame();
    expect(`.app_field_boolean input`).not.toBeChecked();

    await press("enter");
    await animationFrame();
    expect(`.app_field_boolean input`).toBeChecked();

    await clickSave();
    expect(`.app_field_boolean input`).toBeChecked();
});

test("boolean field in editable list view", async () => {
    onRpc("has_group", () => true);

    await mountView({
        resModel: "partner",
        type: "list",
        arch: `<list editable="bottom"><field name="bar"/></list>`,
    });
    expect(`tbody td:not(.app_list_record_selector) .app-checkbox input`).toHaveCount(5);
    expect(`tbody td:not(.app_list_record_selector) .app-checkbox input:checked`).toHaveCount(4);

    // Edit a line
    const cell = `tr.app_data_row td:not(.app_list_record_selector):first`;
    expect(`${cell} .app-checkbox input:only`).toBeChecked();
    expect(`${cell} .app-checkbox input:only`).not.toBeEnabled();

    await click(`${cell} .app-checkbox`);
    await animationFrame();
    expect(`tr.app_data_row:nth-child(1)`).toHaveClass("app_selected_row", {
        message: "the row is now selected, in edition",
    });
    expect(`${cell} .app-checkbox input:only`).not.toBeChecked();
    expect(`${cell} .app-checkbox input:only`).toBeEnabled();

    await click(`${cell} .app-checkbox`);
    await click(cell);
    await animationFrame();
    expect(`${cell} .app-checkbox input:only`).toBeChecked();
    expect(`${cell} .app-checkbox input:only`).toBeEnabled();

    await click(`${cell} .app-checkbox`);
    await animationFrame();

    await click(`.app_list_button_save`);
    await animationFrame();
    expect(`${cell} .app-checkbox input:only`).not.toBeChecked();
    expect(`${cell} .app-checkbox input:only`).not.toBeEnabled();
    expect(`tbody td:not(.app_list_record_selector) .app-checkbox input`).toHaveCount(5);
    expect(`tbody td:not(.app_list_record_selector) .app-checkbox input:checked`).toHaveCount(3);

    // Fake-check the checkbox
    await click(cell);
    await animationFrame();
    await click(`${cell} .app-checkbox`);
    await animationFrame();

    await click(`.app_list_button_save`);
    await animationFrame();
    expect(`tbody td:not(.app_list_record_selector) .app-checkbox input`).toHaveCount(5);
    expect(`tbody td:not(.app_list_record_selector) .app-checkbox input:checked`).toHaveCount(3);
});

test("readonly boolean field", async () => {
    await mountView({
        resModel: "partner",
        resId: 1,
        type: "form",
        arch: `<form><field name="bar" readonly="1"/></form>`,
    });
    expect(`.app_field_boolean input`).toBeChecked();
    expect(`.app_field_boolean input`).not.toBeEnabled();

    await click(`.app_field_boolean .app-checkbox`);
    await animationFrame();
    expect(`.app_field_boolean input`).toBeChecked();
    expect(`.app_field_boolean input`).not.toBeEnabled();
});

test("onchange return value before toggle checkbox", async () => {
    Partner._onChanges.bar = (record) => {
        record["bar"] = true;
    };

    await mountView({
        resModel: "partner",
        resId: 1,
        type: "form",
        arch: `<form><field name="bar"/></form>`,
    });
    expect(`.app_field_boolean input`).toBeChecked();

    await click(`.app_field_boolean .app-checkbox`);
    await animationFrame();
    await animationFrame();
    expect(`.app_field_boolean input`).toBeChecked();
});
