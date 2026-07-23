import {
  HomeWhaleMessageInput,
  RecordPushWhaleMessageInput,
  WhaleMessage,
  WhaleMessageResult,
} from "../model/whale-message.interface";
import {
  resolveRandomTransitionWhaleMessage,
  resolveWhaleMessage,
} from "../policies/whale-message.policy";
import { whaleMessageApi } from "../whale-message.api";

const getLocalDayStartIso = (now = new Date()) => {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
};

const saveInAppMessageOncePerDay = async (
  profileId: string,
  message: WhaleMessage,
): Promise<WhaleMessageResult> => {
  const recentLog = await whaleMessageApi.findRecentMessage({
    profileId,
    channel: "in_app",
    messageTrigger: message.trigger,
    messageBody: message.body,
    since: getLocalDayStartIso(),
  });

  if (recentLog) {
    return {
      message,
      log: recentLog,
    };
  }

  const log = await whaleMessageApi.saveMessageLog({
    profileId,
    channel: "in_app",
    messageTrigger: message.trigger,
    messageBody: message.body,
  });

  return {
    message,
    log,
  };
};

export const whaleMessageService = {
  onHomeEntered(input: HomeWhaleMessageInput) {
    const message = resolveWhaleMessage(input);
    return saveInAppMessageOncePerDay(input.profileId, message);
  },

  onStickerCollected(input: HomeWhaleMessageInput) {
    const message = resolveWhaleMessage(input);
    return saveInAppMessageOncePerDay(input.profileId, message);
  },

  onRandomTransition(profileId: string) {
    const message = resolveRandomTransitionWhaleMessage();
    return saveInAppMessageOncePerDay(profileId, message);
  },

  recordPushMessage(input: RecordPushWhaleMessageInput) {
    return whaleMessageApi.saveMessageLog({
      profileId: input.profileId,
      channel: "push",
      messageTrigger: input.messageTrigger,
      messageBody: input.messageBody,
    });
  },

  getLatestMessage(profileId: string) {
    return whaleMessageApi.getLatestMessage(profileId);
  },
};
