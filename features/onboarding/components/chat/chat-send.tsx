import { Icon } from "@/assets/icons";
import { cn } from "@/shared/utils/cn";
import { Pressable } from "react-native";

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

const ChatSend = ({ onPress, disabled = false }: Props) => {
  return (
    <Pressable
      className={cn(
        "h-[33px] w-[33px] items-center justify-center rounded-full",
        disabled
          ? "bg-gray-200 border border-gray-200"
          : "bg-primary-500 border border-primary-500",
      )}
      disabled={disabled}
      onPress={onPress}
    >
      <Icon name="ArrowUp" size={18} />
    </Pressable>
  );
};

export default ChatSend;
