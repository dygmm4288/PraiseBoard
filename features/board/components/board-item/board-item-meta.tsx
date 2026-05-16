import { BoardRecord } from "@/features/board/types";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { View } from "react-native";
import { useBoardItemUi } from "../../hooks/use-board-item-ui";

type Props = {
  board: BoardRecord;
};

const BoardItemMeta = ({ board }: Props) => {
  const { boardDisabled, rewardText, isCompleted, isTodayDone, boardDDay } =
    useBoardItemUi({ board });

  return (
    <View className="min-w-0 flex-1 flex-row items-center gap-[11px]">
      {/* emoji wrapper */}
      <View
        className={cn(
          "h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[13px]",
          isCompleted
            ? "bg-primary-100"
            : isTodayDone
              ? "bg-gray-100"
              : "bg-primary-100",
        )}
      >
        <AppText className="text-[19px] leading-[23px]">🎸</AppText>
      </View>

      {/* board meta Wrapper */}
      <View className="min-w-0 flex-1">
        {/* board badges */}
        <View className="mt-[6px] flex-row gap-[5px]">
          <View className="rounded-full bg-gray-100 px-[7px] py-[2px]">
            <AppText variant="caption2" className="text-[9.5px] text-gray-400">
              D+{boardDDay}
            </AppText>
          </View>
          {board.currentStreak > 0 ? (
            <View className="rounded-[10px] bg-[#FFF6DD] px-[6px] py-[2px]">
              <AppText
                variant="custom"
                weight="semibold"
                className="text-[9px] leading-[12px] text-[#C8920A]"
              >
                🔥 연속 {board.currentStreak}일
              </AppText>
            </View>
          ) : null}
        </View>

        {/* 타이틀 Text */}
        <AppText
          numberOfLines={1}
          variant="body3"
          weight="semibold"
          className={cn(
            boardDisabled ? "text-gray-400" : "text-primary-800",
            isCompleted && "line-through",
          )}
        >
          {board.title}
        </AppText>

        {/* 보상 Text */}
        {rewardText && (
          <View className="mt-[2.5px] flex-row items-center gap-[4px]">
            <AppText
              variant="caption2"
              weight="semibold"
              className="text-[9.5px] uppercase tracking-[0.5px] text-gray-400"
            >
              보상 • {rewardText}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default BoardItemMeta;
