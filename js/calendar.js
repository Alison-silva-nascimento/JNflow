/* =========================================================
   JNFLOW — CALENDAR V5
   Desktop: painel lateral
   Mobile: modal de detalhes
   + edição
   + conclusão
   + exclusão customizada
   + toast
========================================================= */


/* =========================================================
   ESTADO
========================================================= */

let currentCalendarDate =
    new Date();

let selectedCalendarEventId =
    null;


const CALENDAR_MOBILE_BREAKPOINT =
    768;


/* =========================================================
   ELEMENTOS PRINCIPAIS
========================================================= */

const calendarGrid =
    document.getElementById(
        "calendarGrid"
    );


const calendarTitle =
    document.getElementById(
        "calendarTitle"
    );


const prevMonthButton =
    document.getElementById(
        "prevMonth"
    );


const nextMonthButton =
    document.getElementById(
        "nextMonth"
    );


const todayButton =
    document.getElementById(
        "todayButton"
    );


const categoryFilter =
    document.getElementById(
        "calendarCategoryFilter"
    );


/* =========================================================
   PAINEL DESKTOP
========================================================= */

const detailPanel =
    document.getElementById(
        "eventDetailPanel"
    );


/* =========================================================
   MODAL MOBILE
========================================================= */

const mobileEventModal =
    document.getElementById(
        "mobileEventModal"
    );


const mobileEventModalContent =
    document.getElementById(
        "mobileEventModalContent"
    );


const mobileEventModalClose =
    document.getElementById(
        "mobileEventModalClose"
    );


/* =========================================================
   VIEWPORT
========================================================= */

function isMobileCalendar() {

    return (
        window.innerWidth <=
        CALENDAR_MOBILE_BREAKPOINT
    );
}


/* =========================================================
   HELPERS
========================================================= */

