/* =========================================================
   JNFLOW — APP V2
   Dashboard inteligente + interações principais
   + navegação mobile
========================================================= */


/* =========================================================
   ELEMENTOS PRINCIPAIS
========================================================= */

const eventModal =
    document.getElementById(
        "eventModal"
    );

const eventForm =
    document.getElementById(
        "eventForm"
    );

const openEventModalButton =
    document.getElementById(
        "openEventModal"
    );

const closeModalButton =
    document.getElementById(
        "closeModal"
    );

const cancelModalButton =
    document.getElementById(
        "cancelModal"
    );


/* =========================================================
   ELEMENTOS DO MENU MOBILE
========================================================= */

const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );

const mobileSidebarClose =
    document.getElementById(
        "mobileSidebarClose"
    );

const mobileSidebarOverlay =
    document.getElementById(
        "mobileSidebarOverlay"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );


/* =========================================================
   ELEMENTOS DO DASHBOARD V2
========================================================= */

const heroGreeting =
    document.getElementById(
        "heroGreeting"
    );

const heroSummary =
    document.getElementById(
        "heroSummary"
    );

const todayActivities =
    document.getElementById(
        "todayActivities"
    );

const todayCoverages =
    document.getElementById(
        "todayCoverages"
    );

const overdueCount =
    document.getElementById(
        "overdueCount"
    );

const nextEventCountdown =
    document.getElementById(
        "nextEventCountdown"
    );

const monthEventsContext =
    document.getElementById(
        "monthEventsContext"
    );

const birthdayStatText =
    document.getElementById(
        "birthdayStatText"
    );

const birthdayStatContext =
    document.getElementById(
        "birthdayStatContext"
    );

const pendingStatText =
    document.getElementById(
        "pendingStatText"
    );

const attentionIcon =
    document.getElementById(
        "attentionIcon"
    );

const attentionTitle =
    document.getElementById(
        "attentionTitle"
    );

const attentionDescription =
    document.getElementById(
        "attentionDescription"
    );

const attentionNextCoverage =
    document.getElementById(
        "attentionNextCoverage"
    );

const attentionNextCoverageMeta =
    document.getElementById(
        "attentionNextCoverageMeta"
    );

const attentionNextBirthday =
    document.getElementById(
        "attentionNextBirthday"
    );

const attentionNextBirthdayMeta =
    document.getElementById(
        "attentionNextBirthdayMeta"
    );

const monthProgressRing =
    document.getElementById(
        "monthProgressRing"
    );

const monthProgress =
    document.getElementById(
        "monthProgress"
    );

const progressCompleted =
    document.getElementById(
        "progressCompleted"
    );

const progressOpen =
    document.getElementById(
        "progressOpen"
    );

const progressTotal =
    document.getElementById(
        "progressTotal"
    );

const monthProgressText =
    document.getElementById(
        "monthProgressText"
    );


/* =========================================================
   ELEMENTOS DO FORMULÁRIO
========================================================= */

const eventCategory =
    document.getElementById(
        "eventCategory"
    );

const eventCoverage =
    document.getElementById(
        "eventCoverage"
    );

const eventCoverageField =
    document.getElementById(
        "eventCoverageField"
    );


/* =========================================================
   CONSTANTES
========================================================= */

const NO_COVERAGE =
    "Não se aplica";

const MOBILE_BREAKPOINT =
    768;


/* =========================================================
   HELPERS DE DATA
========================================================= */

function getTodayDateString() {

    const now =
        new Date();

    const offset =
        now.getTimezoneOffset();

    const localDate =
        new Date(
            now.getTime() -
            offset * 60000
        );

    return localDate
        .toISOString()
        .slice(
            0,
            10
        );
}


function parseEventDate(
    dateString
) {

    if (!dateString) {
        return null;
    }

    return new Date(
        `${dateString}T00:00:00`
    );
}


function getTodayStart() {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    return today;
}


function getEventDateTime(
    eventData
) {

    if (
        !eventData ||
        !eventData.date
    ) {
        return null;
    }


    const time =
        eventData.time ||
        "23:59";


    const dateTime =
        new Date(
            `${eventData.date}T${time}:00`
        );


    if (
        Number.isNaN(
            dateTime.getTime()
        )
    ) {
        return null;
    }


    return dateTime;
}


