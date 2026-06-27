import type { ImageSourcePropType } from "react-native";

type ImageGroup = Record<string, ImageSourcePropType>;

export const images: {
  brand: ImageGroup;
  logos: ImageGroup;
  illustrations: ImageGroup;
  whaleMessages: ImageGroup;
} = {
  brand: {
    icon: require("./app-icon.png"),
    splash: require("./splash-icon.png"),
  },
  logos: {
    react: require("./react-logo.png"),
    partialReact: require("./partial-react-logo.png"),
  },
  illustrations: {
    whale: require("./whale_1f40b 1.png"),
    spoutingWhale: require("./spouting-whale_1f433 1.png"),
    onboardWhale: require("./onboard-intro-whale.png"),
  },
  whaleMessages: {
    whale: require("./whale_message_doing.png"),
  },
};

export const onboardImages: ImageSourcePropType[] = [
  images.illustrations.whale,
  images.illustrations.spoutingWhale,
  images.illustrations.onboardWhale,
];

export const boardImages: ImageSourcePropType[] = [
  images.illustrations.onboardWhale,
];

export const whaleMessageImages: ImageSourcePropType[] = [
  images.whaleMessages.whale,
];
