import { INotificationRepository } from "../model/notification.interface";
import { notificationRepository as notificationRepositorySupabase } from "./notification.repository.supabase";

export const notificationRepository: INotificationRepository =
  notificationRepositorySupabase;