function isSameMonth(
    eventData,
    referenceDate = new Date()
) {

    const date =
        parseEventDate(
            eventData.date
        );


    if (!date) {
        return false;
    }


    return (
        date.getMonth() ===
            referenceDate.getMonth() &&

        date.getFullYear() ===
            referenceDate.getFullYear()
    );
}


function formatShortDate(
    dateString
) {

    const date =
        parseEventDate(
            dateString
        );


    if (!date) {
        return "Sem data";
    }


    return date
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
}


/* =========================================================
   HELPERS DE EVENTOS
========================================================= */

function getDashboardEvents() {

    const events =
        getAllEvents();

    return Array.isArray(events)
        ? events
        : [];
}


function getTodayEvents() {

    const today =
        getTodayDateString();


    return getDashboardEvents()
        .filter(
            eventData =>
                eventData.date ===
                    today &&

                eventData.status !==
                    "Cancelado"
        )
        .sort(
            sortEventsByDateTime
        );
}


function getCurrentMonthEvents() {

    const now =
        new Date();


    return getDashboardEvents()
        .filter(
            eventData =>
                isSameMonth(
                    eventData,
                    now
                )
        );
}


function getUpcomingEvents() {

    const now =
        new Date();


    return getDashboardEvents()
        .filter(
            eventData => {

                if (
                    eventData.status ===
                    "Cancelado"
                ) {
                    return false;
                }


                if (
                    eventData.status ===
                    "Concluído"
                ) {
                    return false;
                }


                const eventDateTime =
                    getEventDateTime(
                        eventData
                    );


                return (
                    eventDateTime &&
                    eventDateTime >=
                        now
                );
            }
        )
        .sort(
            sortEventsByDateTime
        );
}


function getOverdueEvents() {

    const now =
        new Date();


    return getDashboardEvents()
        .filter(
            eventData => {

                if (
                    eventData.status ===
                    "Concluído" ||
                    eventData.status ===
                    "Cancelado"
                ) {
                    return false;
                }


                const eventDateTime =
                    getEventDateTime(
                        eventData
                    );


                if (!eventDateTime) {
                    return false;
                }


                return (
                    eventDateTime <
                    now
                );
            }
        );
}


function getCoverageEvents() {

    return getDashboardEvents()
        .filter(
            eventData => {

                const coverage =
                    eventData.coverage;


                return (
                    eventData.category !==
                        "Aniversário" &&

                    coverage &&

                    coverage !==
                        NO_COVERAGE
                );
            }
        );
}


function getTodayCoverageEvents() {

    const today =
        getTodayDateString();


    return getCoverageEvents()
        .filter(
            eventData =>
                eventData.date ===
                    today &&

                eventData.status !==
                    "Cancelado"
        );
}


function getUpcomingCoverage() {

    const now =
        new Date();


    return getCoverageEvents()
        .filter(
            eventData => {

                if (
                    eventData.status ===
                    "Cancelado" ||
                    eventData.status ===
                    "Concluído"
                ) {
                    return false;
                }


                const eventDateTime =
                    getEventDateTime(
                        eventData
                    );


                return (
                    eventDateTime &&
                    eventDateTime >=
                        now
                );
            }
        )
        .sort(
            sortEventsByDateTime
        )[0] ||
        null;
}


function getBirthdayEvents() {

    return getDashboardEvents()
        .filter(
            eventData =>
                eventData.category ===
                "Aniversário"
        );
}


function getNextBirthdayDate(
    eventData
) {

    if (
        !eventData ||
        !eventData.date
    ) {
        return null;
    }


    const originalDate =
        parseEventDate(
            eventData.date
        );


    if (!originalDate) {
        return null;
    }


    const today =
        getTodayStart();


    let nextBirthday =
        new Date(
            today.getFullYear(),
            originalDate.getMonth(),
            originalDate.getDate()
        );


    if (
        nextBirthday <
        today
    ) {
        nextBirthday =
            new Date(
                today.getFullYear() + 1,
                originalDate.getMonth(),
                originalDate.getDate()
            );
    }


    return nextBirthday;
}


function getNextBirthday() {

    const birthdays =
        getBirthdayEvents();


    if (
        birthdays.length ===
        0
    ) {
        return null;
    }


    return [...birthdays]
        .sort(
            (a, b) =>
                getNextBirthdayDate(a) -
                getNextBirthdayDate(b)
        )[0];
}


