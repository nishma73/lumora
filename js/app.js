/* =========================================================
   LUMORA APPLICATION
========================================================= */


let cart =
    JSON.parse(
        localStorage.getItem("lumora-cart")
    ) || [];


let selectedCategory = "All";

let searchTerm = "";

let sortOption = "default";

let currentProduct = null;

let quantity = 1;


/* =========================================================
   DOM
========================================================= */

const app =
    document.getElementById("app");

const cartDrawer =
    document.getElementById("cartDrawer");

const overlay =
    document.getElementById("overlay");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const toast =
    document.getElementById("toast");

const themeToggle =
    document.getElementById("themeToggle");


/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(price);

}


function saveCart() {

    localStorage.setItem(
        "lumora-cart",
        JSON.stringify(cart)
    );

}


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(
        () => {
            toast.classList.remove("show");
        },
        2200
    );

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function productCard(product) {

    return `

        <article class="product-card fade-in">

            <div class="product-image">

                <a
                    href="#/product/${product.id}"
                    aria-label="View ${product.name}"
                >

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </a>

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description}
                </p>


                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-button"
                        type="button"
                        data-add="${product.id}"
                    >
                        +
                    </button>

                </div>


                <button
                    class="secondary-button product-add-button"
                    type="button"
                    data-add="${product.id}"
                >
                    Add to Bag
                </button>

            </div>

        </article>

    `;
}

/* =========================================================
   HOME
========================================================= */

function renderHome() {

    const featured =
        products.slice(0, 4);


    app.innerHTML = `

        <div class="page">

            <section class="hero">

                <div class="hero-content">

                    <div class="eyebrow">
                        CURATED EVERYDAY
                    </div>

                    <h1>
                        Beautiful things
                        <span>for everyday living.</span>
                    </h1>

                    <p class="hero-description">
                        LUMORA brings together thoughtful technology,
                        lifestyle objects and everyday essentials
                        designed to make ordinary moments feel better.
                    </p>

                    <div class="hero-actions">

                        <a
                            href="#/shop"
                            class="primary-button"
                        >
                            Explore the collection
                        </a>

                        <a
                            href="#/about"
                            class="secondary-button"
                        >
                            Our story
                        </a>

                    </div>

                </div>


                <div class="hero-visual">

                    <div class="visual-card">

                        <small>
                            LUMORA EDIT
                        </small>

                        <h3>
                            Soft design.
                            Smart living.
                        </h3>

                    </div>

                </div>

            </section>


            <section>

                <div class="section-header">

                    <div>

                        <div class="eyebrow">
                            FEATURED
                        </div>

                        <h2>
                            Things worth<br>
                            keeping.
                        </h2>

                    </div>

                    <p>
                        A small collection of products chosen
                        for function, simplicity and timeless appeal.
                    </p>

                </div>


                <div class="product-grid">

                    ${featured
                        .map(productCard)
                        .join("")}

                </div>

            </section>

        </div>

        ${footerTemplate()}
    `;

}


/* =========================================================
   SHOP
========================================================= */

