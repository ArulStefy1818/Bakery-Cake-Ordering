
/* =========================================================
   STACKLY BAKERY - COMPLETE CART SYSTEM
   ADD TO CART
   LOCAL STORAGE
   CART PAGE RENDERING
   CHECKOUT -> CLEAR CART -> 404
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       CART STORAGE KEY
    ====================================================== */

    const CART_KEY = "stacklyBakeryCart";


    /* =====================================================
       GET CART
    ====================================================== */

    function getCart() {

        try {

            const savedCart = localStorage.getItem(CART_KEY);

            if (!savedCart) {
                return [];
            }

            const cart = JSON.parse(savedCart);

            if (!Array.isArray(cart)) {
                return [];
            }

            return cart;

        } catch (error) {

            console.error(
                "Unable to read cart:",
                error
            );

            return [];

        }

    }


    /* =====================================================
       SAVE CART
    ====================================================== */

    function saveCart(cart) {

        try {

            localStorage.setItem(
                CART_KEY,
                JSON.stringify(cart)
            );

            updateCartCount();

            /* Re-render cart if cart page is open */

            renderCart();

        } catch (error) {

            console.error(
                "Unable to save cart:",
                error
            );

        }

    }


    /* =====================================================
       UPDATE HEADER CART COUNT
    ====================================================== */

    function updateCartCount() {

        const cart = getCart();

        const totalQuantity = cart.reduce(
            function (total, item) {

                return total + Number(
                    item.quantity || 0
                );

            },
            0
        );


        /* Desktop */

        document
            .querySelectorAll(
                ".stackly-cart-count"
            )
            .forEach(function (element) {

                element.textContent =
                    totalQuantity;

            });


        /* Mobile */

        document
            .querySelectorAll(
                ".stackly-mobile-cart-count"
            )
            .forEach(function (element) {

                element.textContent =
                    totalQuantity;

            });

    }


    /* =====================================================
       CREATE PRODUCT ID
    ====================================================== */

    function createProductId(name) {

        if (!name) {
            return "";
        }

        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    }


    /* =====================================================
       GET PRODUCT FROM PRODUCT CARD
       
       IMPORTANT:
       Reads DIRECTLY from the HTML.
    ====================================================== */

    function getProductFromCard(productCard) {

        if (!productCard) {
            return null;
        }


        /* -----------------------------------------------
           PRODUCT NAME
        ------------------------------------------------ */

        const nameElement =
            productCard.querySelector(
                ".sweet-product-name"
            );


        const name =
            productCard.dataset.productName ||
            nameElement?.textContent?.trim() ||
            "";


        /* -----------------------------------------------
           PRODUCT PRICE
        ------------------------------------------------ */

        const priceElement =
            productCard.querySelector(
                ".sweet-product-price"
            );


        const priceText =
            productCard.dataset.productPrice ||
            priceElement?.textContent ||
            "";


        /*
           Supports:

           ₹850
           Rs. 850
           ₹ 850
           850
        */

        const price =
            parseFloat(
                String(priceText)
                    .replace(/,/g, "")
                    .replace(/[^\d.]/g, "")
            ) || 0;


        /* -----------------------------------------------
           PRODUCT IMAGE
        ------------------------------------------------ */

        const imageElement =
            productCard.querySelector(
                ".sweet-product-image-box img"
            );


        const image =
            productCard.dataset.productImage ||
            imageElement?.getAttribute("src") ||
            "";


        /* -----------------------------------------------
           CATEGORY
        ------------------------------------------------ */

        const categoryElement =
            productCard.querySelector(
                ".sweet-product-category"
            );


        const category =
            productCard.dataset.productCategory ||
            categoryElement?.textContent?.trim() ||
            "BAKERY";


        /* -----------------------------------------------
           PRODUCT ID
        ------------------------------------------------ */

        const id =
            productCard.dataset.productId ||
            createProductId(name);


        /* -----------------------------------------------
           RETURN PRODUCT
        ------------------------------------------------ */

        return {

            id: id,

            name: name,

            category: category,

            price: price,

            image: image

        };

    }


    /* =====================================================
       ADD PRODUCT TO CART
    ====================================================== */

    function addToCart(product) {

        const cart = getCart();


        const existingProduct =
            cart.find(function (item) {

                return item.id === product.id;

            });


        if (existingProduct) {

            existingProduct.quantity =
                Number(
                    existingProduct.quantity || 0
                ) + 1;


            /*
               Repair missing information from
               old/broken cart data.
            */

            existingProduct.name =
                product.name;

            existingProduct.price =
                product.price;

            existingProduct.image =
                product.image;

            existingProduct.category =
                product.category;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                category: product.category,

                price: product.price,

                image: product.image,

                quantity: 1

            });

        }


        saveCart(cart);

    }


    /* =====================================================
       ADD TO CART BUTTON
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-add-to-cart]"
                );


            if (!button) {
                return;
            }


            const productCard =
                button.closest(
                    ".sweet-product-card"
                );


            if (!productCard) {

                console.error(
                    "Product card not found."
                );

                return;

            }


            /* -------------------------------------------
               GET PRODUCT
            -------------------------------------------- */

            const product =
                getProductFromCard(
                    productCard
                );


            console.log(
                "Stackly product:",
                product
            );


            /* -------------------------------------------
               VALIDATE
            -------------------------------------------- */

            if (

                !product ||

                !product.id ||

                !product.name ||

                !product.price ||

                !product.image

            ) {

                console.error(
                    "Product information is missing:",
                    product
                );

                showCartToast(
                    "Unable to add this product."
                );

                return;

            }


            /* -------------------------------------------
               ADD
            -------------------------------------------- */

            addToCart(product);


            /* -------------------------------------------
               BUTTON SUCCESS
            -------------------------------------------- */

            const originalText =
                button.innerHTML;


            button.innerHTML =
                "<span>✓ ADDED TO CART</span>";


            button.classList.add(
                "is-added"
            );


            button.disabled = true;


            setTimeout(
                function () {

                    button.innerHTML =
                        originalText;

                    button.classList.remove(
                        "is-added"
                    );

                    button.disabled = false;

                },
                1500
            );


            /* -------------------------------------------
               TOAST
            -------------------------------------------- */

            showCartToast(
                product.name +
                " added to your cart"
            );

        }
    );


    /* =====================================================
       CART TOAST
    ====================================================== */

    function showCartToast(message) {

        let toast =
            document.getElementById(
                "stacklyCartToast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );

            toast.id =
                "stacklyCartToast";

            toast.className =
                "stackly-cart-toast";

            document.body.appendChild(
                toast
            );

        }


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toast.hideTimer
        );


        toast.hideTimer =
            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                2200
            );

    }


    /* =====================================================
       RENDER CART PAGE
    ====================================================== */

    function renderCart() {

        const cartItems =
            document.getElementById(
                "stacklyCartItems"
            );


        const cartContent =
            document.getElementById(
                "stacklyCartContent"
            );


        const emptyCart =
            document.getElementById(
                "stacklyEmptyCart"
            );


        /*
           Not cart page
        */

        if (!cartItems) {
            return;
        }


        const cart =
            getCart();


        /* -----------------------------------------------
           EMPTY CART
        -------------------------------------------- */

        if (cart.length === 0) {

            cartItems.innerHTML = "";


            if (cartContent) {

                cartContent.style.display =
                    "none";

            }


            if (emptyCart) {

                emptyCart.style.display =
                    "flex";

            }


            updateCartSummary([]);

            return;

        }


        /* -----------------------------------------------
           SHOW CART
        -------------------------------------------- */

        if (cartContent) {

            cartContent.style.display =
                "grid";

        }


        if (emptyCart) {

            emptyCart.style.display =
                "none";

        }


        /* -----------------------------------------------
           CREATE CART ITEMS
        -------------------------------------------- */

        cartItems.innerHTML =
            cart.map(function (item) {

                const quantity =
                    Number(
                        item.quantity || 1
                    );


                const price =
                    Number(
                        item.price || 0
                    );


                const total =
                    price * quantity;


                const safeName =
                    escapeHTML(
                        item.name ||
                        "Bakery Product"
                    );


                const safeCategory =
                    escapeHTML(
                        item.category ||
                        "BAKERY"
                    );


                const safeImage =
                    escapeAttribute(
                        item.image ||
                        ""
                    );


                const safeId =
                    escapeAttribute(
                        item.id ||
                        ""
                    );


                return `

                    <article
                        class="stackly-cart-item"
                        data-product-id="${safeId}"
                    >

                        <div class="stackly-cart-item-image">

                            <img
                                src="${safeImage}"
                                alt="${safeName}"
                                loading="lazy"
                                onerror="this.style.display='none';"
                            >

                        </div>


                        <div class="stackly-cart-item-details">

                            <span class="stackly-cart-item-category">
                                ${safeCategory}
                            </span>


                            <h3 class="stackly-cart-item-name">
                                ${safeName}
                            </h3>


                            <p class="stackly-cart-item-price">
                                ₹${price.toLocaleString("en-IN")}
                            </p>

                        </div>


                        <div class="stackly-cart-item-actions">

                            <div class="stackly-cart-quantity">

                                <button
                                    type="button"
                                    class="stackly-quantity-minus"
                                    data-product-id="${safeId}"
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>


                                <span
                                    class="stackly-cart-quantity-value"
                                >
                                    ${quantity}
                                </span>


                                <button
                                    type="button"
                                    class="stackly-quantity-plus"
                                    data-product-id="${safeId}"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>

                            </div>


                            <strong class="stackly-cart-item-total">
                                ₹${total.toLocaleString("en-IN")}
                            </strong>


                            <button
                                type="button"
                                class="stackly-cart-remove"
                                data-product-id="${safeId}"
                                aria-label="Remove product"
                            >
                                <i class="fa-regular fa-trash-can"></i>
                            </button>

                        </div>

                    </article>

                `;

            }).join("");


        /* -----------------------------------------------
           SUMMARY
        -------------------------------------------- */

        updateCartSummary(cart);

    }


    /* =====================================================
       UPDATE CART SUMMARY
    ====================================================== */

    function updateCartSummary(cart) {

        const subtotalElement =
            document.getElementById(
                "stacklyCartSubtotal"
            );


        const deliveryElement =
            document.getElementById(
                "stacklyCartDelivery"
            );


        const totalElement =
            document.getElementById(
                "stacklyCartTotal"
            );


        if (

            !subtotalElement ||

            !deliveryElement ||

            !totalElement

        ) {

            return;

        }


        const subtotal =
            cart.reduce(
                function (total, item) {

                    return total +
                        (
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                        );

                },
                0
            );


        /*
           Free delivery above ₹999
           Otherwise ₹49
        */

        const delivery =
            subtotal === 0
                ? 0
                : subtotal >= 999
                    ? 0
                    : 49;


        const total =
            subtotal + delivery;


        subtotalElement.textContent =
            "₹" +
            subtotal.toLocaleString(
                "en-IN"
            );


        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : "₹" +
                  delivery.toLocaleString(
                      "en-IN"
                  );


        totalElement.textContent =
            "₹" +
            total.toLocaleString(
                "en-IN"
            );

    }


    /* =====================================================
       INCREASE / DECREASE QUANTITY
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const plusButton =
                event.target.closest(
                    ".stackly-quantity-plus"
                );


            const minusButton =
                event.target.closest(
                    ".stackly-quantity-minus"
                );


            if (
                !plusButton &&
                !minusButton
            ) {
                return;
            }


            const button =
                plusButton ||
                minusButton;


            const productId =
                button.dataset.productId;


            if (!productId) {
                return;
            }


            const amount =
                plusButton
                    ? 1
                    : -1;


            changeQuantity(
                productId,
                amount
            );

        }
    );


    /* =====================================================
       CHANGE QUANTITY
    ====================================================== */

    function changeQuantity(
        productId,
        amount
    ) {

        const cart =
            getCart();


        const product =
            cart.find(
                function (item) {

                    return item.id === productId;

                }
            );


        if (!product) {
            return;
        }


        product.quantity =
            Number(
                product.quantity || 1
            ) + amount;


        if (product.quantity <= 0) {

            const newCart =
                cart.filter(
                    function (item) {

                        return item.id !== productId;

                    }
                );


            saveCart(newCart);

            return;

        }


        saveCart(cart);

    }


    /* =====================================================
       REMOVE PRODUCT
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const removeButton =
                event.target.closest(
                    ".stackly-cart-remove"
                );


            if (!removeButton) {
                return;
            }


            const productId =
                removeButton.dataset.productId;


            if (!productId) {
                return;
            }


            const cart =
                getCart();


            const updatedCart =
                cart.filter(
                    function (item) {

                        return item.id !== productId;

                    }
                );


            saveCart(updatedCart);

        }
    );


    /* =====================================================
       CLEAR CART BUTTON
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const clearButton =
                event.target.closest(
                    "#stacklyClearCart"
                );


            if (!clearButton) {
                return;
            }


            clearEntireCart();

        }
    );


    /* =====================================================
       CLEAR ENTIRE CART
    ====================================================== */

    function clearEntireCart() {

        try {

            localStorage.removeItem(
                CART_KEY
            );

        } catch (error) {

            console.error(
                "Unable to clear cart:",
                error
            );

        }


        updateCartCount();


        renderCart();


        showCartToast(
            "Your cart has been cleared"
        );

    }


    /* =====================================================
       CHECKOUT
       
       CLEAR CART
       THEN REDIRECT TO 404
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const checkoutButton =
                event.target.closest(
                    ".stackly-checkout-button"
                );


            if (!checkoutButton) {
                return;
            }


            event.preventDefault();


            /*
               CLEAR ALL ITEMS
            */

            clearEntireCart();


            /*
               GO TO 404 PAGE
            */

            setTimeout(
                function () {

                    window.location.href =
                        "404.html";

                },
                100
            );

        }
    );


    /* =====================================================
       HTML ESCAPE
    ====================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       ATTRIBUTE ESCAPE
    ====================================================== */

    function escapeAttribute(value) {

        return escapeHTML(value);

    }


    /* =====================================================
       INITIALIZE
    ====================================================== */

    updateCartCount();

    renderCart();


    /* =====================================================
       STORAGE EVENT
    ====================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key === CART_KEY
            ) {

                updateCartCount();

                renderCart();

            }

        }
    );


    /* =====================================================
       PAGE SHOW
    ====================================================== */

    window.addEventListener(
        "pageshow",
        function () {

            updateCartCount();

            renderCart();

        }
    );


    /* =====================================================
       GLOBAL STACKLY CART API
    ====================================================== */

    window.StacklyCart = {

        getCart: getCart,

        addToCart: addToCart,

        updateCartCount: updateCartCount,

        clearCart: clearEntireCart,

        renderCart: renderCart

    };


});

