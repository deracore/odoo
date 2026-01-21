import { expect, test } from "@app/hoot";
import { animationFrame } from "@app/hoot-mock";
import {
    contains,
    defineActions,
    defineModels,
    getService,
    models,
    mountWithCleanup,
    onRpc,
    patchWithCleanup,
    webModels,
} from "@web/../tests/web_test_helpers";

import { user } from "@web/core/user";
import { WebClient } from "@web/webclient/webclient";

const { ResCompany, ResPartner, ResUsers } = webModels;

class Partner extends models.Model {
    _rec_name = "display_name";

    _records = [
        { id: 1, display_name: "First record" },
        { id: 2, display_name: "Second record" },
    ];
    _views = {
        form: `
            <form>
                <header>
                    <button name="object" string="Call method" type="object"/>
                    <button name="4" string="Execute action" type="action"/>
                </header>
                <group>
                    <field name="display_name"/>
                </group>
            </form>`,
        "kanban,1": `
            <kanban>
                <templates>
                    <t t-name="card">
                        <field name="display_name"/>
                    </t>
                </templates>
            </kanban>`,
        list: `<list><field name="display_name"/></list>`,
    };
}

defineModels([Partner, ResCompany, ResPartner, ResUsers]);

defineActions([
    {
        id: 1,
        xml_id: "action_1",
        name: "Partners Action 1",
        res_model: "partner",
        views: [[1, "kanban"]],
    },
    {
        id: 3,
        xml_id: "action_3",
        name: "Partners",
        res_model: "partner",
        views: [
            [false, "list"],
            [1, "kanban"],
            [false, "form"],
        ],
    },
    {
        id: 6,
        xml_id: "action_6",
        name: "Partner",
        res_id: 2,
        res_model: "partner",
        views: [[false, "form"]],
    },
]);

test.tags("desktop");
test("rainbowman integrated to webClient", async () => {
    patchWithCleanup(user, { showEffect: true });

    await mountWithCleanup(WebClient);
    await getService("action").doAction(1);
    expect(".app_kanban_view").toHaveCount(1);
    expect(".app_reward").toHaveCount(0);
    getService("effect").add({ type: "rainbow_man", message: "", fadeout: "no" });
    await animationFrame();
    expect(".app_reward").toHaveCount(1);
    expect(".app_kanban_view").toHaveCount(1);
    await contains(".app_reward").click();
    expect(".app_reward").toHaveCount(0);
    expect(".app_kanban_view").toHaveCount(1);
    getService("effect").add({ type: "rainbow_man", message: "", fadeout: "no" });
    await animationFrame();
    expect(".app_reward").toHaveCount(1);
    expect(".app_kanban_view").toHaveCount(1);
    // Do not force rainbow man to destroy on doAction
    // we let it die either after its animation or on user click
    await getService("action").doAction(3);
    expect(".app_reward").toHaveCount(1);
    expect(".app_list_view").toHaveCount(1);
});

test.tags("desktop");
test("on close with effect from server", async () => {
    patchWithCleanup(user, { showEffect: true });
    onRpc("/web/dataset/call_button/*", () => {
        return {
            type: "ir.actions.act_window_close",
            effect: {
                type: "rainbow_man",
                message: "button called",
            },
        };
    });

    await mountWithCleanup(WebClient);
    await getService("action").doAction(6);
    await contains("button[name=object]").click();
    expect(".app_reward").toHaveCount(1);
});

test.tags("desktop");
test("on close with effect in xml on desktop", async () => {
    patchWithCleanup(user, { showEffect: true });

    Partner._views["form"] = `
        <form>
            <header>
            <button string="Call method" name="object" type="object"
                effect="{'type': 'rainbow_man', 'message': 'rainBowInXML'}"
            />
            </header>
            <field name="display_name"/>
        </form>`;
    onRpc("/web/dataset/call_button/*", () => false);

    await mountWithCleanup(WebClient);
    await getService("action").doAction(6);
    await contains("button[name=object]").click();
    expect(".app_reward").toHaveCount(1);
    expect(".app_reward .app_reward_msg_content").toHaveText("rainBowInXML");
});

test.tags("mobile");
test("on close with effect in xml on mobile", async () => {
    patchWithCleanup(user, { showEffect: true });

    Partner._views["form"] = `
        <form>
            <header>
            <button string="Call method" name="object" type="object"
                effect="{'type': 'rainbow_man', 'message': 'rainBowInXML'}"
            />
            </header>
            <field name="display_name"/>
        </form>`;
    onRpc("/web/dataset/call_button/*", () => false);

    await mountWithCleanup(WebClient);
    await getService("action").doAction(6);
    await contains(`.app_cp_action_menus button:has(.fa-cog)`).click();
    await contains("button[name=object]").click();
    expect(".app_reward").toHaveCount(1);
    expect(".app_reward .app_reward_msg_content").toHaveText("rainBowInXML");
});
