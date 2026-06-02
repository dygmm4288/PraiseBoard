import ArrowUp from "./arrow-up.svg";
import BoardList from "./board-list.svg";
import BoardToggle from "./board-toggle.svg";
import Check from "./check.svg";
import ChevronLeft from "./chevron-left.svg";
import ChevronRightSmall from "./chevron-right.svg";
import Close from "./close.svg";
import Edit from "./edit.svg";
import Chart from "./fnb/chart.svg";
import Folder from "./fnb/folder.svg";
import Home from "./fnb/home.svg";
import Setting from "./fnb/setting.svg";
import Share from "./share.svg";

export const ICONS = {
  ArrowUp,
  BoardList,
  BoardToggle,
  Check,
  Close,
  Setting,
  Share,
  ChevronLeft,
  ChevronRightSmall,
  Edit,
  Home,
  Folder,
  Chart,
} as const;

export type IconName = keyof typeof ICONS;
