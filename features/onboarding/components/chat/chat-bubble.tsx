import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import React from "react";
import { View, ViewProps } from "react-native";
import ChatTyping from "./chat-typing";

type ChatBubbleSide = "left" | "right" | "center";

export interface ChatBubbleProps extends Omit<ViewProps, "children"> {
  className?: string;
  bubbleClassName?: string;
  textClassName?: string;
  message: string;
  side?: ChatBubbleSide;
  showTyping?: boolean;
}

export const ChatBubble = ({
  className,
  bubbleClassName,
  textClassName,
  message,
  side = "left",
  showTyping = false,
  ...props
}: ChatBubbleProps) => {
  const bubbleAlignClassName = {
    left: "items-start",
    right: "items-end",
    center: "items-center",
  }[side];

  const bubbleBgClassName = {
    left: "bg-gray-100 ",
    right: "bg-primary-100",
    center: "bg-gray-100",
  };

  return (
    <View className={cn("w-full", bubbleAlignClassName, className)} {...props}>
      <View className="relative max-w-[80%]">
        <View
          className={cn(
            "py-[8px] px-[14px] rounded-[20px] min-h-[40px]",
            bubbleBgClassName[side],
            bubbleClassName,
          )}
        >
          {!showTyping ? (
            <AppText variant="body3" className={textClassName}>
              {message}
            </AppText>
          ) : (
            <ChatTyping />
          )}
        </View>
      </View>
    </View>
  );
};
