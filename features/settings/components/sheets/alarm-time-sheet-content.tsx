import {
  ALARM_HOURS,
  ALARM_MINUTES,
  ALARM_PERIODS,
  AlarmPeriod,
} from "@/features/settings/hooks/use-alarm-time-draft";
import { AppText } from "@/shared/ui";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import SettingsSheetHeader from "./settings-sheet-header";

const PICKER_COLUMN_HEIGHT = 181;
const PICKER_COLUMN_WIDTH = 90;
const PICKER_CELL_GAP = 9;

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
        variant="custom"
        weight="medium"
        className={[
          "text-center text-[15px] leading-[25px]",
          selected ? "text-primary-50" : "text-textGray",
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

const PickerScrollColumn = ({ children }: { children: ReactNode }) => {
  return (
    <BottomSheetScrollView
      style={{ height: PICKER_COLUMN_HEIGHT, width: PICKER_COLUMN_WIDTH }}
      contentContainerStyle={{ gap: PICKER_CELL_GAP }}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
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
          <PickerScrollColumn>
            {ALARM_HOURS.map((hour) => (
              <PickerCell
                key={hour}
                label={String(hour)}
                selected={hour === alarmHour}
                onPress={() => onChangeHour(hour)}
              />
            ))}
          </PickerScrollColumn>
          <PickerScrollColumn>
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
