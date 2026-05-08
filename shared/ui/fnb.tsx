import { COLOR } from "@/shared/constants/colors.constant";
import { cn } from "@/shared/utils/cn";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { AppText } from "./text";

type FnbIcon = React.ComponentType<SvgProps>;

export type BaseFnbItem<T extends string> = {
  key: T;
  icon: FnbIcon;
  label: string;
};

type Props<T extends string> = {
  items: BaseFnbItem<T>[];
  activeKey: T;
  onPress: (key: T) => void;
  className?: string;
};

const Fnb = <T extends string>({
  items,
  activeKey,
  onPress,
  className,
}: Props<T>) => {
  return (
    <View
      className={cn(
        "fixed bottom-[25px] w-full left-[25px] right-[25px]",
        className,
      )}
    >
      <View
        className="w-full max-w-[348px] flex-row items-start justify-center rounded-[296px] bg-white px-[5px] py-[4px]"
        style={styles.container}
      >
        {items.map((item) => {
          const isActive = item.key === activeKey;
          const Icon = item.icon;
          const color = isActive ? COLOR.primary[500] : COLOR.gray[900];

          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              className="relative min-w-0 flex-1 items-center justify-center gap-[1px] rounded-[100px] px-[7px] pb-[7px] pt-[7px]"
              onPress={() => onPress(item.key)}
            >
              {isActive ? (
                <View className="absolute inset-x-[-2px] inset-y-[-0.5px] rounded-[100px] bg-primary-500/10" />
              ) : null}

              <Icon width={28} height={28} color={color} stroke={color} />

              <AppText
                variant="caption2"
                weight="semibold"
                className={cn(
                  "w-full text-center text-[10px] leading-[12px]",
                  isActive ? "text-primary-500" : "text-gray-900",
                )}
              >
                {item.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
  },
});

export default Fnb;
