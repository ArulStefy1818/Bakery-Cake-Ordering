/* ================================================================
   STACKLY BAKERY
   PROFESSIONAL LOGIN + SIGNUP JAVASCRIPT
   DIRECT ROLE-BASED LOGIN
================================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* ============================================================
       CONFIGURATION
    ============================================================ */

    const AUTH_CONFIG = {

        storage: {
            users: "stacklyBakeryUsers",
            loginEmail: "loginEmail",
            loginRole: "loginRole",
            loginStatus: "stacklyBakeryLoggedIn",
            remember: "stacklyBakeryRemember"
        },

        pages: {
            admin: "admin.html",
            customer: "customer.html",
            login: "login.html"
        },

        roles: [
            "admin",
            "customer"
        ]

    };


    /* ============================================================
       ELEMENT HELPER
    ============================================================ */

    function $(id) {
        return document.getElementById(id);
    }


    /* ============================================================
       LOGIN ELEMENTS
    ============================================================ */

    const loginForm =
        $("bakeryLoginForm");

    const loginWrapper =
        $("bakeryLoginWrapper");

    const loginEmail =
        $("bakeryLoginEmail");

    const loginPassword =
        $("bakeryLoginPassword");

    const loginMessage =
        $("bakeryLoginMessage");

    const rememberMe =
        $("bakeryRememberMe");

    const forgotPassword =
        $("bakeryForgotPassword");


    /* ============================================================
       SIGNUP ELEMENTS
    ============================================================ */

    const signupForm =
        $("bakerySignupForm");

    const signupWrapper =
        $("bakerySignupWrapper");

    const signupName =
        $("bakerySignupName");

    const signupEmail =
        $("bakerySignupEmail");

    const signupPhone =
        $("bakerySignupPhone");

    const signupPassword =
        $("bakerySignupPassword");

    const signupConfirmPassword =
        $("bakerySignupConfirmPassword");

    const signupMessage =
        $("bakerySignupMessage");

    const acceptTerms =
        $("bakeryAcceptTerms");


    /* ============================================================
       SWITCH BUTTONS
    ============================================================ */

    const showSignupButton =
        $("bakeryShowSignup");

    const showLoginButton =
        $("bakeryShowLogin");


    /* ============================================================
       AOS
    ============================================================ */

    if (typeof AOS !== "undefined") {

        AOS.init({
            duration: 900,
            easing: "ease-out-cubic",
            once: true,
            mirror: false,
            offset: 70
        });

    }


    /* ============================================================
       LOCAL STORAGE - GET USERS
    ============================================================ */

    function getUsers() {

        try {

            const data =
                localStorage.getItem(
                    AUTH_CONFIG.storage.users
                );

            if (!data) {
                return [];
            }

            const users =
                JSON.parse(data);

            return Array.isArray(users)
                ? users
                : [];

        } catch (error) {

            console.error(
                "Stackly Bakery: Unable to read users.",
                error
            );

            return [];

        }

    }


    /* ============================================================
       LOCAL STORAGE - SAVE USERS
    ============================================================ */

    function saveUsers(users) {

        try {

            localStorage.setItem(
                AUTH_CONFIG.storage.users,
                JSON.stringify(users)
            );

            return true;

        } catch (error) {

            console.error(
                "Stackly Bakery: Unable to save users.",
                error
            );

            return false;

        }

    }


    /* ============================================================
       NORMALIZE EMAIL
    ============================================================ */

    function normalizeEmail(email) {

        return String(email || "")
            .trim()
            .toLowerCase();

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
       EMAIL VALIDATION
    ============================================================ */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
            normalizeEmail(email)
        );

    }


    /* ============================================================
       NAME VALIDATION
    ============================================================ */

    function isValidName(name) {

        return /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(
            String(name || "").trim()
        );

    }


    /* ============================================================
       PHONE VALIDATION
    ============================================================ */

    function isValidPhone(phone) {

        return /^[0-9]{10}$/.test(
            String(phone || "").trim()
        );

    }


    /* ============================================================
       PASSWORD VALIDATION
    ============================================================ */

    function isValidPassword(password) {

        return String(password || "").length >= 6;

    }


    /* ============================================================
       ROLE VALIDATION
    ============================================================ */

    function isValidRole(role) {

        return AUTH_CONFIG.roles.includes(
            normalizeRole(role)
        );

    }


    /* ============================================================
       SHOW MESSAGE
    ============================================================ */

    function showMessage(
        element,
        message,
        type
    ) {

        if (!element) {
            return;
        }

        element.textContent =
            message;

        element.className =
            "bakery-auth-message";

        if (type) {

            element.classList.add(
                type
            );

        }

    }


    /* ============================================================
       CLEAR MESSAGE
    ============================================================ */

    function clearMessage(element) {

        if (!element) {
            return;
        }

        element.textContent = "";

        element.className =
            "bakery-auth-message";

    }


    /* ============================================================
       CLEAR FIELD ERROR
    ============================================================ */

    function clearFieldError(element) {

        if (!element) {
            return;
        }

        element.classList.remove(
            "bakery-input-error"
        );


        const field =
            element.closest(
                ".bakery-auth-field"
            );


        if (field) {

            field
                .querySelectorAll(
                    ".bakery-field-error"
                )
                .forEach(function (error) {

                    error.remove();

                });

        }


        const dropdown =
            element.closest(
                ".bakery-role-dropdown"
            );


        if (dropdown) {

            dropdown.classList.remove(
                "bakery-input-error"
            );


            const dropdownField =
                dropdown.closest(
                    ".bakery-auth-field"
                );


            if (dropdownField) {

                dropdownField
                    .querySelectorAll(
                        ".bakery-field-error"
                    )
                    .forEach(function (error) {

                        error.remove();

                    });

            }

        }


        const termsOption =
            element.closest(
                ".bakery-terms-option"
            );


        if (termsOption) {

            termsOption
                .querySelectorAll(
                    ".bakery-field-error"
                )
                .forEach(function (error) {

                    error.remove();

                });

        }

    }


    /* ============================================================
       SHOW FIELD ERROR
    ============================================================ */

    function showFieldError(
        element,
        message
    ) {

        if (!element) {
            return false;
        }

        clearFieldError(element);

        element.classList.add(
            "bakery-input-error"
        );


        let container =
            element.closest(
                ".bakery-auth-field"
            );


        if (!container) {

            container =
                element.closest(
                    ".bakery-role-dropdown"
                );

        }


        if (!container) {

            container =
                element.closest(
                    ".bakery-terms-option"
                );

        }


        if (container) {

            const error =
                document.createElement(
                    "div"
                );

            error.className =
                "bakery-field-error";

            error.textContent =
                message;

            container.appendChild(
                error
            );

        }

        return false;

    }


    /* ============================================================
       CLEAR FORM ERRORS
    ============================================================ */

    function clearFormErrors(form) {

        if (!form) {
            return;
        }

        form
            .querySelectorAll(
                ".bakery-input-error"
            )
            .forEach(function (element) {

                element.classList.remove(
                    "bakery-input-error"
                );

            });


        form
            .querySelectorAll(
                ".bakery-field-error"
            )
            .forEach(function (error) {

                error.remove();

            });

    }


    /* ============================================================
       FOCUS INVALID FIELD
    ============================================================ */

    function focusInvalidField(element) {

        if (!element) {
            return;
        }

        try {

            element.focus();

        } catch (error) {

            /* Ignore */

        }


        try {

            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        } catch (error) {

            /* Ignore */

        }

    }


    /* ============================================================
       REDIRECT BY ROLE
    ============================================================ */

    function redirectByRole(role) {

        const currentRole =
            normalizeRole(role);


        if (currentRole === "admin") {

            window.location.href =
                AUTH_CONFIG.pages.admin;

            return true;

        }


        if (currentRole === "customer") {

            window.location.href =
                AUTH_CONFIG.pages.customer;

            return true;

        }


        return false;

    }


    /* ============================================================
       CREATE LOGIN SESSION
    ============================================================ */

    function createLoginSession(
        email,
        role,
        remember
    ) {

        const normalizedEmail =
            normalizeEmail(email);

        const normalizedRole =
            normalizeRole(role);


        if (
            !normalizedEmail ||
            !isValidRole(normalizedRole)
        ) {

            return false;

        }


        try {

            localStorage.setItem(
                AUTH_CONFIG.storage.loginEmail,
                normalizedEmail
            );

            localStorage.setItem(
                AUTH_CONFIG.storage.loginRole,
                normalizedRole
            );

            localStorage.setItem(
                AUTH_CONFIG.storage.loginStatus,
                "true"
            );


            if (remember) {

                localStorage.setItem(
                    AUTH_CONFIG.storage.remember,
                    "true"
                );

            } else {

                localStorage.removeItem(
                    AUTH_CONFIG.storage.remember
                );

            }


            return true;

        } catch (error) {

            console.error(
                "Stackly Bakery: Unable to create login session.",
                error
            );

            return false;

        }

    }


    /* ============================================================
       COMPLETE LOGIN
    ============================================================ */

    function completeLogin(
        email,
        role,
        remember
    ) {

        const sessionCreated =
            createLoginSession(
                email,
                role,
                remember
            );


        if (!sessionCreated) {

            showMessage(
                loginMessage,
                "Unable to create login session.",
                "error"
            );

            return false;

        }


        redirectByRole(role);

        return true;

    }


    /* ============================================================
       ROLE DROPDOWN
    ============================================================ */

    function initializeRoleDropdown(config) {

        const dropdown =
            $(config.dropdownId);

        const button =
            $(config.buttonId);

        const valueElement =
            $(config.valueId);

        const menu =
            $(config.menuId);

        const hiddenInput =
            $(config.inputId);


        if (
            !dropdown ||
            !button ||
            !valueElement ||
            !menu ||
            !hiddenInput
        ) {

            return null;

        }


        const options =
            Array.from(
                menu.querySelectorAll(
                    ".bakery-role-option"
                )
            );


        button.setAttribute(
            "type",
            "button"
        );

        button.setAttribute(
            "aria-haspopup",
            "listbox"
        );

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        menu.setAttribute(
            "role",
            "listbox"
        );


        options.forEach(function (option) {

            option.setAttribute(
                "role",
                "option"
            );

            option.setAttribute(
                "tabindex",
                "-1"
            );

            option.setAttribute(
                "aria-selected",
                "false"
            );

        });


        /* ========================================================
           OPEN
        ======================================================== */

        function openDropdown() {

            closeAllDropdowns(
                dropdown
            );

            dropdown.classList.add(
                "active"
            );

            button.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        /* ========================================================
           CLOSE
        ======================================================== */

        function closeDropdown() {

            dropdown.classList.remove(
                "active"
            );

            button.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        /* ========================================================
           SELECT ROLE
        ======================================================== */

        function selectRole(option) {

            if (!option) {
                return;
            }


            const role =
                normalizeRole(
                    option.getAttribute(
                        "data-value"
                    )
                );


            if (!isValidRole(role)) {
                return;
            }


            const span =
                option.querySelector(
                    "span"
                );


            const visibleText =
                span
                    ? span.textContent.trim()
                    : option.textContent.trim();


            hiddenInput.value =
                role;


            valueElement.textContent =
                visibleText || role;


            valueElement.classList.add(
                "has-value"
            );


            options.forEach(function (item) {

                item.classList.remove(
                    "selected"
                );

                item.setAttribute(
                    "aria-selected",
                    "false"
                );

            });


            option.classList.add(
                "selected"
            );

            option.setAttribute(
                "aria-selected",
                "true"
            );


            clearFieldError(
                dropdown
            );


            closeDropdown();

        }


        /* ========================================================
           BUTTON CLICK
        ======================================================== */

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();


                if (
                    dropdown.classList.contains(
                        "active"
                    )
                ) {

                    closeDropdown();

                } else {

                    openDropdown();

                }

            }
        );


        /* ========================================================
           BUTTON KEYBOARD
        ======================================================== */

        button.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();


                    if (
                        dropdown.classList.contains(
                            "active"
                        )
                    ) {

                        closeDropdown();

                    } else {

                        openDropdown();

                    }

                }


                if (
                    event.key === "ArrowDown"
                ) {

                    event.preventDefault();

                    openDropdown();

                    if (options[0]) {
                        options[0].focus();
                    }

                }


                if (
                    event.key === "Escape"
                ) {

                    event.preventDefault();

                    closeDropdown();

                }

            }
        );


        /* ========================================================
           OPTIONS
        ======================================================== */

        options.forEach(
            function (option, index) {

                option.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        selectRole(option);

                    }
                );


                option.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            selectRole(option);

                            button.focus();

                            return;

                        }


                        if (
                            event.key === "Escape"
                        ) {

                            event.preventDefault();

                            closeDropdown();

                            button.focus();

                            return;

                        }


                        if (
                            event.key === "ArrowDown"
                        ) {

                            event.preventDefault();

                            const next =
                                options[index + 1] ||
                                options[0];

                            if (next) {
                                next.focus();
                            }

                        }


                        if (
                            event.key === "ArrowUp"
                        ) {

                            event.preventDefault();

                            const previous =
                                options[index - 1] ||
                                options[
                                    options.length - 1
                                ];

                            if (previous) {
                                previous.focus();
                            }

                        }


                        if (
                            event.key === "Home"
                        ) {

                            event.preventDefault();

                            if (options[0]) {
                                options[0].focus();
                            }

                        }


                        if (
                            event.key === "End"
                        ) {

                            event.preventDefault();

                            if (options.length) {

                                options[
                                    options.length - 1
                                ].focus();

                            }

                        }

                    }
                );

            }
        );


        return {

            getValue: function () {

                return normalizeRole(
                    hiddenInput.value
                );

            },


            setValue: function (role) {

                const normalized =
                    normalizeRole(role);


                const option =
                    options.find(
                        function (item) {

                            return (
                                normalizeRole(
                                    item.getAttribute(
                                        "data-value"
                                    )
                                ) === normalized
                            );

                        }
                    );


                if (option) {

                    selectRole(
                        option
                    );

                }

            },


            clear: function () {

                hiddenInput.value =
                    "";

                valueElement.textContent =
                    config.placeholder;

                valueElement.classList.remove(
                    "has-value"
                );


                options.forEach(
                    function (option) {

                        option.classList.remove(
                            "selected"
                        );

                        option.setAttribute(
                            "aria-selected",
                            "false"
                        );

                    }
                );


                closeDropdown();

            }

        };

    }


    /* ============================================================
       CLOSE ALL DROPDOWNS
    ============================================================ */

    function closeAllDropdowns(exception) {

        document
            .querySelectorAll(
                ".bakery-role-dropdown.active"
            )
            .forEach(function (dropdown) {

                if (
                    exception &&
                    dropdown === exception
                ) {

                    return;

                }


                dropdown.classList.remove(
                    "active"
                );


                const button =
                    dropdown.querySelector(
                        ".bakery-role-button"
                    );


                if (button) {

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            });

    }


    /* ============================================================
       LOGIN ROLE DROPDOWN
    ============================================================ */

    const loginRoleDropdown =
        initializeRoleDropdown({

            dropdownId:
                "bakeryLoginRoleDropdown",

            buttonId:
                "bakeryLoginRoleButton",

            valueId:
                "bakeryLoginRoleValue",

            menuId:
                "bakeryLoginRoleMenu",

            inputId:
                "bakeryLoginRole",

            placeholder:
                "Select Role"

        });


    /* ============================================================
       SIGNUP ROLE DROPDOWN
    ============================================================ */

    const signupRoleDropdown =
        initializeRoleDropdown({

            dropdownId:
                "bakerySignupRoleDropdown",

            buttonId:
                "bakerySignupRoleButton",

            valueId:
                "bakerySignupRoleValue",

            menuId:
                "bakerySignupRoleMenu",

            inputId:
                "bakerySignupRole",

            placeholder:
                "Select Account Type"

        });


    /* ============================================================
       OUTSIDE CLICK
    ============================================================ */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    ".bakery-role-dropdown"
                )
            ) {

                closeAllDropdowns();

            }

        }
    );


    /* ============================================================
       ESCAPE KEY
    ============================================================ */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeAllDropdowns();

            }

        }
    );


    /* ============================================================
       PASSWORD SHOW / HIDE
    ============================================================ */

    document
        .querySelectorAll(
            ".bakery-password-eye"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const targetId =
                        button.getAttribute(
                            "data-target"
                        );


                    const input =
                        $(targetId);


                    if (!input) {
                        return;
                    }


                    const icon =
                        button.querySelector(
                            "i"
                        );


                    const passwordHidden =
                        input.type === "password";


                    input.type =
                        passwordHidden
                            ? "text"
                            : "password";


                    if (icon) {

                        icon.classList.toggle(
                            "fa-eye",
                            !passwordHidden
                        );

                        icon.classList.toggle(
                            "fa-eye-slash",
                            passwordHidden
                        );

                    }


                    button.setAttribute(
                        "aria-label",
                        passwordHidden
                            ? "Hide password"
                            : "Show password"
                    );


                    button.setAttribute(
                        "title",
                        passwordHidden
                            ? "Hide password"
                            : "Show password"
                    );


                    try {

                        input.focus();

                        const position =
                            input.value.length;

                        input.setSelectionRange(
                            position,
                            position
                        );

                    } catch (error) {

                        /* Ignore */

                    }

                }
            );

        });


    /* ============================================================
       SHOW LOGIN
    ============================================================ */

    function showLogin() {

        if (
            !loginWrapper ||
            !signupWrapper
        ) {

            return;

        }


        signupWrapper.classList.remove(
            "active"
        );

        loginWrapper.classList.add(
            "active"
        );


        clearMessage(
            signupMessage
        );

        clearFormErrors(
            signupForm
        );


        const formPanel =
            document.querySelector(
                ".bakery-auth-form-panel"
            );


        if (formPanel) {

            formPanel.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }


    /* ============================================================
       SHOW SIGNUP
    ============================================================ */

    function showSignup() {

        if (
            !loginWrapper ||
            !signupWrapper
        ) {

            return;

        }


        loginWrapper.classList.remove(
            "active"
        );

        signupWrapper.classList.add(
            "active"
        );


        clearMessage(
            loginMessage
        );

        clearFormErrors(
            loginForm
        );


        const formPanel =
            document.querySelector(
                ".bakery-auth-form-panel"
            );


        if (formPanel) {

            formPanel.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }


    /* ============================================================
       LOGIN / SIGNUP SWITCH
    ============================================================ */

    if (showSignupButton) {

        showSignupButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showSignup();

            }
        );

    }


    if (showLoginButton) {

        showLoginButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showLogin();

            }
        );

    }


    /* ============================================================
       NAME INPUT
    ============================================================ */

    if (signupName) {

        signupName.addEventListener(
            "input",
            function () {

                signupName.value =
                    signupName.value.replace(
                        /[^A-Za-z\s]/g,
                        ""
                    );

                clearFieldError(
                    signupName
                );

            }
        );

    }


    /* ============================================================
       PHONE INPUT
    ============================================================ */

    if (signupPhone) {

        signupPhone.addEventListener(
            "input",
            function () {

                signupPhone.value =
                    signupPhone.value.replace(
                        /[^0-9]/g,
                        ""
                    );

                signupPhone.value =
                    signupPhone.value.slice(
                        0,
                        10
                    );

                clearFieldError(
                    signupPhone
                );

            }
        );


        signupPhone.addEventListener(
            "keydown",
            function (event) {

                const allowedKeys = [

                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                    "Tab",
                    "Home",
                    "End"

                ];


                if (
                    allowedKeys.includes(
                        event.key
                    )
                ) {

                    return;

                }


                if (
                    event.ctrlKey ||
                    event.metaKey
                ) {

                    return;

                }


                if (
                    !/^[0-9]$/.test(
                        event.key
                    )
                ) {

                    event.preventDefault();

                }

            }
        );

    }


    /* ============================================================
       CLEAR ERRORS WHILE TYPING
    ============================================================ */

    [
        loginEmail,
        loginPassword,
        signupEmail,
        signupPassword,
        signupConfirmPassword
    ]
        .filter(Boolean)
        .forEach(function (input) {

            input.addEventListener(
                "input",
                function () {

                    clearFieldError(
                        input
                    );

                    if (
                        input === loginEmail ||
                        input === loginPassword
                    ) {

                        clearMessage(
                            loginMessage
                        );

                    }

                }
            );

        });


    /* ============================================================
       TERMS CHECKBOX
    ============================================================ */

    if (acceptTerms) {

        acceptTerms.addEventListener(
            "change",
            function () {

                clearFieldError(
                    acceptTerms
                );

            }
        );

    }


    /* ============================================================
       DIRECT LOGIN
       
       IMPORTANT:
       NO USER DATABASE CHECK
       NO PASSWORD MATCH CHECK
       NO EXISTING ACCOUNT CHECK

       ROLE = ADMIN
       → admin.html

       ROLE = CUSTOMER
       → customer.html
    ============================================================ */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                clearFormErrors(
                    loginForm
                );

                clearMessage(
                    loginMessage
                );


                /* =================================================
                   GET ROLE
                ================================================= */

                const roleInput =
                    $("bakeryLoginRole");


                const role =
                    normalizeRole(
                        roleInput
                            ? roleInput.value
                            : ""
                    );


                /* =================================================
                   GET EMAIL
                ================================================= */

                const email =
                    normalizeEmail(
                        loginEmail
                            ? loginEmail.value
                            : ""
                    );


                /* =================================================
                   GET PASSWORD
                ================================================= */

                const password =
                    loginPassword
                        ? loginPassword.value
                        : "";


                /* =================================================
                   ROLE
                ================================================= */

                if (!role) {

                    showFieldError(
                        $("bakeryLoginRoleDropdown"),
                        "Please select your account type."
                    );


                    focusInvalidField(
                        $("bakeryLoginRoleButton")
                    );

                    return;

                }


                /* =================================================
                   EMAIL
                ================================================= */

                if (!email) {

                    showFieldError(
                        loginEmail,
                        "Please enter your email address."
                    );


                    focusInvalidField(
                        loginEmail
                    );

                    return;

                }


                /* =================================================
                   PASSWORD
                ================================================= */

                if (!password) {

                    showFieldError(
                        loginPassword,
                        "Please enter your password."
                    );


                    focusInvalidField(
                        loginPassword
                    );

                    return;

                }


                /* =================================================
                   DIRECT LOGIN SESSION
                   
                   NO DATABASE CHECK
                   NO PASSWORD CHECK
                   NO SIGNUP REQUIRED
                ================================================= */

                const sessionCreated =
                    createLoginSession(
                        email,
                        role,
                        rememberMe
                            ? rememberMe.checked
                            : false
                    );


                if (!sessionCreated) {

                    showMessage(
                        loginMessage,
                        "Please select a valid account type.",
                        "error"
                    );

                    return;

                }


                /* =================================================
                   DIRECT ROLE REDIRECT
                ================================================= */

                redirectByRole(
                    role
                );

            }
        );

    }


    /* ============================================================
       SIGNUP FORM
       
       SIGNUP
       ↓
       SAVE USER
       ↓
       CREATE SESSION
       ↓
       REDIRECT
    ============================================================ */

    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                clearFormErrors(
                    signupForm
                );

                clearMessage(
                    signupMessage
                );


                /* =================================================
                   GET VALUES
                ================================================= */

                const name =
                    signupName
                        ? signupName.value.trim()
                        : "";


                const email =
                    normalizeEmail(
                        signupEmail
                            ? signupEmail.value
                            : ""
                    );


                const phone =
                    signupPhone
                        ? signupPhone.value.trim()
                        : "";


                const roleInput =
                    $("bakerySignupRole");


                const role =
                    normalizeRole(
                        roleInput
                            ? roleInput.value
                            : ""
                    );


                const password =
                    signupPassword
                        ? signupPassword.value
                        : "";


                const confirmPassword =
                    signupConfirmPassword
                        ? signupConfirmPassword.value
                        : "";


                /* =================================================
                   NAME
                ================================================= */

                if (!name) {

                    showFieldError(
                        signupName,
                        "Please enter your full name."
                    );


                    focusInvalidField(
                        signupName
                    );

                    return;

                }


                if (!isValidName(name)) {

                    showFieldError(
                        signupName,
                        "Please enter a valid full name."
                    );


                    focusInvalidField(
                        signupName
                    );

                    return;

                }


                /* =================================================
                   EMAIL
                ================================================= */

                if (!email) {

                    showFieldError(
                        signupEmail,
                        "Please enter your email address."
                    );


                    focusInvalidField(
                        signupEmail
                    );

                    return;

                }


                if (!isValidEmail(email)) {

                    showFieldError(
                        signupEmail,
                        "Please enter a valid email address."
                    );


                    focusInvalidField(
                        signupEmail
                    );

                    return;

                }


                /* =================================================
                   PHONE
                ================================================= */

                if (!phone) {

                    showFieldError(
                        signupPhone,
                        "Please enter your phone number."
                    );


                    focusInvalidField(
                        signupPhone
                    );

                    return;

                }


                if (!isValidPhone(phone)) {

                    showFieldError(
                        signupPhone,
                        "Please enter a valid 10-digit phone number."
                    );


                    focusInvalidField(
                        signupPhone
                    );

                    return;

                }


                /* =================================================
                   ROLE
                ================================================= */

                if (!role) {

                    showFieldError(
                        $("bakerySignupRoleDropdown"),
                        "Please select your account type."
                    );


                    focusInvalidField(
                        $("bakerySignupRoleButton")
                    );

                    return;

                }


                /* =================================================
                   PASSWORD
                ================================================= */

                if (!password) {

                    showFieldError(
                        signupPassword,
                        "Please create a password."
                    );


                    focusInvalidField(
                        signupPassword
                    );

                    return;

                }


                if (!isValidPassword(password)) {

                    showFieldError(
                        signupPassword,
                        "Password must contain at least 6 characters."
                    );


                    focusInvalidField(
                        signupPassword
                    );

                    return;

                }


                /* =================================================
                   CONFIRM PASSWORD
                ================================================= */

                if (
                    signupConfirmPassword &&
                    confirmPassword !== password
                ) {

                    showFieldError(
                        signupConfirmPassword,
                        "Passwords do not match."
                    );


                    focusInvalidField(
                        signupConfirmPassword
                    );

                    return;

                }


                /* =================================================
                   TERMS
                ================================================= */

                if (
                    acceptTerms &&
                    !acceptTerms.checked
                ) {

                    showFieldError(
                        acceptTerms,
                        "Please accept the Terms & Conditions and Privacy Policy."
                    );


                    focusInvalidField(
                        acceptTerms
                    );

                    return;

                }


                /* =================================================
                   GET USERS
                ================================================= */

                const users =
                    getUsers();


                /* =================================================
                   CREATE NEW USER
                ================================================= */

                const newUser = {

                    id:
                        "bakery-" +
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .substring(2, 8),

                    name:
                        name,

                    email:
                        email,

                    phone:
                        phone,

                    role:
                        role,

                    password:
                        password,

                    createdAt:
                        new Date().toISOString(),

                    directLogin:
                        false

                };


                /* =================================================
                   SAVE USER
                ================================================= */

                users.push(
                    newUser
                );


                const saved =
                    saveUsers(
                        users
                    );


                if (!saved) {

                    showMessage(
                        signupMessage,
                        "Unable to create your account. Please try again.",
                        "error"
                    );

                    return;

                }


                /* =================================================
                   CREATE SESSION
                ================================================= */

                const sessionCreated =
                    createLoginSession(
                        email,
                        role,
                        true
                    );


                if (!sessionCreated) {

                    showMessage(
                        signupMessage,
                        "Account created. Please login.",
                        "error"
                    );

                    return;

                }


                /* =================================================
                   DIRECT DASHBOARD
                ================================================= */

                redirectByRole(
                    role
                );

            }
        );

    }


    /* ============================================================
       FORGOT PASSWORD
    ============================================================ */

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                clearMessage(
                    loginMessage
                );


                const email =
                    normalizeEmail(
                        loginEmail
                            ? loginEmail.value
                            : ""
                    );


                if (!email) {

                    showMessage(
                        loginMessage,
                        "Please enter your email address first.",
                        "error"
                    );


                    if (loginEmail) {
                        loginEmail.focus();
                    }

                    return;

                }


                if (!isValidEmail(email)) {

                    showMessage(
                        loginMessage,
                        "Please enter a valid email address.",
                        "error"
                    );


                    if (loginEmail) {
                        loginEmail.focus();
                    }

                    return;

                }


                showMessage(
                    loginMessage,
                    "Password reset instructions will be sent to your email.",
                    "success"
                );

            }
        );

    }


    /* ============================================================
       LOAD REMEMBERED LOGIN
    ============================================================ */

    function loadRememberedLogin() {

        if (!loginEmail) {
            return;
        }


        const remembered =
            localStorage.getItem(
                AUTH_CONFIG.storage.remember
            );


        const rememberedEmail =
            localStorage.getItem(
                AUTH_CONFIG.storage.loginEmail
            );


        if (
            remembered === "true" &&
            rememberedEmail
        ) {

            loginEmail.value =
                rememberedEmail;


            if (rememberMe) {

                rememberMe.checked =
                    true;

            }

        }

    }


    loadRememberedLogin();


    /* ============================================================
       INITIAL PAGE STATE
    ============================================================ */

    if (loginWrapper) {

        loginWrapper.classList.add(
            "active"
        );

    }


    if (signupWrapper) {

        signupWrapper.classList.remove(
            "active"
        );

    }


    /* ============================================================
       STACKLY BAKERY AUTH API
    ============================================================ */

    window.StacklyBakeryAuth = {

        /* ========================================================
           GET USERS
        ======================================================== */

        getUsers: function () {

            return getUsers();

        },


        /* ========================================================
           GET LOGGED-IN EMAIL
        ======================================================== */

        getLoggedInEmail: function () {

            return localStorage.getItem(
                AUTH_CONFIG.storage.loginEmail
            );

        },


        /* ========================================================
           GET LOGGED-IN ROLE
        ======================================================== */

        getLoggedInRole: function () {

            return localStorage.getItem(
                AUTH_CONFIG.storage.loginRole
            );

        },


        /* ========================================================
           CHECK LOGIN
        ======================================================== */

        isLoggedIn: function () {

            return (
                localStorage.getItem(
                    AUTH_CONFIG.storage.loginStatus
                ) === "true"
            );

        },


        /* ========================================================
           CHECK ROLE
        ======================================================== */

        hasRole: function (role) {

            const currentRole =
                normalizeRole(
                    localStorage.getItem(
                        AUTH_CONFIG.storage.loginRole
                    )
                );


            return (
                currentRole ===
                normalizeRole(role)
            );

        },


        /* ========================================================
           LOGOUT
        ======================================================== */

        logout: function () {

            localStorage.removeItem(
                AUTH_CONFIG.storage.loginStatus
            );

            localStorage.removeItem(
                AUTH_CONFIG.storage.loginEmail
            );

            localStorage.removeItem(
                AUTH_CONFIG.storage.loginRole
            );

            localStorage.removeItem(
                AUTH_CONFIG.storage.remember
            );


            window.location.href =
                AUTH_CONFIG.pages.login;

        }

    };


    /* ============================================================
       INITIALIZATION COMPLETE
    ============================================================ */

    console.log(
        "Stackly Bakery authentication initialized successfully."
    );

});