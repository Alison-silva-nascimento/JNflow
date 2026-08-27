/* =========================================
   JNFLOW — BIRTHDAYS
   Busca + filtro por mês + contadores
   + próximo aniversário
========================================= */


/* =========================================
   ELEMENTOS
========================================= */

const birthdayList =
    document.getElementById(
        "birthdayList"
    );

const birthdaySearch =
    document.getElementById(
        "birthdaySearch"
    );

const birthdayMonthFilter =
    document.getElementById(
        "birthdayMonthFilter"
    );

const birthdayTotal =
    document.getElementById(
        "birthdayTotal"
    );

const birthdayCurrentMonth =
    document.getElementById(
        "birthdayCurrentMonth"
    );

const birthdayNext =
    document.getElementById(
        "birthdayNext"
    );


/* =========================================
   HELPERS
========================================= */

function getBirthdayEvents() {
    return getAllEvents()
        .filter(
            event =>
                event.category ===
                "Aniversário"
        );
}


function getBirthdayDate(event) {
    if (!event.date) {
        return null;
    }

    return new Date(
        event.date +
        "T00:00:00"
    );
}


function getNextBirthdayDate(event) {
    const sourceDate =
        getBirthdayDate(event);

    if (!sourceDate) {
        return null;
    }

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    let nextBirthday =
        new Date(
            today.getFullYear(),
            sourceDate.getMonth(),
            sourceDate.getDate()
        );

    if (
        nextBirthday <
        today
    ) {
        nextBirthday =
            new Date(
                today.getFullYear() + 1,
                sourceDate.getMonth(),
                sourceDate.getDate()
            );
    }

    return nextBirthday;
}


function getDaysUntilBirthday(event) {
    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const nextBirthday =
        getNextBirthdayDate(event);

    if (!nextBirthday) {
        return null;
    }

    const difference =
        nextBirthday.getTime() -
        today.getTime();

    return Math.ceil(
        difference /
        (
            1000 *
            60 *
            60 *
            24
        )
    );
}


function getBirthdayCountdownText(event) {
    const days =
        getDaysUntilBirthday(
            event
        );

    if (
        days === null
    ) {
        return "";
    }

    if (
        days === 0
    ) {
        return "🎉 É hoje!";
    }

    if (
        days === 1
    ) {
        return "Falta 1 dia";
    }

    return `Faltam ${days} dias`;
}


function getBirthdayMonthName(date) {
    return date
        .toLocaleDateString(
            "pt-BR",
            {
                month:
                    "short"
            }
        )
        .replace(
            ".",
            ""
        )
        .toUpperCase();
}


/* =========================================
   FILTROS
========================================= */

