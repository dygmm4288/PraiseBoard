import { BoardSetupFormValues } from "@/entities/board/board.schema";
import { FieldPath } from "react-hook-form";

export const steps = [
  { label: "intro", value: "intro" },
  { label: "name", value: "name" },
  { label: "title", value: "title" },
  { label: "limit", value: "limit" },
  { label: "reward", value: "reward" },
  { label: "notification", value: "notification" },
] as const;

export const STEP_FIELDS: Record<
  (typeof steps)[number]["value"],
  FieldPath<BoardSetupFormValues>[]
> = {
  intro: [],
  name: ["profiles.nickname"],
  title: ["boards.title"],
  limit: ["boards.target_count"],
  reward: ["boards.reward_memo"],
  notification: [],
};

export type STEPS = (typeof steps)[number]["value"];
