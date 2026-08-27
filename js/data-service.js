/* =========================================
   JNFLOW — DATA SERVICE
   Acesso centralizado aos dados do Supabase
========================================= */

(() => {
    "use strict";

    const ACTIVITY_SELECT = [
        "id",
        "user_id",
        "title",
        "category",
        "activity_date",
        "activity_time",
        "owner",
        "location",
        "status",
        "priority",
        "coverage",
        "notes",
        "created_at",
        "updated_at"
    ].join(",");

    const FINANCIAL_ENTRY_SELECT = [
        "id",
        "user_id",
        "activity_id",
        "entry_type",
        "description",
        "category",
        "amount",
        "due_date",
        "payment_date",
        "status",
        "payment_method",
        "installment",
        "notes",
        "created_at",
        "updated_at"
    ].join(",");

    function requireClient() {
        if (!supabaseClient) {
            throw new Error("Não foi possível conectar ao banco de dados.");
        }

        return supabaseClient;
    }


    async function getAuthenticatedUser() {
        const user = await window.JNAuth?.getCurrentUser();

        if (!user) {
            throw new Error("Sua sessão expirou. Entre novamente.");
        }

        return user;
    }


    function mapActivityFromDatabase(activity) {
        return {
            id: activity.id,
            userId: activity.user_id,
            title: activity.title || "",
            category: activity.category || "Evento",
            date: activity.activity_date || "",
            time: String(activity.activity_time || "").slice(0, 5),
            owner: activity.owner || "",
            location: activity.location || "",
            status: activity.status || "Pendente",
            priority: activity.priority || "Normal",
            coverage: activity.coverage || "",
            notes: activity.notes || "",
            createdAt: activity.created_at || "",
            updatedAt: activity.updated_at || ""
        };
    }


    function mapActivityToDatabase(activity) {
        return {
            title: activity.title || "",
            category: activity.category || "Evento",
            activity_date: activity.date || null,
            activity_time: activity.time || null,
            owner: activity.owner || "",
            location: activity.location || "",
            status: activity.status || "Pendente",
            priority: activity.priority || "Normal",
            coverage: activity.coverage || "",
            notes: activity.notes || ""
        };
    }


    async function getActivities() {
        const client = requireClient();
        const user = await getAuthenticatedUser();

        const { data, error } = await client
            .from("activities")
            .select(ACTIVITY_SELECT)
            .eq("user_id", user.id)
            .order("activity_date", { ascending: true })
            .order("activity_time", { ascending: true });

        if (error) {
            throw new Error("Não foi possível carregar as atividades.");
        }

        return (data || []).map(mapActivityFromDatabase);
    }


    async function createActivity(activity) {
        const client = requireClient();
        const user = await getAuthenticatedUser();

        const { data, error } = await client
            .from("activities")
            .insert({
                user_id: user.id,
                ...mapActivityToDatabase(activity)
            })
            .select(ACTIVITY_SELECT)
            .single();

        if (error) {
            throw new Error("Não foi possível criar a atividade.");
        }

        return mapActivityFromDatabase(data);
    }


    async function updateActivity(id, activity) {
        const client = requireClient();
        const user = await getAuthenticatedUser();

        const { data, error } = await client
            .from("activities")
            .update(mapActivityToDatabase(activity))
            .eq("id", id)
            .eq("user_id", user.id)
            .select(ACTIVITY_SELECT)
            .single();

        if (error) {
            throw new Error("Não foi possível atualizar a atividade.");
        }

        return mapActivityFromDatabase(data);
    }


    async function deleteActivity(id) {
        const client = requireClient();
        const user = await getAuthenticatedUser();

        const { error } = await client
            .from("activities")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            throw new Error("Não foi possível excluir a atividade.");
        }

        return true;
    }


    function mapFinancialEntryFromDatabase(entry) {
        return {
            id: entry.id,
            userId: entry.user_id,
            type: entry.entry_type === "Saída" ? "expense" : "income",
            description: entry.description || "",
            category: entry.category || "",
            amountCents: Math.round((Number(entry.amount) || 0) * 100),
            eventId: entry.activity_id || "",
            dueDate: entry.due_date || "",
            paymentDate: entry.payment_date || "",
            status: entry.status || "Pendente",
            paymentMethod: entry.payment_method || "",
            installment: entry.installment || "",
            notes: entry.notes || "",
            createdAt: entry.created_at || "",
            updatedAt: entry.updated_at || ""
        };
    }


    function mapFinancialEntryToDatabase(entry) {
        return {
            entry_type: entry.type === "expense" ? "Saída" : "Entrada",
            description: entry.description || "",
            category: entry.category || "",
            amount: (Number(entry.amountCents) || 0) / 100,
            activity_id: entry.eventId || null,
            due_date: entry.dueDate || null,
            payment_date: entry.paymentDate || null,
            status: entry.status || "Pendente",
            payment_method: entry.paymentMethod || "",
            installment: entry.installment || "",
            notes: entry.notes || ""
        };
    }


    async function getFinancialEntries() {
        const client = requireClient();
        const user = await getAuthenticatedUser();

        const { data, error } = await client
            .from("financial_entries")
            .select(FINANCIAL_ENTRY_SELECT)
            .eq("user_id", user.id)
            .order("due_date", { ascending: false })
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error("Não foi possível carregar os lançamentos.");
        }

        return (data || []).map(mapFinancialEntryFromDatabase);
    }


    async function createFinancialEntry(entry) {
        const client = requireClient();
        const user = await getAuthenticatedUser();

        const { data, error } = await client
            .from("financial_entries")
            .insert({
                user_id: user.id,
                ...mapFinancialEntryToDatabase(entry)
            })
            .select(FINANCIAL_ENTRY_SELECT)
            .single();

        if (error) {
            throw new Error("Não foi possível criar o lançamento.");
        }

        return mapFinancialEntryFromDatabase(data);
    }


    async function updateFinancialEntry(id, entry) {
        const client = requireClient();
        const user = await getAuthenticatedUser();

        const { data, error } = await client
            .from("financial_entries")
            .update(mapFinancialEntryToDatabase(entry))
            .eq("id", id)
            .eq("user_id", user.id)
            .select(FINANCIAL_ENTRY_SELECT)
            .single();

        if (error) {
            throw new Error("Não foi possível atualizar o lançamento.");
        }

        return mapFinancialEntryFromDatabase(data);
    }


    async function deleteFinancialEntry(id) {
        const client = requireClient();
        const user = await getAuthenticatedUser();

        const { error } = await client
            .from("financial_entries")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            throw new Error("Não foi possível excluir o lançamento.");
        }

        return true;
    }


    window.JNDataService = {
        getActivities,
        createActivity,
        updateActivity,
        deleteActivity,
        getFinancialEntries,
        createFinancialEntry,
        updateFinancialEntry,
        deleteFinancialEntry
    };
})();
