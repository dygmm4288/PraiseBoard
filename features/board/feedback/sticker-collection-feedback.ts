import * as Haptics from "expo-haptics";

export const playStickerCollectionFeedback = () => {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};
