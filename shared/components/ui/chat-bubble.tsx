import { cn } from "@/shared/lib/cn";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { AppText } from "./text";

type ChatBubbleSide = "left" | "right" | "center";

const BUBBLE_COLORS: Record<ChatBubbleSide, string> = {
  left: "#7DE0FF",
  right: "#FFFFF",
  center: "#7DE0FF",
};

export interface AppChatBubbleProps extends Omit<ViewProps, "children"> {
  className?: string;
  bubbleClassName?: string;
  textClassName?: string;
  message: string;
  side?: ChatBubbleSide;
  showTail?: boolean;
}

type BubbleTailProps = {
  side: ChatBubbleSide;
  color: string;
};

const BubbleTail = ({ side, color }: BubbleTailProps) => (
  <View
    pointerEvents="none"
    style={[
      styles.tailBase,
      side === "left" ? styles.tailLeft : styles.tailRight,
      side === "left"
        ? { borderRightColor: color }
        : { borderLeftColor: color },
    ]}
  />
);

export const AppChatBubble = ({
  className,
  bubbleClassName,
  textClassName,
  message,
  side = "left",
  showTail = true,
  ...props
}: AppChatBubbleProps) => {
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
        {showTail ? <BubbleTail side={side} color={bubbleColor} /> : null}

        <View
          className={cn(
            "max-w-[80%] px-3.5 py-2.5 rounded-2xl",
            bubbleBgClassName[side],
            bubbleClassName,
          )}
        >
          <AppText
            variant="body"
            className={cn("leading-6", bubbleTextClassName, textClassName)}
          >
            {message}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tailBase: {
    position: "absolute",
    bottom: 10,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    zIndex: 0,
  },
  tailLeft: {
    left: -7,
    borderRightWidth: 10,
  },
  tailRight: {
    right: -7,
    borderLeftWidth: 10,
  },
});
