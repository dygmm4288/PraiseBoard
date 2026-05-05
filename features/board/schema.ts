import { KOR_ENG_SYMBOL_SPACE_REGEX } from "@/shared/utils/regex";
import { z } from "zod";

export const NICKNAME_MAX_LENGTH = 15;
export const TITLE_MAX_LENGTH = 15;
export const REWARD_MEMO_LENGTH = 20;

export const boardSetupDraftSchema = z.object({
  boards: z.object({
    title: z
      .string()
      .trim()
      .min(1, "보드 제목을 입력해 주세요.")
      .max(TITLE_MAX_LENGTH, "보드 제목은 15자까지 입력할 수 있어요."),
    target_count: z
      .string()
      .trim()
      .min(1, "목표 개수를 입력해 주세요.")
      .refine(
        (value) => /^\d+$/.test(value),
        "목표 개수는 숫자만 입력할 수 있어요.",
      )
      .refine((value) => Number(value) > 0, "목표 개수는 1 이상이어야 해요.")
      .refine((value) => [10, 30, 50].includes(Number(value))),
    reward_memo: z
      .string()
      .trim()
      .max(REWARD_MEMO_LENGTH, "보상은 20자까지 입력할 수 있어요.")
      .nullable(),
    emoji: z
      .string()
      .min(1, "대표 이모지를 선택해 주세요.")
      .refine((value) => {
        const segments = [
          ...new Intl.Segmenter("ko", { granularity: "grapheme" }).segment(
            value,
          ),
        ];
        return (
          segments.length === 1 &&
          /\p{Extended_Pictographic}/u.test(segments[0].segment)
        );
      }, "하나의 이모지만 선택해 주세요."),
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

export const normalizePayload = (
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

export type BoardSetupFormValues = z.input<typeof boardSetupDraftSchema>;
export type BoardCreateFormValues = BoardSetupFormValues;

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
  rewardMemo: string | null;
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
