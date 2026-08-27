/* =========================================================
   JNFLOW — UI V2
   Renderização da interface
   Dashboard inteligente
========================================================= */


/* =========================================================
   HELPERS
========================================================= */

function formatDateBR(
    dateString,
    options = {}
) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "pt-BR",
        options
    );
}


function formatFullDate(
    date = new Date()
) {

    return date.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "2-digit",
            month: "long"
        }
    );
}


function getMonthShort(
    dateString
) {

    return formatDateBR(
        dateString,
        {
            month: "short"
        }
    )
        .replace(
            ".",
            ""
        )
        .toUpperCase();
}


function getDayNumber(
    dateString
) {

    return formatDateBR(
        dateString,
        {
            day: "2-digit"
        }
    );
}


function getStatusClass(
    status
) {

    switch (status) {

        case "Confirmado":
            return "confirmed";

        case "Concluído":
            return "done";

        case "Cancelado":
            return "cancelled";

        default:
            return "pending";
    }
}


function escapeHTML(
    value = ""
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================================
   DATA LOCAL YYYY-MM-DD
========================================================= */

function getLocalDateString(
    date = new Date()
) {

    const offset =
        date.getTimezoneOffset();


    return new Date(
        date.getTime() -
        offset * 60000
    )
        .toISOString()
        .slice(
            0,
            10
        );
}


/* =========================================================
   DATA ATUAL
========================================================= */

function renderCurrentDate() {

    const element =
        document.getElementById(
            "currentDate"
        );


    if (!element) {
        return;
    }


    let dateText =
        formatFullDate();


    dateText =
        dateText.charAt(0)
            .toUpperCase() +
        dateText.slice(1);


    element.textContent =
        dateText;
}


/* =========================================================
   INDICADORES
========================================================= */

function renderDashboardStats() {

    const monthEvents =
        getCurrentMonthEvents();


    const birthdays =
        getCurrentMonthBirthdays();


    const pending =
        monthEvents.filter(
            event =>
                event.status ===
                "Pendente"
        );


    const completed =
        monthEvents.filter(
            event =>
                event.status ===
                "Concluído"
        );


    const monthElement =
        document.getElementById(
            "monthEvents"
        );


    const birthdaysElement =
        document.getElementById(
            "birthdaysCount"
        );


    const pendingElement =
        document.getElementById(
            "pendingCount"
        );


    const completedElement =
        document.getElementById(
            "doneCount"
        );


    if (monthElement) {

        monthElement.textContent =
            monthEvents.length;
    }


    if (birthdaysElement) {

        birthdaysElement.textContent =
            birthdays.length;
    }


    if (pendingElement) {

        pendingElement.textContent =
            pending.length;
    }


    if (completedElement) {

        completedElement.textContent =
            completed.length;
    }


    /*
       Dashboard V2:

       O primeiro KPI representa todos os registros
       do mês, e não somente categoria Evento.

       Por isso o nome correto é ATIVIDADES.
    */

    const firstStatLabel =
        document.querySelector(
            ".smart-stat-card:first-child .smart-stat-label"
        );


    if (firstStatLabel) {

        firstStatLabel.textContent =
            "ATIVIDADES";
    }
}


/* =========================================================
   PRÓXIMA ATIVIDADE — HERO
========================================================= */

function renderNextEvent() {

    const element =
        document.getElementById(
            "nextEvent"
        );


    if (!element) {
        return;
    }


    const upcoming =
        getUpcomingEvents();


    if (
        upcoming.length ===
        0
    ) {

        element.textContent =
            "Nenhuma atividade próxima";

        return;
    }


    const event =
        upcoming[0];


    const date =
        formatDateBR(
            event.date,
            {
                day: "2-digit",
                month: "2-digit"
            }
        );


    const time =
        event.time
            ? ` • ${event.time}`
            : "";


    element.textContent =
        `${date}${time} — ${event.title}`;
}


/* =========================================================
   ATIVIDADES DE HOJE
========================================================= */

function getTodayDashboardActivities() {

    const today =
        getLocalDateString();


    const events =
        getAllEvents();


    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    return events
        .filter(
            event => {

                /*
                    Agenda de hoje:

                    - somente data atual
                    - cancelados não aparecem
                    - concluídos podem aparecer,
                      pois fizeram parte da agenda
                */

                return (
                    event.date === today &&
                    event.status !==
                        "Cancelado"
                );
            }
        )
        .sort(
            (
                eventA,
                eventB
            ) => {

                const timeA =
                    eventA.time ||
                    "99:99";


                const timeB =
                    eventB.time ||
                    "99:99";


                return timeA.localeCompare(
                    timeB
                );
            }
        );
}


/* =========================================================
   AGENDA DE HOJE
========================================================= */

function renderUpcomingActivities() {

    const container =
        document.getElementById(
            "activityList"
        );


    if (!container) {
        return;
    }


    /*
        IMPORTANTE:

        Antigamente usávamos:

        getUpcomingEvents()

        Isso mostrava amanhã, semana que vem etc.

        No Dashboard V2 esta área chama
        "Agenda de hoje", então exibimos
        exclusivamente a data atual.
    */

    const todayEvents =
        getTodayDashboardActivities();


    if (
        todayEvents.length ===
        0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✓
                </div>

                <strong>
                    Agenda livre hoje
                </strong>

                <p>
                    Nenhuma atividade programada
                    para hoje.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        todayEvents
            .map(
                event => {

                    const day =
                        getDayNumber(
                            event.date
                        );


                    const month =
                        getMonthShort(
                            event.date
                        );


                    const time =
                        event.time ||
                        "Sem horário";


                    const location =
                        event.location
                            ? ` • ${escapeHTML(
                                event.location
                            )}`
                            : "";


                    const coverage =
                        (
                            event.coverage &&
                            event.coverage !==
                                "Não se aplica"
                        )
                            ? ` • ${escapeHTML(
                                event.coverage
                            )}`
                            : "";


                    return `

                        <div
                            class="activity-item"
                            data-event-id="${escapeHTML(event.id)}"
                        >

                            <div class="activity-date">

                                <strong>
                                    ${day}
                                </strong>

                                <span>
                                    ${month}
                                </span>

                            </div>


                            <div class="activity-info">

                                <strong>
                                    ${escapeHTML(
                                        event.title
                                    )}
                                </strong>


                                <span>

                                    ${escapeHTML(
                                        time
                                    )}

                                    ${location}

                                    ${coverage}

                                </span>

                            </div>


                            <span
                                class="
                                    status
                                    ${getStatusClass(
                                        event.status
                                    )}
                                "
                            >

                                ${escapeHTML(
                                    event.status
                                )}

                            </span>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   RESUMO POR CATEGORIA
========================================================= */

function renderCategorySummary() {

    const container =
        document.getElementById(
            "categorySummary"
        );


    if (!container) {
        return;
    }


    const summary =
        getCategorySummary();


    const entries =
        Object.entries(
            summary
        );


    if (
        entries.length ===
        0
    ) {

        container.innerHTML = `

            <div class="empty-summary">

                Nenhuma atividade
                cadastrada neste mês.

            </div>
        `;

        return;
    }


    const max =
        Math.max(
            ...entries.map(
                item =>
                    item[1]
            )
        );


    container.innerHTML =
        entries

            .sort(
                (
                    a,
                    b
                ) =>
                    b[1] -
                    a[1]
            )

            .map(
                (
                    [
                        category,
                        count
                    ]
                ) => {

                    const width =
                        Math.max(
                            12,
                            (
                                count /
                                max
                            ) *
                            100
                        );


                    return `

                        <div class="category-row">

                            <div>

                                <div class="category-name">

                                    ${escapeHTML(
                                        category
                                    )}

                                </div>


                                <div class="category-track">

                                    <div
                                        class="category-progress"
                                        style="
                                            width:
                                            ${width}%;
                                        "
                                    >
                                    </div>

                                </div>

                            </div>


                            <span class="category-count">

                                ${count}

                            </span>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   PRÓXIMAS COBERTURAS
========================================================= */

function renderCoveragePreview() {

    const container =
        document.getElementById(
            "coveragePreview"
        );


    if (!container) {
        return;
    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    let coverages =
        getCoverageEvents();


    /*
       Segurança adicional:

       aniversário nunca deve aparecer
       como cobertura no Dashboard.
    */

    coverages =
        coverages.filter(
            event =>
                event.category !==
                "Aniversário"
        );


    coverages =
        coverages

            .filter(
                event => {

                    if (!event.date) {
                        return false;
                    }


                    const eventDate =
                        new Date(
                            event.date +
                            "T00:00:00"
                        );


                    return (
                        eventDate >= today &&
                        event.status !==
                            "Cancelado"
                    );
                }
            )

            .sort(
                (
                    a,
                    b
                ) => {

                    const valueA =
                        `${a.date || ""} ${a.time || "99:99"}`;


                    const valueB =
                        `${b.date || ""} ${b.time || "99:99"}`;


                    return valueA.localeCompare(
                        valueB
                    );
                }
            )

            .slice(
                0,
                4
            );


    if (
        coverages.length ===
        0
    ) {

        container.innerHTML = `

            <div class="empty-state small">

                <div class="empty-icon">
                    📷
                </div>

                <strong>
                    Nenhuma cobertura programada
                </strong>

            </div>
        `;

        return;
    }


    container.innerHTML =
        coverages
            .map(
                event => {

                    const date =
                        formatDateBR(
                            event.date,
                            {
                                day:
                                    "2-digit",

                                month:
                                    "2-digit"
                            }
                        );


                    const time =
                        event.time
                            ? ` • ${event.time}`
                            : "";


                    const location =
                        event.location
                            ? ` • ${escapeHTML(
                                event.location
                            )}`
                            : "";


                    const coverage =
                        (
                            event.coverage &&
                            event.coverage !==
                                "Não se aplica"
                        )
                            ? ` • ${escapeHTML(
                                event.coverage
                            )}`
                            : "";


                    return `

                        <div class="preview-item">

                            <div class="preview-info">

                                <strong>

                                    ${escapeHTML(
                                        event.title
                                    )}

                                </strong>


                                <span>

                                    ${date}

                                    ${time}

                                    ${location}

                                    ${coverage}

                                </span>

                            </div>


                            <span
                                class="
                                    status
                                    ${getStatusClass(
                                        event.status
                                    )}
                                "
                            >

                                ${escapeHTML(
                                    event.status
                                )}

                            </span>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   PRÓXIMOS ANIVERSÁRIOS
========================================================= */

function renderBirthdayPreview() {

    const container =
        document.getElementById(
            "birthdayPreview"
        );


    if (!container) {
        return;
    }


    const birthdays =
        getUpcomingBirthdays()
            .slice(
                0,
                4
            );


    if (
        birthdays.length ===
        0
    ) {

        container.innerHTML = `

            <div class="empty-state small">

                <div class="empty-icon">
                    🎂
                </div>

                <strong>
                    Nenhum aniversário próximo
                </strong>

            </div>
        `;

        return;
    }


    container.innerHTML =
        birthdays
            .map(
                event => {

                    const date =
                        formatDateBR(
                            event.date,
                            {
                                day:
                                    "2-digit",

                                month:
                                    "long"
                            }
                        );


                    return `

                        <div class="preview-item">

                            <div class="preview-info">

                                <strong>

                                    ${escapeHTML(
                                        event.title
                                    )}

                                </strong>


                                <span>

                                    ${date}

                                    ${
                                        event.time
                                            ? ` • ${escapeHTML(
                                                event.time
                                            )}`
                                            : ""
                                    }

                                </span>

                            </div>


                            <span
                                class="
                                    status
                                    ${getStatusClass(
                                        event.status
                                    )}
                                "
                            >

                                ${escapeHTML(
                                    event.status
                                )}

                            </span>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.remove(
        "hidden"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.add(
                    "hidden"
                );

            },
            2500
        );
}


/* =========================================================
   RENDERIZAR DASHBOARD COMPLETO
========================================================= */

function renderDashboard() {

    renderCurrentDate();


    renderDashboardStats();


    /*
       Hero continua enxergando
       toda a agenda futura.
    */

    renderNextEvent();


    /*
       Já este painel exibe
       SOMENTE a agenda de hoje.
    */

    renderUpcomingActivities();


    renderCategorySummary();


    renderCoveragePreview();


    renderBirthdayPreview();
}
