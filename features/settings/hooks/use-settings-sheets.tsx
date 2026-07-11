import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useState } from "react";
import AlarmTimeSheetContent from "../components/sheets/alarm-time-sheet-content";
import NameEditSheetContent from "../components/sheets/name-edit-sheet-content";
import {
  toAlarmDraftTime,
  toReminderTime,
  useAlarmTimeDraft,
} from "./use-alarm-time-draft";
import { useSettingsProfile } from "./use-settings-profile";

type EditingSheet = "name" | "time" | null;

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

  const confirmAlarmTime = useCallback(async () => {
    const saved = await onConfirm(
      toReminderTime({ alarmPeriod, alarmHour, alarmMinute }),
    );

    if (saved) {
      onClose();
    }
  }, [alarmHour, alarmMinute, alarmPeriod, onClose, onConfirm]);

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
  const { dismissTopLevelSheet, presentTopLevelSheet } = useTopLevelSheet();
  const [editingSheet, setEditingSheet] = useState<EditingSheet>(null);
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

  const closeSheet = useCallback(() => {
    setEditingSheet(null);
  }, []);

  const requestCloseSheet = useCallback(() => {
    dismissTopLevelSheet({ runOnClose: true });
  }, [dismissTopLevelSheet]);

  const openNameSheet = useCallback(() => {
    setEditingSheet("name");

    presentTopLevelSheet({
      snapPoints: [300],
      onClose: closeSheet,
      keyboardBehavior: "interactive",
      keyboardBlurBehavior: "restore",
      enableBlurKeyboardOnGesture: true,
      androidKeyboardInputMode: "adjustPan",
      children: (
        <BottomSheetView className="flex-1 px-[16px] pb-[16px]">
          <NameEditSheetContent
            initialName={displayName}
            onClose={requestCloseSheet}
            onConfirm={saveName}
          />
        </BottomSheetView>
      ),
    });
  }, [
    closeSheet,
    displayName,
    presentTopLevelSheet,
    requestCloseSheet,
    saveName,
  ]);

  const openAlarmTimeSheet = useCallback(() => {
    setEditingSheet("time");

    presentTopLevelSheet({
      snapPoints: [345],
      onClose: closeSheet,
      keyboardBehavior: "interactive",
      keyboardBlurBehavior: "restore",
      enableBlurKeyboardOnGesture: true,
      enableContentPanningGesture: false,
      children: (
        <BottomSheetView className="flex-1">
          <AlarmTimeSheetController
            initialHour={primaryReminderTime.hour}
            initialMinute={primaryReminderTime.minute}
            onClose={requestCloseSheet}
            onConfirm={saveReminderTime}
          />
        </BottomSheetView>
      ),
    });
  }, [
    closeSheet,
    presentTopLevelSheet,
    primaryReminderTime.hour,
    primaryReminderTime.minute,
    requestCloseSheet,
    saveReminderTime,
  ]);

  useEffect(() => {
    return () => {
      dismissTopLevelSheet();
    };
  }, [dismissTopLevelSheet]);

  useEffect(() => {
    if (!editingSheet) {
      dismissTopLevelSheet();
    }
  }, [dismissTopLevelSheet, editingSheet]);

  return {
    alarmTimeLabel: savedAlarmTimeLabel,
    displayName,
    openAlarmTimeSheet,
    openNameSheet,
  };
};
