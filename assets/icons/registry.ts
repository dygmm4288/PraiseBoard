import ArrowUp from "./arrow-up.svg";

export const ICONS = {
  ArrowUp,
} as const;

export type IconName = keyof typeof ICONS;
