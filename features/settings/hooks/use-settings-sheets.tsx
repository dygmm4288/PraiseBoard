import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useState } from "react";
import AlarmTimeSheetContent from "../components/sheets/alarm-time-sheet-content";
import NameEditSheetContent from "../components/sheets/name-edit-sheet-content";
import {
  toAlarmDraftTime,
  toReminderTime,
  useAlarmTimeDraft,
} from "./use-alarm-time-draft";
import { useSettingsProfile } from "./use-settings-profile";

type AlarmTimeSheetControllerProps = {
  initialHour: number | null | undefined;
  initialMinute: number | null | undefined;
  onClose: () => void;
  onConfirm: (time: ReturnType<typeof toReminderTime>) => Promise<boolean>;
};

const AlarmTimeSheetController = ({
  initialHour,
  initialMinute,
  onClose,
  onConfirm,
}: AlarmTimeSheetControllerProps) => {
  const {
    alarmHour,
    alarmMinute,
    alarmPeriod,
    setAlarmHour,
    setAlarmMinute,
    setAlarmPeriod,
  } = useAlarmTimeDraft({
    initialHour,
    initialMinute,
  });
  const [isSaving, setIsSaving] = useState(false);

  const confirmAlarmTime = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const saved = await onConfirm(
        toReminderTime({ alarmPeriod, alarmHour, alarmMinute }),
      );

      if (saved) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  }, [alarmHour, alarmMinute, alarmPeriod, isSaving, onClose, onConfirm]);

  return (
    <AlarmTimeSheetContent
      alarmHour={alarmHour}
      alarmMinute={alarmMinute}
      alarmPeriod={alarmPeriod}
      onChangeHour={setAlarmHour}
      onChangeMinute={setAlarmMinute}
      onChangePeriod={setAlarmPeriod}
      onClose={onClose}
      onConfirm={confirmAlarmTime}
      confirmDisabled={isSaving}
    />
  );
};

const getPrimaryReminderTime = (
  reminderTimes: unknown,
  fallbackHour: number | null | undefined,
  fallbackMinute: number | null | undefined,
) => {
  if (Array.isArray(reminderTimes)) {
    const firstTime = reminderTimes.find(
      (time): time is { hour: number; minute: number } =>
        typeof time === "object" &&
        time !== null &&
        typeof (time as { hour?: unknown }).hour === "number" &&
        typeof (time as { minute?: unknown }).minute === "number",
    );

    if (firstTime) {
      return firstTime;
    }
  }

  return {
    hour: fallbackHour,
    minute: fallbackMinute,
  };
};

export const useSettingsSheets = () => {
  const { presentTopLevelSheet } = useTopLevelSheet();
  const { displayName, profile, saveName, saveReminderTime } =
    useSettingsProfile();
  const primaryReminderTime = getPrimaryReminderTime(
    profile?.reminder_times,
    profile?.reminder_hour,
    profile?.reminder_minute,
  );
  const savedAlarmTimeLabel = useMemo(() => {
    const savedTime = toAlarmDraftTime(
      primaryReminderTime.hour,
      primaryReminderTime.minute,
    );

    return `${savedTime.alarmPeriod} ${savedTime.alarmHour}:${String(
      savedTime.alarmMinute,
    ).padStart(2, "0")}`;
  }, [primaryReminderTime.hour, primaryReminderTime.minute]);

  const openNameSheet = useCallback(() => {
    presentTopLevelSheet({
      sheetKey: "settings-name",
      snapPoints: [300],
      keyboardBehavior: "interactive",
      keyboardBlurBehavior: "restore",
      enableBlurKeyboardOnGesture: true,
      androidKeyboardInputMode: "adjustPan",
      renderContent: ({ dismiss }) => (
        <BottomSheetView className="flex-1 px-[16px] pb-[16px]">
          <NameEditSheetContent
            initialName={displayName}
            onClose={dismiss}
            onConfirm={saveName}
          />
        </BottomSheetView>
      ),
    });
  }, [
    displayName,
    presentTopLevelSheet,
    saveName,
  ]);

  const openAlarmTimeSheet = useCallback(() => {
    presentTopLevelSheet({
      sheetKey: "settings-alarm-time",
      snapPoints: [345],
      keyboardBehavior: "interactive",
      keyboardBlurBehavior: "restore",
      enableBlurKeyboardOnGesture: true,
      enableContentPanningGesture: false,
      renderContent: ({ dismiss }) => (
        <BottomSheetView className="flex-1">
          <AlarmTimeSheetController
            initialHour={primaryReminderTime.hour}
            initialMinute={primaryReminderTime.minute}
            onClose={dismiss}
            onConfirm={saveReminderTime}
          />
        </BottomSheetView>
      ),
    });
  }, [
    presentTopLevelSheet,
    primaryReminderTime.hour,
    primaryReminderTime.minute,
    saveReminderTime,
  ]);

  return {
    alarmTimeLabel: savedAlarmTimeLabel,
    displayName,
    openAlarmTimeSheet,
    openNameSheet,
  };
};
