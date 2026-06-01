export type WhaleMessageTrigger =
  | "default_morning"
  | "default_afternoon"
  | "default_night"
  | "random_transition"
  | "inactive_3_days"
  | "sticker_first"
  | "sticker_acceleration"
  | "daily_limit_reached"
  | "evening_reminder"
  | "board_half"
  | "board_three_quarters"
  | "board_complete";

export type WhaleMessage = {
  trigger: WhaleMessageTrigger;
  body: string;
  pushEnabled: boolean;
};

export type WhaleMessageBoardInput = {
  id: string;
  targetCount: number;
  limitCount: number;
  currentCount: number;
  rewardMemo: string | null;
  status: string;
};

export type ResolveWhaleMessageInput = {
  nickname?: string | null;
  now?: Date;
  todayStickerCount: number;
  boards?: WhaleMessageBoardInput[];
  lastLoginAt?: string | null;
};

export type WhaleMessageLogChannel = "push" | "in_app";

export type WhaleMessageLog = {
  id: string;
  profileId: string;
  channel: WhaleMessageLogChannel;
  type: string;
  messageTrigger: WhaleMessageTrigger;
  messageBody: string | null;
  createdAt: string;
  sentAt: string | null;
  openAt: string | null;
};

export type SaveWhaleMessageLogInput = {
  profileId: string;
  channel: WhaleMessageLogChannel;
  messageTrigger: WhaleMessageTrigger;
  messageBody: string;
  createdAt?: string;
};

export type FindRecentWhaleMessageLogInput = {
  profileId: string;
  channel: WhaleMessageLogChannel;
  messageTrigger: WhaleMessageTrigger;
  messageBody: string;
  since: string;
};

export type HomeWhaleMessageInput = ResolveWhaleMessageInput & {
  profileId: string;
};

export type RecordPushWhaleMessageInput = {
  profileId: string;
  messageTrigger: WhaleMessageTrigger;
  messageBody: string;
};

export type WhaleMessageResult = {
  message: WhaleMessage;
  log: WhaleMessageLog | null;
};

export type IWhaleMessageRepository = {
  saveMessageLog: (
    input: SaveWhaleMessageLogInput,
  ) => Promise<WhaleMessageLog>;
  getLatestMessage: (profileId: string) => Promise<WhaleMessageLog | null>;
  findRecentMessage: (
    input: FindRecentWhaleMessageLogInput,
  ) => Promise<WhaleMessageLog | null>;
};

export type IWhaleMessageService = {
  onHomeEntered: (input: HomeWhaleMessageInput) => Promise<WhaleMessageResult>;
  onStickerCollected: (
    input: HomeWhaleMessageInput,
  ) => Promise<WhaleMessageResult>;
  onRandomTransition: (profileId: string) => Promise<WhaleMessageResult>;
  recordPushMessage: (
    input: RecordPushWhaleMessageInput,
  ) => Promise<WhaleMessageLog>;
  getLatestMessage: (profileId: string) => Promise<WhaleMessageLog | null>;
};
