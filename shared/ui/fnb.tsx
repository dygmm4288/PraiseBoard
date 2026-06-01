import { COLOR } from "@/shared/constants/colors.constant";
import { cn } from "@/shared/utils/cn";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { SvgProps } from "react-native-svg";
import { AppText } from "./text";

type FnbIcon = React.ComponentType<SvgProps>;

export type BaseFnbItem<T extends string> = {
  key: T;
  icon: FnbIcon;
  label: string;
};

type FnbItemLayout = {
  x: number;
  width: number;
};

type Props<T extends string> = {
  items: BaseFnbItem<T>[];
  activeKey: T;
  onPress: (key: T) => void;
  className?: string;
};

type ActiveSurfaceProps = {
  x: number;
  width: number;
  visible: boolean;
};

type FnbItemProps<T extends string> = {
  item: BaseFnbItem<T>;
  isActive: boolean;
  onPress: (key: T) => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

const HORIZONTAL_PADDING = 5;

const ActiveSurface = ({ x, width, visible }: ActiveSurfaceProps) => {
  const translateX = useSharedValue(x);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const hasPositioned = useRef(false);

  const activeSurfaceStyle = useAnimatedStyle(() => ({
    opacity: visible ? 1 : 0,
    transform: [
      { translateX: translateX.value },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
    ],
  }));

  useEffect(() => {
    if (!visible) return;

    if (!hasPositioned.current) {
      translateX.value = x;
      scaleX.value = 1;
      scaleY.value = 1;
      hasPositioned.current = true;
      return;
    }

    scaleX.value = withSequence(
      withTiming(0.1, { duration: 0.5 }),
      withSpring(1, {
        damping: 50,
        stiffness: 135,
        mass: 0.85,
      }),
    );
    scaleY.value = withSequence(
      withTiming(0.1, { duration: 0.5 }),
      withSpring(1, {
        damping: 50,
        stiffness: 145,
        mass: 0.85,
      }),
    );
    translateX.value = withSpring(x, {
      damping: 26,
      stiffness: 120,
      mass: 1.05,
    });
  }, [scaleX, scaleY, translateX, visible, x]);

  return (
    <Animated.View
      className="absolute left-0 top-[4px] bottom-[4px] rounded-[100px] bg-primary-500/10"
      pointerEvents="none"
      style={[{ width }, styles.activeSurface, activeSurfaceStyle]}
    />
  );
};

const FnbItemBase = <T extends string>({
  item,
  isActive,
  onPress,
  onLayout,
}: FnbItemProps<T>) => {
  const Icon = item.icon;
  const progress = useSharedValue(isActive ? 1 : 0);
  const color = isActive ? COLOR.primary[500] : COLOR.gray[900];

  useEffect(() => {
    progress.value = withSpring(isActive ? 1 : 0, {
      damping: 18,
      stiffness: 180,
    });
  }, [isActive, progress]);

  const contentStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [0, -2]);
    const scale = interpolate(progress.value, [0, 1], [1, 1.06]);
    const opacity = interpolate(progress.value, [0, 1], [0.72, 1]);

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      className="relative min-w-0 flex-1 items-center justify-center rounded-[100px] px-[7px] pb-[7px] pt-[7px]"
      style={{ zIndex: isActive ? 10 : 1 }}
      onLayout={onLayout}
      onPress={() => onPress(item.key)}
    >
      <Animated.View
        className="items-center justify-center gap-[1px]"
        style={contentStyle}
      >
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
      </Animated.View>
    </Pressable>
  );
};

const FnbItem = memo(FnbItemBase) as typeof FnbItemBase;

const Fnb = <T extends string>({
  items,
  activeKey,
  onPress,
  className,
}: Props<T>) => {
  const onPressRef = useRef(onPress);
  const [visualActiveKey, setVisualActiveKey] = useState(activeKey);
  const [itemLayouts, setItemLayouts] = useState<
    Partial<Record<number, FnbItemLayout>>
  >({});
  const activeIndex = useMemo(
    () =>
      Math.max(
        0,
        items.findIndex((item) => item.key === visualActiveKey),
      ),
    [items, visualActiveKey],
  );
  const activeLayout = itemLayouts[activeIndex];
  const [containerWidth, setContainerWidth] = useState(0);
  const activeSurfaceWidth =
    containerWidth > 0
      ? (containerWidth - HORIZONTAL_PADDING * 2) / items.length
      : 0;
  const activeSurfaceX =
    activeLayout && activeSurfaceWidth > 0
      ? activeLayout.x + activeLayout.width / 2 - activeSurfaceWidth / 2
      : 0;

  useEffect(() => {
    onPressRef.current = onPress;
  }, [onPress]);

  useEffect(() => {
    setVisualActiveKey(activeKey);
  }, [activeKey]);

  const handlePress = useCallback((key: T) => {
    setVisualActiveKey(key);
    onPressRef.current(key);
  }, []);

  const handleItemLayout = useCallback(
    (index: number, layout: FnbItemLayout) => {
      setItemLayouts((current) => {
        const previous = current[index];

        if (
          previous &&
          previous.x === layout.x &&
          previous.width === layout.width
        ) {
          return current;
        }

        return {
          ...current,
          [index]: layout,
        };
      });
    },
    [],
  );

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;

    setContainerWidth((current) =>
      current === nextWidth ? current : nextWidth,
    );
  }, []);

  const itemLayoutHandlers = useMemo(
    () =>
      items.map(
        (_, index) => (event: LayoutChangeEvent) =>
          handleItemLayout(index, event.nativeEvent.layout),
      ),
    [handleItemLayout, items],
  );

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
        onLayout={handleContainerLayout}
      >
        <ActiveSurface
          x={activeSurfaceX}
          width={activeSurfaceWidth}
          visible={!!activeLayout && activeSurfaceWidth > 0}
        />
        {items.map((item, index) => (
          <FnbItem
            key={item.key}
            item={item}
            isActive={item.key === visualActiveKey}
            onLayout={itemLayoutHandlers[index]}
            onPress={handlePress}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 12,
    shadowColor: COLOR.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
  },
  activeSurface: {
    elevation: 6,
    shadowColor: COLOR.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
});

export default Fnb;
