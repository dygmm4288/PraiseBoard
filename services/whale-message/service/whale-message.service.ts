import {
  HomeWhaleMessageInput,
  IWhaleMessageService,
  WhaleMessage,
  WhaleMessageResult,
} from "../model/whale-message.interface";
import {
  resolveRandomTransitionWhaleMessage,
  resolveWhaleMessage,
} from "../policies/whale-message.policy";
import { whaleMessageRepository } from "../repository/whale-message.repository";

const getLocalDayStartIso = (now = new Date()) => {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
};

const saveInAppMessageOncePerDay = async (
  profileId: string,
  message: WhaleMessage,
): Promise<WhaleMessageResult> => {
  const recentLog = await whaleMessageRepository.findRecentMessage({
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

  const log = await whaleMessageRepository.saveMessageLog({
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

export const whaleMessageService: IWhaleMessageService = {
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

  recordPushMessage(input) {
    return whaleMessageRepository.saveMessageLog({
      profileId: input.profileId,
      channel: "push",
      messageTrigger: input.messageTrigger,
      messageBody: input.messageBody,
    });
  },

  getLatestMessage(profileId: string) {
    return whaleMessageRepository.getLatestMessage(profileId);
  },
};
