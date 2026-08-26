/* =========================================
   JNFLOW — AUTENTICAÇÃO
   Supabase Auth
========================================= */

(() => {
    "use strict";


    /* =========================================
       VALIDAR SUPABASE CLIENT
    ========================================= */

    if (
        typeof supabaseClient ===
        "undefined" ||
        !supabaseClient
    ) {

        return;
    }


    /* =========================================
       HELPERS DE ROTA
    ========================================= */

    function isInsidePagesFolder() {

        return (
            window.location.pathname
                .includes("/pages/")
        );
    }


    function isLoginPage() {

        return (
            window.location.pathname
                .endsWith("/login.html")
        );
    }


    function getLoginPath() {

        return isInsidePagesFolder()
            ? "../login.html"
            : "login.html";
    }


    function getDashboardPath() {

        return isInsidePagesFolder()
            ? "../index.html"
            : "index.html";
    }


    /* =========================================
       NORMALIZAR ERRO DE AUTENTICAÇÃO
    ========================================= */

    function formatAuthError(error) {

        if (!error) {
            return "Erro desconhecido de autenticação.";
        }


        const message =
            error.message ||
            "Erro desconhecido de autenticação.";


        return message;
    }


    /* =========================================
       LOGIN
    ========================================= */

    async function login(
        email,
        password,
        captchaToken = ""
    ) {

        try {

            const normalizedEmail =
                String(email || "")
                    .trim()
                    .toLowerCase();


            if (
                !normalizedEmail ||
                !password
            ) {

                return {
                    success: false,
                    error:
                        "Informe seu e-mail e sua senha."
                };
            }


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signInWithPassword({

                        email:
                            normalizedEmail,

                        password,

                        ...(captchaToken
                            ? {
                                options: {
                                    captchaToken
                                }
                            }
                            : {})
                    });


            /* =====================================
               ERRO DO SUPABASE
            ===================================== */

            if (error) {

                const authError =
                    formatAuthError(
                        error
                    );


                return {
                    success: false,
                    error:
                        authError
                };
            }


            /* =====================================
               VALIDAR RETORNO
            ===================================== */

            if (
                !data?.session ||
                !data?.user
            ) {

                return {
                    success: false,
                    error:
                        "Login aceito, mas nenhuma sessão foi criada."
                };
            }


            return {
                success: true,

                user:
                    data.user,

                session:
                    data.session
            };

        }

        catch (error) {

            return {
                success: false,
                error:
                    error?.message ||
                    "Não foi possível realizar o login."
            };
        }
    }


    /* =========================================
       LOGOUT
    ========================================= */

    async function logout() {

        try {

            const {
                error
            } =
                await supabaseClient
                    .auth
                    .signOut();


            if (error) {

                return {
                    success: false,

                    error:
                        error.message ||
                        "Não foi possível encerrar a sessão."
                };
            }


            window.location.replace(
                getLoginPath()
            );


            return {
                success: true
            };

        }

        catch (error) {

            return {
                success: false,

                error:
                    error?.message ||
                    "Não foi possível encerrar a sessão."
            };
        }
    }


    /* =========================================
       SESSÃO ATUAL
    ========================================= */

    async function getSession() {

        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (error) {

                return null;
            }


            return (
                data?.session ||
                null
            );

        }

        catch (error) {

            return null;
        }
    }


    /* =========================================
       USUÁRIO ATUAL
    ========================================= */

    async function getCurrentUser() {

        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getUser();


            if (error) {

                return null;
            }


            return (
                data?.user ||
                null
            );

        }

        catch (error) {

            return null;
        }
    }


    /* =========================================
       PROFILE
    ========================================= */

    async function getProfile() {

        try {

            const user =
                await getCurrentUser();


            if (!user) {

                return null;
            }


            const {
                data,
                error
            } =
                await supabaseClient

                    .from(
                        "profiles"
                    )

                    .select(
                        "id, name, email, created_at, updated_at"
                    )

                    .eq(
                        "id",
                        user.id
                    )

                    .single();


            if (error) {

                return null;
            }


            return data;

        }

        catch (error) {

            return null;
        }
    }


    /* =========================================
       PROTEGER PÁGINA
    ========================================= */

    async function requireAuth() {

        const session =
            await getSession();


        if (!session) {

            window.location.replace(
                getLoginPath()
            );


            return false;
        }


        return true;
    }


    /* =========================================
       LOGIN PAGE
       SE JÁ ESTIVER LOGADO
    ========================================= */

    async function redirectIfAuthenticated() {

        const session =
            await getSession();


        if (!session) {
            return false;
        }


        window.location.replace(
            getDashboardPath()
        );


        return true;
    }


    /* =========================================
       AUTH STATE CHANGE
    ========================================= */

    supabaseClient
        .auth
        .onAuthStateChange(
            (
                event,
                session
            ) => {

                /* =================================
                   SIGNED OUT
                ================================= */

                if (
                    event ===
                    "SIGNED_OUT"
                ) {

                    if (!isLoginPage()) {

                        window.location.replace(
                            getLoginPath()
                        );
                    }

                    return;
                }


                /* =================================
                   SESSÃO AUSENTE
                ================================= */

                if (
                    !session &&
                    event !==
                    "INITIAL_SESSION"
                ) {

                    if (!isLoginPage()) {

                        window.location.replace(
                            getLoginPath()
                        );
                    }
                }
            }
        );


    /* =========================================
       API GLOBAL
    ========================================= */

    window.JNAuth = {

        login,

        logout,

        getSession,

        getCurrentUser,

        getProfile,

        requireAuth,

        redirectIfAuthenticated,

        getLoginPath,

        getDashboardPath
    };
})();
