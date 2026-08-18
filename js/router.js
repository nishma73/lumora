const Router = {

    routes: {},

    register(path, handler) {
        this.routes[path] = handler;
    },

    getPath() {
        const hash = window.location.hash.slice(1);
        return hash || "/";
    },

    resolve() {

        const path = this.getPath();

        // Product detail route
        if (path.startsWith("/product/")) {

            const id = path.split("/")[2];

            if (typeof renderProductDetail === "function") {
                renderProductDetail(id);
            }

            updateActiveNavigation();
            return;
        }

        // Normal routes
        const handler =
            this.routes[path] ||
            this.routes["/404"];

        if (handler) {
            handler();
        }
    },

    start() {

        window.addEventListener(
            "hashchange",
            () => this.resolve()
        );

        this.resolve();
    }
};