import { ArchiveDetail } from "@/features/archive/types";
import { useCollectSticker } from "@/features/board/hooks/use-collect-sticker";
import { Calendar } from "@/shared/components";
import { COLOR } from "@/shared/constants/colors.constant";
import useTodayKey from "@/shared/hooks/use-today-key";
import { AppText } from "@/shared/ui";
import AppCheckbox from "@/shared/ui/checkbox";
import StickerBubbleBurst from "@/shared/ui/sticker-bubble-burst";
import { cn } from "@/shared/utils/cn";
import { PropsWithChildren, useState } from "react";
import { View } from "react-native";

type Props = {
  detail?: ArchiveDetail;
};

type ArchiveDetailItemProps = Props & {
  onMonthChange?: (date: Date) => void;
};

type DetailCardProps = PropsWithChildren<{
  className?: string;
}>;

const CARD_SHADOW_COLOR = COLOR.textDarkPurple;
const DEFAULT_PROGRESS_CELL_COUNT = 30;
const PROGRESS_GRID_COLUMNS = 10;

const getMonthDate = (month?: string) => {
  if (!month) return new Date();

  const [year, monthIndex] = month.split("-").map(Number);
  if (!year || !monthIndex) return new Date();

  return new Date(year, monthIndex - 1, 1);
};

const getBoardStartDate = (detail?: ArchiveDetail) => {
  const startedAt = detail?.board.startedAt;
  if (!startedAt) return undefined;

  const parsedDate = new Date(startedAt);
  if (Number.isNaN(parsedDate.getTime())) return undefined;

  return parsedDate;
};

