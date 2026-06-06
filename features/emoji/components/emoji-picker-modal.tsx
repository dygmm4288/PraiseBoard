import { cn } from "@/shared/utils/cn";
import { Modal, Pressable, View } from "react-native";
import { EmojiOption } from "../model/emoji-options";
import { AppText } from "@/shared/ui";

type EmojiPickerModalProps = {
  visible: boolean;
  title?: string;
  selectedEmoji?: string;
  options: EmojiOption[];
  onSelect: (emoji: string) => void;
  onClose: () => void;
};

const EmojiPickerModal = ({
  visible,
  title = "이모지 선택",
  selectedEmoji,
  options,
  onSelect,
  onClose,
}: EmojiPickerModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/30 px-[28px]">
        <View className="w-full max-w-[336px] gap-[18px] rounded-[18px] bg-white p-[20px]">
          <View className="flex-row items-center justify-between">
            <AppText
              variant="custom"
              weight="bold"
              className="text-[17px] leading-[25px] text-black"
            >
              {title}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="이모지 선택 닫기"
              hitSlop={8}
              onPress={onClose}
            >
              <AppText
                variant="custom"
                weight="medium"
                className="text-[14px] leading-[22px] text-labelGray"
              >
                닫기
              </AppText>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap gap-[8px]">
            {options.map((option) => {
              const selected = option.emoji === selectedEmoji;

              return (
                <Pressable
                  key={`${option.emoji}-${option.label}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${option.label} 이모지 선택`}
                  accessibilityState={{ selected }}
                  className={cn(
                    "h-[48px] w-[48px] items-center justify-center rounded-[12px] border border-bgLightGray bg-white",
                    selected && "border-primary-50 bg-primary-10",
                  )}
                  onPress={() => onSelect(option.emoji)}
                >
                  <AppText
                    variant="custom"
                    className="text-center text-[24px] leading-[30px]"
                  >
                    {option.emoji}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EmojiPickerModal;

