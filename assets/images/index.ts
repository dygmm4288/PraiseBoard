import type { ImageSourcePropType } from "react-native";

type ImageGroup = Record<string, ImageSourcePropType>;

export const images: {
  brand: ImageGroup;
  android: ImageGroup;
  logos: ImageGroup;
  illustrations: ImageGroup;
} = {
  brand: {
    icon: require("./icon.png"),
    splash: require("./splash-icon.png"),
    favicon: require("./favicon.png"),
  },
  android: {
    foreground: require("./android-icon-foreground.png"),
    background: require("./android-icon-background.png"),
    monochrome: require("./android-icon-monochrome.png"),
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
};

export const onboardImages: ImageSourcePropType[] = [
  images.illustrations.whale,
  images.illustrations.spoutingWhale,
  images.illustrations.onboardWhale,
];
