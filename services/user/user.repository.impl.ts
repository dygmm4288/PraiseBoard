import { IUserRepository } from "./user.interface";
import { userRepository as supabaseUserRepository } from "./user.repository.supabase";
export const userRepository: IUserRepository = supabaseUserRepository;
