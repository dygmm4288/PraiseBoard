import { COLOR } from "@/shared/constants/colors.constant";
import { useMemo } from "react";
import { TextInput, View } from "react-native";
import ChatSend from "./chat-send";

type Props = {
  value?: string;
  onChangeText?: (value: string) => void;
  onSend?: () => void;
  placeholder?: string;
  disabled?: boolean;
};

const ChatInput = ({
  value = "",
  onChangeText = () => {},
  onSend = () => {},
  placeholder = "",
  disabled = false,
}: Props) => {
  const sendDisabled = useMemo(() => value.length === 0, [value]);

  return (
    <View className="items-center bg-white py-[18px]">
      <View className="h-[42px] w-full flex-row items-center justify-between rounded-[20px] border border-[#EFF1F5] bg-white pl-[15px] pr-[4px]">
        <TextInput
          className="h-full flex-1 pr-[8px] font-pretendard text-[14px] leading-[20px] text-gray-900"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLOR.labelGray}
          editable={!disabled}
        />
        <ChatSend onPress={onSend} disabled={disabled || sendDisabled} />
      </View>
    </View>
  );
};

export default ChatInput;
