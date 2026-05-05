import { boardRepository as supabaseBoardRepository } from "./repository.supabase";
import { IBoardRepository } from "./types";

export const boardRepository: IBoardRepository = supabaseBoardRepository;
