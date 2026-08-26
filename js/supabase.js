/* =========================================
   JNFLOW — SUPABASE CLIENT
========================================= */

const SUPABASE_URL =
    "https://neygyyszslwaisihkbkk.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_mVAAqFwEwfWwAC9LWqe6pA_h23BbGbO";

const supabaseClient =
    typeof supabase !== "undefined" &&
    typeof supabase.createClient === "function"
        ? supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        )
        : null;
