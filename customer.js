
/* ================================================================
   STACKLY BAKERY
   CUSTOMER DASHBOARD JAVASCRIPT
   PROFESSIONAL CUSTOMER EXPERIENCE
================================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* ============================================================
       CONFIGURATION
    ============================================================ */

    const CUSTOMER_CONFIG = {

        storage: {
            loginEmail: "loginEmail",
            loginRole: "loginRole",
            loginStatus: "stacklyBakeryLoggedIn",
            remember: "stacklyBakeryRemember",
            wishlist: "stacklyBakeryWishlist"
        },

        pages: {
            login: "login.html",
            customer: "customer-dashboard.html",
            admin: "admin.html",
            home: "index.html",
            wishlist: "customer-wishlist.html",
            notifications: "customer-notifications.html"
        },

        role: "customer"

    };


    /* ============================================================
       ELEMENT HELPER
    ============================================================ */

    function $(id) {
        return document.getElementById(id);
    }


    /* ============================================================
       MAIN ELEMENTS
    ============================================================ */

    const sidebar =
        $("bakeryCustomerSidebar");

    const overlay =
        $("bakeryCustomerOverlay");

    const menuToggle =
        $("bakeryCustomerMenuToggle");

    const closeButton =
        $("bakeryCustomerClose");

    const logoutButton =
        $("bakeryCustomerLogout");

    const customerEmail =
        $("bakeryCustomerEmail");


    /* ============================================================
       AOS INITIALIZATION
    ============================================================ */

    if (typeof AOS !== "undefined") {

        AOS.init({
            duration: 850,
            easing: "ease-out-cubic",
            once: true,
            mirror: false,
            offset: 80
        });

    }


    /* ============================================================
       LOCAL STORAGE HELPERS
    ============================================================ */

    function getStorage(key) {

        try {

            return localStorage.getItem(key);

        } catch (error) {

            console.error(
                "Stackly Bakery: Unable to read localStorage.",
                error
            );

            return null;

        }

    }


    function setStorage(key, value) {

        try {

            localStorage.setItem(
                key,
                value
            );

            return true;

        } catch (error) {

            console.error(
                "Stackly Bakery: Unable to write localStorage.",
                error
            );

            return false;

        }

    }


    function removeStorage(key) {

        try {

            localStorage.removeItem(key);

        } catch (error) {

            console.error(
                "Stackly Bakery: Unable to remove localStorage item.",
                error
            );

        }

    }


    /* ============================================================
       NORMALIZE ROLE
    ============================================================ */

    function normalizeRole(role) {

        return String(role || "")
            .trim()
            .toLowerCase();

    }


    /* ============================================================
       CHECK LOGIN STATUS
    ============================================================ */

    function isLoggedIn() {

        return (
            getStorage(
                CUSTOMER_CONFIG.storage.loginStatus
            ) === "true"
        );

    }


    /* ============================================================
       GET LOGIN ROLE
    ============================================================ */

    function getLoginRole() {

        return normalizeRole(
            getStorage(
                CUSTOMER_CONFIG.storage.loginRole
            )
        );

    }


    /* ============================================================
       GET LOGIN EMAIL
    ============================================================ */

    function getLoginEmail() {

        return (
            getStorage(
                CUSTOMER_CONFIG.storage.loginEmail
            ) || ""
        );

    }


    /* ============================================================
       CUSTOMER ACCESS PROTECTION
       
       CUSTOMER DASHBOARD
       ↓
       LOGIN CHECK
       ↓
       CUSTOMER ROLE CHECK
    ============================================================ */

    function protectCustomerDashboard() {

        const loggedIn =
            isLoggedIn();

        const role =
            getLoginRole();


        /*
         * No active session
         */

        if (!loggedIn) {

            window.location.href =
                CUSTOMER_CONFIG.pages.login;

            return false;

        }


        /*
         * Logged in with another role
         */

        if (
            role &&
            role !== CUSTOMER_CONFIG.role
        ) {

            if (role === "admin") {

                window.location.href =
                    CUSTOMER_CONFIG.pages.admin;

            } else {

                window.location.href =
                    CUSTOMER_CONFIG.pages.login;

            }

            return false;

        }


        return true;

    }


    /*
     * Run protection immediately.
     */

    if (!protectCustomerDashboard()) {
        return;
    }


    /* ============================================================
       FORMAT EMAIL NAME
    ============================================================ */

    function getDisplayName(email) {

        if (!email) {
            return "Customer";
        }


        const username =
            email
                .split("@")[0]
                .replace(/[._-]+/g, " ")
                .trim();


        if (!username) {
            return "Customer";
        }


        return username
            .replace(/\b\w/g, function (letter) {

                return letter.toUpperCase();

            });

    }


    /* ============================================================
       UPDATE CUSTOMER EMAIL
    ============================================================ */

    function updateCustomerInformation() {

        const email =
            getLoginEmail();


        if (customerEmail && email) {

            customerEmail.textContent =
                email;

            customerEmail.setAttribute(
                "title",
                email
            );

        }


        /*
         * Update welcome heading when possible.
         */

        const welcomeHeading =
            document.querySelector(
                ".bakery-customer-welcome-section h1"
            );


        if (
            welcomeHeading &&
            email
        ) {

            const displayName =
                getDisplayName(email);


            /*
             * Keep the existing HTML design
             * but personalize the text.
             */

            const span =
                welcomeHeading.querySelector(
                    "span"
                );


            if (span) {

                welcomeHeading.childNodes.forEach(
                    function (node) {

                        if (
                            node.nodeType ===
                            Node.TEXT_NODE &&
                            node.textContent.trim()
                        ) {

                            node.textContent =
                                "Sweet moments start ";

                        }

                    }
                );

            }

        }

    }


    updateCustomerInformation();


    /* ============================================================
       MOBILE SIDEBAR
    ============================================================ */

    function openSidebar() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.add(
            "active"
        );


        if (overlay) {

            overlay.classList.add(
                "active"
            );

            overlay.setAttribute(
                "aria-hidden",
                "false"
            );

        }


        if (menuToggle) {

            menuToggle.classList.add(
                "active"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        sidebar.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "bakery-customer-menu-open"
        );

    }


    function closeSidebar() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.remove(
            "active"
        );


        if (overlay) {

            overlay.classList.remove(
                "active"
            );

            overlay.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        if (menuToggle) {

            menuToggle.classList.remove(
                "active"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        sidebar.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "bakery-customer-menu-open"
        );

    }


    /* ============================================================
       MENU TOGGLE
    ============================================================ */

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (
                    sidebar &&
                    sidebar.classList.contains(
                        "active"
                    )
                ) {

                    closeSidebar();

                } else {

                    openSidebar();

                }

            }
        );

    }


    /* ============================================================
       CLOSE BUTTON
    ============================================================ */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                closeSidebar();

            }
        );

    }


    /* ============================================================
       OVERLAY
    ============================================================ */

    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                closeSidebar();

            }
        );

    }


    /* ============================================================
       ESC KEY
    ============================================================ */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeSidebar();

            }

        }
    );


    /* ============================================================
       CLOSE MOBILE MENU AFTER NAVIGATION
    ============================================================ */

    document
        .querySelectorAll(
            ".bakery-customer-nav-link"
        )
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    closeSidebar();

                }
            );

        });


    /* ============================================================
       ACTIVE NAVIGATION
    ============================================================ */

    function setActiveNavigation() {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        document
            .querySelectorAll(
                ".bakery-customer-nav-link"
            )
            .forEach(function (link) {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (!href) {
                    return;
                }


                const linkPage =
                    href
                        .split("/")
                        .pop()
                        .split("?")[0]
                        .split("#")[0]
                        .toLowerCase();


                link.classList.remove(
                    "active"
                );


                if (
                    currentPage &&
                    linkPage === currentPage
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            });

    }


    setActiveNavigation();


    /* ============================================================
       WISHLIST STORAGE
    ============================================================ */

    function getWishlist() {

        try {

            const stored =
                getStorage(
                    CUSTOMER_CONFIG.storage.wishlist
                );


            if (!stored) {
                return [];
            }


            const wishlist =
                JSON.parse(stored);


            return Array.isArray(wishlist)
                ? wishlist
                : [];

        } catch (error) {

            console.error(
                "Stackly Bakery: Unable to read wishlist.",
                error
            );

            return [];

        }

    }


    function saveWishlist(wishlist) {

        try {

            setStorage(
                CUSTOMER_CONFIG.storage.wishlist,
                JSON.stringify(wishlist)
            );

            return true;

        } catch (error) {

            console.error(
                "Stackly Bakery: Unable to save wishlist.",
                error
            );

            return false;

        }

    }


    /* ============================================================
       PRODUCT INFORMATION
    ============================================================ */

    function getProductData(card) {

        if (!card) {
            return null;
        }


        const titleElement =
            card.querySelector(
                ".bakery-customer-product-content h3"
            );


        const priceElement =
            card.querySelector(
                ".bakery-customer-product-bottom strong"
            );


        const imageElement =
            card.querySelector(
                ".bakery-customer-product-image img"
            );


        const categoryElement =
            card.querySelector(
                ".bakery-customer-product-content > span"
            );


        return {

            id:
                titleElement
                    ? titleElement.textContent
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    : "product-" + Date.now(),

            name:
                titleElement
                    ? titleElement.textContent.trim()
                    : "Bakery Product",

            price:
                priceElement
                    ? priceElement.textContent.trim()
                    : "",

            image:
                imageElement
                    ? imageElement.getAttribute("src")
                    : "",

            category:
                categoryElement
                    ? categoryElement.textContent.trim()
                    : ""

        };

    }


    /* ============================================================
       WISHLIST COUNT
    ============================================================ */

    function updateWishlistCount() {

        const wishlist =
            getWishlist();


        const countElements =
            document.querySelectorAll(
                ".bakery-customer-nav-link"
            );


        countElements.forEach(function (link) {

            const text =
                link.textContent
                    .trim()
                    .toLowerCase();


            if (
                text.includes(
                    "wishlist"
                )
            ) {

                const count =
                    link.querySelector(
                        ".bakery-customer-nav-count"
                    );


                if (count) {

                    count.textContent =
                        wishlist.length;

                }

            }

        });


        /*
         * Also update dashboard wishlist stat.
         */

        const statCards =
            document.querySelectorAll(
                ".bakery-customer-stat-card"
            );


        statCards.forEach(function (card) {

            const text =
                card.textContent
                    .trim()
                    .toLowerCase();


            if (
                text.includes(
                    "wishlist"
                )
            ) {

                const number =
                    card.querySelector(
                        ".bakery-customer-stat-content strong"
                    );


                if (number) {

                    number.textContent =
                        wishlist.length;

                }

            }

        });

    }


    /* ============================================================
       WISHLIST BUTTON STATE
    ============================================================ */

    function updateWishlistButtons() {

        const wishlist =
            getWishlist();


        document
            .querySelectorAll(
                ".bakery-customer-product-card"
            )
            .forEach(function (card) {

                const product =
                    getProductData(card);


                if (!product) {
                    return;
                }


                const button =
                    card.querySelector(
                        ".bakery-customer-wishlist-button"
                    );


                if (!button) {
                    return;
                }


                const icon =
                    button.querySelector(
                        "i"
                    );


                const exists =
                    wishlist.some(
                        function (item) {

                            return (
                                item.id ===
                                product.id
                            );

                        }
                    );


                button.classList.toggle(
                    "active",
                    exists
                );


                button.setAttribute(
                    "aria-pressed",
                    exists
                        ? "true"
                        : "false"
                );


                button.setAttribute(
                    "aria-label",
                    exists
                        ? "Remove " +
                          product.name +
                          " from wishlist"
                        : "Add " +
                          product.name +
                          " to wishlist"
                );


                if (icon) {

                    icon.classList.toggle(
                        "fa-solid",
                        exists
                    );

                    icon.classList.toggle(
                        "fa-regular",
                        !exists
                    );

                    icon.classList.toggle(
                        "fa-heart",
                        true
                    );

                }

            });

    }


    /* ============================================================
       WISHLIST TOGGLE
    ============================================================ */

    function toggleWishlist(card, button) {

        const product =
            getProductData(card);


        if (!product) {
            return;
        }


        let wishlist =
            getWishlist();


        const existingIndex =
            wishlist.findIndex(
                function (item) {

                    return (
                        item.id ===
                        product.id
                    );

                }
            );


        if (existingIndex !== -1) {

            wishlist.splice(
                existingIndex,
                1
            );


            saveWishlist(
                wishlist
            );


            button.classList.remove(
                "active"
            );


            button.setAttribute(
                "aria-pressed",
                "false"
            );


        } else {

            wishlist.push(
                product
            );


            saveWishlist(
                wishlist
            );


            button.classList.add(
                "active"
            );


            button.setAttribute(
                "aria-pressed",
                "true"
            );

        }


        updateWishlistButtons();

        updateWishlistCount();


        /*
         * Small visual feedback
         * without browser alerts.
         */

        button.classList.add(
            "bakery-wishlist-clicked"
        );


        setTimeout(
            function () {

                button.classList.remove(
                    "bakery-wishlist-clicked"
                );

            },
            350
        );

    }


    /* ============================================================
       WISHLIST EVENTS
    ============================================================ */

    document
        .querySelectorAll(
            ".bakery-customer-product-card"
        )
        .forEach(function (card) {

            const wishlistButton =
                card.querySelector(
                    ".bakery-customer-wishlist-button"
                );


            if (!wishlistButton) {
                return;
            }


            wishlistButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    toggleWishlist(
                        card,
                        wishlistButton
                    );

                }
            );

        });


    updateWishlistButtons();

    updateWishlistCount();


    /* ============================================================
       PRODUCT ADD BUTTON
    ============================================================ */

    document
        .querySelectorAll(
            ".bakery-customer-add-button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    /*
                     * Keep the existing href behavior.
                     */

                    button.classList.add(
                        "bakery-product-clicked"
                    );


                    setTimeout(
                        function () {

                            button.classList.remove(
                                "bakery-product-clicked"
                            );

                        },
                        300
                    );

                }
            );

        });


    /* ============================================================
       NAVIGATION HOVER ACCESSIBILITY
    ============================================================ */

    document
        .querySelectorAll(
            ".bakery-customer-nav-link"
        )
        .forEach(function (link) {

            link.addEventListener(
                "focus",
                function () {

                    link.classList.add(
                        "keyboard-focus"
                    );

                }
            );


            link.addEventListener(
                "blur",
                function () {

                    link.classList.remove(
                        "keyboard-focus"
                    );

                }
            );

        });


    /* ============================================================
       NOTIFICATION DOT
    ============================================================ */

    const notificationLink =
        document.querySelector(
            ".bakery-customer-notification"
        );


    if (notificationLink) {

        const notificationDot =
            notificationLink.querySelector(
                ".bakery-customer-notification-dot"
            );


        /*
         * Keep the notification indicator
         * visible when there are notifications.
         */

        if (notificationDot) {

            notificationDot.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        notificationLink.addEventListener(
            "click",
            function () {

                /*
                 * Allow normal navigation.
                 */

            }
        );

    }


    /* ============================================================
       ORDER STATUS LIVE UPDATE
    ============================================================ */

    function initializeOrderStatus() {

        const liveBadge =
            document.querySelector(
                ".bakery-customer-live-badge"
            );


        if (!liveBadge) {
            return;
        }


        /*
         * Accessibility label.
         */

        liveBadge.setAttribute(
            "aria-label",
            "Live order tracking"
        );

    }


    initializeOrderStatus();


    /* ============================================================
       DELIVERY NOTE
    ============================================================ */

    function initializeDeliveryNote() {

        const note =
            document.querySelector(
                ".bakery-customer-delivery-note"
            );


        if (!note) {
            return;
        }


        const currentDate =
            new Date();


        /*
         * This is only a visual dashboard.
         * The displayed HTML date/time remains unchanged.
         */

        note.setAttribute(
            "data-dashboard-status",
            "active"
        );

    }


    initializeDeliveryNote();


    /* ============================================================
       LOGOUT
    ============================================================ */

    function logoutCustomer() {

        /*
         * Remove login session.
         */

        removeStorage(
            CUSTOMER_CONFIG.storage.loginStatus
        );

        removeStorage(
            CUSTOMER_CONFIG.storage.loginEmail
        );

        removeStorage(
            CUSTOMER_CONFIG.storage.loginRole
        );

        removeStorage(
            CUSTOMER_CONFIG.storage.remember
        );


        /*
         * Close sidebar if open.
         */

        closeSidebar();


        /*
         * Redirect to login.
         */

        window.location.href =
            CUSTOMER_CONFIG.pages.login;

    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                logoutCustomer();

            }
        );

    }


    /* ============================================================
       BROWSER BACK / FORWARD PROTECTION
    ============================================================ */

    window.addEventListener(
        "pageshow",
        function () {

            if (!isLoggedIn()) {

                window.location.replace(
                    CUSTOMER_CONFIG.pages.login
                );

                return;

            }


            const role =
                getLoginRole();


            if (
                role &&
                role !== CUSTOMER_CONFIG.role
            ) {

                if (role === "admin") {

                    window.location.replace(
                        CUSTOMER_CONFIG.pages.admin
                    );

                } else {

                    window.location.replace(
                        CUSTOMER_CONFIG.pages.login
                    );

                }

            }

        }
    );


    /* ============================================================
       WINDOW RESIZE
    ============================================================ */

    let resizeTimer;


    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        /*
                         * Close mobile sidebar
                         * when returning to desktop.
                         */

                        if (
                            window.innerWidth > 991
                        ) {

                            closeSidebar();

                        }

                    },
                    120
                );

        }
    );


    /* ============================================================
       PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
    ============================================================ */

    const customerDashboard =
        document.querySelector(
            ".bakery-customer-dashboard"
        );


    if (customerDashboard) {

        const observer =
            new MutationObserver(
                function () {

                    if (
                        sidebar &&
                        sidebar.classList.contains(
                            "active"
                        )
                    ) {

                        document.body.classList.add(
                            "bakery-customer-menu-open"
                        );

                    } else {

                        document.body.classList.remove(
                            "bakery-customer-menu-open"
                        );

                    }

                }
            );


        if (sidebar) {

            observer.observe(
                sidebar,
                {
                    attributes: true,
                    attributeFilter: [
                        "class"
                    ]
                }
            );

        }

    }


    /* ============================================================
       SMOOTH INTERNAL LINKS
    ============================================================ */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* ============================================================
       IMAGE FALLBACK
    ============================================================ */

    document
        .querySelectorAll(
            ".bakery-customer-product-image img, " +
            ".bakery-customer-order-image img, " +
            ".bakery-customer-mini-image img"
        )
        .forEach(function (image) {

            image.addEventListener(
                "error",
                function () {

                    image.classList.add(
                        "bakery-image-error"
                    );

                    image.setAttribute(
                        "alt",
                        "Bakery product image unavailable"
                    );

                }
            );

        });


    /* ============================================================
       CARD HOVER ACCESSIBILITY
    ============================================================ */

    document
        .querySelectorAll(
            ".bakery-customer-product-card, " +
            ".bakery-customer-stat-card, " +
            ".bakery-customer-quick-card"
        )
        .forEach(function (card) {

            card.addEventListener(
                "mouseenter",
                function () {

                    card.classList.add(
                        "is-hovered"
                    );

                }
            );


            card.addEventListener(
                "mouseleave",
                function () {

                    card.classList.remove(
                        "is-hovered"
                    );

                }
            );

        });


    /* ============================================================
       PAGE VISIBILITY
    ============================================================ */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                !document.hidden &&
                !isLoggedIn()
            ) {

                window.location.replace(
                    CUSTOMER_CONFIG.pages.login
                );

            }

        }
    );


    /* ============================================================
       CUSTOMER DASHBOARD API
    ============================================================ */

    window.StacklyBakeryCustomer = {

        /* ========================================================
           GET EMAIL
        ======================================================== */

        getEmail: function () {

            return getLoginEmail();

        },


        /* ========================================================
           GET ROLE
        ======================================================== */

        getRole: function () {

            return getLoginRole();

        },


        /* ========================================================
           CHECK LOGIN
        ======================================================== */

        isLoggedIn: function () {

            return isLoggedIn();

        },


        /* ========================================================
           GET WISHLIST
        ======================================================== */

        getWishlist: function () {

            return getWishlist();

        },


        /* ========================================================
           OPEN SIDEBAR
        ======================================================== */

        openMenu: function () {

            openSidebar();

        },


        /* ========================================================
           CLOSE SIDEBAR
        ======================================================== */

        closeMenu: function () {

            closeSidebar();

        },


        /* ========================================================
           LOGOUT
        ======================================================== */

        logout: function () {

            logoutCustomer();

        }

    };


    /* ============================================================
       INITIALIZATION COMPLETE
    ============================================================ */

    console.log(
        "Stackly Bakery Customer Dashboard initialized successfully."
    );

});

