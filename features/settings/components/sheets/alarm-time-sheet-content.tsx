import {
  ALARM_HOURS,
  ALARM_MINUTES,
  ALARM_PERIODS,
  AlarmPeriod,
} from "@/features/settings/hooks/use-alarm-time-draft";
import { AppText } from "@/shared/ui";
import { Pressable, View } from "react-native";
import SettingsSheetHeader from "./settings-sheet-header";

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
      <View className="flex-row justify-center gap-[9px] py-[21px]">
        <View className="w-[90px] gap-[9px] pt-[51px]">
          {ALARM_PERIODS.map((period) => (
            <PickerCell
              key={period}
              label={period}
              selected={period === alarmPeriod}
              onPress={() => onChangePeriod(period)}
            />
          ))}
        </View>
        <View className="w-[90px] gap-[9px]">
          {ALARM_HOURS.map((hour) => (
            <PickerCell
              key={hour}
              label={String(hour)}
              selected={hour === alarmHour}
              onPress={() => onChangeHour(hour)}
            />
          ))}
        </View>
        <View className="w-[90px] gap-[9px]">
          {ALARM_MINUTES.map((minute) => (
            <PickerCell
              key={minute}
              label={String(minute).padStart(2, "0")}
              selected={minute === alarmMinute}
              onPress={() => onChangeMinute(minute)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default AlarmTimeSheetContent;