function renderShop() {

    let filtered =
        products.filter(
            product => {

                const matchesCategory =
                    selectedCategory === "All" ||
                    product.category === selectedCategory;


                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());


                return (
                    matchesCategory &&
                    matchesSearch
                );

            }
        );


    if (sortOption === "low") {

        filtered.sort(
            (a, b) => a.price - b.price
        );

    }


    if (sortOption === "high") {

        filtered.sort(
            (a, b) => b.price - a.price
        );

    }


    const categories =
        [
            "All",
            ...new Set(
                products.map(
                    product => product.category
                )
            )
        ];


    app.innerHTML = `

        <div class="page">

            <section class="section-header">

                <div>

                    <div class="eyebrow">
                        THE COLLECTION
                    </div>

                    <h2>
                        Shop LUMORA.
                    </h2>

                </div>

                <p>
                    Discover carefully selected pieces
                    for modern everyday life.
                </p>

            </section>


            <div class="category-filter">

                ${categories
                    .map(
                        category => `

                            <button
                                class="
                                    category-button
                                    ${selectedCategory === category
                                        ? "active"
                                        : ""}
                                "
                                data-category="${category}"
                            >
                                ${category}
                            </button>

                        `
                    )
                    .join("")}

            </div>


            <div class="shop-toolbar">

                <input
                    id="productSearch"
                    class="search-input"
                    type="search"
                    placeholder="Search products..."
                    value="${searchTerm}"
                    aria-label="Search products"
                >


                <select
                    id="sortProducts"
                    class="sort-select"
                    aria-label="Sort products"
                >

                    <option
                        value="default"
                        ${sortOption === "default" ? "selected" : ""}
                    >
                        Sort by
                    </option>

                    <option
                        value="low"
                        ${sortOption === "low" ? "selected" : ""}
                    >
                        Price: Low to High
                    </option>

                    <option
                        value="high"
                        ${sortOption === "high" ? "selected" : ""}
                    >
                        Price: High to Low
                    </option>

                </select>

            </div>


            <div class="product-grid">

                ${
                    filtered.length
                        ? filtered
                            .map(productCard)
                            .join("")
                        : `
                            <div class="not-found">
                                <h3>No products found.</h3>
                                <p>
                                    Try another search or category.
                                </p>
                            </div>
                        `
                }

            </div>

        </div>

        ${footerTemplate()}
    `;


    const search =
        document.getElementById("productSearch");


    if (search) {

        search.addEventListener(
            "input",
            event => {

                searchTerm =
                    event.target.value;

                renderShop();

            }
        );

    }


    const sort =
        document.getElementById("sortProducts");


    if (sort) {

        sort.addEventListener(
            "change",
            event => {

                sortOption =
                    event.target.value;

                renderShop();

            }
        );

    }

}


/* =========================================================
   PRODUCT DETAIL
========================================================= */

function renderProductDetail(id) {

    const product =
        products.find(
            item => item.id === Number(id)
        );


    if (!product) {

        render404();

        return;

    }


    currentProduct = product;

    quantity = 1;


    app.innerHTML = `

        <div class="page">

            <div class="detail-page">

                <div class="detail-image fade-in">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="detail-content fade-in">

                    <div class="product-category">
                        ${product.category}
                    </div>

                    <h1>
                        ${product.name}
                    </h1>

                    <p class="detail-description">
                        ${product.description}
                    </p>

                    <div class="detail-price">
                        ${formatPrice(product.price)}
                    </div>


                    <div class="quantity-control">

                        <button
                            id="decreaseQuantity"
                            type="button"
                        >
                            −
                        </button>

                        <strong id="quantityValue">
                            1
                        </strong>

                        <button
                            id="increaseQuantity"
                            type="button"
                        >
                            +
                        </button>

                    </div>


                    <br>


                    <button
                        id="detailAddButton"
                        class="primary-button"
                        type="button"
                    >
                        Add to bag
                    </button>

                </div>

            </div>

        </div>

        ${footerTemplate()}
    `;


    document
        .getElementById("increaseQuantity")
        .addEventListener(
            "click",
            () => {

                quantity++;

                updateQuantity();

            }
        );


    document
        .getElementById("decreaseQuantity")
        .addEventListener(
            "click",
            () => {

                if (quantity > 1) {

                    quantity--;

                    updateQuantity();

                }

            }
        );


    document
        .getElementById("detailAddButton")
        .addEventListener(
            "click",
            () => {

                addToCart(
                    product.id,
                    quantity
                );

            }
        );

}


function updateQuantity() {

    document
        .getElementById("quantityValue")
        .textContent = quantity;

}


/* =========================================================
   ABOUT
========================================================= */

