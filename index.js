
/* =========================================================
   STACKLY BAKERY - COMPLETE JAVASCRIPT
   CART + HERO SLIDER + PRODUCT SLIDER
   + EXPERIENCE SLIDER + SERVICES
   + MOBILE MENU + NEWSLETTER
   + ACTIVE NAVIGATION + QUICK VIEW
   + CUSTOM SERVICE DROPDOWN
   + CONTACT FORM + PAGE LOADER
========================================================= */

"use strict";


/* =========================================================
   GLOBAL SETTINGS
========================================================= */

const STACKLY_CART_KEY = "stacklyBakeryCart";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       AOS
    ====================================================== */

    if (typeof AOS !== "undefined") {

        AOS.init({
            duration: 900,
            easing: "ease-out-cubic",
            once: true,
            mirror: false,
            offset: 80
        });

    }


    /* =====================================================
       INITIALIZE FEATURES
    ====================================================== */

    initStacklyCart();

    initMobileMenu();

    initHeroSlider();

    initFeaturedCollection();

    initBakeryExperience();

    initBakeryServices();

    initNewsletter();

    initActiveNavigation();

    initContactServiceDropdown();

    initContactForm();

});


/* =========================================================
   =========================================================
   STACKLY CART SYSTEM
   =========================================================
========================================================= */


/* =========================================================
   GET CART
========================================================= */

