import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import React from "react";
import { View, ViewProps } from "react-native";

type ChatBubbleSide = "left" | "right" | "center";

const BUBBLE_COLORS: Record<ChatBubbleSide, string> = {
  left: "#7DE0FF",
  right: "#FFFFFF",
  center: "#7DE0FF",
};

export interface ChatBubbleProps extends Omit<ViewProps, "children"> {
  className?: string;
  bubbleClassName?: string;
  textClassName?: string;
  message: string;
  side?: ChatBubbleSide;
  showTail?: boolean;
  showTyping?: boolean;
}

export const ChatBubble = ({
  className,
  bubbleClassName,
  textClassName,
  message,
  side = "left",
  showTail = true,
  showTyping = false,
  ...props
}: ChatBubbleProps) => {
  const bubbleColor = BUBBLE_COLORS[side];
  const bubbleTextClassName = {
    left: "text-gray-900",
    right: "text-primary-foreground",
    center: "text-primary-foreground",
  }[side];

  const bubbleAlignClassName = {
    left: "items-start",
    right: "items-end",
    center: "items-center",
  }[side];

  const bubbleBgClassName = {
    left: "bg-primary rounded-br-md",
    right: "bg-white rounded-bl-md border border-gray-200",
    center: "bg-primary rounded-br-md",
  };

  return (
    <View className={cn("w-full", bubbleAlignClassName, className)} {...props}>
      <View className="relative">
        <View
          className={cn(
            "max-w-[80%] px-3.5 py-2.5 rounded-2xl",
            bubbleBgClassName[side],
            bubbleClassName,
          )}
        >
          {!showTyping ? (
            <AppText
              variant="body"
              className={cn("leading-6", bubbleTextClassName, textClassName)}
            >
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
