import {
  ALARM_HOURS,
  ALARM_MINUTES,
  ALARM_PERIODS,
  AlarmPeriod,
} from "@/features/settings/hooks/use-alarm-time-draft";
import { AppText } from "@/shared/ui";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import SettingsSheetHeader from "./settings-sheet-header";

const PICKER_COLUMN_HEIGHT = 181;
const PICKER_COLUMN_WIDTH = 90;
const PICKER_CELL_HEIGHT = 42;
const PICKER_CELL_GAP = 9;
const PICKER_ITEM_HEIGHT = PICKER_CELL_HEIGHT + PICKER_CELL_GAP;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getSelectedScrollOffset = ({
  itemCount,
  selectedIndex,
}: {
  itemCount: number;
  selectedIndex: number;
}) => {
  const contentHeight =
    itemCount * PICKER_CELL_HEIGHT + (itemCount - 1) * PICKER_CELL_GAP;
  const maxOffset = Math.max(contentHeight - PICKER_COLUMN_HEIGHT, 0);
  const centeredOffset =
    selectedIndex * PICKER_ITEM_HEIGHT -
    (PICKER_COLUMN_HEIGHT - PICKER_CELL_HEIGHT) / 2;

  return clamp(centeredOffset, 0, maxOffset);
};

const PickerCell = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable
      className={[
        "h-[42px] w-full items-center justify-center rounded-[9px] px-[12px]",
        selected ? "bg-primary-10" : "bg-white",
      ].join(" ")}
      onPress={onPress}
    >
      <AppText
        variant="button15"
        weight="medium"
        className={[
          "text-center",
          selected ? "text-primary-50" : "text-content-disabled",
        ].join(" ")}
      >
        {label}
      </AppText>
    </Pressable>
  );
};

const PickerStaticColumn = ({ children }: { children: ReactNode }) => {
  return (
    <View
      className="justify-center"
      style={{
        height: PICKER_COLUMN_HEIGHT,
        width: PICKER_COLUMN_WIDTH,
        gap: PICKER_CELL_GAP,
      }}
    >
      {children}
    </View>
  );
};

const PickerScrollColumn = ({
  children,
  itemCount,
  selectedIndex,
}: {
  children: ReactNode;
  itemCount: number;
  selectedIndex: number;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedScrollOffset = useMemo(
    () => getSelectedScrollOffset({ itemCount, selectedIndex }),
    [itemCount, selectedIndex],
  );

  const scrollToSelectedValue = useCallback(
    (animated = false) => {
      scrollViewRef.current?.scrollTo({
        y: selectedScrollOffset,
        animated,
      });
    },
    [selectedScrollOffset],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollToSelectedValue();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [scrollToSelectedValue]);

  return (
    <BottomSheetScrollView
      ref={scrollViewRef}
      style={{ height: PICKER_COLUMN_HEIGHT, width: PICKER_COLUMN_WIDTH }}
      contentOffset={{ x: 0, y: selectedScrollOffset }}
      contentContainerStyle={{ gap: PICKER_CELL_GAP }}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      onContentSizeChange={() => scrollToSelectedValue()}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </BottomSheetScrollView>
  );
};

type AlarmTimeSheetContentProps = {
  alarmPeriod: AlarmPeriod;
  alarmHour: number;
  alarmMinute: number;
  onChangePeriod: (period: AlarmPeriod) => void;
  onChangeHour: (hour: number) => void;
  onChangeMinute: (minute: number) => void;
  onClose: () => void;
  onConfirm: () => void;
};

const AlarmTimeSheetContent = ({
  alarmPeriod,
  alarmHour,
  alarmMinute,
  onChangePeriod,
  onChangeHour,
  onChangeMinute,
  onClose,
  onConfirm,
}: AlarmTimeSheetContentProps) => {
  return (
    <View className="flex-1 px-[16px]">
      <SettingsSheetHeader
        title="시간 변경하기"
        onClose={onClose}
        onConfirm={onConfirm}
      />
      <View className="h-[223px] py-[21px]">
        <View className="h-[181px] w-full flex-row items-center justify-center gap-[9px]">
          <PickerStaticColumn>
            {ALARM_PERIODS.map((period) => (
              <PickerCell
                key={period}
                label={period}
                selected={period === alarmPeriod}
                onPress={() => onChangePeriod(period)}
              />
            ))}
          </PickerStaticColumn>
          <PickerScrollColumn
            itemCount={ALARM_HOURS.length}
            selectedIndex={ALARM_HOURS.indexOf(alarmHour)}
          >
            {ALARM_HOURS.map((hour) => (
              <PickerCell
                key={hour}
                label={String(hour)}
                selected={hour === alarmHour}
                onPress={() => onChangeHour(hour)}
              />
            ))}
          </PickerScrollColumn>
          <PickerScrollColumn
            itemCount={ALARM_MINUTES.length}
            selectedIndex={ALARM_MINUTES.indexOf(alarmMinute)}
          >
            {ALARM_MINUTES.map((minute) => (
              <PickerCell
                key={minute}
                label={String(minute).padStart(2, "0")}
                selected={minute === alarmMinute}
                onPress={() => onChangeMinute(minute)}
              />
            ))}
          </PickerScrollColumn>
        </View>
      </View>
    </View>
  );
};

export default AlarmTimeSheetContent;