function calendarLocalDateString(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        )
        .padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}`
    );
}


/* =========================================================
   CLASSE DA CATEGORIA
========================================================= */

function getCalendarCategoryClass(
    category
) {

    switch (
        category
    ) {

        case "Evento":

            return "evento";


        case "Aniversário":

            return "aniversario";


        case "Cobertura Fotográfica":

            return "cobertura";


        case "Filmagem":

            return "filmagem";


        case "Campanha":

            return "campanha";


        case "Institucional":

            return "institucional";


        default:

            return "outro";
    }
}


/* =========================================================
   CLASSE DO DIA
========================================================= */

function getCalendarDayCategoryClass(
    category
) {

    switch (
        category
    ) {

        case "Evento":

            return "event-day";


        case "Aniversário":

            return "birthday-day";


        case "Cobertura Fotográfica":

            return "coverage-day";


        case "Filmagem":

            return "film-day";


        case "Campanha":

            return "campaign-day";


        case "Institucional":

            return "institutional-day";


        default:

            return "";
    }
}


/* =========================================================
   ÍCONE
========================================================= */

function getCalendarEventIcon(
    eventData
) {

    switch (
        eventData.category
    ) {

        case "Aniversário":

            return "🎂";


        case "Cobertura Fotográfica":

            return "📷";


        case "Filmagem":

            return "🎥";


        case "Campanha":

            return "📢";


        case "Institucional":

            return "🏢";


        case "Evento":

            return "🎉";


        default:

            return "📌";
    }
}


/* =========================================================
   STATUS DO EVENTO NO CALENDÁRIO
========================================================= */

function getCalendarStatusClass(
    status
) {

    switch (
        status
    ) {

        case "Concluído":

            return "done";


        case "Cancelado":

            return "cancelled";


        default:

            return "";
    }
}


/* =========================================================
   TOAST
========================================================= */

function showCalendarToast(
    message,
    type = "success"
) {

    let toast =
        document.getElementById(
            "calendarToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "calendarToast";


        toast.style.position =
            "fixed";


        toast.style.right =
            "24px";


        toast.style.bottom =
            "24px";


        toast.style.zIndex =
            "9999";


        toast.style.minWidth =
            "250px";


        toast.style.maxWidth =
            "360px";


        toast.style.padding =
            "14px 16px";


        toast.style.borderRadius =
            "12px";


        toast.style.fontSize =
            "13px";


        toast.style.fontWeight =
            "700";


        toast.style.boxShadow =
            "0 18px 45px rgba(0,0,0,.42)";


        toast.style.opacity =
            "0";


        toast.style.transform =
            "translateY(16px)";


        toast.style.transition =
            ".22s ease";


        document.body.appendChild(
            toast
        );
    }


    /* ERRO / EXCLUSÃO */

    if (
        type ===
        "danger"
    ) {

        toast.style.color =
            "#ffffff";


        toast.style.background =
            "linear-gradient(90deg,#be123c,#f43f5e)";


        toast.style.border =
            "1px solid rgba(251,113,133,.25)";
    }


    /* SUCESSO */

    else {

        toast.style.color =
            "#090909";


        toast.style.background =
            "linear-gradient(90deg,#9a741c,#d4af37,#e4c552)";


        toast.style.border =
            "1px solid rgba(212,175,55,.35)";
    }


    toast.textContent =
        message;


    requestAnimationFrame(
        () => {

            toast.style.opacity =
                "1";


            toast.style.transform =
                "translateY(0)";
        }
    );


    clearTimeout(
        toast._timeout
    );


    toast._timeout =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";


                toast.style.transform =
                    "translateY(16px)";
            },

            2500
        );
}


/* =========================================================
   TÍTULO DO MÊS
========================================================= */

function renderCalendarTitle() {

    if (
        !calendarTitle
    ) {
        return;
    }


    let title =
        currentCalendarDate
            .toLocaleDateString(
                "pt-BR",
                {
                    month:
                        "long",

                    year:
                        "numeric"
                }
            );


    title =
        title
            .charAt(0)
            .toUpperCase() +
        title.slice(1);


    calendarTitle.textContent =
        title;
}


/* =========================================================
   FILTRO
========================================================= */

function getFilteredCalendarEvents() {

    const selectedCategory =
        categoryFilter

            ? categoryFilter.value

            : "all";


    const allEvents =
        getAllEvents();


    if (
        selectedCategory ===
        "all"
    ) {

        return allEvents;
    }


    return allEvents.filter(
        eventData =>
            eventData.category ===
            selectedCategory
    );
}


/* =========================================================
   EVENTOS DO DIA
========================================================= */

function getEventsForDay(
    dateString
) {

    return (
        getFilteredCalendarEvents()

            .filter(
                eventData =>
                    eventData.date ===
                    dateString
            )

            .sort(
                (
                    a,
                    b
                ) => {

                    const timeA =
                        a.time ||
                        "99:99";


                    const timeB =
                        b.time ||
                        "99:99";


                    return (
                        timeA.localeCompare(
                            timeB
                        )
                    );
                }
            )
    );
}


/* =========================================================
   RENDER CALENDÁRIO
========================================================= */

function renderCalendar() {

    if (
        !calendarGrid
    ) {
        return;
    }


    renderCalendarTitle();


    const year =
        currentCalendarDate
            .getFullYear();


    const month =
        currentCalendarDate
            .getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    const start =
        new Date(
            year,
            month,
            1 -
            firstDay.getDay()
        );


    const end =
        new Date(
            year,
            month,

            lastDay.getDate() +
            (
                6 -
                lastDay.getDay()
            )
        );


    const today =
        calendarLocalDateString(
            new Date()
        );


    const html =
        [];


    const cursor =
        new Date(
            start
        );


    while (
        cursor <=
        end
    ) {

        const dateString =
            calendarLocalDateString(
                cursor
            );


        const isOtherMonth =
            cursor.getMonth() !==
            month;


        const isToday =
            dateString ===
            today;


        const dayEvents =
            getEventsForDay(
                dateString
            );


        const hasEvents =
            dayEvents.length >
            0;


        const visibleEvents =
            dayEvents.slice(
                0,
                3
            );


        const hiddenCount =
            Math.max(
                0,
                dayEvents.length - 3
            );


        let dayCategoryClass =
            "";


        if (
            dayEvents.length >
            0
        ) {

            dayCategoryClass =
                getCalendarDayCategoryClass(
                    dayEvents[0]
                        .category
                );
        }


        html.push(`
            <div
                class="
                    calendar-day
                    ${isOtherMonth ? "other-month" : ""}
                    ${isToday ? "today" : ""}
                    ${hasEvents ? "has-events" : ""}
                    ${dayCategoryClass}
                "
                data-date="${dateString}"
            >

                <div class="calendar-day-number-row">

                    <div class="calendar-day-number">

                        ${cursor.getDate()}

                    </div>

                </div>


                <div class="calendar-events">

                    ${
                        visibleEvents

                            .map(
                                eventData => {

                                    const categoryClass =
                                        getCalendarCategoryClass(
                                            eventData.category
                                        );


                                    const statusClass =
                                        getCalendarStatusClass(
                                            eventData.status
                                        );


                                    const icon =
                                        getCalendarEventIcon(
                                            eventData
                                        );


                                    const timeText =
                                        eventData.time

                                            ? escapeHTML(
                                                eventData.time
                                            )

                                            : "Sem horário";


                                    return `
                                        <button
                                            type="button"
                                            class="
                                                calendar-event
                                                ${categoryClass}
                                                ${statusClass}
                                            "
                                            data-event-id="${eventData.id}"
                                            aria-label="${escapeHTML(eventData.title)}"
                                        >

                                            <span class="calendar-event-time">

                                                ${icon}

                                                ${timeText}

                                            </span>


                                            <span class="calendar-event-title">

                                                ${escapeHTML(
                                                    eventData.title
                                                )}

                                            </span>

                                        </button>
                                    `;
                                }
                            )

                            .join("")
                    }


                    ${
                        hiddenCount >
                        0

                            ? `
                                <div class="calendar-more">

                                    + ${hiddenCount}

                                    ${
                                        hiddenCount ===
                                        1

                                            ? "atividade"

                                            : "atividades"
                                    }

                                </div>
                            `

                            : ""
                    }

                </div>

            </div>
        `);


        cursor.setDate(
            cursor.getDate() +
            1
        );
    }


    calendarGrid.innerHTML =
        html.join("");
}


/* =========================================================
   DETAIL ROW
========================================================= */

function createDetailRow(
    icon,
    label,
    value
) {

    return `
        <div class="detail-row">

            <div class="detail-row-icon">

                ${icon}

            </div>


            <div>

                <span>

                    ${escapeHTML(
                        label
                    )}

                </span>


                <strong>

                    ${escapeHTML(
                        value
                    )}

                </strong>

            </div>

        </div>
    `;
}


/* =========================================================
   HTML DOS DETALHES

   Reaproveitado no painel desktop
   e no modal mobile.
========================================================= */

function createEventDetailsHTML(
    eventData,
    mobile = false
) {

    const date =
        formatDateBR(
            eventData.date,
            {
                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric",

                weekday:
                    "long"
            }
        );


    const coverage =
        (
            eventData.coverage &&
            eventData.coverage !==
            "Não se aplica"
        )

            ? eventData.coverage

            : "Não se aplica";


    const createdAt =
        eventData.createdAt

            ? new Date(
                eventData.createdAt
            )
                .toLocaleString(
                    "pt-BR"
                )

            : "Não informado";


    return `

        <div class="event-detail-header">

            <div class="event-detail-category-wrap">

                <div class="event-detail-category-icon">

                    ${getCalendarEventIcon(
                        eventData
                    )}

                </div>


                <div class="event-detail-category">

                    ${escapeHTML(
                        eventData.category
                    )}

                </div>

            </div>


            ${
                mobile

                    ? ""

                    : `
                        <button
                            type="button"
                            class="event-detail-close"
                            id="closeEventDetail"
                            aria-label="Fechar detalhes"
                        >
                            ✕
                        </button>
                    `
            }

        </div>


        <h2 class="event-detail-title">

            ${escapeHTML(
                eventData.title
            )}

        </h2>


        <span
            class="
                status
                ${getStatusClass(
                    eventData.status
                )}
                detail-status
            "
        >

            ${escapeHTML(
                eventData.status
            )}

        </span>


        <div class="detail-list">


            ${createDetailRow(
                "📅",
                "Data",
                date
            )}


            ${createDetailRow(
                "◷",
                "Horário",
                eventData.time ||
                "Sem horário"
            )}


            ${createDetailRow(
                "📍",
                "Local",
                eventData.location ||
                "Não informado"
            )}


            ${createDetailRow(
                "👤",
                "Responsável",
                eventData.owner ||
                "Não informado"
            )}


            ${createDetailRow(
                "🏷",
                "Categoria",
                eventData.category
            )}


            ${createDetailRow(
                "📷",
                "Cobertura",
                coverage
            )}


            ${createDetailRow(
                "⚑",
                "Prioridade",
                eventData.priority ||
                "Normal"
            )}


            ${createDetailRow(
                "📝",
                "Observações",
                eventData.notes ||
                "Nenhuma observação informada."
            )}


            ${createDetailRow(
                "◷",
                "Criado em",
                createdAt
            )}

        </div>


        <div class="detail-actions">

            <div class="detail-action-row">

                <button
                    type="button"
                    class="btn-secondary"
                    id="detailEditButton"
                >

                    ✎ Editar

                </button>


                <button
                    type="button"
                    class="btn-primary"
                    id="detailCompleteButton"
                    ${
                        eventData.status ===
                        "Concluído"

                            ? "disabled"

                            : ""
                    }
                >

                    ${
                        eventData.status ===
                        "Concluído"

                            ? "✓ Concluído"

                            : "✓ Marcar como concluído"
                    }

                </button>

            </div>


            <button
                type="button"
                class="detail-danger"
                id="detailDeleteButton"
            >

                🗑 Excluir atividade

            </button>

        </div>
    `;
}


/* =========================================================
   ABRIR MODAL MOBILE
========================================================= */

function openMobileEventDetails(
    eventData
) {

    if (
        !mobileEventModal ||
        !mobileEventModalContent
    ) {
        return;
    }


    mobileEventModalContent.innerHTML =
        createEventDetailsHTML(
            eventData,
            true
        );


    mobileEventModal.classList.add(
        "open"
    );


    mobileEventModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "mobile-event-open"
    );


    bindDetailButtons(
        eventData,
        mobileEventModalContent
    );
}


/* =========================================================
   FECHAR MODAL MOBILE
========================================================= */

function closeMobileEventDetails() {

    if (
        !mobileEventModal
    ) {
        return;
    }


    mobileEventModal.classList.remove(
        "open"
    );


    mobileEventModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "mobile-event-open"
    );


    /*
        Pequeno delay para não apagar
        o conteúdo durante a animação.
    */

    setTimeout(
        () => {

            if (
                mobileEventModal &&
                !mobileEventModal
                    .classList
                    .contains(
                        "open"
                    ) &&
                mobileEventModalContent
            ) {

                mobileEventModalContent.innerHTML =
                    "";
            }

        },

        260
    );
}


/* =========================================================
   RENDER DETALHES
========================================================= */

function renderEventDetails(
    eventData
) {

    if (
        !eventData
    ) {
        return;
    }


    /*
       MOBILE
       Modal sobre o calendário.
    */

    if (
        isMobileCalendar()
    ) {

        openMobileEventDetails(
            eventData
        );

        return;
    }


    /*
       DESKTOP
       Continua exatamente no painel lateral.
    */

    if (
        !detailPanel
    ) {
        return;
    }


    detailPanel.innerHTML =
        createEventDetailsHTML(
            eventData,
            false
        );


    bindDetailButtons(
        eventData,
        detailPanel
    );
}


/* =========================================================
   BOTÕES DOS DETALHES
========================================================= */

function bindDetailButtons(
    eventData,
    container = document
) {

    const closeButton =
        container.querySelector(
            "#closeEventDetail"
        );


    const editButton =
        container.querySelector(
            "#detailEditButton"
        );


    const completeButton =
        container.querySelector(
            "#detailCompleteButton"
        );


    const deleteButton =
        container.querySelector(
            "#detailDeleteButton"
        );


    /*
       Fechar painel desktop
    */

    if (
        closeButton
    ) {

        closeButton.addEventListener(
            "click",
            clearEventDetails
        );
    }


    /*
       EDITAR
    */

    if (
        editButton
    ) {

        editButton.addEventListener(
            "click",
            () => {

                /*
                   No mobile fecha detalhes
                   antes de abrir edição.
                */

                if (
                    isMobileCalendar()
                ) {

                    closeMobileEventDetails();
                }


                openCalendarEditModal(
                    eventData
                );
            }
        );
    }


    /*
       CONCLUIR
    */

    if (
        completeButton &&
        eventData.status !==
        "Concluído"
    ) {

        completeButton.addEventListener(
            "click",
            () => {

                markCalendarEventCompleted(
                    eventData.id
                );
            }
        );
    }


    /*
       EXCLUIR
    */

    if (
        deleteButton
    ) {

        deleteButton.addEventListener(
            "click",
            () => {

                openDeleteConfirmationModal(
                    eventData
                );
            }
        );
    }
}


/* =========================================================
   CONCLUIR
========================================================= */

async function markCalendarEventCompleted(
    eventId
) {

    const eventData =
        getEventById(
            eventId
        );


    if (
        !eventData
    ) {
        return;
    }


    if (
        eventData.status ===
        "Concluído"
    ) {

        showCalendarToast(
            "Esta atividade já está concluída."
        );


        return;
    }


    await updateEvent(
        eventId,
        {
            status:
                "Concluído"
        }
    );


    await reloadEvents();


    renderCalendar();


    const updatedEvent =
        getEventById(
            eventId
        );


    if (
        updatedEvent
    ) {

        renderEventDetails(
            updatedEvent
        );
    }


    showCalendarToast(
        "Atividade marcada como concluída."
    );
}


/* =========================================================
   MODAL DE EXCLUSÃO
========================================================= */

function createDeleteConfirmationModal() {

    if (
        document.getElementById(
            "calendarDeleteModal"
        )
    ) {

        return;
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "calendarDeleteModal";


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
                        Excluir atividade?
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    id="calendarDeleteClose"
                    aria-label="Fechar"
                >

                    ✕

                </button>

            </div>


            <div
                style="
                    display:flex;
                    gap:14px;
                    align-items:flex-start;
                    padding:6px 0 8px;
                "
            >

                <div
                    style="
                        width:48px;
                        height:48px;
                        flex-shrink:0;
                        display:grid;
                        place-items:center;
                        border-radius:14px;
                        background:rgba(244,63,94,.12);
                        border:1px solid rgba(244,63,94,.20);
                        font-size:22px;
                    "
                >

                    🗑

                </div>


                <div>

                    <p
                        style="
                            color:var(--text-secondary);
                            font-size:13px;
                            line-height:1.7;
                        "
                    >

                        Você está prestes a excluir

                        <strong
                            id="calendarDeleteEventName"
                            style="
                                color:var(--text-primary);
                            "
                        ></strong>.

                    </p>


                    <p
                        style="
                            margin-top:6px;
                            color:#fb7185;
                            font-size:11px;
                            font-weight:700;
                        "
                    >

                        Esta ação não poderá ser desfeita.

                    </p>

                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="btn-secondary"
                    id="calendarDeleteCancel"
                >

                    Cancelar

                </button>


                <button
                    type="button"
                    id="calendarDeleteConfirm"
                    style="
                        border:none;
                        padding:11px 16px;
                        border-radius:10px;
                        background:linear-gradient(
                            90deg,
                            #be123c,
                            #f43f5e
                        );
                        color:#fff;
                        font-weight:800;
                    "
                >

                    Excluir atividade

                </button>

            </div>

        </div>
    `;


    document.body.appendChild(
        modal
    );


    bindDeleteModal();
}


