/* =========================================
   JNFLOW — CONTROLADOR DE LOGIN
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const form =
            document.getElementById("loginForm");

        const emailInput =
            document.getElementById("email");

        const passwordInput =
            document.getElementById("password");

        const passwordToggle =
            document.getElementById("passwordToggle");

        const loginButton =
            document.getElementById("loginButton");

        const loginMessage =
            document.getElementById("loginMessage");

        const turnstileContainer =
            document.getElementById("turnstileContainer");

        const turnstileHelp =
            document.getElementById("turnstileHelp");

        let captchaEnabled = false;

        function setLoginAvailability(available) {

            loginButton.disabled = !available;

            loginButton.textContent =
                available
                    ? "Entrar"
                    : "Verificando segurança...";
        }


        if (
            typeof JNAuth === "undefined"
        ) {

            loginMessage.textContent =
                "Não foi possível carregar o sistema de autenticação.";

            loginMessage.className =
                "login-message error";

            return;
        }


        const redirected =
            await JNAuth.redirectIfAuthenticated();

        if (redirected) {
            return;
        }


        captchaEnabled =
            typeof JNTurnstile !== "undefined" &&
            JNTurnstile.isConfigured();

        if (!captchaEnabled) {

            setLoginAvailability(false);

            loginMessage.textContent =
                "Não foi possível carregar a verificação de segurança.";

            loginMessage.className =
                "login-message error";

            return;
        }

        setLoginAvailability(false);

        void JNTurnstile.render(
            turnstileContainer,
            state => {

                const messages = {
                    pending: "Conclua a verificação para entrar.",
                    verified: "Verificação concluída.",
                    expired: "A verificação expirou. Tente novamente.",
                    timeout: "A verificação expirou. Tente novamente.",
                    error: "Não foi possível validar. O desafio será renovado.",
                    unavailable: "A verificação de segurança não pôde ser carregada."
                };

                turnstileHelp.textContent = messages[state] || "";

                setLoginAvailability(state === "verified");
            }
        );


        passwordToggle.addEventListener(
            "click",
            () => {

                const showing =
                    passwordInput.type === "text";

                passwordInput.type =
                    showing
                        ? "password"
                        : "text";

                passwordToggle.setAttribute(
                    "aria-label",
                    showing
                        ? "Mostrar senha"
                        : "Ocultar senha"
                );
            }
        );


        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                loginMessage.className =
                    "login-message";

                loginMessage.textContent =
                    "";

                const email =
                    emailInput.value.trim();

                const password =
                    passwordInput.value;

                const captchaToken =
                    captchaEnabled
                        ? JNTurnstile.getToken()
                        : "";

                if (
                    !email ||
                    !password
                ) {

                    loginMessage.textContent =
                        "Informe seu e-mail e sua senha.";

                    loginMessage.className =
                        "login-message error";

                    return;
                }


                if (captchaEnabled && !captchaToken) {

                    loginMessage.textContent =
                        "Conclua a verificação de segurança para entrar.";

                    loginMessage.className =
                        "login-message error";

                    return;
                }


                loginButton.disabled = true;

                loginButton.textContent =
                    "Entrando...";

                try {

                    const result =
                        await JNAuth.login(
                            email,
                            password,
                            captchaToken
                        );

                    if (!result.success) {

                        loginMessage.textContent =
                            result.error ||
                            "E-mail ou senha inválidos.";

                        loginMessage.className =
                            "login-message error";

                        return;
                    }


                    loginMessage.textContent =
                        "Acesso autorizado.";

                    loginMessage.className =
                        "login-message success";

                    window.location.replace(
                        "index.html"
                    );

                } catch (error) {

                    loginMessage.textContent =
                        "Não foi possível realizar o login.";

                    loginMessage.className =
                        "login-message error";

                } finally {

                    if (captchaEnabled) {
                        JNTurnstile.reset();
                        setLoginAvailability(false);
                    } else {
                        setLoginAvailability(true);
                    }
                }
            }
        );
    }
);
