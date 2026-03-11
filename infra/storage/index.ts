import { asyncStorageImpl } from "./storage.impl.async-storage";
import { webStorageImpl } from "./storage.impl.web-storage";
import { IStorage } from "./storage.interface";

export const localStorage: IStorage =
  process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true"
    ? webStorageImpl
    : asyncStorageImpl;
