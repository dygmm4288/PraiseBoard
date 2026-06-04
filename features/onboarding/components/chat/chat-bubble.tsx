import WhaleAvatar from "@/shared/components/whale-avatar";
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
    left: "bg-primary-100",
    right: "bg-primary-500",
    center: "bg-gray-100",
  };

  if (side === "left") {
    return (
      <View
        className={cn("w-full flex-row items-start gap-[14px]", className)}
        {...props}
      >
        <WhaleAvatar />
        <View className="max-w-[256px] flex-1 gap-[3px]">
          <AppText
            variant="custom"
            weight="semibold"
            className="text-[12px] leading-[20px] text-[#8F7ED0]"
          >
            두잉
          </AppText>
          <View
            className={cn(
              "self-start rounded-bl-[20px] rounded-br-[20px] rounded-tl-[3px] rounded-tr-[20px] px-[15px] py-[9px]",
              bubbleBgClassName.left,
              bubbleClassName,
            )}
          >
            {!showTyping ? (
              <AppText
                variant="custom"
                className={cn(
                  "text-[14px] leading-[20px] text-gray-900",
                  textClassName,
                )}
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
  }

  return (
    <View className={cn("w-full", bubbleAlignClassName, className)} {...props}>
      <View className="relative max-w-[80%]">
        <View
          className={cn(
            side === "right"
              ? "rounded-bl-[20px] rounded-br-[20px] rounded-tl-[20px] rounded-tr-[3px] px-[15px] py-[9px]"
              : "min-h-[40px] rounded-[20px] px-[14px] py-[8px]",
            bubbleBgClassName[side],
            bubbleClassName,
          )}
        >
          {!showTyping ? (
            <AppText
              variant="custom"
              className={cn(
                "text-[14px] leading-[20px]",
                side === "right" ? "text-white" : "text-gray-900",
                textClassName,
              )}
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
