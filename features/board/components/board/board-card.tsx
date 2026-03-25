import { cn } from "@/shared/utils/cn";
import { View } from "react-native";
import { useBoard } from "../../hooks";
import { BoardCardProps } from "../../types/board-card.type";
import { getBoardProgress } from "../../utils/board-progress";
import BoardProgress from "./board-progress";
import BoardStickerGrid from "./board-sticker-grid";

const BoardCard = ({ className, columns = 10 }: BoardCardProps) => {
  const { boardData } = useBoard();
  if (!boardData) return null;

  const progress = getBoardProgress(
    boardData.totalCount,
    boardData.completedCount,
  );

  return (
    <View
      className={cn(
        "w-full items-center gap-[30px] rounded-[30px] bg-white p-[15px]",
        className,
      )}
    >
      <BoardProgress
        remainingCount={progress.remainingCount}
        progressPercent={progress.progressPercent}
      />
      <BoardStickerGrid
        totalCount={progress.totalCount}
        completedCount={progress.completedCount}
        columns={columns}
      />
    </View>
  );
};

export default BoardCard;
