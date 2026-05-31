import { IAppSettingsRepository } from "../model/app-settings.interface";
import { appSettingsRepository as supabaseAppSettingsRepository } from "./app-settings.repository.supabase";

export const appSettingsRepository: IAppSettingsRepository =
  supabaseAppSettingsRepository;