const formatShortDate = (date?: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  const year = String(parsedDate.getFullYear()).slice(2);
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

const formatKoreanDate = (date?: string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return `${parsedDate.getMonth() + 1}월 ${parsedDate.getDate()}일`;
};

const getProgressCellCount = (detail?: ArchiveDetail) => {
  return detail?.progressGrid.totalCount || DEFAULT_PROGRESS_CELL_COUNT;
};

const getProgressCellState = (index: number, detail?: ArchiveDetail) => {
  if (!detail) return "empty";
  if (index < detail.progressGrid.completedCount) return "completed";
  if (index < detail.progressGrid.totalCount) return "remaining";
  return "empty";
};

const getProgressGridRows = (detail?: ArchiveDetail) => {
  const cellCount = getProgressCellCount(detail);
  const cells = Array.from({ length: cellCount }, (_, index) => index);
  const rowCount = Math.ceil(cellCount / PROGRESS_GRID_COLUMNS);

  return Array.from({ length: rowCount }, (_, rowIndex) =>
    cells.slice(
      rowIndex * PROGRESS_GRID_COLUMNS,
      rowIndex * PROGRESS_GRID_COLUMNS + PROGRESS_GRID_COLUMNS,
    ),
  );
};

const DetailCard = ({ children, className }: DetailCardProps) => {
  return (
    <View
      className="rounded-[20px]"
      style={{
        shadowColor: CARD_SHADOW_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View className={cn("rounded-[20px] bg-white", className)}>
        {children}
      </View>
    </View>
  );
};

const ArchiveDetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <View className="flex-row items-center justify-between">
      <AppText variant="caption1" weight="semibold" className="text-labelGray">
        {label}
      </AppText>
      <AppText variant="body3" className="text-gray-900">
        {value}
      </AppText>
    </View>
  );
};

const ArchiveDetailOverview = ({ detail }: Props) => {
  const board = detail?.board;

  return (
    <DetailCard className="px-[20px] py-[16px]">
      <View className="flex-row items-center gap-[12px] border-b border-line pb-[16px]">
        <View className="h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[13px] bg-primary-10">
          <AppText className="text-[20px] leading-[24px]">
            {board?.emoji ?? "🌱"}
          </AppText>
        </View>

        <View className="min-w-0 flex-1 gap-[3px]">
          <AppText
            variant="body3"
            weight="semibold"
            className="text-gray-900"
            numberOfLines={1}
          >
            {board?.title}
          </AppText>
          <View className="flex-row items-center gap-[3px]">
            <AppText variant="caption2" className="text-gray-500">
              보상
            </AppText>
            <View className="h-[1px] w-[1px] rounded-full bg-gray-300" />
            <AppText
              variant="caption2"
              className="text-gray-500"
              numberOfLines={1}
            >
              {board?.rewardMemo ?? "-"}
            </AppText>
          </View>
        </View>

        <AppText
          variant="title3"
          weight="bold"
          className="shrink-0 text-primary-500"
        >
          {board?.progressPercent ?? 0}%
        </AppText>
      </View>

      <View className="gap-[6px] pt-[16px]">
        <ArchiveDetailRow
          label="시작일"
          value={formatShortDate(board?.startedAt)}
        />
        <ArchiveDetailRow
          label="목표 개수"
          value={`${board?.targetCount ?? 0}개 (일 최대 ${
            board?.limitCount ?? 0
          }번)`}
        />
      </View>
    </DetailCard>
  );
};

const ArchiveDetailCalendar = ({
  detail,
  onMonthChange,
}: ArchiveDetailItemProps) => {
  return (
    <Calendar
      defaultDate={getMonthDate(detail?.calendar.month)}
      minDate={getBoardStartDate(detail)}
      onMonthChange={onMonthChange}
      stickerCounts={detail?.calendar.dailyStickerCounts ?? []}
    />
  );
};

const ArchiveDetailDailyRecord = ({ detail }: Props) => {
  const [burstKey, setBurstKey] = useState(0);
  const todayKey = useTodayKey();
  const { mutate: collectSticker, isPending } = useCollectSticker();
  const board = detail?.board;
  const limitCount = detail?.board.limitCount ?? 0;
  const stickerCount = detail?.selectedDay.stickerCount ?? 0;
  const isBoardCompleted = board
    ? board.currentCount >= board.targetCount
    : false;
  const isTodayDone = detail?.selectedDay.completed ?? false;
  const isSelectedDayToday = detail?.selectedDay.date === todayKey;
  const actionDisabled =
    !board ||
    isPending ||
    isBoardCompleted ||
    isTodayDone ||
    !isSelectedDayToday;

  const handleCollectSticker = () => {
    if (actionDisabled || !board) return;

    setBurstKey((key) => key + 1);
    collectSticker({ boardId: board.id, source: "app" });
  };

  return (
    <View className="h-[75px] flex-row items-center justify-between rounded-[14px] bg-primary-100 px-[20px]">
      <AppText variant="caption1" weight="semibold" className="text-labelGray">
        {formatKoreanDate(detail?.selectedDay.date)}
      </AppText>

      <View className="flex-row items-center gap-[12px]">
        <AppText variant="title3" weight="bold" className="text-primary-500">
          {stickerCount} / {limitCount}
        </AppText>
        <View className="relative h-[34px] w-[34px] overflow-visible">
          <AppCheckbox
            disabled={actionDisabled}
            variant={
              isBoardCompleted
                ? "completed"
                : isTodayDone
                  ? "todayDone"
                  : "default"
            }
            onPress={handleCollectSticker}
          />
          {!isBoardCompleted && !isTodayDone && burstKey > 0 ? (
            <StickerBubbleBurst key={burstKey} onDone={() => setBurstKey(0)} />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const ArchiveDetailStreakSummary = ({ detail }: Props) => {
  return (
    <DetailCard className="gap-[6px] px-[20px] py-[16px]">
      <ArchiveDetailRow
        label="최다 성취일"
        value={detail?.streak.maxStreak ? `${detail.streak.maxStreak}일` : "-"}
      />
      <ArchiveDetailRow
        label="연속 성취"
        value={
          detail?.streak.currentStreak
            ? `${detail.streak.currentStreak}일`
            : "-"
        }
      />
    </DetailCard>
  );
};

const ArchiveDetailProgressGrid = ({ detail }: Props) => {
  const rows = getProgressGridRows(detail);

  return (
    <DetailCard className="gap-[24px] px-[20px] pb-[20px] pt-[24px]">
      <View className="flex-row items-center justify-between">
        <AppText
          variant="caption1"
          weight="semibold"
          className="text-labelGray"
        >
          전체 진행률
        </AppText>
        <AppText variant="title3" weight="bold" className="text-primary-500">
          {detail?.board.progressPercent ?? 0}%
        </AppText>
      </View>

      <View className="gap-[5px]">
        {rows.map((row, rowIndex) => (
          <View
            key={`progress-row-${rowIndex}`}
            className="flex-row items-center justify-between"
          >
            {Array.from({ length: PROGRESS_GRID_COLUMNS }, (_, columnIndex) => {
              const cellIndex = row[columnIndex];
              const isPlaceholder = cellIndex === undefined;
              const state = isPlaceholder
                ? "empty"
                : getProgressCellState(cellIndex, detail);

              return (
                <View
                  key={`${rowIndex}-${columnIndex}`}
                  className={cn(
                    "h-[28px] w-[28px] rounded-[6px] border",
                    state === "completed" &&
                      "border-primary-100 bg-primary-300",
                    state !== "completed" && "border-primary-10 bg-primary-10",
                    isPlaceholder && "opacity-0",
                  )}
                />
              );
            })}
          </View>
        ))}
      </View>
    </DetailCard>
  );
};

const ArchiveDetailItem = ({
  detail,
  onMonthChange,
}: ArchiveDetailItemProps) => {
  return (
    <View className="gap-[12px]">
      <ArchiveDetailOverview detail={detail} />
      <ArchiveDetailCalendar detail={detail} onMonthChange={onMonthChange} />
      <ArchiveDetailDailyRecord detail={detail} />
      <ArchiveDetailStreakSummary detail={detail} />
      <ArchiveDetailProgressGrid detail={detail} />
    </View>
  );
};

ArchiveDetailItem.Overview = ArchiveDetailOverview;
ArchiveDetailItem.Calendar = ArchiveDetailCalendar;
ArchiveDetailItem.DailyRecord = ArchiveDetailDailyRecord;
ArchiveDetailItem.StreakSummary = ArchiveDetailStreakSummary;
ArchiveDetailItem.ProgressGrid = ArchiveDetailProgressGrid;

export default ArchiveDetailItem;
