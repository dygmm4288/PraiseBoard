import { IWhaleMessageRepository } from "../model/whale-message.interface";
import { whaleMessageRepository as whaleMessageRepositorySupabase } from "./whale-message.repository.supabase";

export const whaleMessageRepository: IWhaleMessageRepository =
  whaleMessageRepositorySupabase;
