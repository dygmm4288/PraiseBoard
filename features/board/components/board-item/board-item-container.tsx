import { COLORS } from "@/shared/theme";
import { cn } from "@/shared/utils/cn";
import { PropsWithChildren } from "react";
import { Pressable, View } from "react-native";
import { BoardItemUi } from "../../hooks/use-board-item-ui";

type Props = {
  ui: BoardItemUi;
  onPress?: () => void;
  shouldDimTodayDone?: boolean;
} & PropsWithChildren;
const BoardItemContainer = ({
  ui,
  children,
  onPress,
  shouldDimTodayDone = true,
}: Props) => {
  const { isTodayDone, isCompleted } = ui;
  const shouldDim = shouldDimTodayDone && isTodayDone;
  const contentClassName = cn(
    "rounded-[20px] px-[16px] py-[14px]",
    isCompleted ? "border border-secondary-30 bg-secondary-10" : "bg-white",
  );
  const content = (
    <View
      className="flex-row items-center gap-[11px]"
      style={{
        opacity: shouldDim ? 0.5 : 1,
      }}
    >
      {children}
    </View>
  );

  return (
    <View
      className="rounded-[20px]"
      style={{
        shadowColor: COLORS.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 1,
      }}
    >
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          className={contentClassName}
          onPress={onPress}
        >
          {content}
        </Pressable>
      ) : (
        <View className={contentClassName}>{content}</View>
      )}
    </View>
  );
};

export default BoardItemContainer;
