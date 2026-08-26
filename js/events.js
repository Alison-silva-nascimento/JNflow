/* =========================================
   JNFLOW — EVENTS
   Regras e manipulação de eventos
========================================= */


/* =========================================
   ESTADO LOCAL
========================================= */

let events = [];


/* =========================================
   ID ÚNICO
========================================= */

function generateEventId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
    );
}


/* =========================================
   CRIAR EVENTO
========================================= */

async function createEvent(data) {
    const event = await JNDataService.createActivity(data);

    events.push(event);

    return event;
}


/* =========================================
   BUSCAR EVENTO PELO ID
========================================= */

function getEventById(id) {
    return (
        events.find(
            event =>
                event.id === id
        ) || null
    );
}


/* =========================================
   ATUALIZAR EVENTO
========================================= */

async function updateEvent(id, data) {
    const index =
        events.findIndex(
            event =>
                event.id === id
        );


    if (index === -1) {
        return null;
    }


    const event = await JNDataService.updateActivity(
        id,
        {
            ...events[index],
            ...data
        }
    );

    events[index] = event;

    return event;
}


/* =========================================
   EXCLUIR EVENTO
========================================= */

async function deleteEvent(id) {
    const exists =
        events.some(
            event =>
                event.id === id
        );


    if (!exists) {
        return false;
    }


    await JNDataService.deleteActivity(id);

    events = events.filter(
        event => event.id !== id
    );


    return true;
}


/* =========================================
   TODOS OS EVENTOS
========================================= */

function getAllEvents() {
    return [...events];
}


/* =========================================
   ORDENAR POR DATA E HORÁRIO
========================================= */

function sortEventsByDate(list) {
    return [...list].sort(
        (a, b) => {

            const dateA =
                `${a.date} ${a.time || "00:00"}`;

            const dateB =
                `${b.date} ${b.time || "00:00"}`;


            return (
                dateA.localeCompare(
                    dateB
                )
            );
        }
    );
}


/* =========================================
   PRÓXIMOS EVENTOS
========================================= */

function getUpcomingEvents() {
    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const upcoming =
        events.filter(
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
                    event.status !== "Cancelado"
                );
            }
        );


    return (
        sortEventsByDate(
            upcoming
        )
    );
}


/* =========================================
   EVENTOS DO MÊS ATUAL
========================================= */

function getCurrentMonthEvents() {
    const now =
        new Date();


    const currentMonth =
        now.getMonth();


    const currentYear =
        now.getFullYear();


    return events.filter(
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
                eventDate.getMonth() === currentMonth &&
                eventDate.getFullYear() === currentYear
            );
        }
    );
}


/* =========================================
   ANIVERSÁRIOS DO MÊS
========================================= */

function getCurrentMonthBirthdays() {
    return (
        getCurrentMonthEvents()
            .filter(
                event =>
                    event.category ===
                    "Aniversário"
            )
    );
}


/* =========================================
   EVENTOS PENDENTES
========================================= */

function getPendingEvents() {
    return (
        events.filter(
            event =>
                event.status ===
                "Pendente"
        )
    );
}


/* =========================================
   EVENTOS CONCLUÍDOS
========================================= */

function getCompletedEvents() {
    return (
        events.filter(
            event =>
                event.status ===
                "Concluído"
        )
    );
}


/* =========================================
   COBERTURAS
========================================= */

function getCoverageEvents() {
    const coverageCategories = [
        "Cobertura Fotográfica",
        "Filmagem"
    ];


    return (
        sortEventsByDate(
            events.filter(
                event =>
                    coverageCategories.includes(
                        event.category
                    ) ||
                    Boolean(
                        event.coverage
                    )
            )
        )
    );
}


/* =========================================
   PRÓXIMOS ANIVERSÁRIOS
========================================= */

function getUpcomingBirthdays() {
    return (
        getUpcomingEvents()
            .filter(
                event =>
                    event.category ===
                    "Aniversário"
            )
    );
}


/* =========================================
   EVENTOS POR CATEGORIA
========================================= */

function getEventsByCategory(category) {
    return (
        events.filter(
            event =>
                event.category ===
                category
        )
    );
}


/* =========================================
   EVENTOS POR STATUS
========================================= */

function getEventsByStatus(status) {
    return (
        events.filter(
            event =>
                event.status ===
                status
        )
    );
}


/* =========================================
   BUSCA
========================================= */

function searchEvents(term) {
    const query =
        String(term || "")
            .trim()
            .toLowerCase();


    if (!query) {
        return getAllEvents();
    }


    return events.filter(
        event => {

            const content = `
                ${event.title}
                ${event.category}
                ${event.owner}
                ${event.location}
                ${event.notes}
            `
                .toLowerCase();


            return (
                content.includes(
                    query
                )
            );
        }
    );
}


/* =========================================
   RESUMO POR CATEGORIA
========================================= */

function getCategorySummary() {
    const monthEvents =
        getCurrentMonthEvents();


    const summary = {};


    monthEvents.forEach(
        event => {

            const category =
                event.category ||
                "Outro";


            summary[category] =
                (
                    summary[category] ||
                    0
                ) + 1;
        }
    );


    return summary;
}


/* =========================================
   RECARREGAR ESTADO
========================================= */

async function reloadEvents() {
    events = await JNDataService.getActivities();


    return events;
}
