import ArrowUp from "./arrow-up.svg";
import BoardList from "./board-list.svg";
import BoardToggle from "./board-toggle.svg";
import Setting from './setting.svg';
import Share from './share.svg';

export const ICONS = {
  ArrowUp,
  BoardList,
  BoardToggle,
  Setting,
  Share
} as const;

export type IconName = keyof typeof ICONS;
