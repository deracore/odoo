import { expect, test } from "@app/hoot";
import { check, click } from "@app/hoot-dom";
import { animationFrame } from "@app/hoot-mock";
import { defineModels, fields, models, mountView, onRpc } from "@web/../tests/web_test_helpers";

class Partner extends models.Model {
    bar = fields.Boolean({ default: true });

    _records = [{ id: 1, bar: false }];
}

defineModels([Partner]);

test("use BooleanToggleField in form view", async () => {
    await mountView({
        resModel: "partner",
        resId: 1,
        type: "form",
        arch: `<form><field name="bar" widget="boolean_toggle"/></form>`,
    });
    expect(`.form-check.app_boolean_toggle`).toHaveCount(1);
    expect(`.app_boolean_toggle input`).toBeEnabled();
    expect(`.app_boolean_toggle input`).not.toBeChecked();

    await check(`.app_field_widget[name='bar'] input`);
    await animationFrame();
    expect(`.app_boolean_toggle input`).toBeEnabled();
    expect(`.app_boolean_toggle input`).toBeChecked();
});

test("BooleanToggleField is disabled with a readonly attribute", async () => {
    await mountView({
        resModel: "partner",
        resId: 1,
        type: "form",
        arch: `<form><field name="bar" widget="boolean_toggle" readonly="1"/></form>`,
    });
    expect(`.form-check.app_boolean_toggle`).toHaveCount(1);
    expect(`.app_boolean_toggle input`).not.toBeEnabled();
});

test("BooleanToggleField is disabled if readonly in editable list", async () => {
    Partner._fields.bar.readonly = true;

    onRpc("has_group", () => true);
    await mountView({
        resModel: "partner",
        type: "list",
        arch: `
            <list editable="bottom">
                <field name="bar" widget="boolean_toggle"/>
            </list>
        `,
    });
    expect(`.app_boolean_toggle input`).not.toBeEnabled();
    expect(`.app_boolean_toggle input`).not.toBeChecked();

    await click(`.app_boolean_toggle`);
    await animationFrame();
    expect(`.app_boolean_toggle input`).not.toBeEnabled();
    expect(`.app_boolean_toggle input`).not.toBeChecked();
});

test("BooleanToggleField - auto save record when field toggled", async () => {
    onRpc("web_save", () => expect.step("web_save"));
    await mountView({
        resModel: "partner",
        resId: 1,
        type: "form",
        arch: `<form><field name="bar" widget="boolean_toggle"/></form>`,
    });
    await click(`.app_field_widget[name='bar'] input`);
    await animationFrame();
    expect.verifySteps(["web_save"]);
});

test("BooleanToggleField - autosave option set to false", async () => {
    onRpc("web_save", () => expect.step("web_save"));
    await mountView({
        resModel: "partner",
        resId: 1,
        type: "form",
        arch: `<form><field name="bar" widget="boolean_toggle" options="{'autosave': false}"/></form>`,
    });
    await click(`.app_field_widget[name='bar'] input`);
    await animationFrame();
    expect.verifySteps([]);
});