function getDaysUntilBirthday(
    eventData
) {

    const birthday =
        getNextBirthdayDate(
            eventData
        );


    if (!birthday) {
        return null;
    }


    const today =
        getTodayStart();


    return Math.ceil(
        (
            birthday.getTime() -
            today.getTime()
        ) /
        86400000
    );
}


function sortEventsByDateTime(
    a,
    b
) {

    const dateA =
        getEventDateTime(a);

    const dateB =
        getEventDateTime(b);


    if (
        !dateA &&
        !dateB
    ) {
        return 0;
    }


    if (!dateA) {
        return 1;
    }


    if (!dateB) {
        return -1;
    }


    return (
        dateA.getTime() -
        dateB.getTime()
    );
}


/* =========================================================
   SAUDAÇÃO
========================================================= */

function getGreeting() {

    const hour =
        new Date()
            .getHours();


    if (
        hour >= 5 &&
        hour < 12
    ) {
        return "Bom dia";
    }


    if (
        hour >= 12 &&
        hour < 18
    ) {
        return "Boa tarde";
    }


    return "Boa noite";
}


/* =========================================================
   HERO INTELIGENTE
========================================================= */

function renderSmartHero() {

    const todayEvents =
        getTodayEvents();

    const todayCoverageList =
        getTodayCoverageEvents();

    const overdue =
        getOverdueEvents();

    const upcoming =
        getUpcomingEvents();


    if (heroGreeting) {

        heroGreeting.textContent =
            `${getGreeting()}, Jhennyffer.`;
    }


    if (todayActivities) {

        todayActivities.textContent =
            todayEvents.length;
    }


    if (todayCoverages) {

        todayCoverages.textContent =
            todayCoverageList.length;
    }


    if (overdueCount) {

        overdueCount.textContent =
            overdue.length;
    }


    if (heroSummary) {

        if (
            todayEvents.length === 0 &&
            overdue.length === 0
        ) {

            heroSummary.textContent =
                "Sua agenda está tranquila hoje. Nenhuma pendência crítica encontrada.";
        }

        else if (
            overdue.length > 0
        ) {

            heroSummary.textContent =
                `Você tem ${todayEvents.length} atividade${todayEvents.length === 1 ? "" : "s"} hoje e ${overdue.length} item${overdue.length === 1 ? "" : "s"} que merece${overdue.length === 1 ? "" : "m"} atenção.`;
        }

        else {

            heroSummary.textContent =
                `Você tem ${todayEvents.length} atividade${todayEvents.length === 1 ? "" : "s"} programada${todayEvents.length === 1 ? "" : "s"} para hoje e está tudo em dia.`;
        }
    }


    if (nextEventCountdown) {

        const next =
            upcoming[0];


        if (!next) {

            nextEventCountdown.textContent =
                "Agenda livre por enquanto";

            return;
        }


        const nextDate =
            getEventDateTime(
                next
            );


        const now =
            new Date();


        const diff =
            nextDate.getTime() -
            now.getTime();


        const minutes =
            Math.max(
                0,
                Math.floor(
                    diff /
                    60000
                )
            );


        if (
            next.date ===
            getTodayDateString()
        ) {

            if (
                minutes < 60
            ) {

                nextEventCountdown.textContent =
                    minutes === 0
                        ? "Começa agora"
                        : `Começa em ${minutes} min`;
            }

            else {

                const hours =
                    Math.floor(
                        minutes /
                        60
                    );


                nextEventCountdown.textContent =
                    `Começa em aproximadamente ${hours}h`;
            }
        }

        else {

            nextEventCountdown.textContent =
                `${formatShortDate(next.date)} • ${next.time || "Sem horário"}`;
        }
    }
}


/* =========================================================
   CONTEXTO DOS KPIs
========================================================= */

