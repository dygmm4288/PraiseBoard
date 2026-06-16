import { Icon } from "@/assets/icons";
import { AppText } from "@/shared/ui";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";

export type OnboardSelectListItem = {
  icon: string;
  text: string;
  value?: string | null;
};

type Props = {
  items: OnboardSelectListItem[];
  onPress: (item: OnboardSelectListItem) => void | Promise<unknown>;
  disabled?: boolean;
};

const OnboardSelectList = ({ items, onPress, disabled = false }: Props) => {
  return (
    <View className="gap-[12px]">
      {items.map((item, index) => (
        <Animated.View
          key={`${item.icon}-${item.text}`}
          entering={FadeInDown.duration(220)
            .delay(index * 45)
            .springify()
            .damping(18)
            .stiffness(180)
            .reduceMotion(ReduceMotion.System)}
        >
          <Pressable
            className="w-full rounded-[16px] border border-[#EFF1F5] bg-white px-[14px] py-[12px]"
            disabled={disabled}
            onPress={() => onPress(item)}
            style={{ opacity: disabled ? 0.55 : 1 }}
          >
            <View className="flex-row items-center gap-[12px]">
              <View className="h-[40px] w-[40px] items-center justify-center rounded-[13px] bg-primary-100">
                <AppText variant="custom" className="text-[20px] leading-[24px]">
                  {item.icon}
                </AppText>
              </View>
              <AppText
                variant="custom"
                weight="semibold"
                className="flex-1 text-[14px] leading-[20px] text-gray-900"
                numberOfLines={1}
              >
                {item.text}
              </AppText>
              <Icon
                name="ChevronRightSmall"
                width={18}
                height={18}
                color="#BBBBBC"
              />
            </View>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
};

export default OnboardSelectList;
