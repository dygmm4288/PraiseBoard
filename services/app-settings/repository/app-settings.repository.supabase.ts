import { supabase } from "@/shared/lib/supabase";
import { IAppSettingsRepository } from "../model/app-settings.interface";

export const appSettingsRepository: IAppSettingsRepository = {
  async getAppSettings() {
    const { data, error } = await supabase
      .from("app_settings")
      .select(
        "id, latest_version, min_version, maintenance, maintenance_message, created_at, updated_at",
      )
      .eq("id", 1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