function renderSmartStats() {

    const monthEvents =
        getCurrentMonthEvents();


    const birthdaysThisMonth =
        monthEvents.filter(
            eventData =>
                eventData.category ===
                "Aniversário"
        );


    const pending =
        monthEvents.filter(
            eventData =>
                eventData.status ===
                "Pendente"
        );


    const nextBirthday =
        getNextBirthday();


    if (monthEventsContext) {

        if (
            monthEvents.length === 0
        ) {

            monthEventsContext.textContent =
                "Nenhuma atividade";
        }

        else if (
            monthEvents.length === 1
        ) {

            monthEventsContext.textContent =
                "1 item na agenda";
        }

        else {

            monthEventsContext.textContent =
                `${monthEvents.length} itens na agenda`;
        }
    }


    if (birthdayStatText) {

        birthdayStatText.textContent =
            "neste mês";
    }


    if (birthdayStatContext) {

        if (!nextBirthday) {

            birthdayStatContext.textContent =
                "Nenhuma data próxima";
        }

        else {

            const days =
                getDaysUntilBirthday(
                    nextBirthday
                );


            if (days === 0) {

                birthdayStatContext.textContent =
                    "Próximo hoje";
            }

            else if (days === 1) {

                birthdayStatContext.textContent =
                    "Próximo amanhã";
            }

            else {

                birthdayStatContext.textContent =
                    `Próximo em ${days} dias`;
            }
        }
    }


    if (pendingStatText) {

        if (
            pending.length === 0
        ) {

            pendingStatText.textContent =
                "tudo em dia";
        }

        else if (
            pending.length === 1
        ) {

            pendingStatText.textContent =
                "1 pendência";
        }

        else {

            pendingStatText.textContent =
                `${pending.length} pendências`;
        }
    }
}


/* =========================================================
   ATENÇÃO AGORA
========================================================= */

function renderAttentionPanel() {

    const overdue =
        getOverdueEvents();

    const nextCoverage =
        getUpcomingCoverage();

    const nextBirthday =
        getNextBirthday();


    if (
        overdue.length > 0
    ) {

        if (attentionIcon) {

            attentionIcon.textContent =
                "!";
        }


        if (attentionTitle) {

            attentionTitle.textContent =
                overdue.length === 1
                    ? "1 atividade requer atenção"
                    : `${overdue.length} atividades requerem atenção`;
        }


        if (attentionDescription) {

            attentionDescription.textContent =
                "Existem atividades não concluídas cuja data ou horário já passou.";
        }
    }

    else {

        if (attentionIcon) {

            attentionIcon.textContent =
                "✓";
        }


        if (attentionTitle) {

            attentionTitle.textContent =
                "Tudo em dia";
        }


        if (attentionDescription) {

            attentionDescription.textContent =
                "Nenhuma pendência crítica no momento.";
        }
    }


    if (
        attentionNextCoverage &&
        attentionNextCoverageMeta
    ) {

        if (!nextCoverage) {

            attentionNextCoverage.textContent =
                "Nenhuma cobertura próxima";

            attentionNextCoverageMeta.textContent =
                "Agenda de produção livre";
        }

        else {

            attentionNextCoverage.textContent =
                nextCoverage.title;


            attentionNextCoverageMeta.textContent =
                `${formatShortDate(nextCoverage.date)} • ${nextCoverage.time || "Sem horário"} • ${nextCoverage.coverage}`;
        }
    }


    if (
        attentionNextBirthday &&
        attentionNextBirthdayMeta
    ) {

        if (!nextBirthday) {

            attentionNextBirthday.textContent =
                "Nenhum aniversário próximo";

            attentionNextBirthdayMeta.textContent =
                "Nenhuma data cadastrada";
        }

        else {

            const days =
                getDaysUntilBirthday(
                    nextBirthday
                );


            attentionNextBirthday.textContent =
                nextBirthday.title;


            if (days === 0) {

                attentionNextBirthdayMeta.textContent =
                    "É hoje 🎂";
            }

            else if (days === 1) {

                attentionNextBirthdayMeta.textContent =
                    "Amanhã";
            }

            else {

                attentionNextBirthdayMeta.textContent =
                    `${formatShortDate(nextBirthday.date)} • em ${days} dias`;
            }
        }
    }
}


/* =========================================================
   PROGRESSO DO MÊS
========================================================= */

