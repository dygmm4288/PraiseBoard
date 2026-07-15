import { PALETTE } from "@/shared/theme";

export const BOARD_COLORS = {
  achievement: {
    DEFAULT: PALETTE.amber[500],
    surface: PALETTE.amber[150],
    soft: PALETTE.amber[100],
    card: PALETTE.amber[50],
    border: PALETTE.amber[300],
    text: PALETTE.amber[500],
    textMuted: PALETTE.amber[600],
    textStrong: PALETTE.amber[700],
  },
  whale: {
    gradientStart: PALETTE.purple[150],
    gradientEnd: PALETTE.purple[100],
    border: PALETTE.purple[150],
    label: PALETTE.purple[500],
    labelMuted: PALETTE.purple[250],
    timestamp: PALETTE.purple[400],
    text: PALETTE.purple[800],
    shadow: PALETTE.purple[800],
  },
} as const;