/* =========================================================
   ABRIR EXCLUSÃO
========================================================= */

function openDeleteConfirmationModal(
    eventData
) {

    createDeleteConfirmationModal();


    const modal =
        document.getElementById(
            "calendarDeleteModal"
        );


    if (
        !modal
    ) {
        return;
    }


    modal.dataset.eventId =
        eventData.id;


    const name =
        document.getElementById(
            "calendarDeleteEventName"
        );


    if (
        name
    ) {

        name.textContent =
            `"${eventData.title}"`;
    }


    modal.classList.remove(
        "hidden"
    );
}


/* =========================================================
   EVENTS DO MODAL DE EXCLUSÃO
========================================================= */

function bindDeleteModal() {

    const modal =
        document.getElementById(
            "calendarDeleteModal"
        );


    const close =
        document.getElementById(
            "calendarDeleteClose"
        );


    const cancel =
        document.getElementById(
            "calendarDeleteCancel"
        );


    const confirmButton =
        document.getElementById(
            "calendarDeleteConfirm"
        );


    if (
        !modal ||
        !close ||
        !cancel ||
        !confirmButton
    ) {
        return;
    }


    function closeDeleteModal() {

        modal.classList.add(
            "hidden"
        );
    }


    close.addEventListener(
        "click",
        closeDeleteModal
    );


    cancel.addEventListener(
        "click",
        closeDeleteModal
    );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                closeDeleteModal();
            }
        }
    );


    confirmButton.addEventListener(
        "click",
        async () => {

            const eventId =
                modal.dataset.eventId;


            if (
                !eventId
            ) {
                return;
            }


            await deleteEvent(
                eventId
            );


            await reloadEvents();


            selectedCalendarEventId =
                null;


            closeDeleteModal();


            closeMobileEventDetails();


            clearEventDetails();


            renderCalendar();


            showCalendarToast(
                "Atividade excluída com sucesso.",
                "danger"
            );
        }
    );
}


