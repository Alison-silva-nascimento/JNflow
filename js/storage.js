/* =========================================
   JNFLOW — STORAGE
   Persistência local dos dados
========================================= */

const STORAGE_KEY = "jnflow_events_v1";


/**
 * Retorna todos os eventos salvos.
 */
function getEvents() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        const events = JSON.parse(data);

        return Array.isArray(events)
            ? events
            : [];

    } catch (error) {
        console.error(
            "JNFlow: erro ao carregar eventos.",
            error
        );

        return [];
    }
}


/**
 * Salva a lista completa de eventos.
 */
function saveEvents(events) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(events)
        );

        return true;

    } catch (error) {
        console.error(
            "JNFlow: erro ao salvar eventos.",
            error
        );

        return false;
    }
}


/**
 * Remove todos os eventos.
 *
 * Útil durante desenvolvimento/testes.
 */
function clearEvents() {
    try {
        localStorage.removeItem(
            STORAGE_KEY
        );

        return true;

    } catch (error) {
        console.error(
            "JNFlow: erro ao limpar eventos.",
            error
        );

        return false;
    }
}
