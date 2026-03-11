import { cn } from "@/shared/utils/cn";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props extends PropsWithChildren {
  className?: string;
}

/**
 * 레이아웃 스크린. 기본 패딩 적용
 */
const Screen = ({ children, className = "" }: Props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className={cn("px-section pt-section flex-1", className)}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default Screen;
