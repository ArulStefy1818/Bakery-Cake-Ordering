/* =========================================================
   STACKLY BAKERY ADMIN DASHBOARD
   MOBILE SIDEBAR / HAMBURGER JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar = document.getElementById("bakeryAdminSidebar");
    const overlay = document.getElementById("bakeryAdminOverlay");
    const menuToggle = document.getElementById("bakeryAdminMenuToggle");
    const closeButton = document.getElementById("bakeryAdminClose");
    const logoutButton = document.getElementById("bakeryAdminLogout");
    const emailElement = document.getElementById("bakeryAdminEmail");

    const MOBILE_BREAKPOINT = 991;


    /* =====================================================
       LOGIN EMAIL
    ===================================================== */

    const storedEmail = localStorage.getItem("loginEmail");

    if (emailElement) {
        emailElement.textContent =
            storedEmail || "admin@stackly.com";
    }


    /* =====================================================
       CHECK REQUIRED ELEMENTS
    ===================================================== */

    if (!sidebar || !overlay || !menuToggle) {
        console.warn(
            "Stackly Bakery Admin: Sidebar elements are missing."
        );
        return;
    }


    /* =====================================================
       UPDATE BODY SCROLL
    ===================================================== */

    function updateBodyScroll(isOpen) {

        if (window.innerWidth <= MOBILE_BREAKPOINT && isOpen) {
            document.body.classList.add(
                "bakery-admin-menu-open"
            );

            document.body.style.overflow = "hidden";

        } else {
            document.body.classList.remove(
                "bakery-admin-menu-open"
            );

            document.body.style.overflow = "";
        }
    }


    /* =====================================================
       OPEN SIDEBAR
    ===================================================== */

    function openAdminSidebar() {

        if (window.innerWidth > MOBILE_BREAKPOINT) {
            return;
        }

        sidebar.classList.add("active");
        overlay.classList.add("active");

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

        updateBodyScroll(true);
    }


    /* =====================================================
       CLOSE SIDEBAR
    ===================================================== */

    function closeAdminSidebar() {

        sidebar.classList.remove("active");
        overlay.classList.remove("active");

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

        updateBodyScroll(false);
    }


    /* =====================================================
       TOGGLE SIDEBAR
    ===================================================== */

    function toggleAdminSidebar() {

        if (window.innerWidth > MOBILE_BREAKPOINT) {
            return;
        }

        const isOpen =
            sidebar.classList.contains("active");

        if (isOpen) {
            closeAdminSidebar();
        } else {
            openAdminSidebar();
        }
    }


    /* =====================================================
       HAMBURGER BUTTON
    ===================================================== */

    menuToggle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            toggleAdminSidebar();
        }
    );


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                closeAdminSidebar();
            }
        );
    }


    /* =====================================================
       OVERLAY CLICK
    ===================================================== */

    overlay.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            closeAdminSidebar();
        }
    );


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                sidebar.classList.contains("active")
            ) {

                closeAdminSidebar();

                if (menuToggle) {
                    menuToggle.focus();
                }
            }
        }
    );


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    const navigationLinks =
        document.querySelectorAll(
            ".bakery-admin-nav-link"
        );

    navigationLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (
                    window.innerWidth <=
                    MOBILE_BREAKPOINT
                ) {
                    closeAdminSidebar();
                }
            }
        );
    });


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "loginEmail"
                );

                localStorage.removeItem(
                    "loginRole"
                );

                localStorage.removeItem(
                    "stacklyBakeryLoggedIn"
                );

                localStorage.removeItem(
                    "stacklyBakeryRemember"
                );

                window.location.href =
                    "login.html";
            }
        );
    }


    /* =====================================================
       RESIZE HANDLER
    ===================================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        function () {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(
                function () {

                    if (
                        window.innerWidth >
                        MOBILE_BREAKPOINT
                    ) {
                        closeAdminSidebar();
                    }

                },
                100
            );
        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    closeAdminSidebar();


    /* =====================================================
       OPTIONAL ADMIN ACCESS CHECK
       Enable if required.
    ===================================================== */

    /*
    const loginStatus =
        localStorage.getItem(
            "stacklyBakeryLoggedIn"
        );

    const loginRole =
        localStorage.getItem(
            "loginRole"
        );

    if (
        loginStatus !== "true" ||
        loginRole !== "admin"
    ) {
        window.location.href =
            "login.html";
    }
    */

});


