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
import { SafeAreaView } from "react-native-safe-area-context";

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
    <View className="flex-1 overflow-hidden bg-black">
      {visual}
      <SafeAreaView className="flex-1">
        <Animated.View
          key={currentValue}
          className="w-full flex-1 justify-end gap-[50px] px-[20px] pb-[20px]"
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
          <View className="w-full items-center">{children}</View>
          <View className="w-full">{footer}</View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

export default IntroPageLayout;
