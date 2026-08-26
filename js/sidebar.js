/* =========================================
   JNFLOW — SIDEBAR DESKTOP
   Recolhimento persistente da navegação
========================================= */

(function initDesktopSidebarToggle() {
    const sidebar = document.getElementById("sidebar");

    if (!sidebar) {
        return;
    }

    const sidebarFooter =
        sidebar.querySelector(".sidebar-footer");

    if (
        sidebarFooter &&
        typeof window.JNAuth?.logout === "function"
    ) {
        const logoutButton = document.createElement("button");

        logoutButton.type = "button";
        logoutButton.className = "logout-button";
        logoutButton.innerHTML = `
            <span aria-hidden="true">↪</span>
            <span>Sair</span>
        `;

        logoutButton.addEventListener("click", async () => {
            if (logoutButton.disabled) {
                return;
            }

            logoutButton.disabled = true;
            logoutButton.setAttribute("aria-busy", "true");

            const result = await window.JNAuth.logout();

            if (!result?.success) {
                logoutButton.disabled = false;
                logoutButton.removeAttribute("aria-busy");
            }
        });

        sidebarFooter.appendChild(logoutButton);
    }

    const STORAGE_KEY = "jnflow_desktop_sidebar_hidden";
    const toggle = document.createElement("button");

    toggle.type = "button";
    toggle.className = "desktop-sidebar-toggle";
    toggle.setAttribute("aria-controls", "sidebar");

    toggle.innerHTML = `
        <span aria-hidden="true"></span>
    `;

    document.body.appendChild(toggle);


    function isDesktop() {
        return window.matchMedia("(min-width: 769px)").matches;
    }


    function updateToggleState() {
        const hidden =
            document.body.classList.contains(
                "desktop-sidebar-hidden"
            );

        toggle.setAttribute(
            "aria-expanded",
            String(!hidden)
        );

        toggle.setAttribute(
            "aria-label",
            hidden
                ? "Exibir menu lateral"
                : "Ocultar menu lateral"
        );

        toggle.title =
            hidden
                ? "Exibir menu lateral"
                : "Ocultar menu lateral";
    }


    function applySavedState() {
        let hidden = false;

        try {
            hidden =
                localStorage.getItem(STORAGE_KEY) ===
                "true";
        } catch (error) {
            hidden = false;
        }

        document.body.classList.toggle(
            "desktop-sidebar-hidden",
            isDesktop() && hidden
        );

        updateToggleState();
    }


    toggle.addEventListener("click", () => {
        if (!isDesktop()) {
            return;
        }

        const hidden =
            document.body.classList.toggle(
                "desktop-sidebar-hidden"
            );

        try {
            localStorage.setItem(
                STORAGE_KEY,
                String(hidden)
            );
        } catch (error) {
            /* A interface continua funcionando sem persistência. */
        }

        updateToggleState();
    });


    window.addEventListener("resize", () => {
        if (!isDesktop()) {
            document.body.classList.remove(
                "desktop-sidebar-hidden"
            );

            updateToggleState();
            return;
        }

        applySavedState();
    });


    applySavedState();
})();
