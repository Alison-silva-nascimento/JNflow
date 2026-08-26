/* =========================================
   JNFLOW — INICIALIZAÇÃO PRIVADA
   Libera e inicia a aplicação após o Auth
========================================= */

const loader = document.querySelector("script[data-private-app]");

function showPrivateAppLoadError() {
    document.documentElement.classList.remove("auth-pending");
    document.body.classList.add("auth-load-failed");

    const message = document.createElement("main");
    message.className = "auth-load-error";
    message.setAttribute("role", "alert");
    message.innerHTML = `
        <div>
            <strong>Não foi possível carregar o JNFlow.</strong>
            <span>Verifique sua conexão e atualize a página.</span>
        </div>
    `;

    document.body.appendChild(message);
}

function loadPrivateScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src = src;
        script.async = false;
        script.onload = resolve;
        script.onerror = reject;

        document.body.appendChild(script);
    });
}

if (!loader || typeof window.JNAuth?.requireAuth !== "function") {
    showPrivateAppLoadError();
} else {
    const authenticated = await window.JNAuth.requireAuth();

    if (authenticated) {
        try {
            const base = loader.dataset.base || "";
            const scripts = (loader.dataset.scripts || "")
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);

            for (const script of scripts) {
                await loadPrivateScript(`${base}${script}`);
            }

            document.documentElement.classList.remove("auth-pending");
            document.documentElement.classList.add("auth-ready");
        } catch (error) {
            showPrivateAppLoadError();
        }
    }
}