function renderMonthProgress() {

    const monthEvents =
        getCurrentMonthEvents()
            .filter(
                eventData =>
                    eventData.status !==
                    "Cancelado"
            );


    const completed =
        monthEvents.filter(
            eventData =>
                eventData.status ===
                    "Concluído"
        );


    const open =
        monthEvents.filter(
            eventData =>
                eventData.status !==
                    "Concluído"
        );


    const total =
        monthEvents.length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed.length /
                    total
                ) *
                100
            );


    if (monthProgressRing) {

        monthProgressRing
            .style
            .setProperty(
                "--progress",
                percentage
            );
    }


    if (monthProgress) {

        monthProgress.textContent =
            `${percentage}%`;
    }


    if (progressCompleted) {

        progressCompleted.textContent =
            completed.length;
    }


    if (progressOpen) {

        progressOpen.textContent =
            open.length;
    }


    if (progressTotal) {

        progressTotal.textContent =
            total;
    }


    if (!monthProgressText) {
        return;
    }


    if (total === 0) {

        monthProgressText.textContent =
            "Cadastre atividades para acompanhar seu progresso mensal.";
    }

    else if (percentage === 100) {

        monthProgressText.textContent =
            "Excelente. Todas as atividades do mês foram concluídas.";
    }

    else if (percentage >= 75) {

        monthProgressText.textContent =
            "Ótimo ritmo. A maior parte da agenda deste mês já foi concluída.";
    }

    else if (percentage >= 50) {

        monthProgressText.textContent =
            "Bom progresso. Mais da metade das atividades do mês já foi finalizada.";
    }

    else if (percentage > 0) {

        monthProgressText.textContent =
            "O mês está em andamento. Continue acompanhando as atividades abertas.";
    }

    else {

        monthProgressText.textContent =
            "Ainda existem atividades a concluir neste mês.";
    }
}


/* =========================================================
   RENDER DASHBOARD V2
========================================================= */

function renderSmartDashboard() {

    renderSmartHero();

    renderSmartStats();

    renderAttentionPanel();

    renderMonthProgress();
}


/* =========================================================
   MENU MOBILE
========================================================= */

function isMobileViewport() {

    return (
        window.innerWidth <=
        MOBILE_BREAKPOINT
    );
}


function openMobileMenu() {

    if (!isMobileViewport()) {
        return;
    }


    document.body.classList.add(
        "mobile-menu-open"
    );


    if (mobileMenuButton) {

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );
    }


    if (mobileSidebarOverlay) {

        mobileSidebarOverlay.setAttribute(
            "aria-hidden",
            "false"
        );
    }
}


function closeMobileMenu() {

    document.body.classList.remove(
        "mobile-menu-open"
    );


    if (mobileMenuButton) {

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    if (mobileSidebarOverlay) {

        mobileSidebarOverlay.setAttribute(
            "aria-hidden",
            "true"
        );
    }
}


function toggleMobileMenu() {

    const isOpen =
        document.body.classList.contains(
            "mobile-menu-open"
        );


    if (isOpen) {

        closeMobileMenu();

    }

    else {

        openMobileMenu();
    }
}


if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        toggleMobileMenu
    );
}


if (mobileSidebarClose) {

    mobileSidebarClose.addEventListener(
        "click",
        closeMobileMenu
    );
}


if (mobileSidebarOverlay) {

    mobileSidebarOverlay.addEventListener(
        "click",
        closeMobileMenu
    );
}


/* Fecha ao navegar */

document
    .querySelectorAll(
        ".sidebar .menu-item"
    )
    .forEach(
        menuItem => {

            menuItem.addEventListener(
                "click",
                () => {

                    if (
                        isMobileViewport()
                    ) {

                        closeMobileMenu();
                    }
                }
            );
        }
    );


/* Segurança ao redimensionar */

window.addEventListener(
    "resize",
    () => {

        if (
            !isMobileViewport()
        ) {

            closeMobileMenu();
        }
    }
);


/* =========================================================
   MODAL
========================================================= */

function openEventModal() {

    if (!eventModal) {
        return;
    }


    /*
       Se o modal for aberto pelo mobile,
       garante que o menu esteja fechado.
    */

    closeMobileMenu();


    eventModal.classList.remove(
        "hidden"
    );


    const dateInput =
        document.getElementById(
            "eventDate"
        );


    if (
        dateInput &&
        !dateInput.value
    ) {

        dateInput.value =
            getTodayDateString();
    }


    updateCoverageField();


    const titleInput =
        document.getElementById(
            "eventTitle"
        );


    if (titleInput) {

        setTimeout(
            () => {

                titleInput.focus();
            },
            50
        );
    }
}


function closeEventModal() {

    if (!eventModal) {
        return;
    }


    eventModal.classList.add(
        "hidden"
    );
}


/* =========================================================
   COBERTURA INTELIGENTE NO FORMULÁRIO
========================================================= */

