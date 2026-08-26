/* =========================================================
   JNFLOW — THEME GLOBAL
   Tema compartilhado por todas as páginas
========================================================= */

(function () {

    const STORAGE_KEY =
        "jnflow_theme";


    /* =====================================================
       ATUALIZAR BOTÃO
    ===================================================== */

    function updateThemeButton(theme) {

        const themeIcon =
            document.getElementById(
                "themeIcon"
            );


        const themeText =
            document.getElementById(
                "themeText"
            );


        if (themeIcon) {

            themeIcon.textContent =
                theme === "dark"
                    ? "☀"
                    : "☾";
        }


        if (themeText) {

            themeText.textContent =
                theme === "dark"
                    ? "Modo claro"
                    : "Modo escuro";
        }
    }


    /* =====================================================
       APLICAR TEMA
    ===================================================== */

    function applyTheme(theme) {

        const validTheme =
            theme === "light"
                ? "light"
                : "dark";


        document
            .documentElement
            .setAttribute(
                "data-theme",
                validTheme
            );


        localStorage.setItem(
            STORAGE_KEY,
            validTheme
        );


        updateThemeButton(
            validTheme
        );
    }


    /* =====================================================
       TROCAR TEMA
    ===================================================== */

    function toggleTheme() {

        const current =
            document
                .documentElement
                .getAttribute(
                    "data-theme"
                ) ||
            "dark";


        const next =
            current === "dark"
                ? "light"
                : "dark";


        applyTheme(
            next
        );
    }


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    function initializeTheme() {

        const savedTheme =
            localStorage.getItem(
                STORAGE_KEY
            );


        applyTheme(
            savedTheme ||
            "dark"
        );


        const themeToggle =
            document.getElementById(
                "themeToggle"
            );


        if (
            themeToggle &&
            !themeToggle.dataset.themeBound
        ) {

            themeToggle.addEventListener(
                "click",
                toggleTheme
            );


            themeToggle.dataset.themeBound =
                "true";
        }
    }


    /* =====================================================
       EXECUÇÃO
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeTheme
        );

    }

    else {

        initializeTheme();
    }


    /* =====================================================
       SINCRONIZAÇÃO ENTRE ABAS
    ===================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key === STORAGE_KEY &&
                event.newValue
            ) {

                applyTheme(
                    event.newValue
                );
            }
        }
    );

})();
