import { expect, test } from "@app/hoot";
import { Component, xml } from "@app/owl";
import { contains, mountWithCleanup } from "@web/../tests/web_test_helpers";

import { ColorList } from "@web/core/colorlist/colorlist";

class Parent extends Component {
    static template = xml`
        <t t-component="Component" t-props="componentProps"/>
        <div class="outsideDiv">Outside div</div>
    `;
    static props = ["*"];

    get Component() {
        return this.props.Component || ColorList;
    }

    get componentProps() {
        const props = { ...this.props };
        delete props.Component;
        if (!props.onColorSelected) {
            props.onColorSelected = () => {};
        }
        return props;
    }
}

test("basic rendering with forceExpanded props", async () => {
    await mountWithCleanup(Parent, {
        props: {
            colors: [0, 9],
            forceExpanded: true,
        },
    });

    expect(".app_colorlist").toHaveCount(1);
    expect(".app_colorlist button").toHaveCount(2);
    expect(".app_colorlist button:eq(1)").toHaveAttribute("title", "Raspberry");
    expect(".app_colorlist button:eq(1)").toHaveClass("app_colorlist_item_color_9");
});

test("color click does not open the list if canToggle props is not given", async () => {
    const selectedColorId = 0;
    await mountWithCleanup(Parent, {
        props: {
            colors: [4, 5, 6],
            selectedColor: selectedColorId,
            onColorSelected: (colorId) => expect.step("color #" + colorId + " is selected"),
        },
    });
    expect(".app_colorlist").toHaveCount(1);
    expect("button.app_colorlist_toggler").toHaveCount(1);

    await contains(".app_colorlist").click();
    expect("button.app_colorlist_toggler").toHaveCount(1);
});

test("open the list of colors if canToggle props is given", async function () {
    const selectedColorId = 0;
    await mountWithCleanup(Parent, {
        props: {
            canToggle: true,
            colors: [4, 5, 6],
            selectedColor: selectedColorId,
            onColorSelected: (colorId) => expect.step("color #" + colorId + " is selected"),
        },
    });
    expect(".app_colorlist").toHaveCount(1);
    expect(".app_colorlist button").toHaveClass("app_colorlist_item_color_" + selectedColorId);

    await contains(".app_colorlist button").click();
    expect("button.app_colorlist_toggler").toHaveCount(0);
    expect(".app_colorlist button").toHaveCount(3);

    await contains(".outsideDiv").click();
    expect(".app_colorlist button").toHaveCount(1);
    expect("button.app_colorlist_toggler").toHaveCount(1);

    await contains(".app_colorlist_toggler").click();
    await contains(".app_colorlist button:eq(2)").click();
    expect.verifySteps(["color #6 is selected"]);
});
