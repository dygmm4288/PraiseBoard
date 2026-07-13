import { asyncStorageImpl } from "./storage.impl.async-storage";
import { webStorageImpl } from "./storage.impl.web-storage";
import { IStorage } from "./storage.interface";
import { isStorybookEnabled } from "@/shared/constants/environment";

export const localStorage: IStorage =
  isStorybookEnabled ? webStorageImpl : asyncStorageImpl;
