import {
  ALARM_HOURS,
  ALARM_MINUTES,
  ALARM_PERIODS,
  AlarmPeriod,
} from "@/features/settings/hooks/use-alarm-time-draft";
import { AppText } from "@/shared/ui";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Pressable,
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
} from "react-native";
import SettingsSheetHeader from "./settings-sheet-header";

const PICKER_COLUMN_HEIGHT = 181;
const PICKER_COLUMN_WIDTH = 90;
const PICKER_CELL_HEIGHT = 42;
const PICKER_ITEM_HEIGHT = PICKER_CELL_HEIGHT;
const PICKER_VERTICAL_PADDING =
  (PICKER_COLUMN_HEIGHT - PICKER_CELL_HEIGHT) / 2;

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
      className="h-[42px] w-full items-center justify-center px-[12px]"
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

const PickerWheelColumn = <T extends string | number>({
  values,
  selectedIndex,
  getLabel,
  onValueChange,
}: {
  values: readonly T[];
  selectedIndex: number;
  getLabel: (value: T) => string;
  onValueChange: (value: T) => void;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedScrollOffset = useMemo(
    () => Math.max(selectedIndex, 0) * PICKER_ITEM_HEIGHT,
    [selectedIndex],
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

    return () => cancelAnimationFrame(frame);
  }, [scrollToSelectedValue]);

  const selectValueAtOffset = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.max(
        0,
        Math.min(
          values.length - 1,
          Math.round(event.nativeEvent.contentOffset.y / PICKER_ITEM_HEIGHT),
        ),
      );
      const value = values[index];

      if (value !== undefined) {
        onValueChange(value);
      }
    },
    [onValueChange, values],
  );

  return (
    <View
      className="relative overflow-hidden"
      style={{ height: PICKER_COLUMN_HEIGHT, width: PICKER_COLUMN_WIDTH }}
    >
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 rounded-[9px] bg-primary-10"
        style={{ height: PICKER_CELL_HEIGHT, top: PICKER_VERTICAL_PADDING }}
      />
      <BottomSheetScrollView
        ref={scrollViewRef}
        style={{ height: PICKER_COLUMN_HEIGHT, width: PICKER_COLUMN_WIDTH }}
        contentOffset={{ x: 0, y: selectedScrollOffset }}
        contentContainerStyle={{ paddingVertical: PICKER_VERTICAL_PADDING }}
        disableIntervalMomentum
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        onContentSizeChange={() => scrollToSelectedValue()}
        onMomentumScrollEnd={selectValueAtOffset}
        showsVerticalScrollIndicator={false}
        snapToInterval={PICKER_ITEM_HEIGHT}
      >
        {values.map((value, index) => (
          <PickerCell
            key={String(value)}
            label={getLabel(value)}
            selected={index === selectedIndex}
            onPress={() => onValueChange(value)}
          />
        ))}
      </BottomSheetScrollView>
    </View>
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
  confirmDisabled?: boolean;
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
  confirmDisabled = false,
}: AlarmTimeSheetContentProps) => {
  return (
    <View className="flex-1 px-[16px]">
      <SettingsSheetHeader
        title="시간 변경하기"
        confirmDisabled={confirmDisabled}
        closeAccessibilityLabel="취소"
        onClose={onClose}
        onConfirm={onConfirm}
      />
      <View className="h-[223px] py-[21px]">
        <View className="h-[181px] w-full flex-row items-center justify-center gap-[9px]">
          <PickerWheelColumn
            values={ALARM_PERIODS}
            selectedIndex={ALARM_PERIODS.indexOf(alarmPeriod)}
            getLabel={(period) => period}
            onValueChange={onChangePeriod}
          />
          <PickerWheelColumn
            values={ALARM_HOURS}
            selectedIndex={ALARM_HOURS.indexOf(alarmHour)}
            getLabel={String}
            onValueChange={onChangeHour}
          />
          <PickerWheelColumn
            values={ALARM_MINUTES}
            selectedIndex={ALARM_MINUTES.indexOf(alarmMinute)}
            getLabel={(minute) => String(minute).padStart(2, "0")}
            onValueChange={onChangeMinute}
          />
        </View>
      </View>
    </View>
  );
};

export default AlarmTimeSheetContent;
