import { Icon } from "@/assets/icons";
import { images } from "@/assets/images";
import { AppText } from "@/shared/ui";
import { useEffect } from "react";
import { Image, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type Props = {
  nickname?: string | null;
  title?: string | null;
  rewardMemo?: string | null;
  emoji?: string | null;
};

const OnboardCompletionPreview = ({
  nickname,
  title,
  rewardMemo,
  emoji,
}: Props) => {
  const { height } = useWindowDimensions();
  const settled = useSharedValue(0);
  const displayName = nickname?.trim() || "사용자";
  const displayTitle = title?.trim() || "첫 습관";
  const displayReward = rewardMemo?.trim() || "보상";
  const cardStartTop = Math.max(340, height * 0.48);
  const cardEndTop = 260;

  useEffect(() => {
    settled.value = withDelay(
      1500,
      withTiming(1, {
        duration: 850,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [settled]);

  const homeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(settled.value, [0, 1], [0.42, 1]),
    transform: [
      {
        scale: interpolate(settled.value, [0, 1], [0.985, 1]),
      },
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(settled.value, [0, 1], [1, 0]),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(settled.value, [0, 0.65, 1], [1, 0, 0]),
    transform: [
      {
        translateY: interpolate(settled.value, [0, 1], [0, -14]),
      },
    ],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    top: interpolate(settled.value, [0, 1], [cardStartTop, cardEndTop]),
    transform: [
      {
        scale: interpolate(settled.value, [0, 1], [1.045, 1]),
      },
    ],
  }));

  return (
    <View className="absolute inset-0 z-10 bg-white">
      <Animated.View className="flex-1 px-screen pt-[12px]" style={homeStyle}>
        <View className="h-[45px] justify-center px-[8px]">
          <AppText
            variant="custom"
            weight="bold"
            className="text-[18px] leading-[32px] tracking-[-0.18px] text-gray-900"
          >
            홈
          </AppText>
        </View>

        <View className="mt-[12px] gap-[12px]">
          <View className="rounded-[20px] border border-primary-100 bg-primary-100 px-[20px] py-[18px]">
            <View className="mb-[12px] flex-row items-center gap-[9px] border-b border-primary-200 pb-[12px]">
              <Image
                source={images.whaleMessages.whale}
                className="h-[33px] w-[33px] rounded-full"
              />
              <View>
                <AppText
                  variant="custom"
                  weight="semibold"
                  className="text-[12px] leading-[20px] text-primary-500"
                >
                  두잉
                </AppText>
                <AppText
                  variant="custom"
                  className="text-[10px] leading-[12px] text-primary-300"
                >
                  마지막 메시지
                </AppText>
              </View>
            </View>
            <AppText
              variant="custom"
              weight="medium"
              className="text-[15px] leading-[25px] text-[#483970]"
            >
              {`안녕! ${displayName}\n잠깐 고개를 들고 바람을 쐬어볼까?`}
            </AppText>
          </View>

          <View className="h-[75px] flex-row items-center justify-between rounded-[20px] bg-secondary-20 px-[20px]">
            <AppText className="text-[12px] leading-[20px] text-secondary-500">
              오늘의 성취
            </AppText>
            <AppText
              weight="semibold"
              className="text-[12px] leading-[20px] text-secondary-500"
            >
              오늘의 성취를 기다리고 있어요
            </AppText>
          </View>

          <View className="h-[85px]" />
        </View>

        <View className="absolute bottom-[24px] left-[25px] right-[25px] rounded-full bg-white px-[7px] py-[5px] shadow-sm">
          <View className="flex-row items-center justify-between">
            {[
              { icon: "Home", label: "홈", active: true },
              { icon: "Chart", label: "통계", active: false },
              { icon: "Folder", label: "보관함", active: false },
              { icon: "Setting", label: "설정", active: false },
            ].map((item) => (
              <View
                key={item.label}
                className={`min-w-[50px] items-center justify-center rounded-full px-[8px] py-[6px] ${
                  item.active ? "bg-primary-100" : ""
                }`}
              >
                <Icon
                  name={item.icon as "Home" | "Chart" | "Folder" | "Setting"}
                  size={24}
                  color={item.active ? "#7F5ADD" : "#1C1B1F"}
                />
                <AppText
                  variant="custom"
                  weight="semibold"
                  className={`mt-[1px] text-[10px] leading-[12px] ${
                    item.active ? "text-primary-500" : "text-gray-900"
                  }`}
                >
                  {item.label}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        className="absolute inset-0 bg-[rgba(20,10,50,0.22)]"
        style={overlayStyle}
      />

      <Animated.View
        pointerEvents="none"
        className="absolute left-0 right-0 items-center px-screen"
        style={[{ top: height * 0.28 }, titleStyle]}
      >
        <AppText
          variant="custom"
          weight="bold"
          className="text-center text-[18px] leading-[32px] tracking-[-0.18px] text-gray-900"
        >
          {`${displayName}의\n첫 습관이 준비됐어`}
        </AppText>
      </Animated.View>

      <Animated.View
        className="absolute left-screen right-screen h-[85px] justify-center rounded-[20px] bg-white px-[20px] shadow-sm"
        style={cardStyle}
      >
        <View className="flex-row items-center gap-[12px]">
          <View className="h-[40px] w-[40px] items-center justify-center rounded-[13px] bg-primary-100">
            <AppText variant="custom" className="text-[20px] leading-[24px]">
              {emoji?.trim() || "🌱"}
            </AppText>
          </View>
          <View className="flex-1">
            <View className="mb-[3px] self-start rounded-[10px] bg-gray-100 px-[6px] py-[2px]">
              <AppText
                variant="custom"
                weight="semibold"
                className="text-[9px] leading-[10px] text-gray-400"
              >
                D+1
              </AppText>
            </View>
            <AppText
              variant="custom"
              weight="semibold"
              className="text-[14px] leading-[20px] text-gray-900"
              numberOfLines={1}
            >
              {displayTitle}
            </AppText>
            <AppText
              variant="custom"
              className="text-[10px] leading-[12px] text-gray-400"
              numberOfLines={1}
            >
              {`보상 : ${displayReward}`}
            </AppText>
          </View>
          <View className="flex-row items-center gap-[12px]">
            <AppText
              variant="custom"
              weight="bold"
              className="text-[18px] leading-[32px] tracking-[-0.18px] text-primary-500"
            >
              0%
            </AppText>
            <View className="h-[33px] w-[33px] items-center justify-center rounded-[9px] border border-primary-500 bg-white">
              <Icon name="Check" size={18} color="#7F5ADD" />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default OnboardCompletionPreview;
