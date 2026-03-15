import { cn } from "@/shared/utils/cn";
import { useMemo } from "react";
import { View } from "react-native";
import { BoardStickerGridProps } from "../../types/board-card.type";
import { getBoardProgress } from "../../utils/board-progress";
import BoardSticker from "./board-sticker";

const normalizeColumns = (columns: number) => Math.max(1, Math.floor(columns));

const BoardStickerGrid = ({
  totalCount,
  completedCount,
  columns = 10,
  className,
}: BoardStickerGridProps) => {
  const safeColumns = normalizeColumns(columns);
  const {
    totalCount: safeTotalCount,
    completedCount: safeCompletedCount,
  } = getBoardProgress(totalCount, completedCount);
  const rowCount = Math.ceil(safeTotalCount / safeColumns);

  const rows = useMemo(
    () =>
      Array.from({ length: rowCount }, (_, rowIndex) => {
        const start = rowIndex * safeColumns;
        const end = Math.min(start + safeColumns, safeTotalCount);

        return Array.from({ length: end - start }, (_, offset) => start + offset);
      }),
    [rowCount, safeColumns, safeTotalCount],
  );

  return (
    <View className={cn("w-full gap-[8px]", className)}>
      {rows.map((row, rowIndex) => (
        <View key={`board-row-${rowIndex}`} className="flex-row gap-[8px]">
          {row.map((stickerIndex) => (
            <BoardSticker
              key={`board-sticker-${stickerIndex}`}
              filled={stickerIndex < safeCompletedCount}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default BoardStickerGrid;
