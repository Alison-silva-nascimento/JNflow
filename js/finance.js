(function () {
    "use strict";

    let entries = [];
    let editingId = null;

    const $ = id => document.getElementById(id);
    const list = $("financeList");
    const receivables = $("financeReceivables");
    const modal = $("financeModal");
    const form = $("financeForm");

    async function loadEntries() {
        entries = await JNDataService.getFinancialEntries();
        return entries;
    }

    function escapeHTML(value = "") {
        return String(value).replace(/[&<>'"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"})[character]);
    }

    function todayISO() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    }

    function money(cents) {
        return new Intl.NumberFormat("pt-BR", {style:"currency", currency:"BRL"}).format((Number(cents) || 0) / 100);
    }

    function parseMoney(value) {
        const normalized = String(value).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
        const amount = Number(normalized);
        return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
    }

    function inputMoney(cents) {
        return ((Number(cents) || 0) / 100).toLocaleString("pt-BR", {minimumFractionDigits:2, maximumFractionDigits:2});
    }

    function formatDate(value) {
        if (!value) return "Sem data";
        return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
    }

    function effectiveStatus(entry) {
        if (entry.status === "Pago" || entry.status === "Cancelado") return entry.status;
        return entry.dueDate && entry.dueDate < todayISO() ? "Vencido" : "Pendente";
    }

    function eventName(id) {
        if (!id || typeof getEventById !== "function") return "";
        return getEventById(id)?.title || "";
    }

    function showToast(message, error = false) {
        const toast = $("financeToast");
        toast.textContent = message;
        toast.style.borderColor = error ? "rgba(251,113,133,.35)" : "";
        toast.classList.remove("hidden");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2600);
    }

    function populateEvents() {
        const select = $("financeEvent");
        const eventsList = typeof getAllEvents === "function" ? getAllEvents() : [];
        select.innerHTML = `<option value="">Nenhum evento relacionado</option>` + eventsList
            .sort((a,b) => String(a.date).localeCompare(String(b.date)))
            .map(event => `<option value="${escapeHTML(event.id)}">${escapeHTML(event.title)}${event.date ? ` • ${formatDate(event.date)}` : ""}</option>`)
            .join("");
    }

    function renderSummary() {
        const month = todayISO().slice(0,7);
        const active = entries.filter(entry => effectiveStatus(entry) !== "Cancelado");
        const received = active.filter(entry => entry.type === "income" && effectiveStatus(entry) === "Pago" && (entry.paymentDate || entry.dueDate || "").slice(0,7) === month).reduce((sum,e) => sum + e.amountCents, 0);
        const expenses = active.filter(entry => entry.type === "expense" && effectiveStatus(entry) === "Pago" && (entry.paymentDate || entry.dueDate || "").slice(0,7) === month).reduce((sum,e) => sum + e.amountCents, 0);
        const pending = active.filter(entry => entry.type === "income" && ["Pendente","Vencido"].includes(effectiveStatus(entry))).reduce((sum,e) => sum + e.amountCents, 0);
        const overdueList = active.filter(entry => entry.type === "income" && effectiveStatus(entry) === "Vencido");
        const overdue = overdueList.reduce((sum,e) => sum + e.amountCents, 0);

        $("financeReceived").textContent = money(received);
        $("financeReceivable").textContent = money(pending);
        $("financeOverdue").textContent = money(overdue);
        $("financeOverdueCount").textContent = overdueList.length ? `${overdueList.length} lançamento${overdueList.length > 1 ? "s" : ""}` : "nenhum vencimento";
        $("financeBalance").textContent = money(received - expenses);
        $("financeExpenses").textContent = `${money(expenses)} em despesas`;
    }

    function filteredEntries() {
        const search = $("financeSearch").value.trim().toLocaleLowerCase("pt-BR");
        const type = $("financeTypeFilter").value;
        const status = $("financeStatusFilter").value;
        const month = $("financeMonthFilter").value;

        return [...entries].filter(entry => {
            const haystack = `${entry.description} ${entry.category || ""} ${eventName(entry.eventId)}`.toLocaleLowerCase("pt-BR");
            return (!search || haystack.includes(search)) &&
                (type === "all" || entry.type === type) &&
                (status === "all" || effectiveStatus(entry) === status) &&
                (!month || String(entry.dueDate || "").slice(0,7) === month);
        }).sort((a,b) => String(b.dueDate).localeCompare(String(a.dueDate)) || String(b.createdAt).localeCompare(String(a.createdAt)));
    }

    function renderList() {
        const filtered = filteredEntries();
        $("financeResultCount").textContent = filtered.length;

        if (!filtered.length) {
            list.innerHTML = `<div class="finance-empty"><strong>Nenhum lançamento encontrado</strong><span>Cadastre uma entrada ou saída para iniciar o controle do caixa.</span></div>`;
            return;
        }

        list.innerHTML = filtered.map(entry => {
            const status = effectiveStatus(entry);
            const linkedEvent = eventName(entry.eventId);
            const sign = entry.type === "income" ? "+" : "−";
            return `<article class="finance-entry ${entry.type}">
                <div class="finance-entry-icon" aria-hidden="true">${sign}</div>
                <div class="finance-entry-content">
                    <strong class="finance-entry-title">${escapeHTML(entry.description)}</strong>
                    <div class="finance-entry-meta">
                        <span>Vencimento: ${formatDate(entry.dueDate)}</span>
                        <span>${escapeHTML(entry.category || "Sem categoria")}</span>
                        ${entry.paymentMethod ? `<span>${escapeHTML(entry.paymentMethod)}</span>` : ""}
                        ${entry.installment ? `<span>Parcela ${escapeHTML(entry.installment)}</span>` : ""}
                    </div>
                    ${linkedEvent ? `<div class="finance-entry-event">◫ ${escapeHTML(linkedEvent)}</div>` : ""}
                </div>
                <div class="finance-entry-side">
                    <strong class="finance-entry-value">${sign} ${money(entry.amountCents)}</strong>
                    <span class="finance-status ${status.toLocaleLowerCase("pt-BR")}">${status}</span>
                    <div class="finance-entry-actions">
                        <button type="button" class="finance-action" data-action="edit" data-id="${entry.id}">Editar</button>
                        ${status !== "Pago" && status !== "Cancelado" ? `<button type="button" class="finance-action pay" data-action="pay" data-id="${entry.id}">Dar baixa</button>` : `<button type="button" class="finance-action" data-action="reopen" data-id="${entry.id}">Reabrir</button>`}
                        <button type="button" class="finance-action delete" data-action="delete" data-id="${entry.id}">Excluir</button>
                    </div>
                </div>
            </article>`;
        }).join("");
    }

    function renderReceivables() {
        const pending = entries.filter(entry => entry.type === "income" && ["Pendente","Vencido"].includes(effectiveStatus(entry))).sort((a,b) => String(a.dueDate).localeCompare(String(b.dueDate))).slice(0,6);
        if (!pending.length) {
            receivables.innerHTML = `<div class="finance-empty"><strong>Tudo recebido</strong><span>Nenhuma conta pendente no momento.</span></div>`;
            return;
        }
        receivables.innerHTML = pending.map(entry => `<article class="receivable-item ${effectiveStatus(entry) === "Vencido" ? "overdue" : ""}">
            <span>${escapeHTML(entry.description)}</span><strong>${money(entry.amountCents)}</strong>
            <small>${effectiveStatus(entry)} • ${formatDate(entry.dueDate)}${eventName(entry.eventId) ? ` • ${escapeHTML(eventName(entry.eventId))}` : ""}</small>
        </article>`).join("");
    }

    function render() { renderSummary(); renderList(); renderReceivables(); }

    function openModal(entry = null) {
        populateEvents();
        editingId = entry?.id || null;
        form.reset();
        $("financeId").value = editingId || "";
        $("financeModalTitle").textContent = entry ? "Editar lançamento" : "Novo lançamento";
        $("financeDueDate").value = entry?.dueDate || todayISO();
        if (entry) {
            $("financeType").value = entry.type;
            $("financeStatus").value = entry.status;
            $("financeDescription").value = entry.description;
            $("financeAmount").value = inputMoney(entry.amountCents);
            $("financeCategory").value = entry.category || "";
            $("financeEvent").value = entry.eventId || "";
            $("financePaymentDate").value = entry.paymentDate || "";
            $("financePaymentMethod").value = entry.paymentMethod || "";
            $("financeInstallment").value = entry.installment || "";
            $("financeNotes").value = entry.notes || "";
        }
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        setTimeout(() => $("financeDescription").focus(), 50);
    }

    function closeModal() {
        modal.classList.add("hidden");
        document.body.style.overflow = "";
        editingId = null;
    }

    async function submitForm(event) {
        event.preventDefault();
        const wasEditing = Boolean(editingId);
        const amountCents = parseMoney($("financeAmount").value);
        if (amountCents <= 0) { showToast("Informe um valor maior que zero.", true); return; }
        const data = {
            type: $("financeType").value,
            description: $("financeDescription").value.trim(), category: $("financeCategory").value.trim(),
            amountCents, eventId: $("financeEvent").value, dueDate: $("financeDueDate").value,
            paymentDate: $("financePaymentDate").value, status: $("financeStatus").value,
            paymentMethod: $("financePaymentMethod").value, installment: $("financeInstallment").value.trim(),
            notes: $("financeNotes").value.trim()
        };
        if (data.status === "Pago" && !data.paymentDate) data.paymentDate = todayISO();
        try {
            const saved = wasEditing
                ? await JNDataService.updateFinancialEntry(editingId, data)
                : await JNDataService.createFinancialEntry(data);
            const index = entries.findIndex(item => item.id === saved.id);
            if (index >= 0) entries[index] = saved;
            else entries.push(saved);
            closeModal(); render(); showToast(wasEditing ? "Lançamento atualizado." : "Lançamento cadastrado.");
        } catch (error) {
            showToast(error.message || "Não foi possível salvar o lançamento.", true);
        }
    }

    async function handleAction(event) {
        const button = event.target.closest("[data-action]");
        if (!button) return;
        const entry = entries.find(item => item.id === button.dataset.id);
        if (!entry) return;
        if (button.dataset.action === "edit") { openModal(entry); return; }
        if (button.dataset.action === "delete") {
            if (!window.confirm(`Excluir o lançamento "${entry.description}"?`)) return;
            try {
                await JNDataService.deleteFinancialEntry(entry.id);
                entries = entries.filter(item => item.id !== entry.id);
                render(); showToast("Lançamento excluído.");
            } catch (error) {
                showToast(error.message || "Não foi possível excluir o lançamento.", true);
            }
            return;
        }
        const nextEntry = { ...entry };
        if (button.dataset.action === "pay") { nextEntry.status = "Pago"; nextEntry.paymentDate = todayISO(); }
        if (button.dataset.action === "reopen") { nextEntry.status = "Pendente"; nextEntry.paymentDate = ""; }
        try {
            const saved = await JNDataService.updateFinancialEntry(entry.id, nextEntry);
            const index = entries.findIndex(item => item.id === saved.id);
            if (index >= 0) entries[index] = saved;
            render();
            if (button.dataset.action === "pay") showToast("Pagamento confirmado.");
            if (button.dataset.action === "reopen") showToast("Lançamento reaberto.");
        } catch (error) {
            showToast(error.message || "Não foi possível atualizar o lançamento.", true);
        }
    }

    $("openFinanceModal").addEventListener("click", () => openModal());
    $("financeModalClose").addEventListener("click", closeModal);
    $("financeModalCancel").addEventListener("click", closeModal);
    modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
    form.addEventListener("submit", submitForm);
    list.addEventListener("click", handleAction);
    ["financeSearch","financeTypeFilter","financeStatusFilter","financeMonthFilter"].forEach(id => $(id).addEventListener(id === "financeSearch" ? "input" : "change", renderList));
    $("financeStatus").addEventListener("change", () => { if ($("financeStatus").value === "Pago" && !$("financePaymentDate").value) $("financePaymentDate").value = todayISO(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.classList.contains("hidden")) closeModal(); });

    void (async () => {
        try {
            await reloadEvents();
            await loadEntries();
            render();
        } catch (error) {
            render();
            showToast(error.message || "Não foi possível carregar os lançamentos.", true);
        }
    })();
})();
