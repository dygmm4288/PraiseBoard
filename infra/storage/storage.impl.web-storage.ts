import { IStorage } from "./storage.interface";

export const webStorageImpl: IStorage = {
  async getItem(key) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },
  async setItem(key, value) {
    if (typeof window === "undefined") return;
    return window.localStorage.setItem(key, value);
  },
  async removeItem(key) {
    if (typeof window === "undefined") return;
    return window.localStorage.removeItem(key);
  },
};
