/* =========================================
   JNFLOW — COVERAGES V2
   Filtros + contadores + edição
   + concluir + exclusão customizada
========================================= */


/* =========================================
   ELEMENTOS
========================================= */

const coverageList =
    document.getElementById(
        "coverageList"
    );

const coverageSearch =
    document.getElementById(
        "coverageSearch"
    );

const coverageStatusFilter =
    document.getElementById(
        "coverageStatusFilter"
    );

const coverageTypeFilter =
    document.getElementById(
        "coverageTypeFilter"
    );

const coverageTotal =
    document.getElementById(
        "coverageTotal"
    );

const coveragePending =
    document.getElementById(
        "coveragePending"
    );

const coverageCompleted =
    document.getElementById(
        "coverageCompleted"
    );


/* =========================================
   HELPERS
========================================= */

function getCoverageItems() {
    return getAllEvents()
        .filter(
            event => {

                const coverage =
                    event.coverage;

                const hasValidCoverage =
                    coverage &&
                    coverage !==
                    "Não se aplica";

                const isBirthday =
                    event.category ===
                    "Aniversário";

                return (
                    hasValidCoverage &&
                    !isBirthday
                );
            }
        );
}


function formatCoverageDate(
    dateString
) {
    if (!dateString) {
        return null;
    }

    return new Date(
        dateString +
        "T00:00:00"
    );
}


function getCoverageMonthShort(
    date
) {
    return date
        .toLocaleDateString(
            "pt-BR",
            {
                month: "short"
            }
        )
        .replace(".", "")
        .toUpperCase();
}


/* =========================================
   TOAST
========================================= */

