import {
  ResolveWhaleMessageInput,
  WhaleMessage,
  WhaleMessageBoardInput,
} from "../model/whale-message.interface";

const FALLBACK_NICKNAME = "고래친구";
const RANDOM_TRANSITION_MESSAGES = [
  "완벽하지 않아도 괜찮아. 중요한 건 멈추지 않는 마음인 거 알지?",
  "앗, 혹시 손가락이 근질근질하지 않아? 얼른 스티커 붙여달라고 난리네! 😂",
  "한 달 뒤의 너를 떠올려봐. 지금 이 스티커 한 장이 널 바꿔놓을 거야!",
  "거창한 건 필요 없어. 지금 당장 할 수 있는 아주 작은 것부터 시작해볼까?",
] as const;

export const resolveWhaleMessage = ({
  nickname,
  now = new Date(),
  todayStickerCount,
  boards = [],
  lastLoginAt,
}: ResolveWhaleMessageInput): WhaleMessage => {
  const displayName = nickname?.trim() || FALLBACK_NICKNAME;
  const boardMilestoneMessage = resolveBoardMilestoneMessage(
    boards,
    displayName,
  );

  if (boardMilestoneMessage) return boardMilestoneMessage;

  if (boards.length > 0 && todayStickerCount >= getDailyLimit(boards)) {
    return {
      trigger: "daily_limit_reached",
      body: "우와 대단해 ! 오늘의 목표를 다 채웠어. 내일 다시 도전해보자 ~",
      pushEnabled: false,
    };
  }

  if (todayStickerCount >= 2) {
    return {
      trigger: "sticker_acceleration",
      body: `벌써 ${todayStickerCount}번이나?\n기세가 대단한 하루인 걸~`,
      pushEnabled: false,
    };
  }

  if (todayStickerCount === 1) {
    return {
      trigger: "sticker_first",
      body: "푸우 ~ 첫번째 스티커를 모았어!\n작은 시작이 오늘의 너를 지켜줄거야.",
      pushEnabled: false,
    };
  }

  if (isInactiveForThreeDays(lastLoginAt, now)) {
    return {
      trigger: "inactive_3_days",
      body: "안녕! 다시 가볍게 시작해볼까?\n오늘은 딱 하나만 챙겨보자",
      pushEnabled: true,
    };
  }

  if (isEveningReminderTime(now)) {
    return {
      trigger: "evening_reminder",
      body: "오늘 하루도 얼마 남지 않았어요. 1분만 투자해서 습관을 지켜볼까요?",
      pushEnabled: true,
    };
  }

  return resolveDefaultEntryMessage(now, displayName);
};

const resolveDefaultEntryMessage = (
  now: Date,
  displayName: string,
): WhaleMessage => {
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return {
      trigger: "default_morning",
      body: `안녕! ${displayName}\n오늘 한 번 힘차게 시작해볼까?`,
      pushEnabled: true,
    };
  }

  if (hour >= 12 && hour < 20) {
    return {
      trigger: "default_afternoon",
      body: `안녕 ${displayName}!\n잠깐 고개를 들고 바람을 쐬어볼까?`,
      pushEnabled: true,
    };
  }

  return {
    trigger: "default_night",
    body: `${displayName} 오늘 하루는 어땠어?\n버텨내느라 고생 많았어!`,
    pushEnabled: true,
  };
};

const resolveBoardMilestoneMessage = (
  boards: WhaleMessageBoardInput[],
  displayName: string,
): WhaleMessage | null => {
  const milestoneBoard = boards
    .map((board) => ({
      board,
      progressPercent: getProgressPercent(board.targetCount, board.currentCount),
    }))
    .sort((a, b) => b.progressPercent - a.progressPercent)[0];

  if (!milestoneBoard) return null;

  const { board, progressPercent } = milestoneBoard;
  const reward = board.rewardMemo || "보상";

  if (progressPercent >= 100 || board.status === "completed") {
    return {
      trigger: "board_complete",
      body: `우와 ${displayName} 축하해 ! 드디어 다 모았어!\n성실히 완주한 너가 너무 자랑스러워\n완료 습관은 보관함에서 볼 수 있어 🏆`,
      pushEnabled: false,
    };
  }

  if (progressPercent >= 75) {
    return {
      trigger: "board_three_quarters",
      body: `거의 다 채웠어! ${reward}이 널 기다리고 있어. 곁에서 끝까지 응원할게`,
      pushEnabled: false,
    };
  }

  if (progressPercent >= 50) {
    return {
      trigger: "board_half",
      body: "절반이나 채웠어! 네 속도는 지금 딱 좋아.\n조급해하지 말고 우리 끝까지 가보자.",
      pushEnabled: false,
    };
  }

  return null;
};

export const resolveRandomTransitionWhaleMessage = (): WhaleMessage => {
  const index = Math.floor(Math.random() * RANDOM_TRANSITION_MESSAGES.length);

  return {
    trigger: "random_transition",
    body: RANDOM_TRANSITION_MESSAGES[index],
    pushEnabled: false,
  };
};

const getDailyLimit = (boards: WhaleMessageBoardInput[]) => {
  const limits = boards
    .map((board) => board.limitCount)
    .filter((limit) => limit > 0);

  return Math.max(1, ...limits);
};

const isEveningReminderTime = (now: Date) => now.getHours() === 21;

const isInactiveForThreeDays = (
  lastLoginAt: string | null | undefined,
  now: Date,
) => {
  if (!lastLoginAt) return false;

  const lastLoginDate = new Date(lastLoginAt);
  if (Number.isNaN(lastLoginDate.getTime())) return false;

  const inactiveMs = now.getTime() - lastLoginDate.getTime();

  return inactiveMs >= 1000 * 60 * 60 * 24 * 3;
};

const getProgressPercent = (totalCount: number, completedCount: number) => {
  const safeTotalCount = Math.max(0, Math.trunc(totalCount));
  const safeCompletedCount = Math.min(
    Math.max(0, Math.trunc(completedCount)),
    safeTotalCount,
  );

  return safeTotalCount === 0
    ? 0
    : Math.round((safeCompletedCount / safeTotalCount) * 100);
};
