import { IAppSettingsService } from "../model/app-settings.interface";
import { appSettingsRepository } from "../repository/app-settings.repository";

export const appSettings: IAppSettingsService = {
  getAppSettings() {
    return appSettingsRepository.getAppSettings();
  },
};
