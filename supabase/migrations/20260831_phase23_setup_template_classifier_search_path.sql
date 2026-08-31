-- Phase23: pin search_path for the generic Setup classifier.
-- This addresses Supabase function_search_path_mutable without changing publication state.

alter function private.is_generic_setup_template(text, text, text)
set search_path = pg_catalog;
