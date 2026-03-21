import { IBoardRepository } from "./board.interface";
import { boardRepository as supabaseBoardRepository } from "./board.repository.supabase";

export const boardRepository: IBoardRepository = supabaseBoardRepository;
