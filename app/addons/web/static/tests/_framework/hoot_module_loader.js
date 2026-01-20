// @app-module ignore
// ! WARNING: this module must be loaded after `module_loader` but cannot have dependencies !

(function (app) {
    "use strict";

    if (app.define.name.endsWith("(hoot)")) {
        return;
    }

    const name = `${app.define.name} (hoot)`;
    app.define = {
        [name](name, dependencies, factory) {
            return app.loader.define(name, dependencies, factory, !name.endsWith(".hoot"));
        },
    }[name];
})(globalThis.app);
