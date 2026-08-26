/* =========================================
   JNFLOW — CLOUDFLARE TURNSTILE
   Somente a Site Key pública deve ser usada aqui.
========================================= */

(() => {
    "use strict";

    // Cole aqui a Site Key pública gerada no Cloudflare Turnstile.
    // Nunca adicione a Secret Key ao frontend.
    const TURNSTILE_SITE_KEY = "0x4AAAAAAEdJ3UC2sBMPzCdj";
    const API_TIMEOUT_MS = 10000;

    let widgetId = null;
    let token = "";
    let container = null;
    let notify = () => {};

    function isConfigured() {
        return Boolean(TURNSTILE_SITE_KEY.trim());
    }

    function waitForApi() {
        return new Promise(resolve => {
            const startedAt = Date.now();
            const timer = window.setInterval(() => {
                if (window.turnstile?.render) {
                    window.clearInterval(timer);
                    resolve(window.turnstile);
                    return;
                }

                if (Date.now() - startedAt >= API_TIMEOUT_MS) {
                    window.clearInterval(timer);
                    resolve(null);
                }
            }, 100);
        });
    }

    function clearToken(state = "pending") {
        token = "";
        notify(state);
    }

    function reset() {
        token = "";

        if (widgetId !== null && window.turnstile?.reset) {
            window.turnstile.reset(widgetId);
        }
    }

    async function render(target, onStateChange) {
        container = target;
        notify = typeof onStateChange === "function" ? onStateChange : () => {};

        if (!isConfigured()) {
            container.closest(".turnstile-group")?.setAttribute("hidden", "");
            notify("disabled");
            return false;
        }

        container.closest(".turnstile-group")?.removeAttribute("hidden");
        clearToken();

        const api = await waitForApi();

        if (!api) {
            notify("unavailable");
            return false;
        }

        widgetId = api.render(container, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: "dark",
            size: "flexible",
            action: "login",
            retry: "auto",
            "refresh-expired": "auto",
            "refresh-timeout": "auto",
            callback: newToken => {
                token = newToken || "";
                notify(token ? "verified" : "pending");
            },
            "expired-callback": () => {
                clearToken("expired");
                reset();
            },
            "timeout-callback": () => {
                clearToken("timeout");
                reset();
            },
            "error-callback": () => {
                clearToken("error");
                window.setTimeout(reset, 800);
            }
        });

        return true;
    }

    window.JNTurnstile = {
        isConfigured,
        render,
        reset,
        getToken: () => token
    };
})();
