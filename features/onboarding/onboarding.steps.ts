import { BoardSetupFormValues } from "@/shared/schemas/board.schema";
import { FieldPath } from "react-hook-form";

export const steps = [
  { label: "intro", value: "intro0" },
  { label: "intro1", value: "intro1" },
  { label: "name", value: "name" },
  { label: "title", value: "title" },
  { label: "limit", value: "limit" },
  { label: "reward", value: "reward" },
] as const;

export const STEP_FIELDS: Record<
  (typeof steps)[number]["value"],
  FieldPath<BoardSetupFormValues>[]
> = {
  intro0: [],
  intro1: [],
  name: ["profiles.nickname"],
  title: ["boards.title"],
  limit: ["boards.target_count"],
  reward: ["boards.reward_memo"],
};
