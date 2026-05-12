import { ArchiveDetail } from "@/features/archive/types";
import { Calendar } from "@/shared/components";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { PropsWithChildren } from "react";
import { View } from "react-native";

type Props = {
  detail?: ArchiveDetail;
};

type DetailCardProps = PropsWithChildren<{
  className?: string;
}>;

const CARD_SHADOW_COLOR = "#4B3C71";
const PROGRESS_CELL_COUNT = 30;

const getMonthDate = (month?: string) => {
  if (!month) return new Date();

  const [year, monthIndex] = month.split("-").map(Number);
  if (!year || !monthIndex) return new Date();

  return new Date(year, monthIndex - 1, 1);
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

const getProgressCellState = (index: number, detail?: ArchiveDetail) => {
  if (!detail) return "empty";
  if (index < detail.progressGrid.completedCount) return "completed";
  if (index < detail.progressGrid.totalCount) return "remaining";
  return "empty";
};

const DetailCard = ({ children, className }: DetailCardProps) => {
  return (
    <View
      className={cn("rounded-[20px] bg-white", className)}
      style={{
        shadowColor: CARD_SHADOW_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {children}
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
      <AppText variant="caption1" weight="semibold" className="text-[#8E8E95]">
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
      <View className="flex-row items-center gap-[12px] border-b border-[#EFF1F5] pb-[16px]">
        <View className="h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[13px] bg-primary-25">
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
            #{board?.title ?? "{타이틀}"}
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
              #{board?.rewardMemo ?? "{보상}"}
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

const ArchiveDetailCalendar = ({ detail }: Props) => {
  return (
    <Calendar
      defaultDate={getMonthDate(detail?.calendar.month)}
      stickerCounts={detail?.calendar.dailyStickerCounts ?? []}
    />
  );
};

const ArchiveDetailDailyRecord = ({ detail }: Props) => {
  const limitCount = detail?.board.limitCount ?? 0;
  const stickerCount = detail?.selectedDay.stickerCount ?? 0;

  return (
    <View className="h-[75px] flex-row items-center justify-between rounded-[14px] bg-primary-25 px-[20px]">
      <AppText variant="caption1" weight="semibold" className="text-[#8E8E95]">
        {formatKoreanDate(detail?.selectedDay.date)}
      </AppText>

      <View className="flex-row items-center gap-[12px]">
        <AppText variant="title3" weight="bold" className="text-primary-500">
          {stickerCount} / {limitCount}
        </AppText>
        <View className="h-[33px] w-[33px] items-center justify-center rounded-[9px] border border-primary-500 bg-white">
          <AppText variant="body2" weight="semibold" className="text-primary-500">
            ✓
          </AppText>
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
        value={
          detail?.streak.maxStreak ? `${detail.streak.maxStreak}일` : "-"
        }
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
  return (
    <DetailCard className="gap-[24px] px-[20px] pb-[20px] pt-[24px]">
      <View className="flex-row items-center justify-between">
        <AppText
          variant="caption1"
          weight="semibold"
          className="text-[#8E8E95]"
        >
          전체 진행률
        </AppText>
        <AppText variant="title3" weight="bold" className="text-primary-500">
          {detail?.board.progressPercent ?? 0}%
        </AppText>
      </View>

      <View className="flex-row flex-wrap justify-between gap-y-[5px]">
        {Array.from({ length: PROGRESS_CELL_COUNT }, (_, index) => {
          const state = getProgressCellState(index, detail);

          return (
            <View
              key={index}
              className={cn(
                "h-[28px] w-[28px] rounded-[6px] border",
                state === "completed" && "border-primary-100 bg-primary-300",
                state === "remaining" && "border-[#F4F2FD] bg-[#F9F8FF]",
                state === "empty" && "border-[#F4F2FD] bg-[#F9F8FF]",
              )}
            />
          );
        })}
      </View>
    </DetailCard>
  );
};

const ArchiveDetailItem = ({ detail }: Props) => {
  return (
    <View className="gap-[12px]">
      <ArchiveDetailOverview detail={detail} />
      <ArchiveDetailCalendar detail={detail} />
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