function renderAbout() {

    app.innerHTML = `

        <div class="page">

            <section class="content-page fade-in">

                <div class="eyebrow">
                    ABOUT LUMORA
                </div>

                <h1>
                    Less noise.
                    Better things.
                </h1>

                <p>
                    LUMORA is a concept lifestyle store built
                    around a simple idea: useful products can
                    also be beautiful.
                </p>

                <p>
                    From thoughtful technology to everyday
                    objects, every product in our collection
                    is selected for function, simplicity and
                    visual character.
                </p>


                <div class="info-grid">

                    <article class="info-card">

                        <h3>
                            Thoughtful
                        </h3>

                        <p>
                            Products chosen with purpose,
                            not simply because they are popular.
                        </p>

                    </article>


                    <article class="info-card">

                        <h3>
                            Modern
                        </h3>

                        <p>
                            Clean products and experiences
                            designed around contemporary living.
                        </p>

                    </article>


                    <article class="info-card">

                        <h3>
                            Human
                        </h3>

                        <p>
                            Technology should make life
                            simpler, warmer and more enjoyable.
                        </p>

                    </article>

                </div>

            </section>

        </div>

        ${footerTemplate()}
    `;

}


/* =========================================================
   CONTACT
========================================================= */

function renderContact() {

    app.innerHTML = `

        <div class="page">

            <section class="content-page fade-in">

                <div class="eyebrow">
                    GET IN TOUCH
                </div>

                <h1>
                    Let's make
                    something good.
                </h1>

                <p>
                    Have a question about a product,
                    collaboration idea or just want to
                    say hello?
                </p>


                <div class="info-grid">

                    <article class="info-card">

                        <h3>
                            Email
                        </h3>

                        <p>
                            hello@lumora.store
                        </p>

                    </article>


                    <article class="info-card">

                        <h3>
                            Support
                        </h3>

                        <p>
                            We're here to help with
                            your shopping experience.
                        </p>

                    </article>


                    <article class="info-card">

                        <h3>
                            Location
                        </h3>

                        <p>
                            India
                        </p>

                    </article>

                </div>

            </section>

        </div>

        ${footerTemplate()}
    `;

}


/* =========================================================
   FOOTER
========================================================= */

function footerTemplate() {

    return `

        <footer class="site-footer">

            <span>
                © ${new Date().getFullYear()} LUMORA.
                Designed for everyday living.
            </span>

            <span>
                Built with HTML, CSS & JavaScript.
            </span>

        </footer>

    `;

}


/* =========================================================
   404
========================================================= */

function render404() {

    app.innerHTML = `

        <div class="not-found">

            <h1>
                404
            </h1>

            <p>
                This page doesn't exist.
            </p>

            <br>

            <a
                href="#/"
                class="primary-button"
            >
                Back Home
            </a>

        </div>

    `;

}


/* =========================================================
   CART
========================================================= */

function addToCart(id, amount = 1) {

    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        existing.quantity += amount;

    } else {

        cart.push({
            id,
            quantity: amount
        });

    }


    saveCart();

    updateCartUI();

    showToast("Added to your bag ✦");

}


function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    saveCart();

    updateCartUI();

}


function changeCartQuantity(id, change) {

    const item =
        cart.find(
            product => product.id === id
        );


    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;

    }


    saveCart();

    updateCartUI();

}


