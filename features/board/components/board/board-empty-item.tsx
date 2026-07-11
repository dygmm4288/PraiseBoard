import { AppText } from "@/shared/ui";
import { View } from "react-native";

const BoardEmptyItem = () => {
  return (
    <View className="flex-grow flex-col items-center justify-center gap-[30px]">
      <View className="flex-col items-center justify-center gap-[12px]">
        <AppText
          variant="custom"
          weight="bold"
          className="text-[36px] text-gray-500"
        >
          텅
        </AppText>
        <AppText
          variant="body14"
          weight="regular"
          className="text-center text-gray-500"
        >
          새로운 습관을 다시 시작해봐요!
        </AppText>
      </View>
    </View>
  );
};

export default BoardEmptyItem;