/* =========================================================
   MODAL DE EDIÇÃO
========================================================= */

function createCalendarEditModal() {

    if (
        document.getElementById(
            "calendarEditModal"
        )
    ) {

        return;
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "calendarEditModal";


    modal.className =
        "modal-overlay hidden";


    modal.innerHTML = `

        <div class="modal">

            <div class="modal-header">

                <div>

                    <span class="panel-label">

                        JNFLOW

                    </span>

                    <h2>

                        Editar atividade

                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    id="calendarEditClose"
                    aria-label="Fechar"
                >

                    ✕

                </button>

            </div>


            <form id="calendarEditForm">

                <input
                    type="hidden"
                    id="calendarEditId"
                >


                <div class="form-grid">


                    <label class="form-field full">

                        <span>
                            Título *
                        </span>

                        <input
                            type="text"
                            id="calendarEditTitle"
                            required
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Categoria
                        </span>

                        <select id="calendarEditCategory">

                            <option>
                                Evento
                            </option>

                            <option>
                                Aniversário
                            </option>

                            <option>
                                Cobertura Fotográfica
                            </option>

                            <option>
                                Filmagem
                            </option>

                            <option>
                                Campanha
                            </option>

                            <option>
                                Institucional
                            </option>

                            <option>
                                Outro
                            </option>

                        </select>

                    </label>


                    <label class="form-field">

                        <span>
                            Status
                        </span>

                        <select id="calendarEditStatus">

                            <option>
                                Pendente
                            </option>

                            <option>
                                Confirmado
                            </option>

                            <option>
                                Concluído
                            </option>

                            <option>
                                Cancelado
                            </option>

                        </select>

                    </label>


                    <label class="form-field">

                        <span>
                            Data
                        </span>

                        <input
                            type="date"
                            id="calendarEditDate"
                            required
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Horário
                        </span>

                        <input
                            type="time"
                            id="calendarEditTime"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Local
                        </span>

                        <input
                            type="text"
                            id="calendarEditLocation"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Responsável
                        </span>

                        <input
                            type="text"
                            id="calendarEditOwner"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Prioridade
                        </span>

                        <select id="calendarEditPriority">

                            <option>
                                Baixa
                            </option>

                            <option>
                                Normal
                            </option>

                            <option>
                                Alta
                            </option>

                        </select>

                    </label>


                    <label
                        class="form-field"
                        id="calendarCoverageField"
                    >

                        <span>
                            Cobertura
                        </span>

                        <select id="calendarEditCoverage">

                            <option value="">
                                Não se aplica
                            </option>

                            <option>
                                Fotografia
                            </option>

                            <option>
                                Vídeo
                            </option>

                            <option>
                                Foto + Vídeo
                            </option>

                            <option>
                                Stories / Redes sociais
                            </option>

                            <option>
                                Cobertura completa
                            </option>

                        </select>

                    </label>


                    <label class="form-field full">

                        <span>
                            Observações
                        </span>

                        <textarea
                            id="calendarEditNotes"
                            rows="4"
                        ></textarea>

                    </label>

                </div>


                <div class="form-actions">

                    <button
                        type="button"
                        class="btn-secondary"
                        id="calendarEditCancel"
                    >

                        Cancelar

                    </button>


                    <button
                        type="submit"
                        class="btn-primary"
                    >

                        Salvar alterações

                    </button>

                </div>

            </form>

        </div>
    `;


    document.body.appendChild(
        modal
    );


    bindCalendarEditModal();
}


/* =========================================================
   COBERTURA INTELIGENTE
========================================================= */

function updateCoverageFieldByCategory() {

    const category =
        document
            .getElementById(
                "calendarEditCategory"
            )
            ?.value;


    const coverageField =
        document
            .getElementById(
                "calendarCoverageField"
            );


    const coverageSelect =
        document
            .getElementById(
                "calendarEditCoverage"
            );


    if (
        !coverageField ||
        !coverageSelect
    ) {

        return;
    }


    if (
        category ===
        "Aniversário"
    ) {

        coverageSelect.value =
            "";


        coverageSelect.disabled =
            true;


        coverageField.style.opacity =
            ".45";
    }

    else {

        coverageSelect.disabled =
            false;


        coverageField.style.opacity =
            "1";
    }
}


/* =========================================================
   ABRIR EDIÇÃO
========================================================= */

function openCalendarEditModal(
    eventData
) {

    createCalendarEditModal();


    document
        .getElementById(
            "calendarEditId"
        )
        .value =
            eventData.id;


    document
        .getElementById(
            "calendarEditTitle"
        )
        .value =
            eventData.title ||
            "";


    document
        .getElementById(
            "calendarEditCategory"
        )
        .value =
            eventData.category ||
            "Evento";


    document
        .getElementById(
            "calendarEditStatus"
        )
        .value =
            eventData.status ||
            "Pendente";


    document
        .getElementById(
            "calendarEditDate"
        )
        .value =
            eventData.date ||
            "";


    document
        .getElementById(
            "calendarEditTime"
        )
        .value =
            eventData.time ||
            "";


    document
        .getElementById(
            "calendarEditLocation"
        )
        .value =
            eventData.location ||
            "";


    document
        .getElementById(
            "calendarEditOwner"
        )
        .value =
            eventData.owner ||
            "";


    document
        .getElementById(
            "calendarEditPriority"
        )
        .value =
            eventData.priority ||
            "Normal";


    document
        .getElementById(
            "calendarEditCoverage"
        )
        .value =
            eventData.coverage ||
            "";


    document
        .getElementById(
            "calendarEditNotes"
        )
        .value =
            eventData.notes ||
            "";


    updateCoverageFieldByCategory();


    document
        .getElementById(
            "calendarEditModal"
        )
        .classList
        .remove(
            "hidden"
        );
}


/* =========================================================
   MODAL DE EDIÇÃO — EVENTS
========================================================= */

function bindCalendarEditModal() {

    const modal =
        document.getElementById(
            "calendarEditModal"
        );


    const close =
        document.getElementById(
            "calendarEditClose"
        );


    const cancel =
        document.getElementById(
            "calendarEditCancel"
        );


    const form =
        document.getElementById(
            "calendarEditForm"
        );


    const category =
        document.getElementById(
            "calendarEditCategory"
        );


    if (
        !modal ||
        !close ||
        !cancel ||
        !form ||
        !category
    ) {
        return;
    }


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


    modal.addEventListener(
        "click",
        async event => {

            if (
                event.target ===
                modal
            ) {

                closeModal();
            }
        }
    );


    category.addEventListener(
        "change",
        updateCoverageFieldByCategory
    );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const id =
                document
                    .getElementById(
                        "calendarEditId"
                    )
                    .value;


            const selectedCategory =
                document
                    .getElementById(
                        "calendarEditCategory"
                    )
                    .value;


            const coverage =
                selectedCategory ===
                "Aniversário"

                    ? ""

                    : document
                        .getElementById(
                            "calendarEditCoverage"
                        )
                        .value;


            await updateEvent(
                id,
                {

                    title:
                        document
                            .getElementById(
                                "calendarEditTitle"
                            )
                            .value
                            .trim(),

                    category:
                        selectedCategory,

                    status:
                        document
                            .getElementById(
                                "calendarEditStatus"
                            )
                            .value,

                    date:
                        document
                            .getElementById(
                                "calendarEditDate"
                            )
                            .value,

                    time:
                        document
                            .getElementById(
                                "calendarEditTime"
                            )
                            .value,

                    location:
                        document
                            .getElementById(
                                "calendarEditLocation"
                            )
                            .value
                            .trim(),

                    owner:
                        document
                            .getElementById(
                                "calendarEditOwner"
                            )
                            .value
                            .trim(),

                    priority:
                        document
                            .getElementById(
                                "calendarEditPriority"
                            )
                            .value,

                    coverage:
                        coverage,

                    notes:
                        document
                            .getElementById(
                                "calendarEditNotes"
                            )
                            .value
                            .trim()
                }
            );


            await reloadEvents();


            closeModal();


            renderCalendar();


            const updated =
                getEventById(
                    id
                );


            if (
                updated
            ) {

                renderEventDetails(
                    updated
                );
            }


            showCalendarToast(
                "Atividade atualizada com sucesso."
            );
        }
    );
}


