import { Icon } from "@/assets/icons";
import { COLOR } from "@/shared/constants/colors.constant";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import {
  addMonths,
  formatDateKey,
  getLastDate,
  getMonthDate,
} from "@/shared/utils/date";
import { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useTopLevelSheet } from "../bottom-sheet/top-level-sheet-provider";
import CalendarMonthPicker from "./calendar-month-picker";

export type CalendarStickerCount = {
  date: string;
  count: number;
};

type CalendarCell = {
  key: string;
  date: Date;
  dayOfMonth: number | null;
};

type CalendarProps = {
  className?: string;
  defaultDate?: Date;
  onMonthChange?: (date: Date) => void;
  stickerCounts?: CalendarStickerCount[];
};

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const CALENDAR_SHADOW_COLOR = COLOR.primary[900];

const getCalendarCells = (date: Date): CalendarCell[] => {
  const monthDate = getMonthDate(date);
  const firstDay = monthDate.getDay();
  const lastDate = getLastDate(monthDate);
  const cellCount = 42;

  return Array.from({ length: cellCount }, (_, index) => {
    const dayOfMonth = index - firstDay + 1;

    if (dayOfMonth < 1 || dayOfMonth > lastDate) {
      return {
        key: `empty-${index}`,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), index),
        dayOfMonth: null,
      };
    }

    const cellDate = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      dayOfMonth,
    );

    return {
      key: formatDateKey(cellDate),
      date: cellDate,
      dayOfMonth,
    };
  });
};

const getStickerLevelClassName = (count: number | undefined) => {
  if (!count) return "bg-white";
  if (count <= 2) return "bg-primary-100";
  if (count <= 4) return "bg-primary-300";
  return "bg-primary-500";
};

const chunkWeeks = (cells: CalendarCell[]) =>
  Array.from({ length: Math.ceil(cells.length / 7) }, (_, weekIndex) =>
    cells.slice(weekIndex * 7, weekIndex * 7 + 7),
  );

type CalendarMonthPickerSheetProps = {
  currentDate: Date;
  maxDate: Date;
  onClose: () => void;
  onSelectMonth: (date: Date) => void;
};

const CalendarMonthPickerSheet = ({
  currentDate,
  maxDate,
  onClose,
  onSelectMonth,
}: CalendarMonthPickerSheetProps) => {
  const [year, setYear] = useState(currentDate.getFullYear());

  return (
    <CalendarMonthPicker
      year={year}
      selectedDate={currentDate}
      maxDate={maxDate}
      onChangeYear={setYear}
      onSelectMonth={(nextDate) => {
        onSelectMonth(nextDate);
        onClose();
      }}
    />
  );
};

const Calendar = ({
  className,
  defaultDate = new Date(),
  onMonthChange,
  stickerCounts = [],
}: CalendarProps) => {
  const [date, setDate] = useState<Date>(() => getMonthDate(defaultDate));
  const todayKey = formatDateKey(new Date());
  const monthLabel = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  const cells = useMemo(() => getCalendarCells(date), [date]);
  const weeks = useMemo(() => chunkWeeks(cells), [cells]);
  const stickerCountMap = useMemo(
    () =>
      new Map(stickerCounts.map((item) => [item.date, item.count] as const)),
    [stickerCounts],
  );

  const { dismissTopLevelSheet, presentTopLevelSheet } = useTopLevelSheet();

  const changeMonth = useCallback(
    (nextDate: Date) => {
      const nextMonthDate = getMonthDate(nextDate);

      setDate(nextMonthDate);
      onMonthChange?.(nextMonthDate);
    },
    [onMonthChange],
  );

  const openMonthPicker = useCallback(() => {
    presentTopLevelSheet({
      snapPoints: ["50%"],
      children: (
        <CalendarMonthPickerSheet
          currentDate={date}
          maxDate={new Date()}
          onClose={dismissTopLevelSheet}
          onSelectMonth={changeMonth}
        />
      ),
    });
  }, [changeMonth, date, dismissTopLevelSheet, presentTopLevelSheet]);

  return (
    <View
      className={cn(
        "w-full rounded-[20px] bg-white px-[20px] pb-[20px] pt-[24px]",
        className,
      )}
      style={{
        shadowColor: CALENDAR_SHADOW_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View className="mb-[24px] flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="이전 달"
          className="h-[24px] w-[24px] items-start justify-center"
          hitSlop={10}
          onPress={() => changeMonth(addMonths(date, -1))}
        >
          <Icon name="ChevronLeft" size={18} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="날짜 선택"
          onPress={openMonthPicker}
        >
          <AppText
            variant="caption1"
            weight="semibold"
            className="text-gray-900"
          >
            {monthLabel}
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="다음 달"
          className="h-[24px] w-[24px] items-end justify-center"
          hitSlop={10}
          onPress={() => changeMonth(addMonths(date, 1))}
        >
          <Icon name="ChevronRightSmall" width={6} height={11} />
        </Pressable>
      </View>

      <View className="gap-[11px]">
        <View className="flex-row items-center justify-between">
          {WEEK_DAYS.map((day, index) => (
            <View key={day} className="w-[45px] items-center">
              <AppText
                variant="button2"
                weight="semibold"
                className={cn(
                  "text-center",
                  index === 0 && "text-red",
                  index > 0 && index < 6 && "text-gray-400",
                  index === 6 && "text-tertiary-500",
                )}
              >
                {day}
              </AppText>
            </View>
          ))}
        </View>

        <View className="gap-[3px]">
          {weeks.map((week, weekIndex) => (
            <View
              key={`week-${weekIndex}`}
              className="flex-row items-center justify-between"
            >
              {week.map((cell) => {
                const dateKey = formatDateKey(cell.date);
                const count = stickerCountMap.get(dateKey);
                const hasSticker = !!count;
                const isToday =
                  cell.dayOfMonth !== null && dateKey === todayKey;

                return (
                  <View
                    key={cell.key}
                    accessibilityLabel={
                      cell.dayOfMonth
                        ? `${dateKey}, 스티커 ${count ?? 0}개`
                        : undefined
                    }
                    className={cn(
                      "h-[45px] w-[45px] items-center justify-center rounded-[9px]",
                      cell.dayOfMonth === null
                        ? "bg-white/50"
                        : getStickerLevelClassName(count),
                      isToday && "border-[1.5px] border-primary-800",
                    )}
                  >
                    {cell.dayOfMonth !== null ? (
                      <AppText
                        variant="button2"
                        weight="medium"
                        className={cn(
                          "text-center",
                          hasSticker ? "text-gray-900" : "text-gray-400",
                        )}
                      >
                        {cell.dayOfMonth}
                      </AppText>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Calendar;
