/* =========================================================
   JNFLOW — NAVIGATION
   Navegação global desktop + mobile
========================================================= */

(function () {

    const MOBILE_BREAKPOINT = 768;


    const menuButton =
        document.getElementById(
            "mobileMenuButton"
        );


    const closeButton =
        document.getElementById(
            "mobileSidebarClose"
        );


    const overlay =
        document.getElementById(
            "mobileSidebarOverlay"
        );


    function isMobile() {

        return (
            window.innerWidth <=
            MOBILE_BREAKPOINT
        );
    }


    function openMenu() {

        if (!isMobile()) {
            return;
        }


        document.body.classList.add(
            "mobile-menu-open"
        );


        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }


        if (overlay) {

            overlay.setAttribute(
                "aria-hidden",
                "false"
            );
        }
    }


    function closeMenu() {

        document.body.classList.remove(
            "mobile-menu-open"
        );


        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }


        if (overlay) {

            overlay.setAttribute(
                "aria-hidden",
                "true"
            );
        }
    }


    function toggleMenu() {

        const opened =
            document.body.classList.contains(
                "mobile-menu-open"
            );


        if (opened) {

            closeMenu();

        }

        else {

            openMenu();
        }
    }


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            toggleMenu
        );
    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeMenu
        );
    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeMenu
        );
    }


    document
        .querySelectorAll(
            ".sidebar .menu-item"
        )
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    () => {

                        if (isMobile()) {

                            closeMenu();
                        }
                    }
                );
            }
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                document.body.classList.contains(
                    "mobile-menu-open"
                )
            ) {

                closeMenu();
            }
        }
    );


    window.addEventListener(
        "resize",
        () => {

            if (!isMobile()) {

                closeMenu();
            }
        }
    );

})();
