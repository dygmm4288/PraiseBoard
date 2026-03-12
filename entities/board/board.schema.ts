import { z } from "zod";

export const NICKNAME_MAX_LENGTH = 15;

const targetCountSchema = z
  .string()
  .trim()
  .min(1, "목표 개수를 입력해 주세요.")
  .refine(
    (value) => /^\d+$/.test(value),
    "목표 개수는 숫자만 입력할 수 있어요.",
  )
  .refine((value) => Number(value) > 0, "목표 개수는 1 이상이어야 해요.")
  .refine((value) => [10, 30, 50].includes(Number(value)));

export const boardSetupDraftSchema = z.object({
  boards: z.object({
    title: z.string().trim().min(1, "보드 제목을 입력해 주세요."),
    target_count: targetCountSchema,
    reward_memo: z
      .string()
      .trim()
      .max(200, "보상 메모는 200자 이하로 입력해 주세요."),
  }),
  profiles: z.object({
    nickname: z
      .string()
      .trim()
      .max(
        NICKNAME_MAX_LENGTH,
        `닉네임은 ${NICKNAME_MAX_LENGTH}자 이하로 입력해 주세요.`,
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
      target_count: Number(boards.target_count),
      reward_memo: boards.reward_memo ? boards.reward_memo : null,
    },
    profiles: {
      nickname: profiles.nickname ? profiles.nickname : null,
    },
  };
};

export type BoardSetupFormValues = z.input<typeof boardSetupDraftSchema>;

export type BoardSetupPayload = {
  boards: {
    title: string;
    target_count: number;
    reward_memo: string | null;
  };
  profiles: {
    nickname: string | null;
  };
};

export const BOARD_SETUP_DEFAULT_VALUES: BoardSetupFormValues = {
  boards: {
    title: "",
    target_count: "",
    reward_memo: "",
  },
  profiles: {
    nickname: "",
  },
};
