import { asyncStorageImpl } from "./storage.impl.async-storage";
import { IStorage } from "./storage.interface";

export const localStorage: IStorage = asyncStorageImpl;
