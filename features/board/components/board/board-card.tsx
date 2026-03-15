import { cn } from "@/shared/utils/cn";
import { View } from "react-native";
import { BoardCardProps } from "../../types/board-card.type";
import { getBoardProgress } from "../../utils/board-progress";
import BoardHeader from "./board-header";
import BoardProgress from "./board-progress";
import BoardStickerGrid from "./board-sticker-grid";

const BoardCard = ({ data, className, columns = 10 }: BoardCardProps) => {
  const progress = getBoardProgress(data.totalCount, data.completedCount);

  return (
    <View
      className={cn(
        "w-full max-w-[362px] items-center gap-[30px] rounded-[30px] bg-white p-[15px]",
        className,
      )}
    >
      <BoardHeader title={data.title} rewardMemo={data.rewardMemo} />
      <BoardStickerGrid
        totalCount={progress.totalCount}
        completedCount={progress.completedCount}
        columns={columns}
      />
      <BoardProgress
        remainingCount={progress.remainingCount}
        progressPercent={progress.progressPercent}
      />
    </View>
  );
};

export default BoardCard;
