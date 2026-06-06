import { AppButton, AppInput, AppText } from "@/shared/ui";
import { View } from "react-native";

const BoardEditContent = () => {
  return (
    <View className="flex flex-1 flex-col justify-between">
      <View className="flex flex-col gap-[30px]">
        <AppText variant="title3" className="text-gray-700">
          유리병 수정하기
        </AppText>

        <View className="flex flex-col gap-[10px]">
          <AppText variant="caption1" className="text-gray-400">
            유리병 이름
          </AppText>
          <AppInput placeholder="보드제목" />
        </View>
        <View className="flex flex-col gap-[10px]">
          <AppText variant="caption1" className="text-gray-400">
            구슬 개수
          </AppText>
        </View>
        <View className="flex flex-col gap-[10px]">
          <AppText variant="caption1" className="text-gray-400">
            보상 (선택)
          </AppText>
          <AppInput placeholder="나에게 어떤 선물을 주고 싶나요?" />
        </View>
      </View>
      <AppButton variant="primary">확인</AppButton>
    </View>
  );
};

export default BoardEditContent;
