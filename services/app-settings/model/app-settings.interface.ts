import { Database } from "@/shared/types/supabase.types";

export type AppSettings =
  Database["public"]["Tables"]["app_settings"]["Row"];

export interface IAppSettingsRepository {
  getAppSettings(): Promise<AppSettings | null>;
}

export interface IAppSettingsService {
  getAppSettings(): Promise<AppSettings | null>;
}