/* =========================================================
   STACKLY BAKERY CUSTOMER DASHBOARD JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GET ELEMENTS
    ====================================================== */

    const menuToggle = document.getElementById(
        "bakeryCustomerMenuToggle"
    );

    const sidebar = document.getElementById(
        "bakeryCustomerSidebar"
    );

    const closeButton = document.getElementById(
        "bakeryCustomerClose"
    );

    const overlay = document.getElementById(
        "bakeryCustomerOverlay"
    );

    const sidebarLinks = document.querySelectorAll(
        ".bakery-customer-nav-link"
    );


    /* =====================================================
       CHECK REQUIRED ELEMENTS
    ====================================================== */

    if (
        !menuToggle ||
        !sidebar ||
        !closeButton ||
        !overlay
    ) {
        console.warn(
            "Stackly Customer Dashboard: Sidebar elements not found."
        );

        return;
    }


    /* =====================================================
       OPEN SIDEBAR
    ====================================================== */

    function openCustomerSidebar() {

        sidebar.classList.add("is-open");

        overlay.classList.add("is-visible");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        sidebar.setAttribute(
            "aria-hidden",
            "false"
        );

        overlay.setAttribute(
            "aria-hidden",
            "false"
        );

        /* Prevent background scrolling */

        document.body.style.overflow = "hidden";
    }


    /* =====================================================
       CLOSE SIDEBAR
    ====================================================== */

    function closeCustomerSidebar() {

        sidebar.classList.remove("is-open");

        overlay.classList.remove("is-visible");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        sidebar.setAttribute(
            "aria-hidden",
            "true"
        );

        overlay.setAttribute(
            "aria-hidden",
            "true"
        );

        /* Restore background scrolling */

        document.body.style.overflow = "";
    }


    /* =====================================================
       HAMBURGER BUTTON
    ====================================================== */

    menuToggle.addEventListener(
        "click",
        function () {

            const sidebarIsOpen =
                sidebar.classList.contains("is-open");

            if (sidebarIsOpen) {

                closeCustomerSidebar();

            } else {

                openCustomerSidebar();

            }

        }
    );


    /* =====================================================
       CLOSE BUTTON
    ====================================================== */

    closeButton.addEventListener(
        "click",
        function () {

            closeCustomerSidebar();

        }
    );


    /* =====================================================
       OVERLAY CLICK
    ====================================================== */

    overlay.addEventListener(
        "click",
        function () {

            closeCustomerSidebar();

        }
    );


    /* =====================================================
       CLOSE WHEN NAVIGATION LINK IS CLICKED
       MOBILE ONLY
    ====================================================== */

    sidebarLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (
                    window.innerWidth <= 991
                ) {

                    closeCustomerSidebar();

                }

            }
        );

    });


    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                sidebar.classList.contains("is-open")
            ) {

                closeCustomerSidebar();

            }

        }
    );


    /* =====================================================
       CLOSE SIDEBAR WHEN RESIZING TO DESKTOP
    ====================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 991) {

                closeCustomerSidebar();

            }

        }
    );


    /* =====================================================
       TOPBAR SCROLL EFFECT
    ====================================================== */

    const topbar = document.querySelector(
        ".bakery-customer-topbar"
    );

    if (topbar) {

        function updateCustomerTopbar() {

            if (window.scrollY > 40) {

                topbar.classList.add("scrolled");

            } else {

                topbar.classList.remove("scrolled");

            }

        }

        window.addEventListener(
            "scroll",
            updateCustomerTopbar,
            {
                passive: true
            }
        );

        updateCustomerTopbar();

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ====================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    sidebarLinks.forEach(function (link) {

        const linkPage =
            link.getAttribute("href")
                ?.split("/")
                .pop()
                .toLowerCase();

        if (
            linkPage &&
            linkPage === currentPage
        ) {

            sidebarLinks.forEach(function (item) {

                item.classList.remove("active");

            });

            link.classList.add("active");

        }

    });


    /* =====================================================
       INITIAL STATE
    ====================================================== */

    if (window.innerWidth <= 991) {

        sidebar.classList.remove("is-open");

        overlay.classList.remove("is-visible");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        sidebar.setAttribute(
            "aria-hidden",
            "true"
        );

    } else {

        sidebar.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /* =====================================================
       LOGOUT BUTTON
    ====================================================== */

    const logoutButton = document.getElementById(
        "bakeryCustomerLogout"
    );

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                /*
                 * Clear customer login information.
                 * Remove these lines if your login system
                 * uses different localStorage keys.
                 */

                localStorage.removeItem(
                    "loginEmail"
                );

                localStorage.removeItem(
                    "loginRole"
                );

                window.location.href =
                    "login.html";

            }
        );

    }

});

