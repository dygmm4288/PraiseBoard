import { BoardSetupFormValues } from "@/features/board/schema";
import { FieldPath } from "react-hook-form";

export const steps = [
  { label: "name", value: "name" },
  { label: "title", value: "title" },
  { label: "limit", value: "limit" },
  { label: "limitCount", value: "limitCount" },
  { label: "reward", value: "reward" },
  { label: "notification", value: "notification" },
] as const;

export const STEP_FIELDS: Record<
  (typeof steps)[number]["value"],
  FieldPath<BoardSetupFormValues>[]
> = {
  name: ["profiles.nickname"],
  title: ["boards.title"],
  limit: ["boards.target_count"],
  limitCount: ["boards.limit_count"],
  reward: ["boards.reward_memo"],
  notification: [],
};

export const STEP_LABEL = {
  name: "이름 설정",
  title: "습관 설정",
  limit: "목표 개수 설정",
  reward: "보상 설정",
  notification: "알림 설정",
  limitCount: "하루 최대 개수 설정",
} as Record<STEPS, string>;

export const STEP_CNT_LABEL = {
  name: "STEP 1 / 6",
  title: "STEP 2 / 6",
  limit: "STEP 3 / 6",
  limitCount: "STEP 4 / 6",
  reward: "STEP 5 / 6",
  notification: "STEP 6 / 6",
} as Record<STEPS, string>;
export type STEPS = (typeof steps)[number]["value"];

export const TOTAL_STEPS = steps.length;

export const STEP_INDEX = steps.reduce(
  (acc, step, index) => {
    acc[step.value] = index;
    return acc;
  },
  {} as Record<STEPS, number>,
);
