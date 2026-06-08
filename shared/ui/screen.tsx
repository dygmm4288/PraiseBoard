import { cn } from "@/shared/utils/cn";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props extends PropsWithChildren {
  className?: string;
  padded?: boolean;
}

/**
 * 레이아웃 스크린. 기본 패딩 적용
 */
const Screen = ({ children, className = "", padded = true }: Props) => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFF", position: "relative" }}
    >
      <View className={cn("flex-1", padded && "px-screen", className)}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default Screen;
