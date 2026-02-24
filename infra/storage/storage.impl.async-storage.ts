import AsyncStorage from "@react-native-async-storage/async-storage";
import { IStorage } from "./storage.interface";

export const asyncStorageImpl: IStorage = {
  async getItem(key) {
    return await AsyncStorage.getItem(key);
  },
  async setItem(key, value) {
    return await AsyncStorage.setItem(key, value);
  },
  async removeItem(key) {
    return await AsyncStorage.removeItem(key);
  },
};
