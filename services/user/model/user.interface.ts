import { Database } from "@/shared/types/supabase.types";

export type AuthState = "public" | "anonymous" | "member";

export type CurrentAuthUser = {
  authUserId: string | null;
  authState: AuthState;
};

export type UpdateProfileInput = {
  nickname?: string | null;
  reminderHour?: number;
  reminderMinute?: number;
  reminderTimes?: { hour: number; minute: number }[];
  timezone?: string;
};

export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
