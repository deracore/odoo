/* Copyright 2025 Tecnativa - Carlos Roca
 * License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl). */
const checkCalledFromClickEverywhere = function () {
    // Simulate an error to have the stack trace to check if
    // functions are thrown from clickEverywhere
    const error = new Error();
    const stack = error.stack || "";
    // Check that the stack has clickEverywhere function
    return stack.includes("clickEverywhere");
};

// We modified the behavior of querySelector and querySelectorAll so
// that when attempting to access .app-dropdown--menu .app
// or .app_navbar_apps_menu .dropdown-toggle, they are replaced with
// the correct selector and the click everywhere functionality
// continues to work.
// Note: This will only be loaded when the option to trigger clicks on
// all elements is selected.
const originalQuerySelector = document.querySelector;
document.querySelector = function (selector) {
    if (checkCalledFromClickEverywhere()) {
        if (selector === ".app-dropdown--menu .app") {
            selector = ".app-menu-list .app";
        } else if (selector === ".app_navbar_apps_menu .dropdown-toggle") {
            selector = ".app_navbar_apps_menu .app_grid_apps_menu__button";
        } else if (
            selector.includes('.app-dropdown--menu .dropdown-item[data-menu-xmlid="')
        ) {
            selector = selector.replace(
                ".app-dropdown--menu .dropdown-item",
                ".app-menu-list .app"
            );
        }
    }
    return originalQuerySelector.call(this, selector);
};
const originalQuerySelectorAll = document.querySelectorAll;
document.querySelectorAll = function (selector) {
    if (checkCalledFromClickEverywhere()) {
        if (selector === ".app-dropdown--menu .app") {
            selector = ".app-menu-list .app";
        }
    }
    return originalQuerySelectorAll.call(this, selector);
};
