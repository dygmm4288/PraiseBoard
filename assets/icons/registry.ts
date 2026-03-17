import ArrowUp from "./arrow-up.svg";
import BoardList from "./board-list.svg";
import BoardToggle from "./board-toggle.svg";

export const ICONS = {
  ArrowUp,
  BoardList,
  BoardToggle,
} as const;

export type IconName = keyof typeof ICONS;
