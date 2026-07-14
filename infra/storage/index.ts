import { Platform } from "react-native";
import { asyncStorageImpl } from "./storage.impl.async-storage";
import { webStorageImpl } from "./storage.impl.web-storage";
import { IStorage } from "./storage.interface";

export const localStorage: IStorage =
  Platform.OS === "web" ? webStorageImpl : asyncStorageImpl;