/* =========================================================
   LIMPAR DETALHES
========================================================= */

function clearEventDetails() {

    selectedCalendarEventId =
        null;


    closeMobileEventDetails();


    /*
       O painel desktop continua com
       seu estado vazio tradicional.
    */

    if (
        !detailPanel
    ) {
        return;
    }


    detailPanel.innerHTML = `

        <div class="event-detail-empty">

            <div class="icon">

                ◷

            </div>

            <strong>

                Selecione um evento

            </strong>

            <span>

                Clique em uma atividade no calendário
                para visualizar os detalhes.

            </span>

        </div>
    `;
}


/* =========================================================
   CLIQUE NO EVENTO
========================================================= */

if (
    calendarGrid
) {

    calendarGrid.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".calendar-event"
                );


            if (
                !button
            ) {
                return;
            }


            const id =
                button.dataset
                    .eventId;


            const eventData =
                getEventById(
                    id
                );


            if (
                !eventData
            ) {
                return;
            }


            selectedCalendarEventId =
                id;


            /*
               Esta função decide sozinha:

               desktop → painel
               mobile → modal
            */

            renderEventDetails(
                eventData
            );
        }
    );
}


/* =========================================================
   EVENTOS DO MODAL MOBILE
========================================================= */

if (
    mobileEventModalClose
) {

    mobileEventModalClose
        .addEventListener(
            "click",
            () => {

                selectedCalendarEventId =
                    null;


                closeMobileEventDetails();
            }
        );
}


