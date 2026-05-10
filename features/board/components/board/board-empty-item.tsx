import { AppText } from "@/shared/ui";
import { Pressable, View } from "react-native";

type BoardEmptyItemProps = {
  onCreateBoardPress: () => void;
};

const BoardEmptyItem = ({ onCreateBoardPress }: BoardEmptyItemProps) => {
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
          variant="body3"
          weight="regular"
          className="text-center text-gray-500"
        >
          새로운 습관을 다시 시작해봐요!
        </AppText>
      </View>
      <Pressable
        className="rounded-[100px] bg-primary-500 px-[9px] py-[5px]"
        onPress={onCreateBoardPress}
      >
        <AppText variant="button2" weight="medium" className="text-white">
          + 새로운 습관 추가하기
        </AppText>
      </Pressable>
    </View>
  );
};

export default BoardEmptyItem;
