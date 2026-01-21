import { expect, test } from "@app/hoot";
import { defineModels, fields, models, mountView } from "@web/../tests/web_test_helpers";

class Product extends models.Model {
    json_field = fields.Json();

    _records = [{ id: 1, json_field: "['coupon', 'promotion']" }];
}

defineModels([Product]);

test("basic rendering", async () => {
    await mountView({
        type: "form",
        resModel: "product",
        resId: 1,
        arch: '<form><field name="json_field"/></form>',
    });
    expect(".app_field_json").toHaveCount(1);
    expect(".app_field_json span").toHaveText(`"['coupon', 'promotion']"`);
});