function getFilteredBirthdays() {
    const search =
        String(
            birthdaySearch?.value ||
            ""
        )
            .trim()
            .toLowerCase();

    const selectedMonth =
        birthdayMonthFilter?.value ||
        "all";

    return getBirthdayEvents()
        .filter(
            event => {

                const eventDate =
                    getBirthdayDate(
                        event
                    );

                if (!eventDate) {
                    return false;
                }

                const matchesSearch =
                    !search ||
                    [
                        event.title,
                        event.owner,
                        event.location,
                        event.notes
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase()
                        .includes(search);

                const matchesMonth =
                    selectedMonth ===
                    "all" ||
                    eventDate
                        .getMonth()
                        .toString() ===
                    selectedMonth;

                return (
                    matchesSearch &&
                    matchesMonth
                );
            }
        )
        .sort(
            (a, b) => {

                const nextA =
                    getNextBirthdayDate(
                        a
                    );

                const nextB =
                    getNextBirthdayDate(
                        b
                    );

                return (
                    nextA -
                    nextB
                );
            }
        );
}


/* =========================================
   RESUMO
========================================= */

function renderBirthdaySummary() {
    const birthdays =
        getBirthdayEvents();

    const now =
        new Date();

    const currentMonth =
        now.getMonth();

    const birthdaysThisMonth =
        birthdays.filter(
            event => {

                const date =
                    getBirthdayDate(
                        event
                    );

                return (
                    date &&
                    date.getMonth() ===
                    currentMonth
                );
            }
        );


    if (birthdayTotal) {
        birthdayTotal.textContent =
            birthdays.length;
    }


    if (birthdayCurrentMonth) {
        birthdayCurrentMonth.textContent =
            birthdaysThisMonth.length;
    }


    if (birthdayNext) {
        if (
            birthdays.length === 0
        ) {
            birthdayNext.textContent =
                "Nenhum";

            return;
        }

        const sorted =
            [...birthdays]
                .sort(
                    (a, b) =>
                        getNextBirthdayDate(a) -
                        getNextBirthdayDate(b)
                );

        const next =
            sorted[0];

        const nextDate =
            getNextBirthdayDate(
                next
            );

        const days =
            getDaysUntilBirthday(
                next
            );

        const formattedDate =
            nextDate
                .toLocaleDateString(
                    "pt-BR",
                    {
                        day:
                            "2-digit",

                        month:
                            "short"
                    }
                )
                .replace(
                    ".",
                    ""
                );

        birthdayNext.innerHTML = `
            ${escapeHTML(
                next.title
            )}

            <span
                style="
                    display:block;
                    margin-top:5px;
                    color:var(--text-secondary);
                    font-size:10px;
                    font-weight:600;
                "
            >
                ${escapeHTML(
                    formattedDate
                )}

                •

                ${
                    days === 0
                        ? "Hoje"
                        : days === 1
                            ? "1 dia"
                            : `${days} dias`
                }
            </span>
        `;
    }
}


/* =========================================
   RENDER LISTA
========================================= */

function renderBirthdays() {
    if (!birthdayList) {
        return;
    }

    const list =
        getFilteredBirthdays();

    if (
        list.length === 0
    ) {
        birthdayList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🎂
                </div>

                <strong>
                    Nenhum aniversário encontrado
                </strong>

                <p>
                    Cadastre uma atividade com
                    categoria Aniversário ou
                    ajuste os filtros.
                </p>

            </div>
        `;

        return;
    }


    birthdayList.innerHTML =
        list
            .map(
                event => {

                    const date =
                        getBirthdayDate(
                            event
                        );

                    const day =
                        String(
                            date.getDate()
                        ).padStart(
                            2,
                            "0"
                        );

                    const month =
                        getBirthdayMonthName(
                            date
                        );

                    const countdown =
                        getBirthdayCountdownText(
                            event
                        );

                    return `
                        <article
                            class="birthday-card"
                            data-event-id="${event.id}"
                        >

                            <div class="birthday-date">

                                <strong>
                                    ${day}
                                </strong>

                                <span>
                                    ${month}
                                </span>

                            </div>


                            <div class="birthday-info">

                                <div class="birthday-title-row">

                                    <strong class="birthday-title">

                                        ${escapeHTML(
                                            event.title
                                        )}

                                    </strong>


                                    <span class="birthday-tag">
                                        🎂 Aniversário
                                    </span>

                                </div>


                                <div class="birthday-meta">

                                    ${
                                        event.location
                                            ? `
                                                <span>
                                                    📍
                                                    ${escapeHTML(
                                                        event.location
                                                    )}
                                                </span>
                                            `
                                            : ""
                                    }


                                    ${
                                        event.owner
                                            ? `
                                                <span>
                                                    👤
                                                    ${escapeHTML(
                                                        event.owner
                                                    )}
                                                </span>
                                            `
                                            : ""
                                    }


                                    ${
                                        event.time
                                            ? `
                                                <span>
                                                    ◷
                                                    ${escapeHTML(
                                                        event.time
                                                    )}
                                                </span>
                                            `
                                            : ""
                                    }

                                </div>


                                <div class="birthday-countdown">
                                    ${escapeHTML(
                                        countdown
                                    )}
                                </div>

                            </div>


                            <div class="birthday-actions">

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


                                <div class="birthday-action-buttons">

                                    <button
                                        type="button"
                                        class="birthday-action-btn"
                                        data-action="view"
                                        data-event-id="${event.id}"
                                    >
                                        Ver
                                    </button>


                                    <button
                                        type="button"
                                        class="
                                            birthday-action-btn
                                            delete
                                        "
                                        data-action="delete"
                                        data-event-id="${event.id}"
                                    >
                                        Excluir
                                    </button>

                                </div>

                            </div>

                        </article>
                    `;
                }
            )
            .join("");
}


/* =========================================
   MODAL DE DETALHES
========================================= */

function createBirthdayDetailModal() {
    if (
        document.getElementById(
            "birthdayDetailModal"
        )
    ) {
        return;
    }

    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "birthdayDetailModal";

    modal.className =
        "modal-overlay hidden";

    modal.innerHTML = `

        <div
            class="modal"
            style="
                max-width:560px;
            "
        >

            <div class="modal-header">

                <div>

                    <span class="panel-label">
                        ANIVERSÁRIO
                    </span>

                    <h2
                        id="birthdayDetailTitle"
                    >
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    id="birthdayDetailClose"
                >
                    ✕
                </button>

            </div>


            <div
                id="birthdayDetailContent"
            >
            </div>

        </div>
    `;

    document.body.appendChild(
        modal
    );

    const close =
        document.getElementById(
            "birthdayDetailClose"
        );

    close.addEventListener(
        "click",
        async () => {

            modal.classList.add(
                "hidden"
            );
        }
    );

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {
                modal.classList.add(
                    "hidden"
                );
            }
        }
    );
}


function openBirthdayDetailModal(
    eventData
) {
    createBirthdayDetailModal();

    const modal =
        document.getElementById(
            "birthdayDetailModal"
        );

    const title =
        document.getElementById(
            "birthdayDetailTitle"
        );

    const content =
        document.getElementById(
            "birthdayDetailContent"
        );

    const date =
        getBirthdayDate(
            eventData
        );

    const formattedDate =
        date
            .toLocaleDateString(
                "pt-BR",
                {
                    day:
                        "2-digit",

                    month:
                        "long"
                }
            );

    title.textContent =
        eventData.title;


    content.innerHTML = `

        <div
            style="
                display:grid;
                gap:14px;
            "
        >

            <div class="detail-row">

                <div class="detail-row-icon">
                    🎂
                </div>

                <div>

                    <span>
                        Data
                    </span>

                    <strong>
                        ${escapeHTML(
                            formattedDate
                        )}
                    </strong>

                </div>

            </div>


            <div class="detail-row">

                <div class="detail-row-icon">
                    ⏳
                </div>

                <div>

                    <span>
                        Contagem regressiva
                    </span>

                    <strong>
                        ${escapeHTML(
                            getBirthdayCountdownText(
                                eventData
                            )
                        )}
                    </strong>

                </div>

            </div>


            <div class="detail-row">

                <div class="detail-row-icon">
                    📍
                </div>

                <div>

                    <span>
                        Local
                    </span>

                    <strong>
                        ${escapeHTML(
                            eventData.location ||
                            "Não informado"
                        )}
                    </strong>

                </div>

            </div>


            <div class="detail-row">

                <div class="detail-row-icon">
                    👤
                </div>

                <div>

                    <span>
                        Responsável
                    </span>

                    <strong>
                        ${escapeHTML(
                            eventData.owner ||
                            "Não informado"
                        )}
                    </strong>

                </div>

            </div>


            <div class="detail-row">

                <div class="detail-row-icon">
                    📝
                </div>

                <div>

                    <span>
                        Observações
                    </span>

                    <strong>
                        ${escapeHTML(
                            eventData.notes ||
                            "Nenhuma observação."
                        )}
                    </strong>

                </div>

            </div>

        </div>
    `;


    modal.classList.remove(
        "hidden"
    );
}


/* =========================================
   EXCLUSÃO
========================================= */

function createBirthdayDeleteModal() {
    if (
        document.getElementById(
            "birthdayDeleteModal"
        )
    ) {
        return;
    }

    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "birthdayDeleteModal";

    modal.className =
        "modal-overlay hidden";

    modal.innerHTML = `

        <div
            class="modal"
            style="
                max-width:470px;
            "
        >

            <div class="modal-header">

                <div>

                    <span
                        class="panel-label"
                        style="
                            color:#fb7185;
                        "
                    >
                        EXCLUSÃO
                    </span>

                    <h2>
                        Excluir aniversário?
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    id="birthdayDeleteClose"
                >
                    ✕
                </button>

            </div>


            <p
                style="
                    color:var(--text-secondary);
                    font-size:13px;
                    line-height:1.7;
                "
            >
                Você está prestes a excluir

                <strong
                    id="birthdayDeleteName"
                    style="
                        color:var(--text-primary);
                    "
                >
                </strong>.

                Esta ação não poderá ser desfeita.
            </p>


            <div class="form-actions">

                <button
                    type="button"
                    class="btn-secondary"
                    id="birthdayDeleteCancel"
                >
                    Cancelar
                </button>


                <button
                    type="button"
                    id="birthdayDeleteConfirm"
                    style="
                        border:none;
                        padding:11px 16px;
                        border-radius:10px;
                        background:
                            linear-gradient(
                                90deg,
                                #be123c,
                                #f43f5e
                            );
                        color:#ffffff;
                        font-weight:800;
                    "
                >
                    Excluir
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(
        modal
    );


    const close =
        document.getElementById(
            "birthdayDeleteClose"
        );

    const cancel =
        document.getElementById(
            "birthdayDeleteCancel"
        );

    const confirm =
        document.getElementById(
            "birthdayDeleteConfirm"
        );


    function closeModal() {
        modal.classList.add(
            "hidden"
        );
    }


    close.addEventListener(
        "click",
        closeModal
    );


    cancel.addEventListener(
        "click",
        closeModal
    );


    confirm.addEventListener(
        "click",
        async () => {

            const id =
                modal.dataset.eventId;

            if (!id) {
                return;
            }

            await deleteEvent(
                id
            );

            closeModal();

            renderBirthdaySummary();

            renderBirthdays();
        }
    );
}


function openBirthdayDeleteModal(
    eventData
) {
    createBirthdayDeleteModal();

    const modal =
        document.getElementById(
            "birthdayDeleteModal"
        );

    modal.dataset.eventId =
        eventData.id;

    document
        .getElementById(
            "birthdayDeleteName"
        )
        .textContent =
            `"${eventData.title}"`;

    modal.classList.remove(
        "hidden"
    );
}


/* =========================================
   AÇÕES
========================================= */

if (birthdayList) {
    birthdayList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-action]"
                );

            if (!button) {
                return;
            }

            const id =
                button.dataset.eventId;

            const action =
                button.dataset.action;

            const eventData =
                getEventById(
                    id
                );

            if (!eventData) {
                return;
            }

            if (
                action ===
                "view"
            ) {
                openBirthdayDetailModal(
                    eventData
                );
            }

            if (
                action ===
                "delete"
            ) {
                openBirthdayDeleteModal(
                    eventData
                );
            }
        }
    );
}


/* =========================================
   FILTROS
========================================= */

if (birthdaySearch) {
    birthdaySearch.addEventListener(
        "input",
        renderBirthdays
    );
}


if (birthdayMonthFilter) {
    birthdayMonthFilter.addEventListener(
        "change",
        renderBirthdays
    );
}


/* =========================================
   START
========================================= */

void (async () => {
    await reloadEvents();
    renderBirthdaySummary();
    renderBirthdays();
})();
