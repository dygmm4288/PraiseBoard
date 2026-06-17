import { COLOR } from "@/shared/constants/colors.constant";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onPress: () => void;
};

const FnbFloatingAction = ({ onPress }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityLabel="보드 추가"
      accessibilityRole="button"
      className="absolute right-[34px] h-[54px] w-[54px] items-center justify-center rounded-[50px] bg-primary-70"
      style={[styles.container, { bottom: insets.bottom + 97 }]}
      onPress={onPress}
    >
      <View className="absolute h-[2px] w-[24px] rounded-[1px] bg-white" />
      <View className="absolute h-[24px] w-[2px] rounded-[1px] bg-white" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 14,
    shadowColor: COLOR.primary[70],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 11,
  },
});

export default FnbFloatingAction;
