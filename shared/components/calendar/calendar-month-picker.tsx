import { Icon } from "@/assets/icons";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { Pressable, View } from "react-native";

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

type CalendarMonthPickerProps = {
  year: number;
  selectedDate?: Date;
  selectedMonth?: number;
  minDate?: Date;
  maxDate?: Date;
  onChangeYear?: (year: number) => void;
  onSelectMonth?: (date: Date) => void;
};

const isMonthDisabled = ({
  year,
  month,
  minDate,
  maxDate,
}: {
  year: number;
  month: number;
  minDate?: Date;
  maxDate?: Date;
}) => {
  const monthDate = new Date(year, month - 1, 1);
  const minMonthDate = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    : null;
  const maxMonthDate = maxDate
    ? new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
    : null;

  if (minMonthDate && monthDate < minMonthDate) return true;
  if (maxMonthDate && monthDate > maxMonthDate) return true;

  return false;
};

const CalendarMonthPicker = ({
  year,
  selectedDate,
  selectedMonth,
  minDate,
  maxDate,
  onChangeYear,
  onSelectMonth,
}: CalendarMonthPickerProps) => {
  const canGoPreviousYear =
    !minDate || year > new Date(minDate.getFullYear(), 0, 1).getFullYear();
  const canGoNextYear =
    !maxDate || year < new Date(maxDate.getFullYear(), 0, 1).getFullYear();

  return (
    <View className="w-full bg-white px-[16px]">
      <View className="h-[45px] flex-row items-center justify-between px-[8px]">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="이전 연도"
          disabled={!canGoPreviousYear}
          className={cn(
            "h-[39px] w-[39px] items-center justify-center rounded-full bg-bgLightGray",
            !canGoPreviousYear && "opacity-20",
          )}
          onPress={() => onChangeYear?.(year - 1)}
        >
          <Icon name="ChevronLeft" size={18} />
        </Pressable>

        <AppText
          variant="custom"
          weight="bold"
          className="text-[18px] leading-[32px] text-black"
        >
          {year}년
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="다음 연도"
          disabled={!canGoNextYear}
          className={cn(
            "h-[39px] w-[39px] items-center justify-center rounded-full bg-bgLightGray",
            !canGoNextYear && "opacity-20",
          )}
          onPress={() => onChangeYear?.(year + 1)}
        >
          <Icon name="ChevronRightSmall" size={18} />
        </Pressable>
      </View>

      <View className="py-[21px]">
        <View className="flex-row flex-wrap gap-[6px]">
          {MONTHS.map((month) => {
            const disabled = isMonthDisabled({
              year,
              month,
              minDate,
              maxDate,
            });
            const selected =
              !disabled &&
              (selectedDate
                ? year === selectedDate.getFullYear() &&
                  month === selectedDate.getMonth() + 1
                : month === selectedMonth);

            return (
              <Pressable
                key={month}
                accessibilityRole="button"
                accessibilityLabel={`${month}월 선택`}
                accessibilityState={{ selected, disabled }}
                disabled={disabled}
                className={cn(
                  "h-[42px] flex-1 basis-[31%] items-center justify-center rounded-[12px] border border-bgLightGray bg-white px-[12px]",
                  selected &&
                    "rounded-[9px] border-primary-50 bg-primary-10 px-[13px]",
                  disabled && "border-bgLightGray bg-white",
                )}
                onPress={() => onSelectMonth?.(new Date(year, month - 1, 1))}
              >
                <AppText
                  variant="custom"
                  weight="medium"
                  numberOfLines={1}
                  className={cn(
                    "text-center text-[15px] leading-[25px] text-bgDarkGray",
                    selected && "text-primary-50",
                    disabled && "text-textGray",
                  )}
                >
                  {month}월
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default CalendarMonthPicker;
