export type EmojiOption = {
  emoji: string;
  label: string;
};

export const DEFAULT_BOARD_EMOJI_OPTIONS = [
  { emoji: "🐋", label: "고래" },
  { emoji: "🌱", label: "새싹" },
  { emoji: "🥛", label: "물 한 잔" },
  { emoji: "📖", label: "독서" },
  { emoji: "🎸", label: "악기" },
  { emoji: "🪴", label: "화분" },
  { emoji: "💼", label: "업무" },
  { emoji: "🌟", label: "별" },
  { emoji: "🔥", label: "불꽃" },
  { emoji: "💯", label: "백점" },
  { emoji: "🍗", label: "치킨" },
  { emoji: "📚", label: "책" },
] satisfies EmojiOption[];

