import { cn } from "@/shared/utils/cn";
import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props extends PropsWithChildren {
  className?: string;
}

const Screen = ({ children, className = "" }: Props) => {
  return (
    <SafeAreaView className={cn("px-section py-section", className)}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;
