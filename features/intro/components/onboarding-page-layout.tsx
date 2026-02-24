import { cn } from "@/shared/lib/cn";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: React.ReactNode;
  visual?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
};

const OnboardingPageLayout = ({
  title,
  visual,
  children,
  footer,
  className,
  contentClassName,
  bodyClassName,
  footerClassName,
}: Props) => {
  return (
    <SafeAreaView className={cn("flex-1 bg-white", className)}>
      <View className={cn("flex-1 px-6 pt-4 pb-6", contentClassName)}>
        <View className={cn("flex-1", bodyClassName)}>
          <View className='items-center'>{title}</View>

          {visual ? <View className='mt-6 flex-1'>{visual}</View> : null}

          {children ? <View className='mt-6 gap-2'>{children}</View> : null}
        </View>

        {footer ? (
          <View className={cn("mt-6 gap-4", footerClassName)}>{footer}</View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingPageLayout;
