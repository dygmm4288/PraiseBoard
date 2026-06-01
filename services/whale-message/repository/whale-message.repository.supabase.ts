import { supabase } from "@/shared/lib/supabase";
import { Database } from "@/shared/types/supabase.types";
import {
  IWhaleMessageRepository,
  WhaleMessageLog,
  WhaleMessageLogChannel,
  WhaleMessageTrigger,
} from "../model/whale-message.interface";

type NotificationLogRow = Database["public"]["Tables"]["notification_logs"]["Row"];

const WHALE_MESSAGE_LOG_TYPE = "whale_message";

const toWhaleMessageLog = (row: NotificationLogRow): WhaleMessageLog => ({
  id: row.id,
  profileId: row.profile_id,
  channel: row.channel as WhaleMessageLogChannel,
  type: row.type,
  messageTrigger: row.message_trigger as WhaleMessageTrigger,
  messageBody: row.message_body,
  createdAt: row.created_at,
  sentAt: row.sent_at,
  openAt: row.open_at,
});

export const whaleMessageRepository: IWhaleMessageRepository = {
  async saveMessageLog(input) {
    const { data, error } = await supabase
      .from("notification_logs")
      .insert({
        profile_id: input.profileId,
        channel: input.channel,
        type: WHALE_MESSAGE_LOG_TYPE,
        message_trigger: input.messageTrigger,
        message_body: input.messageBody,
        created_at: input.createdAt,
      })
      .select()
      .single();

    if (error) throw error;

    return toWhaleMessageLog(data);
  },

  async getLatestMessage(profileId) {
    const { data, error } = await supabase
      .from("notification_logs")
      .select("*")
      .eq("profile_id", profileId)
      .eq("type", WHALE_MESSAGE_LOG_TYPE)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return toWhaleMessageLog(data);
  },

  async findRecentMessage(input) {
    const { data, error } = await supabase
      .from("notification_logs")
      .select("*")
      .eq("profile_id", input.profileId)
      .eq("channel", input.channel)
      .eq("type", WHALE_MESSAGE_LOG_TYPE)
      .eq("message_trigger", input.messageTrigger)
      .eq("message_body", input.messageBody)
      .gte("created_at", input.since)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return toWhaleMessageLog(data);
  },
};
