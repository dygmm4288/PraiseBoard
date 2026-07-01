import { PropsWithChildren } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OnboardScreenLayout = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-white px-screen"
      style={{ paddingTop: insets.top }}
    >
      {children}
    </View>
  );
};

export default OnboardScreenLayout;
