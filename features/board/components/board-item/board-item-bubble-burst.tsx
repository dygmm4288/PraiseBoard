import { useEffect, useMemo, useRef } from "react";
import { View, Animated, Easing } from "react-native";

const BUBBLE_OFFSETS = [-18, 10, -6, 20, -24, 3, 15, -12, 25, -2];

const BoardItemBubbleBurst = ({ onDone }: { onDone: () => void }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const bubbles = useMemo(
    () =>
      BUBBLE_OFFSETS.map((x, index) => ({
        id: index,
        x,
        size: 4 + (index % 3) * 2,
        delay: index * 35,
        lift: 56 + index * 5,
      })),
    [],
  );

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 980,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished) onDone();
    });

    return () => {
      animation.stop();
    };
  }, [onDone, progress]);

  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-visible">
      {bubbles.map((bubble) => {
        const animatedProgress = progress.interpolate({
          inputRange: [0, bubble.delay / 980, 1],
          outputRange: [0, 0, 1],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={bubble.id}
            className="absolute rounded-full border border-primary-300 bg-primary-100"
            style={{
              bottom: 14,
              left: 15,
              width: bubble.size,
              height: bubble.size,
              opacity: animatedProgress.interpolate({
                inputRange: [0, 0.12, 0.78, 1],
                outputRange: [0, 0.9, 0.45, 0],
              }),
              transform: [
                {
                  translateX: animatedProgress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, bubble.x * 0.35, bubble.x],
                  }),
                },
                {
                  translateY: animatedProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -bubble.lift],
                  }),
                },
                {
                  scale: animatedProgress.interpolate({
                    inputRange: [0, 0.18, 1],
                    outputRange: [0.4, 1, 0.75],
                  }),
                },
              ],
            }}
          />
        );
      })}
    </View>
  );
};

export default BoardItemBubbleBurst;