/* =========================================================
   STACKLY BAKERY — CAKE EDIT BUTTON
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const editButtons = document.querySelectorAll(
        ".bakery-cakes-product-edit"
    );

    if (!editButtons.length) {
        return;
    }


    /* =====================================================
       CREATE EDIT MODAL
    ====================================================== */

    const editModal = document.createElement("div");

    editModal.className = "bakery-cakes-edit-modal";

    editModal.innerHTML = `
        <div class="bakery-cakes-edit-overlay"></div>

        <div
            class="bakery-cakes-edit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bakeryCakesEditTitle"
        >

            <button
                type="button"
                class="bakery-cakes-edit-close"
                aria-label="Close edit window"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>


            <div class="bakery-cakes-edit-header">

                <span>
                    CAKE MANAGEMENT
                </span>

                <h3 id="bakeryCakesEditTitle">
                    Edit Cake
                </h3>

                <p>
                    Update cake details and inventory information.
                </p>

            </div>


            <form class="bakery-cakes-edit-form">

                <div class="bakery-cakes-edit-field">

                    <label for="bakeryCakeEditName">
                        Cake Name
                    </label>

                    <input
                        type="text"
                        id="bakeryCakeEditName"
                        required
                    >

                </div>


                <div class="bakery-cakes-edit-row">

                    <div class="bakery-cakes-edit-field">

                        <label for="bakeryCakeEditCategory">
                            Category
                        </label>

                        <input
                            type="text"
                            id="bakeryCakeEditCategory"
                            required
                        >

                    </div>


                    <div class="bakery-cakes-edit-field">

                        <label for="bakeryCakeEditPrice">
                            Price
                        </label>

                        <input
                            type="number"
                            id="bakeryCakeEditPrice"
                            min="0"
                            required
                        >

                    </div>

                </div>


                <div class="bakery-cakes-edit-field">

                    <label for="bakeryCakeEditStock">
                        Available Stock
                    </label>

                    <input
                        type="number"
                        id="bakeryCakeEditStock"
                        min="0"
                        required
                    >

                </div>


                <div class="bakery-cakes-edit-actions">

                    <button
                        type="button"
                        class="bakery-cakes-edit-cancel"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="bakery-cakes-edit-save"
                    >
                        <i class="fa-solid fa-check"></i>
                        Save Changes
                    </button>

                </div>

            </form>

        </div>
    `;

    document.body.appendChild(editModal);


    /* =====================================================
       GET MODAL ELEMENTS
    ====================================================== */

    const overlay = editModal.querySelector(
        ".bakery-cakes-edit-overlay"
    );

    const closeButton = editModal.querySelector(
        ".bakery-cakes-edit-close"
    );

    const cancelButton = editModal.querySelector(
        ".bakery-cakes-edit-cancel"
    );

    const form = editModal.querySelector(
        ".bakery-cakes-edit-form"
    );

    const nameInput = document.getElementById(
        "bakeryCakeEditName"
    );

    const categoryInput = document.getElementById(
        "bakeryCakeEditCategory"
    );

    const priceInput = document.getElementById(
        "bakeryCakeEditPrice"
    );

    const stockInput = document.getElementById(
        "bakeryCakeEditStock"
    );


    let activeCard = null;


    /* =====================================================
       OPEN MODAL
    ====================================================== */

    function openCakeEditModal(card) {

        activeCard = card;

        const nameElement = card.querySelector(
            ".bakery-cakes-product-content h4"
        );

        const categoryElement = card.querySelector(
            ".bakery-cakes-product-category"
        );

        const priceElement = card.querySelector(
            ".bakery-cakes-product-meta strong"
        );

        const stockElement = card.querySelector(
            ".bakery-cakes-stock-row strong"
        );


        const cakeName = nameElement
            ? nameElement.textContent.trim()
            : "";

        const category = categoryElement
            ? categoryElement.textContent.trim()
            : "";

        const price = priceElement
            ? priceElement.textContent
                .replace(/[₹,\s]/g, "")
            : "";

        const stock = stockElement
            ? stockElement.textContent
                .replace(/[^0-9]/g, "")
            : "";


        nameInput.value = cakeName;
        categoryInput.value = category;
        priceInput.value = price;
        stockInput.value = stock;


        editModal.classList.add(
            "bakery-cakes-edit-modal-active"
        );

        document.body.classList.add(
            "bakery-cakes-edit-open"
        );


        setTimeout(function () {
            nameInput.focus();
        }, 150);

    }


    /* =====================================================
       CLOSE MODAL
    ====================================================== */

    function closeCakeEditModal() {

        editModal.classList.remove(
            "bakery-cakes-edit-modal-active"
        );

        document.body.classList.remove(
            "bakery-cakes-edit-open"
        );

        activeCard = null;

    }


    /* =====================================================
       EDIT BUTTON EVENTS
    ====================================================== */

    editButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const card = button.closest(
                ".bakery-cakes-product-card"
            );

            if (!card) {
                return;
            }

            openCakeEditModal(card);

        });

    });


    /* =====================================================
       CLOSE EVENTS
    ====================================================== */

    closeButton.addEventListener(
        "click",
        closeCakeEditModal
    );

    cancelButton.addEventListener(
        "click",
        closeCakeEditModal
    );

    overlay.addEventListener(
        "click",
        closeCakeEditModal
    );


    /* =====================================================
       ESC KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                editModal.classList.contains(
                    "bakery-cakes-edit-modal-active"
                )
            ) {

                closeCakeEditModal();

            }

        }
    );


    /* =====================================================
       SAVE CHANGES
    ====================================================== */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            if (!activeCard) {
                return;
            }


            const newName =
                nameInput.value.trim();

            const newCategory =
                categoryInput.value.trim();

            const newPrice =
                Number(priceInput.value);

            const newStock =
                Number(stockInput.value);


            if (
                !newName ||
                !newCategory ||
                Number.isNaN(newPrice) ||
                Number.isNaN(newStock)
            ) {
                return;
            }


            /* ---------------------------------------------
               UPDATE CARD CONTENT
            --------------------------------------------- */

            const nameElement =
                activeCard.querySelector(
                    ".bakery-cakes-product-content h4"
                );

            const categoryElement =
                activeCard.querySelector(
                    ".bakery-cakes-product-category"
                );

            const priceElement =
                activeCard.querySelector(
                    ".bakery-cakes-product-meta strong"
                );

            const stockElement =
                activeCard.querySelector(
                    ".bakery-cakes-stock-row strong"
                );


            if (nameElement) {
                nameElement.textContent = newName;
            }


            if (categoryElement) {
                categoryElement.textContent = newCategory;
            }


            if (priceElement) {

                priceElement.textContent =
                    "₹" +
                    newPrice.toLocaleString("en-IN");

            }


            if (stockElement) {

                stockElement.textContent =
                    newStock +
                    (
                        newStock === 1
                            ? " available"
                            : " available"
                    );

            }


            /* ---------------------------------------------
               UPDATE EDIT BUTTON ACCESSIBILITY LABEL
            --------------------------------------------- */

            const editButton =
                activeCard.querySelector(
                    ".bakery-cakes-product-edit"
                );

            if (editButton) {

                editButton.setAttribute(
                    "aria-label",
                    "Edit " + newName
                );

            }


            /* ---------------------------------------------
               SMALL SUCCESS EFFECT
            --------------------------------------------- */

            activeCard.classList.add(
                "bakery-cakes-card-updated"
            );

            setTimeout(function () {

                activeCard.classList.remove(
                    "bakery-cakes-card-updated"
                );

            }, 900);


            closeCakeEditModal();

        }
    );

});

