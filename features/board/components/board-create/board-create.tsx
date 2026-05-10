import { AppButton, AppInput, AppText, SelectableOption } from "@/shared/ui";
import { View } from "react-native";
import { useCreateBoard } from "../../hooks/use-create-board";

const targetCountOptions = [
  { label: "28개", value: 28 },
  { label: "50개", value: 50 },
  { label: "100개", value: 100 },
];
const dailyLimitOptions = [
  { label: "1개", value: 1 },
  { label: "2개", value: 2 },
  { label: "3개", value: 3 },
  { label: "4개", value: 4 },
  { label: "5개", value: 5 },
];

type BoardCreateProps = {
  onCreated?: () => void;
};

const BoardCreate = ({ onCreated }: BoardCreateProps) => {
  const { changeFormData, createBoard, formData } = useCreateBoard();

  const handleCreateBoard = () => {
    createBoard()?.then(() => {
      onCreated?.();
    });
  };

  return (
    <View className="flex-1 justify-between gap-[28px]">
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
              value={formData.title}
              onChangeText={changeFormData("title")}
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
              value={formData.emoji}
              onChangeText={changeFormData("emoji")}
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
            {targetCountOptions.map(({ label, value }) => (
              <SelectableOption
                key={label}
                label={label}
                value={value}
                selected={value === formData["targetCount"]}
                onSelect={changeFormData("targetCount")}
              />
            ))}
          </View>
        </View>

        <View className="gap-[12px]">
          <AppText variant="caption1" className="text-gray-400">
            하루 최대
          </AppText>
          <View className="flex-row items-center gap-[9px]">
            {dailyLimitOptions.map(({ label, value }) => (
              <SelectableOption
                key={label}
                label={label}
                value={value}
                selected={value === formData["limitCount"]}
                onSelect={changeFormData("limitCount")}
              />
            ))}
          </View>
        </View>

        <View className="gap-[12px]">
          <AppText variant="caption1" className="text-gray-400">
            보상 (선택)
          </AppText>
          <AppInput
            value={formData.rewardMemo ?? ""}
            onChangeText={changeFormData("rewardMemo")}
            placeholder="hint text"
            placeholderTextColor="#8E8E95"
            className="h-[38px] min-h-[38px] rounded-[10px] px-[12px] py-[6px]"
            inputClassName="text-[14px] leading-[20px] text-gray-400"
          />
        </View>
      </View>

      <AppButton
        fullWidth
        label="확인"
        variant="primary"
        className="opacity-100"
        onPress={handleCreateBoard}
      />
    </View>
  );
};

export default BoardCreate;
