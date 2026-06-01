import { COLOR } from "@/shared/constants/colors.constant";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useBoard } from "../../hooks";
import { BoardCardProps } from "../../types";
import { getBoardProgress } from "../../utils/board-progress";
import BoardProgress from "./board-progress";
import BoardStickerGrid from "./board-sticker-grid";

const BoardCard = ({ className, columns = 10 }: BoardCardProps) => {
  const { boardData } = useBoard();
  const router = useRouter();
  if (!boardData) return null;

  const progress = getBoardProgress(
    boardData.totalCount,
    boardData.completedCount,
  );

  const handleGotoBoardEdit = () => {
    router.push("/(modals)/board-edit");
  };

  return (
    <View
      className={cn(
        "flex-1 w-full items-center gap-[30px] rounded-[30px] bg-white p-[15px]",
        className,
      )}
    >
      <BoardProgress
        className="shrink-0"
        remainingCount={progress.remainingCount}
        progressPercent={progress.progressPercent}
      />
      <View className="relative w-full flex-1 min-h-[50px]">
        <View className="w-full overflow-hidden flex-1 min-h-[50px]">
          <BoardStickerGrid
            totalCount={progress.totalCount}
            completedCount={progress.completedCount}
            columns={columns}
          />
        </View>
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.88)", COLOR.white]}
          locations={[0, 0.6, 1]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 56,
          }}
        />
      </View>
      <AppText
        variant="caption1"
        className="text-gray-400 w-full text-center shrink-0"
        onPress={handleGotoBoardEdit}
      >
        편집
      </AppText>
    </View>
  );
};

export default BoardCard;