/* ============================================================
   STACKLY BAKERY — CUSTOMER VIEW / EDIT JAVASCRIPT
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================================
       GET CUSTOMER VIEW BUTTONS
    ======================================================== */

    const customerButtons = document.querySelectorAll(
        ".bakery-customers-view-button"
    );

    if (!customerButtons.length) {
        return;
    }


    /* ========================================================
       CREATE CUSTOMER MODAL
    ======================================================== */

    const customerModal = document.createElement("div");

    customerModal.className = "bakery-customers-view-modal";

    customerModal.innerHTML = `
        <div class="bakery-customers-view-overlay"></div>

        <div
            class="bakery-customers-view-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bakeryCustomersViewTitle"
        >

            <!-- Modal Header -->

            <div class="bakery-customers-view-header">

                <div>
                    <span class="bakery-customers-view-label">
                        CUSTOMER PROFILE
                    </span>

                    <h3 id="bakeryCustomersViewTitle">
                        Customer Details
                    </h3>
                </div>

                <button
                    type="button"
                    class="bakery-customers-view-close"
                    aria-label="Close customer profile"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            </div>


            <!-- Customer Profile -->

            <div class="bakery-customers-view-profile">

                <div class="bakery-customers-view-avatar">
                    <span id="bakeryCustomersViewAvatar">
                        AS
                    </span>
                </div>

                <div class="bakery-customers-view-profile-info">

                    <h4 id="bakeryCustomersViewName">
                        Ananya Sharma
                    </h4>

                    <p id="bakeryCustomersViewEmail">
                        ananya@example.com
                    </p>

                    <span id="bakeryCustomersViewType">
                        <i class="fa-solid fa-crown"></i>
                        VIP Customer
                    </span>

                </div>

            </div>


            <!-- Customer Statistics -->

            <div class="bakery-customers-view-stats">

                <div class="bakery-customers-view-stat">

                    <span>
                        <i class="fa-solid fa-bag-shopping"></i>
                    </span>

                    <div>
                        <small>
                            Total Orders
                        </small>

                        <strong id="bakeryCustomersViewOrders">
                            18
                        </strong>
                    </div>

                </div>


                <div class="bakery-customers-view-stat">

                    <span>
                        <i class="fa-solid fa-indian-rupee-sign"></i>
                    </span>

                    <div>
                        <small>
                            Total Spent
                        </small>

                        <strong id="bakeryCustomersViewSpent">
                            ₹24,850
                        </strong>
                    </div>

                </div>


                <div class="bakery-customers-view-stat">

                    <span>
                        <i class="fa-solid fa-location-dot"></i>
                    </span>

                    <div>
                        <small>
                            Location
                        </small>

                        <strong id="bakeryCustomersViewLocation">
                            Chennai
                        </strong>
                    </div>

                </div>

            </div>


            <!-- Customer Information -->

            <div class="bakery-customers-view-information">

                <div class="bakery-customers-view-info-heading">

                    <span>
                        CUSTOMER INFORMATION
                    </span>

                    <h4>
                        Account Overview
                    </h4>

                </div>


                <div class="bakery-customers-view-info-grid">

                    <div>
                        <small>
                            Customer Name
                        </small>

                        <strong id="bakeryCustomersInfoName">
                            Ananya Sharma
                        </strong>
                    </div>


                    <div>
                        <small>
                            Email Address
                        </small>

                        <strong id="bakeryCustomersInfoEmail">
                            ananya@example.com
                        </strong>
                    </div>


                    <div>
                        <small>
                            Location
                        </small>

                        <strong id="bakeryCustomersInfoLocation">
                            Chennai
                        </strong>
                    </div>


                    <div>
                        <small>
                            Last Order
                        </small>

                        <strong id="bakeryCustomersInfoLastOrder">
                            11 Sep 2026
                        </strong>
                    </div>

                </div>

            </div>


            <!-- Modal Footer -->

            <div class="bakery-customers-view-footer">

                <button
                    type="button"
                    class="bakery-customers-view-secondary"
                    id="bakeryCustomersViewClose"
                >
                    Close
                </button>

                <a
                    href="404-admin.html"
                    class="bakery-customers-view-primary"
                >
                    <i class="fa-solid fa-pen"></i>
                    Edit Customer
                </a>

            </div>

        </div>
    `;

    document.body.appendChild(customerModal);


    /* ========================================================
       GET MODAL ELEMENTS
    ======================================================== */

    const modalOverlay = customerModal.querySelector(
        ".bakery-customers-view-overlay"
    );

    const closeButton = customerModal.querySelector(
        ".bakery-customers-view-close"
    );

    const footerCloseButton = customerModal.querySelector(
        "#bakeryCustomersViewClose"
    );


    const avatarElement = customerModal.querySelector(
        "#bakeryCustomersViewAvatar"
    );

    const nameElement = customerModal.querySelector(
        "#bakeryCustomersViewName"
    );

    const emailElement = customerModal.querySelector(
        "#bakeryCustomersViewEmail"
    );

    const typeElement = customerModal.querySelector(
        "#bakeryCustomersViewType"
    );

    const ordersElement = customerModal.querySelector(
        "#bakeryCustomersViewOrders"
    );

    const spentElement = customerModal.querySelector(
        "#bakeryCustomersViewSpent"
    );

    const locationElement = customerModal.querySelector(
        "#bakeryCustomersViewLocation"
    );

    const infoNameElement = customerModal.querySelector(
        "#bakeryCustomersInfoName"
    );

    const infoEmailElement = customerModal.querySelector(
        "#bakeryCustomersInfoEmail"
    );

    const infoLocationElement = customerModal.querySelector(
        "#bakeryCustomersInfoLocation"
    );

    const infoLastOrderElement = customerModal.querySelector(
        "#bakeryCustomersInfoLastOrder"
    );


    /* ========================================================
       OPEN MODAL
    ======================================================== */

    function openCustomerModal(row) {

        if (!row) {
            return;
        }


        /* ----------------------------------------------------
           GET CUSTOMER DATA FROM TABLE
        ---------------------------------------------------- */

        const name =
            row.querySelector(
                ".bakery-customers-profile-cell strong"
            )?.textContent.trim() || "Customer";


        const email =
            row.querySelector(
                ".bakery-customers-profile-cell small"
            )?.textContent.trim() || "No email available";


        const avatar =
            row.querySelector(
                ".bakery-customers-avatar"
            )?.textContent.trim() || "CU";


        const cells = row.querySelectorAll("td");


        const location =
            cells[1]?.textContent.trim() || "Not available";


        const orders =
            cells[2]?.textContent.trim() || "0";


        const spent =
            cells[3]?.textContent.trim() || "₹0";


        const lastOrder =
            cells[4]?.textContent.trim() || "Not available";


        const customerTypeElement =
            cells[5]?.querySelector("span");


        const customerType =
            customerTypeElement?.textContent.trim() || "Regular";


        const customerIcon =
            customerTypeElement?.querySelector("i");


        /* ----------------------------------------------------
           UPDATE MODAL
        ---------------------------------------------------- */

        avatarElement.textContent = avatar;

        nameElement.textContent = name;

        emailElement.textContent = email;

        ordersElement.textContent = orders;

        spentElement.textContent = spent;

        locationElement.textContent = location;

        infoNameElement.textContent = name;

        infoEmailElement.textContent = email;

        infoLocationElement.textContent = location;

        infoLastOrderElement.textContent = lastOrder;


        /* ----------------------------------------------------
           CUSTOMER TYPE
        ---------------------------------------------------- */

        typeElement.className =
            "bakery-customers-view-type";


        if (
            customerType
                .toLowerCase()
                .includes("vip")
        ) {

            typeElement.classList.add(
                "bakery-customers-view-type-vip"
            );

            typeElement.innerHTML = `
                <i class="fa-solid fa-crown"></i>
                VIP Customer
            `;

        } else if (
            customerType
                .toLowerCase()
                .includes("returning")
        ) {

            typeElement.classList.add(
                "bakery-customers-view-type-returning"
            );

            typeElement.innerHTML = `
                <i class="fa-solid fa-repeat"></i>
                Returning Customer
            `;

        } else {

            typeElement.classList.add(
                "bakery-customers-view-type-regular"
            );

            typeElement.innerHTML = `
                Regular Customer
            `;
        }


        /* ----------------------------------------------------
           SHOW MODAL
        ---------------------------------------------------- */

        customerModal.classList.add("active");

        document.body.classList.add(
            "bakery-customers-modal-open"
        );

        document.body.style.overflow = "hidden";


        /* ----------------------------------------------------
           ACCESSIBILITY
        ---------------------------------------------------- */

        closeButton.focus();
    }


    /* ========================================================
       CLOSE MODAL
    ======================================================== */

    function closeCustomerModal() {

        customerModal.classList.remove("active");

        document.body.classList.remove(
            "bakery-customers-modal-open"
        );

        document.body.style.overflow = "";
    }


    /* ========================================================
       VIEW BUTTON EVENTS
    ======================================================== */

    customerButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const row =
                button.closest("tr");

            openCustomerModal(row);

        });

    });


    /* ========================================================
       CLOSE BUTTON
    ======================================================== */

    closeButton.addEventListener(
        "click",
        closeCustomerModal
    );


    footerCloseButton.addEventListener(
        "click",
        closeCustomerModal
    );


    modalOverlay.addEventListener(
        "click",
        closeCustomerModal
    );


    /* ========================================================
       ESC KEY
    ======================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                customerModal.classList.contains("active")
            ) {

                closeCustomerModal();

            }

        }
    );

});

/* =========================================================
   STACKLY BAKERY ADMIN SETTINGS JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SETTINGS ELEMENTS
    ===================================================== */

    const settingsPage =
        document.querySelector(".bakery-settings-page-content");

    if (!settingsPage) {
        return;
    }

    const settingsMenuLinks =
        settingsPage.querySelectorAll(".bakery-settings-menu-link");

    const settingsPanels =
        settingsPage.querySelectorAll(".bakery-settings-panel");

    const saveButton =
        settingsPage.querySelector(".bakery-settings-save-button");

    const saveStatus =
        settingsPage.querySelector(".bakery-settings-save-status");


    /* =====================================================
       SETTINGS PANEL CONFIGURATION
    ===================================================== */

    const defaultPanelId = "bakeryStoreProfile";


    /* =====================================================
       SHOW SELECTED SETTINGS PANEL
    ===================================================== */

    function showSettingsPanel(panelId, updateHash = true) {

        const targetPanel =
            document.getElementById(panelId);

        if (!targetPanel) {
            return;
        }


        /* =================================================
           HIDE ALL PANELS
        ================================================= */

        settingsPanels.forEach(function (panel) {

            panel.classList.remove("bakery-settings-panel-active");

            panel.style.display = "none";

        });


        /* =================================================
           REMOVE ACTIVE MENU STATE
        ================================================= */

        settingsMenuLinks.forEach(function (link) {

            link.classList.remove("active");

        });


        /* =================================================
           FIND ACTIVE MENU LINK
        ================================================= */

        const activeLink =
            settingsPage.querySelector(
                '.bakery-settings-menu-link[href="#' +
                panelId +
                '"]'
            );


        if (activeLink) {

            activeLink.classList.add("active");

        }


        /* =================================================
           DISPLAY SELECTED PANEL
        ================================================= */

        targetPanel.style.display = "block";


        /*
           Force browser to register display:block before
           adding the animation class.
        */

        requestAnimationFrame(function () {

            targetPanel.classList.add(
                "bakery-settings-panel-active"
            );

        });


        /* =================================================
           UPDATE URL HASH
        ================================================= */

        if (updateHash) {

            if (window.history && window.history.replaceState) {

                window.history.replaceState(
                    null,
                    "",
                    "#" + panelId
                );

            } else {

                window.location.hash = panelId;

            }

        }

    }


    /* =====================================================
       SETTINGS MENU CLICK
    ===================================================== */

    settingsMenuLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const targetId =
                link.getAttribute("href");

            if (!targetId) {
                return;
            }

            const panelId =
                targetId.replace("#", "").trim();

            if (!panelId) {
                return;
            }


            /* =============================================
               DISPLAY SELECTED SECTION
            ============================================== */

            showSettingsPanel(panelId, true);


            /* =============================================
               SMOOTH SCROLL TO SETTINGS CONTENT
            ============================================== */

            const mainSettingsArea =
                settingsPage.querySelector(
                    ".bakery-settings-main-section"
                );

            if (mainSettingsArea) {

                const topOffset = 90;

                const targetPosition =
                    mainSettingsArea.getBoundingClientRect().top +
                    window.pageYOffset -
                    topOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            }

        });

    });


    /* =====================================================
       LOAD PANEL FROM URL HASH
    ===================================================== */

    function loadSettingsFromHash() {

        const hash =
            window.location.hash.replace("#", "").trim();


        if (hash) {

            const matchingPanel =
                document.getElementById(hash);

            if (matchingPanel &&
                matchingPanel.classList.contains(
                    "bakery-settings-panel"
                )) {

                showSettingsPanel(hash, false);

                return;

            }

        }


        /* =============================================
           DEFAULT SETTINGS PANEL
        ============================================== */

        showSettingsPanel(
            defaultPanelId,
            false
        );

    }


    loadSettingsFromHash();


    /* =====================================================
       HANDLE BROWSER BACK / FORWARD
    ===================================================== */

    window.addEventListener(
        "hashchange",
        function () {

            const hash =
                window.location.hash
                    .replace("#", "")
                    .trim();

            if (!hash) {

                showSettingsPanel(
                    defaultPanelId,
                    false
                );

                return;

            }


            const targetPanel =
                document.getElementById(hash);

            if (targetPanel &&
                targetPanel.classList.contains(
                    "bakery-settings-panel"
                )) {

                showSettingsPanel(
                    hash,
                    false
                );

            }

        }
    );


    /* =====================================================
       SAVE CHANGES BUTTON
    ===================================================== */

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function (event) {

                /*
                   Keep the existing 404-admin.html link
                   functional, but provide visual feedback
                   before navigation.
                */

                if (saveStatus) {

                    saveStatus.classList.add(
                        "bakery-settings-saving"
                    );

                    saveStatus.innerHTML =
                        '<i class="fa-solid fa-spinner fa-spin"></i>' +
                        ' Saving changes...';

                }


                saveButton.classList.add(
                    "bakery-settings-button-saving"
                );

                saveButton.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i>' +
                    ' Saving...';

            }
        );

    }


    /* =====================================================
       PANEL UPDATE BUTTONS
    ===================================================== */

    const panelButtons =
        settingsPage.querySelectorAll(
            ".bakery-settings-panel-button"
        );


    panelButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                button.classList.add(
                    "bakery-settings-panel-button-loading"
                );

                const originalText =
                    button.textContent.trim();

                button.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i>' +
                    ' Updating...';


                /*
                   Restore the button shortly before the
                   browser follows the existing 404 link.
                */

                setTimeout(function () {

                    button.innerHTML =
                        originalText;

                    button.classList.remove(
                        "bakery-settings-panel-button-loading"
                    );

                }, 900);

            }
        );

    });


    /* =====================================================
       SETTINGS TOGGLES
    ===================================================== */

    const settingsSwitches =
        settingsPage.querySelectorAll(
            ".bakery-settings-switch input"
        );


    settingsSwitches.forEach(function (checkbox) {

        checkbox.addEventListener(
            "change",
            function () {

                const parentSwitch =
                    checkbox.closest(
                        ".bakery-settings-switch"
                    );

                if (!parentSwitch) {
                    return;
                }


                /* =========================================
                   ADD TEMPORARY FEEDBACK CLASS
                ========================================== */

                parentSwitch.classList.add(
                    "bakery-settings-switch-updated"
                );


                setTimeout(function () {

                    parentSwitch.classList.remove(
                        "bakery-settings-switch-updated"
                    );

                }, 500);


                /* =========================================
                   UPDATE SAVE STATUS
                ========================================== */

                updateUnsavedStatus();

            }
        );

    });


    /* =====================================================
       SELECT / INPUT CHANGE DETECTION
    ===================================================== */

    const settingInputs =
        settingsPage.querySelectorAll(
            "input:not([type='checkbox']), textarea, select"
        );


    settingInputs.forEach(function (input) {

        input.addEventListener(
            "change",
            function () {

                updateUnsavedStatus();

            }
        );

        input.addEventListener(
            "input",
            function () {

                updateUnsavedStatus();

            }
        );

    });


    /* =====================================================
       UNSAVED STATUS
    ===================================================== */

    function updateUnsavedStatus() {

        if (!saveStatus) {
            return;
        }


        saveStatus.classList.remove(
            "bakery-settings-saving"
        );

        saveStatus.classList.add(
            "bakery-settings-unsaved"
        );

        saveStatus.innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i>' +
            ' Unsaved changes';

    }


    /* =====================================================
       ACTIVE MENU KEYBOARD SUPPORT
    ===================================================== */

    settingsMenuLinks.forEach(function (link) {

        link.addEventListener(
            "keydown",
            function (event) {

                const currentIndex =
                    Array.from(settingsMenuLinks)
                        .indexOf(link);


                /* =========================================
                   ARROW DOWN
                ========================================== */

                if (event.key === "ArrowDown") {

                    event.preventDefault();

                    const nextIndex =
                        (currentIndex + 1) %
                        settingsMenuLinks.length;

                    settingsMenuLinks[nextIndex].focus();

                }


                /* =========================================
                   ARROW UP
                ========================================== */

                if (event.key === "ArrowUp") {

                    event.preventDefault();

                    const previousIndex =
                        (currentIndex -
                            1 +
                            settingsMenuLinks.length) %
                        settingsMenuLinks.length;

                    settingsMenuLinks[previousIndex].focus();

                }

            }
        );

    });


    /* =====================================================
       ACCESSIBILITY
    ===================================================== */

    settingsPanels.forEach(function (panel) {

        panel.setAttribute(
            "tabindex",
            "-1"
        );

    });


    /* =====================================================
       MOBILE MENU BEHAVIOR
    ===================================================== */

    function handleMobileSettingsMenu() {

        if (window.innerWidth <= 767) {

            settingsMenuLinks.forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        /*
                           Small delay gives the user a clear
                           transition before the selected panel
                           becomes the main focus.
                        */

                        setTimeout(function () {

                            const activePanel =
                                settingsPage.querySelector(
                                    ".bakery-settings-panel-active"
                                );

                            if (activePanel) {

                                activePanel.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                });

                            }

                        }, 250);

                    },
                    {
                        once: true
                    }
                );

            });

        }

    }


    handleMobileSettingsMenu();


    /* =====================================================
       RESIZE HANDLER
    ===================================================== */

    let settingsResizeTimer;

    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                settingsResizeTimer
            );

            settingsResizeTimer =
                setTimeout(function () {

                    handleMobileSettingsMenu();

                }, 150);

        }
    );


    /* =====================================================
       INITIAL PAGE READY EFFECT
    ===================================================== */

    settingsPage.classList.add(
        "bakery-settings-page-ready"
    );


});