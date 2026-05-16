import { IUserRepository } from "../model/user.interface";
import { userRepository as supabaseUserRepository } from "./user.repository.supabase";
export const userRepository: IUserRepository = supabaseUserRepository;