function updateCartUI() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;


    if (!cart.length) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <p>
                    Your bag is waiting for something beautiful.
                </p>

            </div>

        `;

        cartTotal.textContent =
            formatPrice(0);

        return;

    }


    let total = 0;


    cartItems.innerHTML =
        cart
            .map(item => {

                const product =
                    products.find(
                        product =>
                            product.id === item.id
                    );


                if (!product) return "";


                total +=
                    product.price *
                    item.quantity;


                return `

                    <div class="cart-item">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                        <div>

                            <h4>
                                ${product.name}
                            </h4>

                            <p>
                                ${formatPrice(product.price)}
                            </p>


                            <div class="cart-controls">

                                <button
                                    type="button"
                                    data-minus="${product.id}"
                                >
                                    −
                                </button>

                                <span>
                                    ${item.quantity}
                                </span>

                                <button
                                    type="button"
                                    data-plus="${product.id}"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <button
                            class="remove-item"
                            type="button"
                            data-remove="${product.id}"
                        >
                            Remove
                        </button>

                    </div>

                `;

            })
            .join("");


    cartTotal.textContent =
        formatPrice(total);

}


/* =========================================================
   CART EVENTS
========================================================= */

cartItems.addEventListener(
    "click",
    event => {

        const minus =
            event.target.closest(
                "[data-minus]"
            );


        const plus =
            event.target.closest(
                "[data-plus]"
            );


        const remove =
            event.target.closest(
                "[data-remove]"
            );


        if (minus) {

            changeCartQuantity(
                Number(minus.dataset.minus),
                -1
            );

        }


        if (plus) {

            changeCartQuantity(
                Number(plus.dataset.plus),
                1
            );

        }


        if (remove) {

            removeFromCart(
                Number(remove.dataset.remove)
            );

        }

    }
);


/* =========================================================
   OPEN / CLOSE CART
========================================================= */

function openCart() {

    cartDrawer.classList.add("open");

    overlay.classList.add("open");

    cartDrawer.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeCart() {

    cartDrawer.classList.remove("open");

    overlay.classList.remove("open");

    cartDrawer.setAttribute(
        "aria-hidden",
        "true"
    );

}


document
    .getElementById("cartButton")
    .addEventListener(
        "click",
        openCart
    );


document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closeCart
    );


overlay.addEventListener(
    "click",
    closeCart
);


/* =========================================================
   GLOBAL APP CLICKS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const addButton =
            event.target.closest(
                "[data-add]"
            );


        if (addButton) {

            addToCart(
                Number(addButton.dataset.add)
            );

        }


        const categoryButton =
            event.target.closest(
                "[data-category]"
            );


        if (categoryButton) {

            selectedCategory =
                categoryButton.dataset.category;

            renderShop();

        }

    }
);


/* =========================================================
   CHECKOUT
========================================================= */

document
    .getElementById("checkoutButton")
    .addEventListener(
        "click",
        () => {

            if (!cart.length) {

                showToast(
                    "Your bag is empty."
                );

                return;

            }


            showToast(
                "Checkout demo — order flow ready for integration."
            );

        }
    );


/* =========================================================
   THEME
========================================================= */

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.textContent = "☾";

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        themeToggle.textContent = "☼";

    }

}


themeToggle.addEventListener(
    "click",
    () => {

        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        const newTheme =
            isDark ? "light" : "dark";


        applyTheme(newTheme);


        localStorage.setItem(
            "lumora-theme",
            newTheme
        );

    }
);


const savedTheme =
    localStorage.getItem(
        "lumora-theme"
    );


applyTheme(
    savedTheme || "light"
);


/* =========================================================
   NAVIGATION ACTIVE STATE
========================================================= */

function updateActiveNavigation() {

    const path =
        Router.getPath();


    document
        .querySelectorAll(
            "[data-route]"
        )
        .forEach(link => {

            const target =
                link.getAttribute("href")
                    .replace("#", "");


            link.classList.toggle(
                "active",
                target === path
            );

        });

}


/* =========================================================
   ROUTES
========================================================= */

/* =========================================================
   ROUTES
========================================================= */

Router.register(
    "/",
    () => {

        renderHome();

        updateActiveNavigation();

    }
);


Router.register(
    "/shop",
    () => {

        renderShop();

        updateActiveNavigation();

    }
);


Router.register(
    "/about",
    () => {

        renderAbout();

        updateActiveNavigation();

    }
);


Router.register(
    "/contact",
    () => {

        renderContact();

        updateActiveNavigation();

    }
);


Router.register(
    "/404",
    () => {

        render404();

        updateActiveNavigation();

    }
);


/* =========================================================
   START ROUTER
========================================================= */

updateCartUI();

Router.start();