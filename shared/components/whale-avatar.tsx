import { images } from "@/assets/images";
import { Image, View } from "react-native";

const WhaleAvatar = () => {
  return (
    <View className="h-[33px] w-[33px] rounded-full bg-primary-20 flex items-center overflow-hidden">
      <Image
        className="w-[51px] h-[53px]"
        height={53}
        width={51}
        source={images.whaleMessages.whale}
      />
    </View>
  );
};

export default WhaleAvatar;
