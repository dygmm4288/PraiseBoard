import ArrowUp from "./arrow-up.svg";
import BoardList from "./board-list.svg";
import BoardToggle from "./board-toggle.svg";
import ChevronLeft from "./chevron-left.svg";
import ChevronRightSmall from "./chevron-right.svg";
import Setting from "./setting.svg";
import Share from "./share.svg";

export const ICONS = {
  ArrowUp,
  BoardList,
  BoardToggle,
  Setting,
  Share,
  ChevronLeft,
  ChevronRightSmall,
} as const;

export type IconName = keyof typeof ICONS;
