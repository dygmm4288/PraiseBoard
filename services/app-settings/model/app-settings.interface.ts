import { Database } from "@/shared/types/supabase.types";

export type AppSettings =
  Database["public"]["Tables"]["app_settings"]["Row"];