if (
    mobileEventModal
) {

    mobileEventModal.addEventListener(
        "click",
        event => {

            /*
               Só fecha se clicar no fundo.
               Clique no card não fecha.
            */

            if (
                event.target ===
                mobileEventModal
            ) {

                selectedCalendarEventId =
                    null;


                closeMobileEventDetails();
            }
        }
    );
}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function goToPreviousMonth() {

    currentCalendarDate =
        new Date(
            currentCalendarDate
                .getFullYear(),

            currentCalendarDate
                .getMonth() - 1,

            1
        );


    clearEventDetails();


    renderCalendar();
}


function goToNextMonth() {

    currentCalendarDate =
        new Date(
            currentCalendarDate
                .getFullYear(),

            currentCalendarDate
                .getMonth() + 1,

            1
        );


    clearEventDetails();


    renderCalendar();
}


function goToToday() {

    currentCalendarDate =
        new Date();


    clearEventDetails();


    renderCalendar();
}


/* =========================================================
   LISTENERS
========================================================= */

if (
    prevMonthButton
) {

    prevMonthButton.addEventListener(
        "click",
        goToPreviousMonth
    );
}


if (
    nextMonthButton
) {

    nextMonthButton.addEventListener(
        "click",
        goToNextMonth
    );
}


if (
    todayButton
) {

    todayButton.addEventListener(
        "click",
        goToToday
    );
}


