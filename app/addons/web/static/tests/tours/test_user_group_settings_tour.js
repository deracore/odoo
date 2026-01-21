import { registry } from "@web/core/registry";

registry.category("web_tour.tours").add("test_user_group_settings", {
    url: "/app/settings?debug=assets,tests",
    steps: () => [
        // create new privileges
        {
            trigger: 'button[data-menu-xmlid="base.menu_users"]',
            content: "open user menu",
            run: "click",
        },
        {
            trigger: 'a[data-menu-xmlid="base.menu_action_res_groups_privilege"]',
            content: "open privilege menu",
            run: "click",
        },
        {
            trigger: 'th.app_group_name:contains("Master Data")',
        },
        {
            trigger: "button.app_list_button_add",
            content: "click on new button",
            run: "click",
        },
        {
            trigger: '.app_field_char[name="name"] input',
            content: "insert a privilege name",
            run: "edit Privi Foo",
        },
        {
            trigger: ".app_field_x2many_list_row_add a",
            content: "add groups (open modal)",
            run: "click",
        },
        {
            trigger: ".app_create_button",
            content: "create the first group",
            run: "click",
        },
        {
            trigger: '.app_field_char[name="name"] input[placeholder="Group Name"]',
            content: "insert the first group name",
            run: "edit Bar User",
        },
        {
            trigger: "footer .app_form_button_save_new",
            content: "create the second group",
            run: "click",
        },
        {
            trigger: "body .app_notebook_content:contains(bar user)",
        },
        {
            trigger: '.app_field_char[name="name"] input[placeholder="Group Name"]',
            content: "insert the second group name",
            run: "edit Bar Manager",
        },
        {
            trigger: 'a[name="inherit_groups"]',
            content: "get implied groups",
            run: "click",
        },
        {
            trigger: 'div[name="implied_ids"] .app_field_x2many_list_row_add a',
            content: "switch to implied",
            run: "click",
        },
        {
            trigger: ".app_searchview_input",
            content: "search 'Bar' groups",
            run: "edit Bar",
        },
        {
            trigger: ".app_searchview_autocomplete .app-dropdown-item.focus",
            content: "Validate search",
            run: "click",
        },
        {
            trigger: '.app_data_cell:contains("Bar User"):last',
            content: "click to implied group 'Bar User'",
            run: "click",
        },
        {
            trigger: "footer .app_form_button_save",
            content: "save group and close modal",
            run: "click",
        },
        {
            trigger:
                "body:not(:has(.modal:visible)) .app_notebook_content:contains(bar user):contains(bar manager)",
        },
        // and the new manager group to the demo user
        {
            trigger: 'button[data-menu-xmlid="base.menu_users"]',
            content: "open user menu",
            run: "click",
        },
        {
            trigger: 'a[data-menu-xmlid="base.menu_action_res_users"]',
            content: "open users & companies menu",
            run: "click",
        },
        {
            trigger: ".app_list_renderer:contains(marc demo):contains(mitchell admin)",
        },
        {
            trigger: '.app_data_row:contains(Marc Demo) .app_field_cell[name="name"]',
            content: "open users menu",
            run: "click",
        },
        {
            trigger: '.app_last_breadcrumb_item:contains("Marc Demo")',
            content: "check if is demo user",
        },
        {
            trigger:
                '.app_field_widget[name="group_ids"] .app_cell:has(label:contains("Privi Foo")) + .app_cell .app_select_menu input',
            content: "Add 'Bar Manager' access to demo user",
            run: `click`,
        },
        {
            trigger: `.app-dropdown--menu .app_select_menu_item:contains("Bar Manager")`,
            run: "click",
        },
        // open group information button (popover)
        {
            trigger:
                '.app_field_widget[name="group_ids"] .app_cell:has(label:contains("Privi Foo")) + .app_cell .app_group_info_button',
            content: "open group information for the new group",
            run: "click",
        },
        {
            trigger: '.app_popover:contains("Privi Foo") a:contains("Bar Manager")',
            content: "open the group from the info button",
            run: "click",
        },
        // check if demo user has this group
        {
            trigger: '.app_last_breadcrumb_item:contains("Bar Manager")',
            content: "check if is Bar Manager group",
        },
        {
            trigger: '.app_field_many2many[name="user_ids"] .app_data_cell:contains("Marc Demo")',
            content: "check if demo user has this group",
        },
    ],
});