/* =========================================================
   STACKLY BAKERY OFFERS - COPY COUPON CODE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const copyButtons = document.querySelectorAll(
        ".bakery-offer-code button"
    );

    copyButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const couponCode = this
                .closest(".bakery-offer-code")
                .querySelector("strong")
                .textContent
                .trim();

            navigator.clipboard.writeText(couponCode)
                .then(function () {

                    button.textContent = "Copied!";

                    button.classList.add("copied");

                    setTimeout(function () {

                        button.textContent = "Copy";

                        button.classList.remove("copied");

                    }, 2000);

                })
                .catch(function () {

                    button.textContent = "Failed";

                    setTimeout(function () {

                        button.textContent = "Copy";

                    }, 2000);

                });

        });

    });

});

/* =========================================================
   STACKLY BAKERY - DISPLAY USER NAME FROM LOGIN EMAIL
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const userNameElement = document.getElementById(
        "bakerySettingsUserName"
    );

    if (!userNameElement) {
        return;
    }


    /* =====================================================
       GET LOGGED-IN EMAIL
    ====================================================== */

    const loggedInEmail = localStorage.getItem(
        "loginEmail"
    );


    /* =====================================================
       CREATE DISPLAY NAME
       
       Example:
       arul@gmail.com
       ↓
       arul
       ↓
       Arul
    ====================================================== */

    if (loggedInEmail) {

        const emailName = loggedInEmail
            .split("@")[0]
            .trim();

        if (emailName) {

            /*
             * Take the first part before:
             * .  _  -
             */

            const firstWord = emailName
                .split(/[._-]/)[0]
                .trim();


            if (firstWord) {

                const displayName =
                    firstWord.charAt(0).toUpperCase() +
                    firstWord.slice(1).toLowerCase();

                userNameElement.textContent =
                    displayName;

            }

        }

    }

});


/* =========================================================
   STACKLY BAKERY - SETTINGS USER EMAIL
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const emailElement = document.getElementById(
        "bakerySettingsUserEmail"
    );

    if (!emailElement) {
        return;
    }

    let loggedInEmail = "";

    /* Use existing Stackly Bakery Auth */
    if (
        window.StacklyBakeryAuth &&
        typeof window.StacklyBakeryAuth.getLoggedInEmail === "function"
    ) {
        loggedInEmail =
            window.StacklyBakeryAuth.getLoggedInEmail() || "";
    } else {
        loggedInEmail =
            localStorage.getItem("loginEmail") || "";
    }

    loggedInEmail = loggedInEmail.trim();

    /* Display logged-in email */
    if (loggedInEmail) {
        emailElement.textContent = loggedInEmail;
    }

});

