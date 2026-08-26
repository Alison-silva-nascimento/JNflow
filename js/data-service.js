/* =========================================
   JNFLOW — DATA SERVICE
   Acesso centralizado aos dados do Supabase
========================================= */

(() => {
    "use strict";

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
            .select("*")
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
            .select()
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
            .select()
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


    window.JNDataService = {
        getActivities,
        createActivity,
        updateActivity,
        deleteActivity
    };
})();
