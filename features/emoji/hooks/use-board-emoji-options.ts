import { DEFAULT_BOARD_EMOJI_OPTIONS } from "../model/emoji-options";

export const useBoardEmojiOptions = () => {
  // TODO: Replace this with a user-specific emoji source when the product
  // policy for per-user emoji availability is finalized.
  return DEFAULT_BOARD_EMOJI_OPTIONS;
};

