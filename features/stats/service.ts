import { statsRepository } from "./repository";
import { IStatsService } from "./types";

export const stats: IStatsService = {
  getMonth(payload) {
    return statsRepository.getMonth(payload);
  },
};