function getStacklyCart() {

    try {

        const savedCart =
            localStorage.getItem(STACKLY_CART_KEY);

        if (!savedCart) {
            return [];
        }


        const parsedCart =
            JSON.parse(savedCart);


        if (!Array.isArray(parsedCart)) {
            return [];
        }


        return parsedCart
            .filter(function (item) {

                return item &&
                       item.id &&
                       item.name;

            })
            .map(function (item) {

                return {

                    id: String(item.id),

                    name: String(item.name),

                    category:
                        item.category
                            ? String(item.category)
                            : "BAKERY SPECIAL",

                    price:
                        Number(item.price) || 0,

                    image:
                        item.image
                            ? String(item.image)
                            : "",

                    quantity:
                        Math.max(
                            1,
                            parseInt(item.quantity, 10) || 1
                        )

                };

            });

    } catch (error) {

        console.error(
            "Stackly cart read error:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE CART
========================================================= */

function saveStacklyCart(cart) {

    try {

        localStorage.setItem(
            STACKLY_CART_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Stackly cart save error:",
            error
        );

    }

    updateStacklyCartCount();

    renderStacklyCart();

}


/* =========================================================
   PRODUCT ID
========================================================= */

function createStacklyProductId(name) {

    return String(name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeStacklyHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   GET PRODUCT FROM BUTTON
========================================================= */

function getStacklyProductFromButton(button) {

    if (!button) {
        return null;
    }


    const card =
        button.closest(".sweet-product-card");


    if (!card) {

        console.error(
            "Stackly product card not found."
        );

        return null;

    }


    const nameElement =
        card.querySelector(
            ".sweet-product-name"
        );


    const priceElement =
        card.querySelector(
            ".sweet-product-price"
        );


    const categoryElement =
        card.querySelector(
            ".sweet-product-category"
        );


    const imageElement =
        card.querySelector(
            ".sweet-product-image-box img"
        );


    const name =
        button.dataset.productName ||
        card.dataset.productName ||
        (
            nameElement
                ? nameElement.textContent.trim()
                : ""
        );


    const category =
        button.dataset.productCategory ||
        card.dataset.productCategory ||
        (
            categoryElement
                ? categoryElement.textContent.trim()
                : "BAKERY SPECIAL"
        );


    const rawPrice =
        button.dataset.productPrice ||
        card.dataset.productPrice ||
        (
            priceElement
                ? priceElement.textContent.trim()
                : "0"
        );


    const cleanPrice =
        String(rawPrice)
            .replace(/,/g, "")
            .replace(/[^\d.]/g, "");


    const price =
        parseFloat(cleanPrice) || 0;


    const image =
        button.dataset.productImage ||
        card.dataset.productImage ||
        (
            imageElement
                ? imageElement.getAttribute("src")
                : ""
        );


    const id =
        button.dataset.productId ||
        card.dataset.productId ||
        createStacklyProductId(name);


    if (!name) {

        console.error(
            "Stackly product name missing."
        );

        return null;

    }


    if (price <= 0) {

        console.error(
            "Stackly product price missing:",
            name
        );

        return null;

    }


    return {

        id: id,

        name: name,

        category: category,

        price: price,

        image: image,

        quantity: 1

    };

}


/* =========================================================
   ADD PRODUCT TO CART
========================================================= */

function addStacklyProductToCart(button) {

    const product =
        getStacklyProductFromButton(button);


    if (!product) {

        showStacklyToast(
            "Unable to add this product."
        );

        return;

    }


    let cart =
        getStacklyCart();


    const existingProduct =
        cart.find(function (item) {

            return item.id === product.id;

        });


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push(product);

    }


    saveStacklyCart(cart);


    if (button) {

        const originalText =
            button.dataset.originalText ||
            button.innerHTML;


        button.dataset.originalText =
            originalText;


        button.innerHTML =
            '<i class="fa-solid fa-check"></i> ADDED TO CART';


        button.classList.add(
            "sweet-cart-added"
        );


        clearTimeout(
            button._stacklyCartTimer
        );


        button._stacklyCartTimer =
            setTimeout(function () {

                button.innerHTML =
                    originalText;

                button.classList.remove(
                    "sweet-cart-added"
                );

            }, 1600);

    }


    showStacklyToast(
        product.name + " added to cart"
    );

}


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateStacklyCartCount() {

    const cart =
        getStacklyCart();


    const totalQuantity =
        cart.reduce(
            function (total, item) {

                return total +
                    (Number(item.quantity) || 0);

            },
            0
        );


    const countElements =
        document.querySelectorAll(
            ".stackly-cart-count, .stackly-mobile-cart-count"
        );


    countElements.forEach(function (element) {

        element.textContent =
            totalQuantity;


        element.setAttribute(
            "aria-label",
            totalQuantity +
            (
                totalQuantity === 1
                    ? " item in cart"
                    : " items in cart"
            )
        );

    });

}


/* =========================================================
   CART TOAST
========================================================= */

function showStacklyToast(message) {

    let toast =
        document.querySelector(
            ".stackly-cart-toast"
        );


    if (!toast) {

        toast =
            document.createElement("div");

        toast.className =
            "stackly-cart-toast";

        document.body.appendChild(toast);

    }


    toast.innerHTML =
        '<i class="fa-solid fa-circle-check"></i>' +
        "<span>" +
        escapeStacklyHTML(message) +
        "</span>";


    toast.classList.add(
        "stackly-cart-toast-show"
    );


    clearTimeout(
        toast._stacklyToastTimer
    );


    toast._stacklyToastTimer =
        setTimeout(function () {

            toast.classList.remove(
                "stackly-cart-toast-show"
            );

        }, 2200);

}


/* =========================================================
   CART INITIALIZATION
========================================================= */

function initStacklyCart() {

    updateStacklyCartCount();


    document.addEventListener(
        "click",
        function (event) {

            /* =============================================
               ADD TO CART
            ============================================== */

            const addButton =
                event.target.closest(
                    ".sweet-cart-button"
                );


            if (addButton) {

                event.preventDefault();

                addStacklyProductToCart(
                    addButton
                );

                return;

            }


            /* =============================================
               PLUS
            ============================================== */

            const plusButton =
                event.target.closest(
                    ".stackly-quantity-plus"
                );


            if (plusButton) {

                event.preventDefault();


                const itemId =
                    plusButton.dataset.productId;


                changeStacklyQuantity(
                    itemId,
                    1
                );

                return;

            }


            /* =============================================
               MINUS
            ============================================== */

            const minusButton =
                event.target.closest(
                    ".stackly-quantity-minus"
                );


            if (minusButton) {

                event.preventDefault();


                const itemId =
                    minusButton.dataset.productId;


                changeStacklyQuantity(
                    itemId,
                    -1
                );

                return;

            }


            /* =============================================
               REMOVE
            ============================================== */

            const removeButton =
                event.target.closest(
                    ".stackly-cart-remove"
                );


            if (removeButton) {

                event.preventDefault();


                const itemId =
                    removeButton.dataset.productId;


                removeStacklyProduct(
                    itemId
                );

                return;

            }


            /* =============================================
               CLEAR
            ============================================== */

            const clearButton =
                event.target.closest(
                    "#stacklyClearCart"
                );


            if (clearButton) {

                event.preventDefault();

                clearStacklyCart();

            }

        }
    );


    renderStacklyCart();

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeStacklyQuantity(
    productId,
    amount
) {

    if (!productId) {
        return;
    }


    const cart =
        getStacklyCart();


    const product =
        cart.find(function (item) {

            return item.id === productId;

        });


    if (!product) {
        return;
    }


    product.quantity += amount;


    if (product.quantity <= 0) {

        const newCart =
            cart.filter(function (item) {

                return item.id !== productId;

            });


        saveStacklyCart(newCart);

        return;

    }


    saveStacklyCart(cart);

}


/* =========================================================
   REMOVE PRODUCT
========================================================= */

function removeStacklyProduct(productId) {

    if (!productId) {
        return;
    }


    const cart =
        getStacklyCart();


    const product =
        cart.find(function (item) {

            return item.id === productId;

        });


    const newCart =
        cart.filter(function (item) {

            return item.id !== productId;

        });


    saveStacklyCart(newCart);


    if (product) {

        showStacklyToast(
            product.name +
            " removed from cart"
        );

    }

}


/* =========================================================
   CLEAR CART
========================================================= */

function clearStacklyCart() {

    const cart =
        getStacklyCart();


    if (!cart.length) {
        return;
    }


    const confirmed =
        window.confirm(
            "Are you sure you want to clear your cart?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        STACKLY_CART_KEY
    );


    updateStacklyCartCount();

    renderStacklyCart();


    showStacklyToast(
        "Cart cleared"
    );

}


/* =========================================================
   RENDER CART
========================================================= */

function renderStacklyCart() {

    const cartItemsContainer =
        document.getElementById(
            "stacklyCartItems"
        );


    if (!cartItemsContainer) {

        updateStacklyCartCount();

        return;

    }


    const cart =
        getStacklyCart();


    const cartContent =
        document.getElementById(
            "stacklyCartContent"
        );


    const emptyCart =
        document.getElementById(
            "stacklyEmptyCart"
        );


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


    const clearButton =
        document.getElementById(
            "stacklyClearCart"
        );


    /* =====================================================
       EMPTY CART
    ====================================================== */

    if (!cart.length) {

        cartItemsContainer.innerHTML = "";


        if (cartContent) {

            cartContent.style.display =
                "none";

        }


        if (emptyCart) {

            emptyCart.style.display =
                "flex";

        }


        if (subtotalElement) {

            subtotalElement.textContent =
                "₹0";

        }


        if (deliveryElement) {

            deliveryElement.textContent =
                "₹0";

        }


        if (totalElement) {

            totalElement.textContent =
                "₹0";

        }


        if (clearButton) {

            clearButton.disabled =
                true;

        }


        updateStacklyCartCount();

        return;

    }


    /* =====================================================
       CART HAS ITEMS
    ====================================================== */

    if (cartContent) {

        cartContent.style.display =
            "grid";

    }


    if (emptyCart) {

        emptyCart.style.display =
            "none";

    }


    if (clearButton) {

        clearButton.disabled =
            false;

    }


    cartItemsContainer.innerHTML =
        cart.map(function (item) {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            const safeId =
                escapeStacklyHTML(
                    item.id
                );


            const safeName =
                escapeStacklyHTML(
                    item.name
                );


            const safeCategory =
                escapeStacklyHTML(
                    item.category
                );


            const safeImage =
                escapeStacklyHTML(
                    item.image
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
                            ₹${Number(item.price).toLocaleString("en-IN")}
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
                                <i class="fa-solid fa-minus"></i>
                            </button>


                            <span class="stackly-cart-quantity-value">
                                ${item.quantity}
                            </span>


                            <button
                                type="button"
                                class="stackly-quantity-plus"
                                data-product-id="${safeId}"
                                aria-label="Increase quantity"
                            >
                                <i class="fa-solid fa-plus"></i>
                            </button>

                        </div>


                        <strong class="stackly-cart-item-total">
                            ₹${itemTotal.toLocaleString("en-IN")}
                        </strong>


                        <button
                            type="button"
                            class="stackly-cart-remove"
                            data-product-id="${safeId}"
                            aria-label="Remove ${safeName}"
                        >
                            <i class="fa-regular fa-trash-can"></i>
                        </button>

                    </div>

                </article>

            `;

        }).join("");


    /* =====================================================
       TOTALS
    ====================================================== */

    const subtotal =
        cart.reduce(
            function (total, item) {

                return total +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    );

            },
            0
        );


    const delivery =
        subtotal >= 999
            ? 0
            : 49;


    const total =
        subtotal + delivery;


    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" +
            subtotal.toLocaleString("en-IN");

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : "₹" +
                  delivery.toLocaleString("en-IN");

    }


    if (totalElement) {

        totalElement.textContent =
            "₹" +
            total.toLocaleString("en-IN");

    }


    updateStacklyCartCount();

}


/* =========================================================
   STORAGE EVENT
========================================================= */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === STACKLY_CART_KEY
        ) {

            updateStacklyCartCount();

            renderStacklyCart();

        }

    }
);


/* =========================================================
   PAGE SHOW
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        updateStacklyCartCount();

        renderStacklyCart();

    }
);


/* =========================================================
   HERO SLIDER
========================================================= */

function initHeroSlider() {

    const hero =
        document.querySelector(
            ".stackly-hero"
        );


    if (!hero) {
        return;
    }


    const slides =
        hero.querySelectorAll(
            ".stackly-hero-slide"
        );


    const videos =
        hero.querySelectorAll(
            ".stackly-hero-video"
        );


    const indicators =
        hero.querySelectorAll(
            ".stackly-hero-bottom span"
        );


    if (!slides.length) {
        return;
    }


    let currentSlide = 0;


    /* =====================================================
       PREPARE VIDEOS
    ====================================================== */

    videos.forEach(function (video) {

        video.muted = true;

        video.autoplay = true;

        video.loop = true;

        video.playsInline = true;


        const playVideo =
            video.play();


        if (
            playVideo &&
            typeof playVideo.catch === "function"
        ) {

            playVideo.catch(
                function () {}
            );

        }

    });


    /* =====================================================
       SHOW SLIDE
    ====================================================== */

    function showSlide(index) {

        currentSlide =
            (
                index +
                slides.length
            ) %
            slides.length;


        slides.forEach(
            function (slide, i) {

                slide.classList.toggle(
                    "active",
                    i === currentSlide
                );

            }
        );


        indicators.forEach(
            function (indicator, i) {

                indicator.classList.toggle(
                    "active",
                    i === currentSlide
                );

            }
        );

    }


    showSlide(0);


    /* =====================================================
       AUTO SLIDE
    ====================================================== */

    let heroTimer =
        setInterval(
            function () {

                showSlide(
                    currentSlide + 1
                );

            },
            6000
        );


    /* =====================================================
       RESTART TIMER
    ====================================================== */

    function restartHeroTimer() {

        clearInterval(heroTimer);


        heroTimer =
            setInterval(
                function () {

                    showSlide(
                        currentSlide + 1
                    );

                },
                6000
            );

    }


    /* =====================================================
       INDICATORS
    ====================================================== */

    indicators.forEach(
        function (indicator, index) {

            indicator.addEventListener(
                "click",
                function () {

                    showSlide(index);

                    restartHeroTimer();

                }
            );

        }
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function initMobileMenu() {

    const menuButton =
        document.getElementById(
            "stackly-menu-toggle"
        );


    const navigation =
        document.getElementById(
            "stackly-navigation"
        );


    if (!menuButton || !navigation) {
        return;
    }


    const navLinks =
        navigation.querySelectorAll(
            ".stackly-nav-link"
        );


    /* =====================================================
       CLOSE MENU
    ====================================================== */

    function closeMenu() {

        navigation.classList.remove(
            "is-open"
        );


        document.body.classList.remove(
            "stackly-menu-open"
        );


        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    /* =====================================================
       MENU TOGGLE
    ====================================================== */

    menuButton.addEventListener(
        "click",
        function () {

            const isOpen =
                navigation.classList.toggle(
                    "is-open"
                );


            document.body.classList.toggle(
                "stackly-menu-open",
                isOpen
            );


            menuButton.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );

        }
    );


    /* =====================================================
       CLOSE AFTER LINK CLICK
    ====================================================== */

    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                closeMenu
            );

        }
    );


    /* =====================================================
       ESC KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeMenu();

            }

        }
    );


    /* =====================================================
       RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 850) {

                closeMenu();

            }

        }
    );

}


/* =========================================================
   FEATURED COLLECTION SLIDER
========================================================= */

function initFeaturedCollection() {

    const windowElement =
        document.querySelector(
            ".sweet-slider-window"
        );


    const track =
        document.querySelector(
            ".sweet-slider-track"
        );


    if (!windowElement || !track) {
        return;
    }


    const cards =
        Array.from(
            track.querySelectorAll(
                ".sweet-product-card"
            )
        );


    const previousButton =
        document.querySelector(
            ".sweet-slider-prev"
        );


    const nextButton =
        document.querySelector(
            ".sweet-slider-next"
        );


    const dots =
        Array.from(
            document.querySelectorAll(
                ".sweet-slider-dot"
            )
        );


    if (!cards.length) {
        return;
    }


    let currentIndex = 0;

    let cardsPerView = 3;


    /* =====================================================
       CARDS PER VIEW
    ====================================================== */

    function getCardsPerView() {

        if (window.innerWidth <= 800) {
            return 1;
        }


        if (window.innerWidth <= 1100) {
            return 2;
        }


        return 3;

    }


    /* =====================================================
       UPDATE SLIDER
    ====================================================== */

    function updateSlider() {

        cardsPerView =
            getCardsPerView();


        const maximumIndex =
            Math.max(
                0,
                cards.length -
                cardsPerView
            );


        if (
            currentIndex >
            maximumIndex
        ) {

            currentIndex =
                maximumIndex;

        }


        const cardWidth =
            cards[0].getBoundingClientRect().width;


        const trackStyle =
            getComputedStyle(track);


        const gap =
            parseFloat(
                trackStyle.columnGap ||
                trackStyle.gap
            ) || 0;


        const moveAmount =
            cardWidth + gap;


        track.style.transform =
            "translateX(-" +
            (
                currentIndex *
                moveAmount
            ) +
            "px)";


        const totalSlides =
            maximumIndex + 1;


        dots.forEach(
            function (dot, index) {

                dot.style.display =
                    index < totalSlides
                        ? ""
                        : "none";


                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            }
        );

    }


    /* =====================================================
       PREVIOUS
    ====================================================== */

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            function () {

                const maximumIndex =
                    Math.max(
                        0,
                        cards.length -
                        cardsPerView
                    );


                currentIndex =
                    currentIndex <= 0
                        ? maximumIndex
                        : currentIndex - 1;


                updateSlider();

            }
        );

    }


    /* =====================================================
       NEXT
    ====================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                const maximumIndex =
                    Math.max(
                        0,
                        cards.length -
                        cardsPerView
                    );


                currentIndex =
                    currentIndex >= maximumIndex
                        ? 0
                        : currentIndex + 1;


                updateSlider();

            }
        );

    }


    /* =====================================================
       DOTS
    ====================================================== */

    dots.forEach(
        function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    currentIndex =
                        index;

                    updateSlider();

                }
            );

        }
    );


    window.addEventListener(
        "resize",
        updateSlider
    );


    updateSlider();

}


/* =========================================================
   BAKERY EXPERIENCE SLIDER
========================================================= */

function initBakeryExperience() {

    const imageContainer =
        document.querySelector(
            ".bakery-experience-image"
        );


    if (!imageContainer) {
        return;
    }


    const image =
        imageContainer.querySelector(
            "img"
        );


    if (!image) {
        return;
    }


    const slides = [

        {
            image:
                "fresh-bakery-products.webp",

            title:
                "Freshly Baked Every Day"
        },

        {
            image:
                "chocolate-cake.webp",

            title:
                "Signature Chocolate Cakes"
        },

        {
            image:
                "macarons-desserts.webp",

            title:
                "Elegant Desserts"
        }

    ];


    let currentIndex = 0;


    const previousButton =
        imageContainer.querySelector(
            ".bakery-slider-prev"
        );


    const nextButton =
        imageContainer.querySelector(
            ".bakery-slider-next"
        );


    const dots =
        document.querySelectorAll(
            ".bakery-dot"
        );


    function showExperienceSlide(index) {

        currentIndex =
            (
                index +
                slides.length
            ) %
            slides.length;


        image.style.opacity =
            "0";


        setTimeout(
            function () {

                image.src =
                    slides[currentIndex].image;


                image.alt =
                    slides[currentIndex].title;


                image.style.opacity =
                    "1";

            },
            200
        );


        dots.forEach(
            function (dot, i) {

                dot.classList.toggle(
                    "active",
                    i === currentIndex
                );

            }
        );

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            function () {

                showExperienceSlide(
                    currentIndex - 1
                );

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                showExperienceSlide(
                    currentIndex + 1
                );

            }
        );

    }


    dots.forEach(
        function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    showExperienceSlide(
                        index
                    );

                }
            );

        }
    );


    showExperienceSlide(0);


    setInterval(
        function () {

            showExperienceSlide(
                currentIndex + 1
            );

        },
        5000
    );

}


/* =========================================================
   BAKERY SERVICES SLIDER + ACCORDION
========================================================= */

function initBakeryServices() {

    const serviceSlides =
        document.querySelectorAll(
            ".bakery-service-slide"
        );


    if (!serviceSlides.length) {
        return;
    }


    const serviceDots =
        document.querySelectorAll(
            ".bakery-slider-dot"
        );


    let currentIndex = 0;


    function showServiceSlide(index) {

        currentIndex =
            (
                index +
                serviceSlides.length
            ) %
            serviceSlides.length;


        serviceSlides.forEach(
            function (slide, i) {

                slide.classList.toggle(
                    "active",
                    i === currentIndex
                );

            }
        );


        serviceDots.forEach(
            function (dot, i) {

                dot.classList.toggle(
                    "active",
                    i === currentIndex
                );

            }
        );

    }


    serviceDots.forEach(
        function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    showServiceSlide(
                        index
                    );

                }
            );

        }
    );


    const servicePrevious =
        document.querySelector(
            ".bakery-service-slider .bakery-slider-prev"
        );


    const serviceNext =
        document.querySelector(
            ".bakery-service-slider .bakery-slider-next"
        );


    if (servicePrevious) {

        servicePrevious.addEventListener(
            "click",
            function () {

                showServiceSlide(
                    currentIndex - 1
                );

            }
        );

    }


    if (serviceNext) {

        serviceNext.addEventListener(
            "click",
            function () {

                showServiceSlide(
                    currentIndex + 1
                );

            }
        );

    }


    showServiceSlide(0);


    /* =====================================================
       SERVICE ACCORDION
    ====================================================== */

    const serviceItems =
        document.querySelectorAll(
            ".bakery-service-item"
        );


    serviceItems.forEach(
        function (item) {

            const button =
                item.querySelector(
                    ".bakery-service-item-button"
                );


            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                function () {

                    serviceItems.forEach(
                        function (otherItem) {

                            if (
                                otherItem !== item
                            ) {

                                otherItem.classList.remove(
                                    "active"
                                );

                            }

                        }
                    );


                    item.classList.toggle(
                        "active"
                    );

                }
            );

        }
    );

}


/* =========================================================
   NEWSLETTER
========================================================= */

function initNewsletter() {

    const form =
        document.querySelector(
            ".stackly-footer-newsletter-form"
        );


    if (!form) {
        return;
    }


    const emailInput =
        document.getElementById(
            "stacklyFooterEmail"
        );


    if (!emailInput) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                emailInput.value.trim();


            const validEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!validEmail.test(email)) {

                emailInput.classList.add(
                    "is-invalid"
                );

                return;

            }


            emailInput.classList.remove(
                "is-invalid"
            );


            const wrapper =
                form.querySelector(
                    ".stackly-footer-input-wrap"
                );


            let message =
                form.querySelector(
                    ".stackly-newsletter-message"
                );


            if (!message) {

                message =
                    document.createElement(
                        "div"
                    );


                message.className =
                    "stackly-newsletter-message";


                if (wrapper) {

                    wrapper.after(message);

                } else {

                    form.appendChild(message);

                }

            }


            message.textContent =
                "Thank you! You are subscribed.";


            message.classList.add(
                "success"
            );


            emailInput.value = "";

        }
    );

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function initActiveNavigation() {

    let currentPath =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    /* =============================================
       HANDLE ROOT / INDEX
    ============================================== */

    if (!currentPath) {

        currentPath =
            "index.html";

    }


    const navLinks =
        document.querySelectorAll(
            ".stackly-nav-link"
        );


    navLinks.forEach(
        function (link) {

            const href =
                link.getAttribute("href");


            if (!href) {
                return;
            }


            const linkPath =
                href
                    .split("/")
                    .pop()
                    .split("#")[0]
                    .toLowerCase();


            if (
                linkPath === currentPath
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   QUICK VIEW
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const quickView =
            event.target.closest(
                ".sweet-quick-view"
            );


        if (!quickView) {
            return;
        }


        event.preventDefault();


        const card =
            quickView.closest(
                ".sweet-product-card"
            );


        if (!card) {
            return;
        }


        const nameElement =
            card.querySelector(
                ".sweet-product-name"
            );


        const name =
            nameElement
                ? nameElement.textContent.trim()
                : "Bakery Product";


        showStacklyToast(
            "Quick view: " + name
        );

    }
);


 /* =========================================================
    =========================================================
    CONTACT SERVICE DROPDOWN — FIXED
    =========================================================
 ========================================================= */

function initContactServiceDropdown() {

    const dropdown = document.getElementById(
        "contactServiceDropdown"
    );

    const button = document.getElementById(
        "contactServiceButton"
    );

    const menu = document.getElementById(
        "contactServiceMenu"
    );

    const value = document.getElementById(
        "contactServiceValue"
    );

    const hiddenInput = document.getElementById(
        "contactService"
    );


    /* =====================================================
       CHECK REQUIRED ELEMENTS
    ====================================================== */

    if (
        !dropdown ||
        !button ||
        !menu ||
        !value ||
        !hiddenInput
    ) {
        return;
    }


    const options = menu.querySelectorAll(
        ".stackly-dropdown-option"
    );


    /* =====================================================
       OPEN DROPDOWN
    ====================================================== */

    function openDropdown() {

        dropdown.classList.add("active");

        button.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    /* =====================================================
       CLOSE DROPDOWN
    ====================================================== */

    function closeDropdown() {

        dropdown.classList.remove("active");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    /* =====================================================
       TOGGLE DROPDOWN
    ====================================================== */

    function toggleDropdown() {

        const isOpen =
            dropdown.classList.contains("active");

        if (isOpen) {

            closeDropdown();

        } else {

            openDropdown();

        }

    }


    /* =====================================================
       BUTTON CLICK
    ====================================================== */

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            toggleDropdown();

        }
    );


    /* =====================================================
       OPTION CLICK
    ====================================================== */

    options.forEach(
        function (option) {

            option.setAttribute(
                "tabindex",
                "0"
            );

            option.setAttribute(
                "aria-selected",
                "false"
            );


            option.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const selectedText =
                        option.textContent.trim();

                    const selectedValue =
                        option.getAttribute(
                            "data-value"
                        );


                    /* -------------------------------------
                       CHECK VALUE
                    ------------------------------------- */

                    if (!selectedValue) {
                        return;
                    }


                    /* -------------------------------------
                       UPDATE VISIBLE VALUE
                    ------------------------------------- */

                    value.textContent =
                        selectedText;


                    /* -------------------------------------
                       UPDATE HIDDEN INPUT
                    ------------------------------------- */

                    hiddenInput.value =
                        selectedValue;


                    /* -------------------------------------
                       REMOVE OLD SELECTED STATE
                    ------------------------------------- */

                    options.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );

                            item.setAttribute(
                                "aria-selected",
                                "false"
                            );

                        }
                    );


                    /* -------------------------------------
                       ADD SELECTED STATE
                    ------------------------------------- */

                    option.classList.add(
                        "selected"
                    );

                    option.setAttribute(
                        "aria-selected",
                        "true"
                    );


                    /* -------------------------------------
                       CLEAR VALIDATION ERROR
                    ------------------------------------- */

                    if (
                        typeof clearContactFieldError ===
                        "function"
                    ) {
                        clearContactFieldError(
                            dropdown
                        );
                    }


                    /* -------------------------------------
                       CLOSE DROPDOWN IMMEDIATELY
                    ------------------------------------- */

                    closeDropdown();

                }
            );


            /* =================================================
               KEYBOARD SELECTION
            ================================================== */

            option.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        option.click();

                    }


                    if (
                        event.key === "Escape"
                    ) {

                        event.preventDefault();

                        closeDropdown();

                        button.focus();

                    }

                }
            );

        }
    );


    /* =====================================================
       CLICK OUTSIDE DROPDOWN
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !dropdown.contains(
                    event.target
                )
            ) {

                closeDropdown();

            }

        }
    );


    /* =====================================================
       ESC KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                if (
                    dropdown.classList.contains(
                        "active"
                    )
                ) {

                    closeDropdown();

                    button.focus();

                }

            }

        }
    );


    /* =====================================================
       BUTTON KEYBOARD
    ====================================================== */

    button.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                toggleDropdown();

            }


            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeDropdown();

            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ====================================================== */

    closeDropdown();

}

/* =========================================================
   =========================================================
   CONTACT FORM
   =========================================================
========================================================= */

function initContactForm() {

    const contactForm =
        document.getElementById(
            "stacklyContactForm"
        );


    if (!contactForm) {
        return;
    }


    /* =====================================================
       FORM ELEMENTS
    ====================================================== */

    const contactName =
        document.getElementById(
            "contactName"
        );


    const contactPhone =
        document.getElementById(
            "contactPhone"
        );


    const contactEmail =
        document.getElementById(
            "contactEmail"
        );


    const contactDate =
        document.getElementById(
            "contactDate"
        );


    const contactMessage =
        document.getElementById(
            "contactMessage"
        );


    const serviceDropdown =
        document.getElementById(
            "contactServiceDropdown"
        );


    const serviceButton =
        document.getElementById(
            "contactServiceButton"
        );


    const serviceValue =
        document.getElementById(
            "contactServiceValue"
        );


    const serviceInput =
        document.getElementById(
            "contactService"
        );


    const serviceOptions =
        document.querySelectorAll(
            "#contactServiceMenu .stackly-dropdown-option"
        );


    /* =====================================================
       DATE HELPER
    ====================================================== */

    function getTodayString() {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }


    /* =====================================================
       SET MINIMUM DATE
    ====================================================== */

    function setMinimumDate() {

        if (!contactDate) {
            return;
        }


        const today =
            getTodayString();


        contactDate.min =
            today;


        contactDate.setAttribute(
            "required",
            "required"
        );

    }


    setMinimumDate();


    /* =====================================================
       NAME INPUT
    ====================================================== */

    if (contactName) {

        contactName.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                    );


                clearContactFieldError(
                    this
                );

            }
        );

    }


    /* =====================================================
       PHONE INPUT
    ====================================================== */

    if (contactPhone) {

        contactPhone.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 10);


                clearContactFieldError(
                    this
                );

            }
        );

    }


    /* =====================================================
       EMAIL INPUT
    ====================================================== */

    if (contactEmail) {

        contactEmail.addEventListener(
            "input",
            function () {

                clearContactFieldError(
                    this
                );

            }
        );

    }


    /* =====================================================
       DATE CHANGE
    ====================================================== */

    if (contactDate) {

        contactDate.addEventListener(
            "change",
            function () {

                const selectedDate =
                    this.value;


                const today =
                    getTodayString();


                if (!selectedDate) {

                    showContactFieldError(
                        contactDate,
                        "Please select a date."
                    );

                    return;

                }


                if (
                    selectedDate < today
                ) {

                    showContactFieldError(
                        contactDate,
                        "Please select today or a future date."
                    );


                    this.value = "";

                    return;

                }


                clearContactFieldError(
                    contactDate
                );

            }
        );


        contactDate.addEventListener(
            "input",
            function () {

                clearContactFieldError(
                    this
                );

            }
        );

    }


    /* =====================================================
       MESSAGE INPUT
    ====================================================== */

    if (contactMessage) {

        contactMessage.addEventListener(
            "input",
            function () {

                clearContactFieldError(
                    this
                );

            }
        );

    }


    /* =====================================================
       SHOW ERROR
    ====================================================== */

    function showContactFieldError(
        element,
        message
    ) {

        if (!element) {
            return;
        }


        clearContactFieldError(
            element
        );


        element.classList.add(
            "stackly-input-error"
        );


        const errorMessage =
            document.createElement(
                "small"
            );


        errorMessage.className =
            "stackly-contact-error-message";


        errorMessage.textContent =
            message;


        const parent =
            element.closest(
                ".stackly-contact-form-group"
            );


        if (parent) {

            parent.appendChild(
                errorMessage
            );

        }

    }


    /* =====================================================
       CLEAR ERROR
    ====================================================== */

    function clearContactFieldError(
        element
    ) {

        if (!element) {
            return;
        }


        element.classList.remove(
            "stackly-input-error"
        );


        const parent =
            element.closest(
                ".stackly-contact-form-group"
            );


        if (!parent) {
            return;
        }


        const errorMessage =
            parent.querySelector(
                ".stackly-contact-error-message"
            );


        if (errorMessage) {

            errorMessage.remove();

        }

    }


    /* =====================================================
       SUCCESS MESSAGE
    ====================================================== */

    function showContactSuccessMessage() {

        const oldMessage =
            contactForm.querySelector(
                ".stackly-contact-success-message"
            );


        if (oldMessage) {

            oldMessage.remove();

        }


        const successMessage =
            document.createElement(
                "div"
            );


        successMessage.className =
            "stackly-contact-success-message";


        successMessage.innerHTML = `

            <i class="fa-solid fa-circle-check"></i>

            <div>

                <strong>
                    Message Sent Successfully!
                </strong>

                <span>
                    Thank you for contacting Stackly Bakery.
                    Our team will get back to you soon.
                </span>

            </div>

        `;


        contactForm.insertBefore(
            successMessage,
            contactForm.firstChild
        );


        setTimeout(
            function () {

                successMessage.style.opacity =
                    "0";


                setTimeout(
                    function () {

                        if (
                            successMessage.parentNode
                        ) {

                            successMessage.remove();

                        }

                    },
                    400
                );

            },
            5000
        );

    }


    /* =====================================================
       RESET SERVICE DROPDOWN
    ====================================================== */

    function resetServiceDropdown() {

        if (serviceValue) {

            serviceValue.textContent =
                "Select a service";

        }


        if (serviceInput) {

            serviceInput.value =
                "";

        }


        if (serviceDropdown) {

            serviceDropdown.classList.remove(
                "active"
            );

        }


        if (serviceButton) {

            serviceButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        serviceOptions.forEach(
            function (option) {

                option.classList.remove(
                    "selected"
                );

            }
        );

    }


    /* =====================================================
       FORM SUBMIT
    ====================================================== */

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =============================================
               CLEAR OLD ERRORS
            ============================================== */

            clearContactFieldError(
                contactName
            );

            clearContactFieldError(
                contactPhone
            );

            clearContactFieldError(
                contactEmail
            );

            clearContactFieldError(
                contactDate
            );

            clearContactFieldError(
                contactMessage
            );

            clearContactFieldError(
                serviceDropdown
            );


            let isValid = true;


            /* =============================================
               NAME
            ============================================== */

            const name =
                contactName
                    ? contactName.value.trim()
                    : "";


            const namePattern =
                /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;


            if (!name) {

                showContactFieldError(
                    contactName,
                    "Please enter your name."
                );

                isValid = false;

            } else if (
                name.length < 2
            ) {

                showContactFieldError(
                    contactName,
                    "Please enter a valid name."
                );

                isValid = false;

            } else if (
                !namePattern.test(name)
            ) {

                showContactFieldError(
                    contactName,
                    "Name should contain only letters and spaces."
                );

                isValid = false;

            }


            /* =============================================
               PHONE
            ============================================== */

            const phone =
                contactPhone
                    ? contactPhone.value.trim()
                    : "";


            const phonePattern =
                /^[0-9]{10}$/;


            if (!phone) {

                showContactFieldError(
                    contactPhone,
                    "Please enter your phone number."
                );

                isValid = false;

            } else if (
                !phonePattern.test(phone)
            ) {

                showContactFieldError(
                    contactPhone,
                    "Phone number must contain exactly 10 digits."
                );

                isValid = false;

            }


            /* =============================================
               EMAIL
            ============================================== */

            const email =
                contactEmail
                    ? contactEmail.value.trim()
                    : "";


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


            if (!email) {

                showContactFieldError(
                    contactEmail,
                    "Please enter your email address."
                );

                isValid = false;

            } else if (
                !emailPattern.test(email)
            ) {

                showContactFieldError(
                    contactEmail,
                    "Please enter a valid email address."
                );

                isValid = false;

            }


            /* =============================================
               SERVICE
            ============================================== */

            const selectedService =
                serviceInput
                    ? serviceInput.value.trim()
                    : "";


            if (!selectedService) {

                showContactFieldError(
                    serviceDropdown,
                    "Please select a service."
                );

                isValid = false;

            }


            /* =============================================
               DATE
            ============================================== */

            const selectedDate =
                contactDate
                    ? contactDate.value.trim()
                    : "";


            if (!selectedDate) {

                showContactFieldError(
                    contactDate,
                    "Please select a date."
                );

                isValid = false;

            } else {

                const today =
                    getTodayString();


                if (
                    selectedDate < today
                ) {

                    showContactFieldError(
                        contactDate,
                        "Please select today or a future date."
                    );

                    isValid = false;

                }

            }


            /* =============================================
               MESSAGE
            ============================================== */

            const message =
                contactMessage
                    ? contactMessage.value.trim()
                    : "";


            if (!message) {

                showContactFieldError(
                    contactMessage,
                    "Please enter your message."
                );

                isValid = false;

            } else if (
                message.length < 10
            ) {

                showContactFieldError(
                    contactMessage,
                    "Please enter at least 10 characters."
                );

                isValid = false;

            }


            /* =============================================
               INVALID FORM
            ============================================== */

            if (!isValid) {

                const firstError =
                    contactForm.querySelector(
                        ".stackly-input-error"
                    );


                if (firstError) {

                    if (
                        typeof firstError.focus ===
                        "function"
                    ) {

                        firstError.focus();

                    }


                    firstError.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }


                return;

            }


            /* =============================================
               SUCCESS
            ============================================== */

            showContactSuccessMessage();


            /* =============================================
               RESET FORM
            ============================================== */

            contactForm.reset();


            /* =============================================
               RESET DROPDOWN
            ============================================== */

            resetServiceDropdown();


            /* =============================================
               CLEAR VALIDATION
            ============================================== */

            clearContactFieldError(
                contactName
            );

            clearContactFieldError(
                contactPhone
            );

            clearContactFieldError(
                contactEmail
            );

            clearContactFieldError(
                contactDate
            );

            clearContactFieldError(
                contactMessage
            );

            clearContactFieldError(
                serviceDropdown
            );


            /* =============================================
               RESET DATE
            ============================================== */

            setMinimumDate();

        }
    );

}


/* =========================================================
   EXPOSE CART API
========================================================= */

window.StacklyCart = {

    get: function () {

        return getStacklyCart();

    },


    add: function (button) {

        addStacklyProductToCart(
            button
        );

    },


    remove: function (productId) {

        removeStacklyProduct(
            productId
        );

    },


    clear: function () {

        clearStacklyCart();

    },


    updateCount: function () {

        updateStacklyCartCount();

    },


    render: function () {

        renderStacklyCart();

    }

};


/* =========================================================
   =========================================================
   STACKLY BAKERY PAGE LOADER
   =========================================================
========================================================= */

window.addEventListener(
    "load",
    function () {

        const stacklyBakeryLoader =
            document.getElementById(
                "stacklyBakeryLoader"
            );


        if (!stacklyBakeryLoader) {
            return;
        }


        setTimeout(
            function () {

                stacklyBakeryLoader.classList.add(
                    "is-hidden"
                );


                setTimeout(
                    function () {

                        if (
                            stacklyBakeryLoader.parentNode
                        ) {

                            stacklyBakeryLoader.remove();

                        }

                    },
                    700
                );

            },
            1500
        );

    }
);

/* =========================================================
   STACKLY BAKERY
   NEWSLETTER / SUBSCRIBE VALIDATION
========================================================= */

function initNewsletter() {

    const form = document.querySelector(
        ".stackly-footer-newsletter-form"
    );

    const emailInput = document.getElementById(
        "stacklyFooterEmail"
    );

    if (!form || !emailInput) {
        return;
    }


    /* =====================================================
       DISABLE BROWSER DEFAULT VALIDATION
       This allows our custom messages to appear.
    ====================================================== */

    form.setAttribute(
        "novalidate",
        "novalidate"
    );


    /* =====================================================
       FIND OR CREATE MESSAGE ELEMENT
    ====================================================== */

    let message = form.querySelector(
        ".stackly-newsletter-message"
    );

    if (!message) {

        message = document.createElement(
            "div"
        );

        message.className =
            "stackly-newsletter-message";

        const inputWrapper = form.querySelector(
            ".stackly-footer-input-wrap"
        );

        if (inputWrapper) {

            inputWrapper.insertAdjacentElement(
                "afterend",
                message
            );

        } else {

            emailInput.insertAdjacentElement(
                "afterend",
                message
            );

        }

    }


    /* =====================================================
       EMAIL VALIDATION
    ====================================================== */

    function isValidEmail(email) {

        const emailPattern =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

        return emailPattern.test(email);

    }


    /* =====================================================
       SHOW MESSAGE
    ====================================================== */

    function showMessage(text, type) {

        message.textContent = text;

        message.className =
            "stackly-newsletter-message";

        if (type === "error") {

            message.classList.add(
                "stackly-newsletter-error"
            );

        }

        if (type === "success") {

            message.classList.add(
                "stackly-newsletter-success"
            );

        }

    }


    /* =====================================================
       CLEAR MESSAGE
    ====================================================== */

    function clearMessage() {

        message.textContent = "";

        message.className =
            "stackly-newsletter-message";

    }


    /* =====================================================
       INPUT ERROR
    ====================================================== */

    function showInputError() {

        emailInput.classList.add(
            "stackly-newsletter-input-error"
        );

    }


    /* =====================================================
       REMOVE INPUT ERROR
    ====================================================== */

    function removeInputError() {

        emailInput.classList.remove(
            "stackly-newsletter-input-error"
        );

    }


    /* =====================================================
       FORM SUBMIT
    ====================================================== */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            /* =============================================
               GET EMAIL
            ============================================== */

            const email =
                emailInput.value.trim();


            /* =============================================
               CLEAR OLD STATE
            ============================================== */

            clearMessage();
            removeInputError();


            /* =============================================
               EMPTY EMAIL
            ============================================== */

            if (email === "") {

                showMessage(
                    "Please enter your email address.",
                    "error"
                );

                showInputError();

                emailInput.focus();

                return;

            }


            /* =============================================
               INVALID EMAIL
            ============================================== */

            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                showInputError();

                emailInput.focus();

                return;

            }


            /* =============================================
               SUCCESS
            ============================================== */

            showMessage(
                "Thank you for subscribing! Sweet news is on its way.",
                "success"
            );


            /* =============================================
               CLEAR FORM
            ============================================== */

            emailInput.value = "";

            removeInputError();


            /* =============================================
               HIDE SUCCESS MESSAGE AFTER 5 SECONDS
            ============================================== */

            setTimeout(
                function () {

                    clearMessage();

                },
                5000
            );

        },
        false
    );


    /* =====================================================
       CLEAR ERROR WHILE TYPING
    ====================================================== */

    emailInput.addEventListener(
        "input",
        function () {

            removeInputError();
            clearMessage();

        }
    );


    /* =====================================================
       EMAIL BLUR VALIDATION
    ====================================================== */

    emailInput.addEventListener(
        "blur",
        function () {

            const email =
                emailInput.value.trim();

            if (email === "") {
                return;
            }

            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                showInputError();

            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ====================================================== */

    clearMessage();
    removeInputError();

}
