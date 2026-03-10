import { cn } from "@/shared/utils/cn";
import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props extends PropsWithChildren {
  className?: string;
}

/**
 * 레이아웃 스크린. 기본 패딩 적용
 */
const Screen = ({ children, className = "" }: Props) => {
  return (
    <SafeAreaView className={cn("px-section py-section", className)}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;
