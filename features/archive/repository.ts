import { archiveRepository as supabaseArchiveRepository } from "./repository.supabase";
import { IArchiveRepository } from "./types";

export const archiveRepository: IArchiveRepository = supabaseArchiveRepository;
