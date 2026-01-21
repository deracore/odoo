import { registry } from "@web/core/registry";

registry.category("web_tour.tours").add("test_favorite_management", {
    url: "/app/apps",
    steps: () => [
        {
            trigger:
                ".app_kanban_renderer:not(:has(.app_kanban_record:contains(France - Localizations)))",
        },
        {
            trigger: ".app_facet_remove",
            run: "click",
        },
        {
            trigger: ".app_kanban_renderer:has(.app_kanban_record:contains(France - Localizations))",
        },
        {
            trigger: ".app_searchview_dropdown_toggler",
            run: "click",
        },
        {
            trigger: ".app_favorite_menu .app_accordion > .app_menu_item",
            run: "click",
        },
        {
            trigger: ".app_favorite_menu .app_accordion_values .app_input",
            run: "edit Apps1",
        },
        {
            trigger: ".app_save_favorite",
            run: "click",
        },
        {
            trigger: ".app_searchview_facet .app_facet_value:contains(Apps1)",
        },
        {
            trigger: ".app_group_by_menu > .app-dropdown-item:contains(Category)",
            run: "click",
        },
        {
            trigger: ".app_kanban_header:contains(Account Charts)",
        },
        {
            trigger: ".app_favorite_menu .app_accordion_values .app_input",
            run: "edit Apps2",
        },
        {
            trigger: ".app_save_favorite",
            run: "click",
        },
        {
            trigger: ".app_favorite_menu .app-dropdown-item:contains(Apps2)",
        },
        {
            trigger: ".app_favorite_menu .app-dropdown-item:contains(Apps1) i:not(:visible)",
            run: "click",
        },
        {
            trigger: ".app_field_domain > div > div",
            run: "click",
        },
        {
            trigger: ".app_tree_editor_row:contains(New Rule) > a",
            run: "click",
        },
        {
            trigger: ".app_form_button_save",
            run: "click",
        },
        {
            trigger: ".app_back_button > a",
            run: "click",
        },
        {
            trigger: ".app_facet_values:contains('Apps2')",
        },
        {
            trigger: ".app_kanban_header:contains(Account Charts)",
        },
        {
            trigger: ".app_searchview_dropdown_toggler",
            run: "click",
        },
        {
            trigger: ".app_favorite_menu .app-dropdown-item:contains(Apps1)",
            run: "click",
        },
        {
            trigger: ".app_kanban_record:not(.app_kanban_ghost):only",
        },
        {
            trigger: ".app_favorite_menu .app-dropdown-item:contains(Apps1) i:not(:visible)",
            run: "click",
        },
        {
            trigger: ".app_form_view .app_cp_action_menus .app-dropdown",
            run: "click",
        },
        {
            trigger: ".app_popover > .app-dropdown-item:contains(Delete)",
            run: "click",
        },
        {
            trigger: ".app_technical_modal button:contains(Delete)",
            run: "click",
        },
        {
            trigger: ".app_searchview_dropdown_toggler",
            run: "click",
        },
        {
            trigger: ".app_favorite_menu .app-dropdown-item:contains(Apps2)",
        },
        {
            content: "There should not be any facet inside the search bar",
            trigger: "body:not(:has(.app_searchview_facet))",
        },
        {
            content: "The Apps1 filter should be deleted",
            trigger: "body:not(:has(.app_favorite_menu .app-dropdown-item:contains(Apps1)))",
        },
    ],
});
