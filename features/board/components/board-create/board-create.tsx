import { AppButton, AppInput, AppText, SelectableOption } from "@/shared/ui";
import { View } from "react-native";

const targetCountOptions = ["28개", "50개", "100개"];
const dailyLimitOptions = ["1개", "2개", "3개", "4개", "5개"];

const BoardCreate = () => {
    
  return (
    <View className="flex-1 justify-between">
      <View className="gap-[30px]">
        <AppText variant="title3" className="text-gray-700">
          새로운 습관 만들기
        </AppText>

        <View className="flex-row gap-[30px]">
          <View className="min-w-0 flex-1 gap-[12px]">
            <AppText variant="caption1" className="text-gray-400">
              습관 이름
            </AppText>
            <AppInput
              placeholder="hint text"
              placeholderTextColor="#8E8E95"
              className="h-[38px] min-h-[38px] rounded-[10px] px-[12px] py-[6px]"
              inputClassName="text-[14px] leading-[20px] text-gray-400"
            />
          </View>

          <View className="w-[68px] gap-[12px]">
            <AppText variant="caption1" className="text-gray-400">
              이모티콘
            </AppText>
            <AppInput
              placeholder="emoji"
              placeholderTextColor="#8E8E95"
              className="h-[38px] min-h-[38px] rounded-[10px] px-[12px] py-[6px]"
              inputClassName="text-[14px] leading-[20px] text-gray-400"
            />
          </View>
        </View>

        <View className="gap-[12px]">
          <AppText variant="caption1" className="text-gray-400">
            목표 개수
          </AppText>
          <View className="flex-row items-center gap-[9px]">
            {targetCountOptions.map((label) => (
              <SelectableOption key={label} label={label} />
            ))}
          </View>
        </View>

        <View className="gap-[12px]">
          <AppText variant="caption1" className="text-gray-400">
            하루 최대
          </AppText>
          <View className="flex-row items-center gap-[9px]">
            {dailyLimitOptions.map((label) => (
              <SelectableOption key={label} label={label} />
            ))}
          </View>
        </View>

        <View className="gap-[12px]">
          <AppText variant="caption1" className="text-gray-400">
            보상 (선택)
          </AppText>
          <AppInput
            placeholder="hint text"
            placeholderTextColor="#8E8E95"
            className="h-[38px] min-h-[38px] rounded-[10px] px-[12px] py-[6px]"
            inputClassName="text-[14px] leading-[20px] text-gray-400"
          />
        </View>
      </View>

      <AppButton
        disabled
        fullWidth
        label="확인"
        variant="primary"
        className="opacity-100"
      />
    </View>
  );
};

export default BoardCreate;
