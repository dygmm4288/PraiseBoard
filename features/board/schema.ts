import { KOR_ENG_SYMBOL_SPACE_REGEX } from "@/shared/utils/regex";
import { z } from "zod";

export const NICKNAME_MAX_LENGTH = 15;
export const TITLE_MAX_LENGTH = 15;
export const REWARD_MEMO_LENGTH = 20;

const emojiSchema = z
  .string()
  .min(1, "대표 이모지를 선택해 주세요.")
  .refine((value) => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    const matches = trimmed.match(/\p{Extended_Pictographic}/gu);
    return matches?.length === 1;
  }, "하나의 이모지만 선택해 주세요.");

const titleSchema = z
  .string()
  .trim()
  .min(1, "보드 제목을 입력해 주세요.")
  .max(TITLE_MAX_LENGTH, "보드 제목은 15자까지 입력할 수 있어요.");

const rewardMemoSchema = z
  .string()
  .trim()
  .max(REWARD_MEMO_LENGTH, "보상은 20자까지 입력할 수 있어요.")
  .nullable();

export const boardSetupDraftSchema = z.object({
  boards: z.object({
    title: titleSchema,
    target_count: z
      .string()
      .trim()
      .min(1, "목표 개수를 입력해 주세요.")
      .refine(
        (value) => /^\d+$/.test(value),
        "목표 개수는 숫자만 입력할 수 있어요.",
      )
      .refine((value) => Number(value) > 0, "목표 개수는 1 이상이어야 해요.")
      .refine((value) => [30, 50, 100].includes(Number(value))),
    reward_memo: rewardMemoSchema,
    emoji: emojiSchema,
  }),
  profiles: z.object({
    nickname: z
      .string()
      .trim()
      .min(1, "이름은 최소 1자이상 입력해 주세요")
      .max(NICKNAME_MAX_LENGTH, "이름은 15자까지 입력할 수 있어요.")
      .regex(
        KOR_ENG_SYMBOL_SPACE_REGEX,
        "닉네임은 한글/영문/특수문자/공백만 입력할 수 있어요.",
      ),
  }),
});

export const boardCreateDraftSchema = z.object({
  title: titleSchema,
  emoji: emojiSchema,
  targetCount: z
    .number()
    .int("목표 개수는 정수만 입력할 수 있어요.")
    .refine(
      (value) => [30, 50, 100].includes(value),
      "목표 개수를 선택해 주세요",
    ),
  rewardMemo: z
    .string()
    .trim()
    .max(REWARD_MEMO_LENGTH, "보상은 20자까지 입력할 수 있어요.")
    .optional()
    .nullable(),
  limitCount: z
    .number()
    .int("하루 최대 개수는 정수만 입력할 수 있어요.")
    .min(1, "하루 최대 개수는 1 이상이어야 해요.")
    .max(5, "하루 최대 개수는 5개까지 입력할 수 있어요."),
});

export const normalizeBoardSetupPayload = (
  values: BoardSetupFormValues,
): BoardSetupPayload | null => {
  const parsed = boardSetupDraftSchema.safeParse(values);

  if (!parsed.success) return null;

  const { boards, profiles } = parsed.data;

  return {
    boards: {
      title: boards.title,
      emoji: boards.emoji,
      target_count: Number(boards.target_count),
      reward_memo: boards.reward_memo ? boards.reward_memo : null,
      limit_count: 10,
    },
    profiles: {
      nickname: profiles.nickname ? profiles.nickname : null,
    },
  };
};

export const normalizeBoardCreatePayload = (
  values: BoardCreateFormValues,
  profileId: string,
): BoardCreatePayload => {
  const parsed = boardCreateDraftSchema.parse(values);

  return {
    title: parsed.title,
    emoji: parsed.emoji,
    targetCount: parsed.targetCount,
    rewardMemo: parsed.rewardMemo ? parsed.rewardMemo : null,
    limitCount: parsed.limitCount,
    profileId,
  };
};

export type BoardSetupFormValues = z.input<typeof boardSetupDraftSchema>;
export type BoardCreateFormValues = z.input<typeof boardCreateDraftSchema>;

export type BoardSetupPayload = {
  boards: {
    title: string;
    emoji: string;
    target_count: number;
    reward_memo: string | null;
    limit_count: number;
  };
  profiles: {
    nickname: string | null;
  };
};

export type BoardCreatePayload = {
  title: string;
  emoji: string;
  targetCount: number;
  rewardMemo: string | null | undefined;
  limitCount: number;
  profileId: string;
};

export const BOARD_SETUP_DEFAULT_VALUES: BoardSetupFormValues = {
  boards: {
    title: "",
    target_count: "",
    reward_memo: "",
    emoji: "🐋",
  },
  profiles: {
    nickname: "",
  },
};

export const BOARD_CREATE_DEFAULT_VALUES: BoardCreateFormValues = {
  title: "",
  emoji: "🐋",
  targetCount: 30,
  rewardMemo: "",
  limitCount: 1,
};
