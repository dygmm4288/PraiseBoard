import Screen from "@/shared/ui/Screen";
import React from "react";
import { View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ReduceMotion,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

type Props = {
  visual: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  direction: "none" | "forward" | "backward";
  currentValue: string;
};

const IntroPageLayout = ({
  visual,
  children,
  footer,
  currentValue,
  direction,
}: Props) => {
  return (
    <Screen className="flex-1 bg-white">
      <View className={"flex-1 flex flex-col justify-between gap-[66px]"}>
        <Animated.View
          key={currentValue}
          className="flex-1 overflow-hidden"
          entering={
            direction === "forward"
              ? SlideInRight.duration(220).reduceMotion(ReduceMotion.System)
              : direction === "backward"
                ? SlideInLeft.duration(220).reduceMotion(ReduceMotion.System)
                : FadeIn.duration(160).reduceMotion(ReduceMotion.System)
          }
          exiting={
            direction === "forward"
              ? SlideOutLeft.duration(220).reduceMotion(ReduceMotion.System)
              : direction === "backward"
                ? SlideOutRight.duration(220).reduceMotion(ReduceMotion.System)
                : FadeOut.duration(120).reduceMotion(ReduceMotion.System)
          }
        >
          <View className="flex-1 flex flex-col gap-20">
            <View>{visual}</View>
            <View>{children}</View>
          </View>
        </Animated.View>
        <View className="mt-6 gap-4">{footer}</View>
      </View>
    </Screen>
  );
};

export default IntroPageLayout;
