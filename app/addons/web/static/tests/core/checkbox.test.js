import { expect, test } from "@app/hoot";
import { check, uncheck } from "@app/hoot-dom";
import { Component, useState, xml } from "@app/owl";
import { contains, defineParams, mountWithCleanup } from "@web/../tests/web_test_helpers";

import { CheckBox } from "@web/core/checkbox/checkbox";

test("can be rendered", async () => {
    await mountWithCleanup(CheckBox);

    expect(`.app-checkbox input[type=checkbox]`).toHaveCount(1);
    expect(`.app-checkbox input[type=checkbox]`).toBeEnabled();
});

test("has a slot for translatable text", async () => {
    defineParams({ translations: { ragabadabadaba: "rugubudubudubu" } });

    class Parent extends Component {
        static components = { CheckBox };
        static props = {};
        static template = xml`<div t-translation-context="web"><CheckBox>ragabadabadaba</CheckBox></div>`;
    }

    await mountWithCleanup(Parent);

    expect(`.form-check`).toHaveCount(1);
    expect(`.form-check`).toHaveText("rugubudubudubu", { exact: true });
});

test("call onChange prop when some change occurs", async () => {
    let value = false;
    class Parent extends Component {
        static components = { CheckBox };
        static props = {};
        static template = xml`<CheckBox onChange="onChange" />`;
        onChange(checked) {
            value = checked;
        }
    }

    await mountWithCleanup(Parent);

    expect(`.app-checkbox input`).toHaveCount(1);

    await check("input");

    expect(value).toBe(true);

    await uncheck("input");

    expect(value).toBe(false);
});

test("checkbox with props disabled", async () => {
    class Parent extends Component {
        static components = { CheckBox };
        static props = {};
        static template = xml`<CheckBox disabled="true" />`;
    }

    await mountWithCleanup(Parent);

    expect(`.app-checkbox input`).toHaveCount(1);
    expect(`.app-checkbox input`).not.toBeEnabled();
});

test.tags("desktop");
test("can toggle value by pressing ENTER", async () => {
    class Parent extends Component {
        static components = { CheckBox };
        static props = {};
        static template = xml`<CheckBox onChange.bind="onChange" value="state.value" />`;

        setup() {
            this.state = useState({ value: false });
        }

        onChange(checked) {
            this.state.value = checked;
        }
    }

    await mountWithCleanup(Parent);

    expect(`.app-checkbox input`).toHaveCount(1);
    expect(`.app-checkbox input`).not.toBeChecked();

    await contains(".app-checkbox input").press("Enter");

    expect(`.app-checkbox input`).toBeChecked();

    await contains(".app-checkbox input").press("Enter");

    expect(`.app-checkbox input`).not.toBeChecked();
});

test.tags("desktop");
test("toggling through multiple ways", async () => {
    class Parent extends Component {
        static components = { CheckBox };
        static props = {};
        static template = xml`<CheckBox onChange.bind="onChange" value="state.value" />`;

        setup() {
            this.state = useState({ value: false });
        }

        onChange(checked) {
            this.state.value = checked;
            expect.step(String(checked));
        }
    }

    await mountWithCleanup(Parent);

    expect(`.app-checkbox input`).toHaveCount(1);
    expect(`.app-checkbox input`).not.toBeChecked();

    await contains(".app-checkbox").click();

    expect(`.app-checkbox input`).toBeChecked();

    await contains(".app-checkbox > .form-check-label", { visible: false }).uncheck();

    expect(`.app-checkbox input`).not.toBeChecked();

    await contains(".app-checkbox input").press("Enter");

    expect(`.app-checkbox input`).toBeChecked();

    await contains(".app-checkbox input").press(" ");

    expect(`.app-checkbox input`).not.toBeChecked();
    expect.verifySteps(["true", "false", "true", "false"]);
});

test("checkbox with props indeterminate", async () => {
    class Parent extends Component {
        static components = { CheckBox };
        static props = {};
        static template = xml`<CheckBox indeterminate="true" />`;
    }

    await mountWithCleanup(Parent);

    expect(`.app-checkbox input`).toHaveCount(1);
    expect(`.app-checkbox input`).toBeChecked({ indeterminate: true });
});
