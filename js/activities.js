/* =========================================
   JNFLOW — ACTIVITIES V2
   Busca + filtros + edição + conclusão
   + exclusão customizada + toast
========================================= */


/* =========================================
   ELEMENTOS
========================================= */

const activitiesList =
    document.getElementById(
        "activitiesList"
    );

const activitySearch =
    document.getElementById(
        "activitySearch"
    );

const activityStatusFilter =
    document.getElementById(
        "activityStatusFilter"
    );

const activityCategoryFilter =
    document.getElementById(
        "activityCategoryFilter"
    );

const activityResultCount =
    document.getElementById(
        "activityResultCount"
    );


/* =========================================
   TOAST
========================================= */

function showActivitiesToast(
    message,
    type = "success"
) {

    let toast =
        document.getElementById(
            "activitiesToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "activitiesToast";

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

        toast.style.color =
            "#ffffff";

        toast.style.boxShadow =
            "0 18px 45px rgba(0,0,0,.35)";

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


    if (
        type === "danger"
    ) {

        toast.style.background =
            "linear-gradient(90deg,#be123c,#f43f5e)";

        toast.style.border =
            "1px solid rgba(251,113,133,.25)";
    }

    else {

        toast.style.background =
            "linear-gradient(90deg,#0891b2,#2563eb)";

        toast.style.border =
            "1px solid rgba(34,211,238,.22)";
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


/* =========================================
   FILTROS
========================================= */

function getFilteredActivities() {

    const search =
        String(
            activitySearch?.value || ""
        )
            .trim()
            .toLowerCase();


    const status =
        activityStatusFilter?.value ||
        "all";


    const category =
        activityCategoryFilter?.value ||
        "all";


    return (
        getAllEvents()

            .filter(
                event => {

                    const searchText =
                        [
                            event.title,
                            event.owner,
                            event.location,
                            event.category,
                            event.coverage,
                            event.notes
                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();


                    const matchesSearch =
                        !search ||
                        searchText.includes(
                            search
                        );


                    const matchesStatus =
                        status === "all" ||
                        event.status === status;


                    const matchesCategory =
                        category === "all" ||
                        event.category === category;


                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesCategory
                    );
                }
            )

            .sort(
                (a, b) => {

                    const dateA =
                        `${a.date || ""} ${a.time || "99:99"}`;

                    const dateB =
                        `${b.date || ""} ${b.time || "99:99"}`;


                    return (
                        dateA.localeCompare(
                            dateB
                        )
                    );
                }
            )
    );
}


/* =========================================
   RENDER
========================================= */

function renderActivities() {

    if (!activitiesList) {
        return;
    }


    const list =
        getFilteredActivities();


    if (activityResultCount) {

        activityResultCount.textContent =
            list.length;
    }


    if (
        list.length === 0
    ) {

        activitiesList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ✓
                </div>

                <strong>
                    Nenhuma atividade encontrada
                </strong>

                <p>
                    Ajuste os filtros ou cadastre
                    uma nova atividade.
                </p>

            </div>
        `;

        return;
    }


    activitiesList.innerHTML =
        list

            .map(
                event => {

                    const date =
                        new Date(
                            event.date +
                            "T00:00:00"
                        );


                    const day =
                        String(
                            date.getDate()
                        ).padStart(
                            2,
                            "0"
                        );


                    const month =
                        date
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


                    const coverage =
                        (
                            event.coverage &&
                            event.coverage !==
                            "Não se aplica"
                        )

                            ? `
                                <div class="activity-card-coverage">
                                    ${escapeHTML(
                                        event.coverage
                                    )}
                                </div>
                            `

                            : "";


                    const completed =
                        event.status ===
                        "Concluído";


                    return `
                        <article
                            class="activity-card"
                            data-event-id="${event.id}"
                        >

                            <div class="activity-card-date">

                                <strong>
                                    ${day}
                                </strong>

                                <span>
                                    ${month}
                                </span>

                            </div>


                            <div class="activity-card-content">

                                <div class="activity-card-title-row">

                                    <strong class="activity-card-title">

                                        ${escapeHTML(
                                            event.title
                                        )}

                                    </strong>


                                    <span class="activity-card-category">

                                        ${escapeHTML(
                                            event.category
                                        )}

                                    </span>

                                </div>


                                <div class="activity-card-meta">

                                    <span>
                                        ◷
                                        ${escapeHTML(
                                            event.time ||
                                            "Sem horário"
                                        )}
                                    </span>


                                    <span>
                                        📍
                                        ${escapeHTML(
                                            event.location ||
                                            "Local não informado"
                                        )}
                                    </span>


                                    <span>
                                        👤
                                        ${escapeHTML(
                                            event.owner ||
                                            "Responsável não informado"
                                        )}
                                    </span>

                                </div>


                                ${coverage}

                            </div>


                            <div class="activity-card-actions">

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


                                <div class="activity-action-buttons">

                                    <button
                                        type="button"
                                        class="activity-action-btn"
                                        data-action="edit"
                                        data-event-id="${event.id}"
                                    >
                                        ✎ Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="activity-action-btn complete"
                                        data-action="complete"
                                        data-event-id="${event.id}"
                                    >

                                        ${
                                            completed
                                                ? "✓ Concluído"
                                                : "✓ Concluir"
                                        }

                                    </button>


                                    <button
                                        type="button"
                                        class="activity-action-btn delete"
                                        data-action="delete"
                                        data-event-id="${event.id}"
                                    >
                                        🗑 Excluir
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
   CONCLUIR
========================================= */

async function completeActivity(id) {

    const eventData =
        getEventById(
            id
        );


    if (!eventData) {
        return;
    }


    if (
        eventData.status ===
        "Concluído"
    ) {

        showActivitiesToast(
            "Esta atividade já está concluída."
        );

        return;
    }


    await updateEvent(
        id,
        {
            status:
                "Concluído"
        }
    );


    await reloadEvents();


    renderActivities();


    showActivitiesToast(
        "Atividade marcada como concluída."
    );
}


/* =========================================
   MODAL DE EDIÇÃO
========================================= */

function createActivityEditModal() {

    if (
        document.getElementById(
            "activityEditModal"
        )
    ) {
        return;
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "activityEditModal";


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
                    id="activityEditClose"
                >
                    ✕
                </button>

            </div>


            <form id="activityEditForm">


                <input
                    type="hidden"
                    id="activityEditId"
                >


                <div class="form-grid">


                    <label class="form-field full">

                        <span>
                            Título *
                        </span>

                        <input
                            type="text"
                            id="activityEditTitle"
                            required
                            maxlength="100"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Categoria
                        </span>

                        <select
                            id="activityEditCategory"
                        >

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

                        <select
                            id="activityEditStatus"
                        >

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
                            Data *
                        </span>

                        <input
                            type="date"
                            id="activityEditDate"
                            required
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Horário
                        </span>

                        <input
                            type="time"
                            id="activityEditTime"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Local
                        </span>

                        <input
                            type="text"
                            id="activityEditLocation"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Responsável
                        </span>

                        <input
                            type="text"
                            id="activityEditOwner"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Prioridade
                        </span>

                        <select
                            id="activityEditPriority"
                        >

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
                        id="activityCoverageField"
                    >

                        <span>
                            Cobertura
                        </span>

                        <select
                            id="activityEditCoverage"
                        >

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
                            id="activityEditNotes"
                            rows="4"
                            maxlength="500"
                        ></textarea>

                    </label>

                </div>


                <div class="form-actions">

                    <button
                        type="button"
                        class="btn-secondary"
                        id="activityEditCancel"
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


    bindActivityEditModal();
}


/* =========================================
   COBERTURA INTELIGENTE
========================================= */

function updateActivityCoverageField() {

    const category =
        document
            .getElementById(
                "activityEditCategory"
            )
            ?.value;


    const field =
        document
            .getElementById(
                "activityCoverageField"
            );


    const select =
        document
            .getElementById(
                "activityEditCoverage"
            );


    if (
        !field ||
        !select
    ) {
        return;
    }


    if (
        category ===
        "Aniversário"
    ) {

        select.value =
            "";

        select.disabled =
            true;

        field.style.opacity =
            ".45";
    }

    else {

        select.disabled =
            false;

        field.style.opacity =
            "1";
    }
}


/* =========================================
   ABRIR MODAL DE EDIÇÃO
========================================= */

function openActivityEditModal(
    eventData
) {

    createActivityEditModal();


    document
        .getElementById(
            "activityEditId"
        )
        .value =
            eventData.id;


    document
        .getElementById(
            "activityEditTitle"
        )
        .value =
            eventData.title || "";


    document
        .getElementById(
            "activityEditCategory"
        )
        .value =
            eventData.category ||
            "Evento";


    document
        .getElementById(
            "activityEditStatus"
        )
        .value =
            eventData.status ||
            "Pendente";


    document
        .getElementById(
            "activityEditDate"
        )
        .value =
            eventData.date || "";


    document
        .getElementById(
            "activityEditTime"
        )
        .value =
            eventData.time || "";


    document
        .getElementById(
            "activityEditLocation"
        )
        .value =
            eventData.location || "";


    document
        .getElementById(
            "activityEditOwner"
        )
        .value =
            eventData.owner || "";


    document
        .getElementById(
            "activityEditPriority"
        )
        .value =
            eventData.priority ||
            "Normal";


    document
        .getElementById(
            "activityEditCoverage"
        )
        .value =
            eventData.coverage || "";


    document
        .getElementById(
            "activityEditNotes"
        )
        .value =
            eventData.notes || "";


    updateActivityCoverageField();


    document
        .getElementById(
            "activityEditModal"
        )
        .classList
        .remove(
            "hidden"
        );
}


/* =========================================
   BIND MODAL EDIÇÃO
========================================= */

function bindActivityEditModal() {

    const modal =
        document.getElementById(
            "activityEditModal"
        );


    const close =
        document.getElementById(
            "activityEditClose"
        );


    const cancel =
        document.getElementById(
            "activityEditCancel"
        );


    const form =
        document.getElementById(
            "activityEditForm"
        );


    const category =
        document.getElementById(
            "activityEditCategory"
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
        updateActivityCoverageField
    );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const id =
                document
                    .getElementById(
                        "activityEditId"
                    )
                    .value;


            const title =
                document
                    .getElementById(
                        "activityEditTitle"
                    )
                    .value
                    .trim();


            const categoryValue =
                document
                    .getElementById(
                        "activityEditCategory"
                    )
                    .value;


            if (!title) {

                showActivitiesToast(
                    "Informe o título da atividade.",
                    "danger"
                );

                return;
            }


            const coverage =
                categoryValue ===
                "Aniversário"

                    ? ""

                    : document
                        .getElementById(
                            "activityEditCoverage"
                        )
                        .value;


            await updateEvent(
                id,
                {
                    title:
                        title,

                    category:
                        categoryValue,

                    status:
                        document
                            .getElementById(
                                "activityEditStatus"
                            )
                            .value,

                    date:
                        document
                            .getElementById(
                                "activityEditDate"
                            )
                            .value,

                    time:
                        document
                            .getElementById(
                                "activityEditTime"
                            )
                            .value,

                    location:
                        document
                            .getElementById(
                                "activityEditLocation"
                            )
                            .value
                            .trim(),

                    owner:
                        document
                            .getElementById(
                                "activityEditOwner"
                            )
                            .value
                            .trim(),

                    priority:
                        document
                            .getElementById(
                                "activityEditPriority"
                            )
                            .value,

                    coverage:
                        coverage,

                    notes:
                        document
                            .getElementById(
                                "activityEditNotes"
                            )
                            .value
                            .trim()
                }
            );


            await reloadEvents();


            closeModal();


            renderActivities();


            showActivitiesToast(
                "Atividade atualizada com sucesso."
            );
        }
    );
}


/* =========================================
   MODAL DE EXCLUSÃO
========================================= */

function createActivityDeleteModal() {

    if (
        document.getElementById(
            "activityDeleteModal"
        )
    ) {
        return;
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "activityDeleteModal";


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
                    id="activityDeleteClose"
                >
                    ✕
                </button>

            </div>


            <div
                style="
                    display:flex;
                    align-items:flex-start;
                    gap:14px;
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
                            id="activityDeleteEventName"
                            style="
                                color:var(--text-primary);
                            "
                        >
                        </strong>.

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
                    id="activityDeleteCancel"
                >
                    Cancelar
                </button>


                <button
                    type="button"
                    id="activityDeleteConfirm"
                    style="
                        border:none;
                        padding:11px 16px;
                        border-radius:10px;
                        background:linear-gradient(
                            90deg,
                            #be123c,
                            #f43f5e
                        );
                        color:#ffffff;
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


    bindActivityDeleteModal();
}


/* =========================================
   ABRIR MODAL DE EXCLUSÃO
========================================= */

function openActivityDeleteModal(
    eventData
) {

    createActivityDeleteModal();


    const modal =
        document.getElementById(
            "activityDeleteModal"
        );


    modal.dataset.eventId =
        eventData.id;


    document
        .getElementById(
            "activityDeleteEventName"
        )
        .textContent =
            `"${eventData.title}"`;


    modal.classList.remove(
        "hidden"
    );
}


/* =========================================
   BIND MODAL DE EXCLUSÃO
========================================= */

function bindActivityDeleteModal() {

    const modal =
        document.getElementById(
            "activityDeleteModal"
        );


    const close =
        document.getElementById(
            "activityDeleteClose"
        );


    const cancel =
        document.getElementById(
            "activityDeleteCancel"
        );


    const confirmButton =
        document.getElementById(
            "activityDeleteConfirm"
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


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                closeModal();
            }
        }
    );


    confirmButton.addEventListener(
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


            await reloadEvents();


            closeModal();


            renderActivities();


            showActivitiesToast(
                "Atividade excluída com sucesso.",
                "danger"
            );
        }
    );
}


/* =========================================
   AÇÕES DA LISTA
========================================= */

if (activitiesList) {

    activitiesList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {
                return;
            }


            const action =
                button.dataset.action;


            const id =
                button.dataset.eventId;


            const eventData =
                getEventById(
                    id
                );


            if (!eventData) {
                return;
            }


            if (
                action ===
                "complete"
            ) {

                completeActivity(
                    id
                );
            }


            if (
                action ===
                "edit"
            ) {

                openActivityEditModal(
                    eventData
                );
            }


            if (
                action ===
                "delete"
            ) {

                openActivityDeleteModal(
                    eventData
                );
            }
        }
    );
}


/* =========================================
   FILTROS EM TEMPO REAL
========================================= */

if (activitySearch) {

    activitySearch.addEventListener(
        "input",
        renderActivities
    );
}


if (activityStatusFilter) {

    activityStatusFilter.addEventListener(
        "change",
        renderActivities
    );
}


if (activityCategoryFilter) {

    activityCategoryFilter.addEventListener(
        "change",
        renderActivities
    );
}


/* =========================================
   ESC FECHA MODAIS
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        const editModal =
            document.getElementById(
                "activityEditModal"
            );


        const deleteModal =
            document.getElementById(
                "activityDeleteModal"
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
        }


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
        }
    }
);


/* =========================================
   START
========================================= */

void (async () => {
    await reloadEvents();
    renderActivities();
})();
