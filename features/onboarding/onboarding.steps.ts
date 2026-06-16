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

export type STEPS = (typeof steps)[number]["value"];

export const TOTAL_STEPS = steps.length;

export const STEP_INDEX = steps.reduce(
  (acc, step, index) => {
    acc[step.value] = index;
    return acc;
  },
  {} as Record<STEPS, number>,
);