if (
    categoryFilter
) {

    categoryFilter.addEventListener(
        "change",
        () => {

            clearEventDetails();


            renderCalendar();
        }
    );
}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;
        }


        /* =====================================================
           1. MODAL DE EDIÇÃO
        ===================================================== */

        const editModal =
            document.getElementById(
                "calendarEditModal"
            );


        if (
            editModal &&
            !editModal
                .classList
                .contains(
                    "hidden"
                )
        ) {

            editModal.classList.add(
                "hidden"
            );


            return;
        }


        /* =====================================================
           2. MODAL DE EXCLUSÃO
        ===================================================== */

        const deleteModal =
            document.getElementById(
                "calendarDeleteModal"
            );


        if (
            deleteModal &&
            !deleteModal
                .classList
                .contains(
                    "hidden"
                )
        ) {

            deleteModal.classList.add(
                "hidden"
            );


            return;
        }


        /* =====================================================
           3. DETALHES MOBILE
        ===================================================== */

        if (
            mobileEventModal &&
            mobileEventModal
                .classList
                .contains(
                    "open"
                )
        ) {

            selectedCalendarEventId =
                null;


            closeMobileEventDetails();
        }
    }
);


/* =========================================================
   RESIZE

   Segurança para troca entre
   mobile e desktop no DevTools.
========================================================= */

window.addEventListener(
    "resize",
    () => {

        /*
           Se voltou ao desktop com
           modal mobile aberto:
           fecha modal e mostra o evento
           no painel lateral.
        */

        if (
            !isMobileCalendar() &&
            mobileEventModal &&
            mobileEventModal
                .classList
                .contains(
                    "open"
                )
        ) {

            closeMobileEventDetails();


            if (
                selectedCalendarEventId
            ) {

                const selectedEvent =
                    getEventById(
                        selectedCalendarEventId
                    );


                if (
                    selectedEvent
                ) {

                    renderEventDetails(
                        selectedEvent
                    );
                }
            }
        }
    }
);


/* =========================================================
   START
========================================================= */

void (async () => {
    await reloadEvents();
    clearEventDetails();
    renderCalendar();
})();