function updateCoverageField() {

    if (
        !eventCategory ||
        !eventCoverage
    ) {
        return;
    }


    const category =
        eventCategory.value;


    if (
        category ===
        "Aniversário"
    ) {

        eventCoverage.value =
            "";

        eventCoverage.disabled =
            true;


        if (eventCoverageField) {

            eventCoverageField.style.opacity =
                "0.48";
        }


        return;
    }


    eventCoverage.disabled =
        false;


    if (eventCoverageField) {

        eventCoverageField.style.opacity =
            "1";
    }


    if (
        category ===
            "Cobertura Fotográfica" &&

        !eventCoverage.value
    ) {

        eventCoverage.value =
            "Fotografia";
    }


    if (
        category ===
            "Filmagem" &&

        !eventCoverage.value
    ) {

        eventCoverage.value =
            "Vídeo";
    }
}


if (eventCategory) {

    eventCategory.addEventListener(
        "change",
        updateCoverageField
    );
}


/* =========================================================
   CRIAR ATIVIDADE
========================================================= */

async function handleEventSubmit(
    event
) {

    event.preventDefault();


    const title =
        document
            .getElementById(
                "eventTitle"
            )
            .value
            .trim();


    const category =
        document
            .getElementById(
                "eventCategory"
            )
            .value;


    const date =
        document
            .getElementById(
                "eventDate"
            )
            .value;


    const time =
        document
            .getElementById(
                "eventTime"
            )
            .value;


    const location =
        document
            .getElementById(
                "eventLocation"
            )
            .value
            .trim();


    const owner =
        document
            .getElementById(
                "eventOwner"
            )
            .value
            .trim();


    const status =
        document
            .getElementById(
                "eventStatus"
            )
            .value;


    const priority =
        document
            .getElementById(
                "eventPriority"
            )
            .value;


    let coverage =
        document
            .getElementById(
                "eventCoverage"
            )
            .value;


    const notes =
        document
            .getElementById(
                "eventNotes"
            )
            .value
            .trim();


    if (!title) {

        showToast(
            "Informe o título da atividade."
        );

        return;
    }


    if (!date) {

        showToast(
            "Informe a data da atividade."
        );

        return;
    }


    if (
        category ===
        "Aniversário"
    ) {

        coverage =
            "";
    }


    await createEvent({

        title,
        category,
        date,
        time,
        location,
        owner,
        status,
        priority,
        coverage,
        notes

    });


    eventForm.reset();


    updateCoverageField();


    closeEventModal();


    renderDashboard();


    renderSmartDashboard();


    showToast(
        "Atividade criada com sucesso."
    );
}


/* =========================================================
   EVENTOS DE MODAL
========================================================= */

if (openEventModalButton) {

    openEventModalButton.addEventListener(
        "click",
        openEventModal
    );
}


if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeEventModal
    );
}


if (cancelModalButton) {

    cancelModalButton.addEventListener(
        "click",
        closeEventModal
    );
}


if (eventModal) {

    eventModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                eventModal
            ) {

                closeEventModal();
            }
        }
    );
}


/* =========================================================
   FORM
========================================================= */

if (eventForm) {

    eventForm.addEventListener(
        "submit",
        handleEventSubmit
    );
}


/* =========================================================
   ESC GLOBAL
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


        /*
           Prioridade:
           1. modal
           2. menu mobile
        */

        if (
            eventModal &&
            !eventModal
                .classList
                .contains(
                    "hidden"
                )
        ) {

            closeEventModal();

            return;
        }


        if (
            document.body.classList.contains(
                "mobile-menu-open"
            )
        ) {

            closeMobileMenu();
        }
    }
);


/* =========================================================
   ATUALIZAÇÃO AUTOMÁTICA DO DASHBOARD
========================================================= */

function startDashboardClock() {

    let refreshing = false;

    async function refreshDashboard() {

        if (document.hidden || refreshing) {
            return;
        }

        refreshing = true;

        try {
            await reloadEvents();
            renderDashboard();
            renderSmartDashboard();
        } finally {
            refreshing = false;
        }
    }

    setInterval(
        refreshDashboard,
        60000
    );

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            void refreshDashboard();
        }
    });
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

async function initJNFlow() {

    /*
       Tema é responsabilidade do theme.js
    */

    await reloadEvents();


    renderDashboard();


    renderSmartDashboard();


    updateCoverageField();


    /*
       Garante estado inicial correto
       do menu mobile.
    */

    closeMobileMenu();


    startDashboardClock();
}


/* =========================================================
   START
========================================================= */

void initJNFlow();
