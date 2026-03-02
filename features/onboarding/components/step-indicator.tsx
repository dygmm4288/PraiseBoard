import { PropsWithChildren } from "react";
import { Image, View } from "react-native";

interface Props extends PropsWithChildren {
  imgSrc?: string;
}

const StepIndicator = ({ children, imgSrc = "" }: Props) => {
  const hasImage = !!imgSrc;

  return (
    <View className="">
      {hasImage && <Image src="img_src" />}
      {children}
    </View>
  );
};

export default StepIndicator;
