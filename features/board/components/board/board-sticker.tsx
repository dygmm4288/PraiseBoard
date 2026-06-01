import { cn } from "@/shared/utils/cn";
import { View } from "react-native";

type BoardStickerProps = {
  filled?: boolean;
  className?: string;
};

const BoardSticker = ({ filled = false, className }: BoardStickerProps) => {
  return (
    <View
      className={cn(
        "h-[26px] w-[26px] rounded-full",
        filled ? "bg-primary-300" : "bg-surface-disabled",
        className,
      )}
    />
  );
};

export default BoardSticker;
