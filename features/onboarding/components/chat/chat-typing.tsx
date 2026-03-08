import { cn } from "@/shared/utils/cn";
import { useEffect, useState } from "react";
import { View } from "react-native";

type Props = {
  totalDots?: number;
};

const ChatTyping = ({ totalDots = 3 }: Props) => {
  const [curIndex, setCurIndex] = useState(0);

  useEffect(() => {
    let interval: number | null = null;

    const run = () => {
      if (interval) return;

      interval = setInterval(() => {
        setCurIndex((prev) => (prev + 1) % totalDots);
      }, 200);
    };

    run();

    return () => {
      interval = null;
    };
  });

  return (
    <View className="flex-row items-center gap-[6px] min-h-[24px] max-h-[24px]">
      {Array.from({ length: totalDots }, (_, i) => (
        <View
          key={`chat-typing-dot-${i}`}
          className={cn(
            "w-[6px] h-[6px] rounded-full transition-all",
            curIndex === i ? "bg-gray-500" : "bg-gray-300",
          )}
        />
      ))}
    </View>
  );
};

export default ChatTyping;
