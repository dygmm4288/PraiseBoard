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
        "w-[40px] h-[40px] rounded-full",
        disabled
          ? "bg-gray-100 border border-gray-100"
          : "bg-primary-500 border border-primary-500",
      )}
      disabled={disabled}
      onPress={onPress}
    >
      <Icon name="ArrowUp" size={24} />
    </Pressable>
  );
};

export default ChatSend;