function showCoverageToast(
    message,
    type = "success"
) {
    let toast =
        document.getElementById(
            "coverageToast"
        );

    if (!toast) {
        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "coverageToast";

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
        type ===
        "danger"
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
   CONTADORES
========================================= */

function renderCoverageSummary() {
    const list =
        getCoverageItems();

    const pending =
        list.filter(
            event =>
                event.status ===
                "Pendente"
        );

    const completed =
        list.filter(
            event =>
                event.status ===
                "Concluído"
        );

    if (coverageTotal) {
        coverageTotal.textContent =
            list.length;
    }

    if (coveragePending) {
        coveragePending.textContent =
            pending.length;
    }

    if (coverageCompleted) {
        coverageCompleted.textContent =
            completed.length;
    }
}


/* =========================================
   FILTROS
========================================= */

function getFilteredCoverages() {
    const search =
        String(
            coverageSearch?.value ||
            ""
        )
            .trim()
            .toLowerCase();

    const status =
        coverageStatusFilter?.value ||
        "all";

    const type =
        coverageTypeFilter?.value ||
        "all";

    return getCoverageItems()
        .filter(
            event => {

                const searchText =
                    [
                        event.title,
                        event.owner,
                        event.location,
                        event.coverage,
                        event.notes,
                        event.category
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
                    event.status ===
                    status;

                const matchesType =
                    type === "all" ||
                    event.coverage ===
                    type;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesType
                );
            }
        )
        .sort(
            (a, b) => {

                const aValue =
                    `${a.date || ""} ${a.time || "99:99"}`;

                const bValue =
                    `${b.date || ""} ${b.time || "99:99"}`;

                return aValue.localeCompare(
                    bValue
                );
            }
        );
}


/* =========================================
   RENDER LISTA
========================================= */

function renderCoverages() {
    if (!coverageList) {
        return;
    }

    const list =
        getFilteredCoverages();

    if (
        list.length === 0
    ) {
        coverageList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    📷
                </div>

                <strong>
                    Nenhuma cobertura encontrada
                </strong>

                <p>
                    Ajuste os filtros ou cadastre
                    uma atividade com tipo de cobertura.
                </p>

            </div>
        `;

        return;
    }

    coverageList.innerHTML =
        list
            .map(
                event => {

                    const date =
                        formatCoverageDate(
                            event.date
                        );

                    const day =
                        date
                            ? String(
                                date.getDate()
                            ).padStart(
                                2,
                                "0"
                            )
                            : "--";

                    const month =
                        date
                            ? getCoverageMonthShort(
                                date
                            )
                            : "---";

                    const completed =
                        event.status ===
                        "Concluído";

                    return `
                        <article
                            class="coverage-card"
                            data-event-id="${event.id}"
                        >

                            <div class="coverage-date">

                                <strong>
                                    ${day}
                                </strong>

                                <span>
                                    ${month}
                                </span>

                            </div>


                            <div class="coverage-content">

                                <div class="coverage-title-row">

                                    <strong class="coverage-title">

                                        ${escapeHTML(
                                            event.title
                                        )}

                                    </strong>


                                    <span class="coverage-tag">

                                        ${escapeHTML(
                                            event.category ||
                                            "Evento"
                                        )}

                                    </span>

                                </div>


                                <div class="coverage-meta">

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


                                <div class="coverage-type">

                                    📷
                                    ${escapeHTML(
                                        event.coverage
                                    )}

                                </div>

                            </div>


                            <div class="coverage-actions">

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


                                <div class="coverage-action-buttons">

                                    <button
                                        type="button"
                                        class="coverage-action-btn"
                                        data-action="edit"
                                        data-event-id="${event.id}"
                                    >
                                        ✎ Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="
                                            coverage-action-btn
                                            complete
                                        "
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
                                        class="
                                            coverage-action-btn
                                            delete
                                        "
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

async function completeCoverage(id) {
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
        showCoverageToast(
            "Esta cobertura já está concluída."
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

    renderCoverageSummary();

    renderCoverages();

    showCoverageToast(
        "Cobertura marcada como concluída."
    );
}


/* =========================================
   MODAL DE EDIÇÃO
========================================= */

function createCoverageEditModal() {
    if (
        document.getElementById(
            "coverageEditModal"
        )
    ) {
        return;
    }

    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "coverageEditModal";

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
                        Editar cobertura
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    id="coverageEditClose"
                >
                    ✕
                </button>

            </div>


            <form id="coverageEditForm">

                <input
                    type="hidden"
                    id="coverageEditId"
                >


                <div class="form-grid">


                    <label class="form-field full">

                        <span>
                            Título *
                        </span>

                        <input
                            type="text"
                            id="coverageEditTitle"
                            required
                            maxlength="100"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Categoria
                        </span>

                        <select
                            id="coverageEditCategory"
                        >

                            <option>
                                Evento
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
                            id="coverageEditStatus"
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
                            id="coverageEditDate"
                            required
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Horário
                        </span>

                        <input
                            type="time"
                            id="coverageEditTime"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Local
                        </span>

                        <input
                            type="text"
                            id="coverageEditLocation"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Responsável
                        </span>

                        <input
                            type="text"
                            id="coverageEditOwner"
                        >

                    </label>


                    <label class="form-field">

                        <span>
                            Prioridade
                        </span>

                        <select
                            id="coverageEditPriority"
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


                    <label class="form-field">

                        <span>
                            Tipo de cobertura *
                        </span>

                        <select
                            id="coverageEditType"
                            required
                        >

                            <option value="">
                                Selecione
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
                            id="coverageEditNotes"
                            rows="4"
                            maxlength="500"
                        ></textarea>

                    </label>

                </div>


                <div class="form-actions">

                    <button
                        type="button"
                        class="btn-secondary"
                        id="coverageEditCancel"
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

    bindCoverageEditModal();
}


/* =========================================
   ABRIR EDIÇÃO
========================================= */

function openCoverageEditModal(
    eventData
) {
    createCoverageEditModal();

    document
        .getElementById(
            "coverageEditId"
        )
        .value =
            eventData.id;

    document
        .getElementById(
            "coverageEditTitle"
        )
        .value =
            eventData.title ||
            "";

    document
        .getElementById(
            "coverageEditCategory"
        )
        .value =
            eventData.category ||
            "Evento";

    document
        .getElementById(
            "coverageEditStatus"
        )
        .value =
            eventData.status ||
            "Pendente";

    document
        .getElementById(
            "coverageEditDate"
        )
        .value =
            eventData.date ||
            "";

    document
        .getElementById(
            "coverageEditTime"
        )
        .value =
            eventData.time ||
            "";

    document
        .getElementById(
            "coverageEditLocation"
        )
        .value =
            eventData.location ||
            "";

    document
        .getElementById(
            "coverageEditOwner"
        )
        .value =
            eventData.owner ||
            "";

    document
        .getElementById(
            "coverageEditPriority"
        )
        .value =
            eventData.priority ||
            "Normal";

    document
        .getElementById(
            "coverageEditType"
        )
        .value =
            eventData.coverage ||
            "";

    document
        .getElementById(
            "coverageEditNotes"
        )
        .value =
            eventData.notes ||
            "";

    document
        .getElementById(
            "coverageEditModal"
        )
        .classList
        .remove(
            "hidden"
        );
}


/* =========================================
   BIND EDIÇÃO
========================================= */

function bindCoverageEditModal() {
    const modal =
        document.getElementById(
            "coverageEditModal"
        );

    const close =
        document.getElementById(
            "coverageEditClose"
        );

    const cancel =
        document.getElementById(
            "coverageEditCancel"
        );

    const form =
        document.getElementById(
            "coverageEditForm"
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

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const id =
                document
                    .getElementById(
                        "coverageEditId"
                    )
                    .value;

            const title =
                document
                    .getElementById(
                        "coverageEditTitle"
                    )
                    .value
                    .trim();

            const type =
                document
                    .getElementById(
                        "coverageEditType"
                    )
                    .value;

            const category =
                document
                    .getElementById(
                        "coverageEditCategory"
                    )
                    .value;

            if (!title) {
                showCoverageToast(
                    "Informe o título da cobertura.",
                    "danger"
                );

                return;
            }

            if (!type) {
                showCoverageToast(
                    "Selecione o tipo de cobertura.",
                    "danger"
                );

                return;
            }

            await updateEvent(
                id,
                {
                    title:
                        title,

                    category:
                        category,

                    status:
                        document
                            .getElementById(
                                "coverageEditStatus"
                            )
                            .value,

                    date:
                        document
                            .getElementById(
                                "coverageEditDate"
                            )
                            .value,

                    time:
                        document
                            .getElementById(
                                "coverageEditTime"
                            )
                            .value,

                    location:
                        document
                            .getElementById(
                                "coverageEditLocation"
                            )
                            .value
                            .trim(),

                    owner:
                        document
                            .getElementById(
                                "coverageEditOwner"
                            )
                            .value
                            .trim(),

                    priority:
                        document
                            .getElementById(
                                "coverageEditPriority"
                            )
                            .value,

                    coverage:
                        type,

                    notes:
                        document
                            .getElementById(
                                "coverageEditNotes"
                            )
                            .value
                            .trim()
                }
            );

            closeModal();

            renderCoverageSummary();

            renderCoverages();

            showCoverageToast(
                "Cobertura atualizada com sucesso."
            );
        }
    );
}


/* =========================================
   MODAL EXCLUSÃO
========================================= */

function createCoverageDeleteModal() {
    if (
        document.getElementById(
            "coverageDeleteModal"
        )
    ) {
        return;
    }

    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "coverageDeleteModal";

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
                        Excluir cobertura?
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    id="coverageDeleteClose"
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
                            id="coverageDeleteName"
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
                    id="coverageDeleteCancel"
                >
                    Cancelar
                </button>


                <button
                    type="button"
                    id="coverageDeleteConfirm"
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
                    Excluir cobertura
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(
        modal
    );

    bindCoverageDeleteModal();
}


/* =========================================
   ABRIR EXCLUSÃO
========================================= */

function openCoverageDeleteModal(
    eventData
) {
    createCoverageDeleteModal();

    const modal =
        document.getElementById(
            "coverageDeleteModal"
        );

    modal.dataset.eventId =
        eventData.id;

    document
        .getElementById(
            "coverageDeleteName"
        )
        .textContent =
            `"${eventData.title}"`;

    modal.classList.remove(
        "hidden"
    );
}


/* =========================================
   BIND EXCLUSÃO
========================================= */

function bindCoverageDeleteModal() {
    const modal =
        document.getElementById(
            "coverageDeleteModal"
        );

    const close =
        document.getElementById(
            "coverageDeleteClose"
        );

    const cancel =
        document.getElementById(
            "coverageDeleteCancel"
        );

    const confirmButton =
        document.getElementById(
            "coverageDeleteConfirm"
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

            closeModal();

            renderCoverageSummary();

            renderCoverages();

            showCoverageToast(
                "Cobertura excluída com sucesso.",
                "danger"
            );
        }
    );
}


/* =========================================
   AÇÕES
========================================= */

if (coverageList) {
    coverageList.addEventListener(
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
                completeCoverage(
                    id
                );
            }

            if (
                action ===
                "edit"
            ) {
                openCoverageEditModal(
                    eventData
                );
            }

            if (
                action ===
                "delete"
            ) {
                openCoverageDeleteModal(
                    eventData
                );
            }
        }
    );
}


/* =========================================
   FILTROS
========================================= */

if (coverageSearch) {
    coverageSearch.addEventListener(
        "input",
        renderCoverages
    );
}


if (coverageStatusFilter) {
    coverageStatusFilter.addEventListener(
        "change",
        renderCoverages
    );
}


if (coverageTypeFilter) {
    coverageTypeFilter.addEventListener(
        "change",
        renderCoverages
    );
}


/* =========================================
   ESC
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
                "coverageEditModal"
            );

        const deleteModal =
            document.getElementById(
                "coverageDeleteModal"
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
    renderCoverageSummary();
    renderCoverages();
})();
