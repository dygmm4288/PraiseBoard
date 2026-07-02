import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, View } from "react-native";
import AlarmTimeSheetContent from "../components/sheets/alarm-time-sheet-content";
import NameEditSheetContent from "../components/sheets/name-edit-sheet-content";
import {
  toAlarmDraftTime,
  toReminderTime,
  useAlarmTimeDraft,
} from "./use-alarm-time-draft";
import { useSettingsProfile } from "./use-settings-profile";

type EditingSheet = "name" | "time" | null;

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
  const [nameSheetInitialName, setNameSheetInitialName] = useState("");
  const { displayName, profile, saveName, saveReminderTime } =
    useSettingsProfile();
  const primaryReminderTime = getPrimaryReminderTime(
    profile?.reminder_times,
    profile?.reminder_hour,
    profile?.reminder_minute,
  );
  const {
    alarmHour,
    alarmMinute,
    alarmPeriod,
    setAlarmHour,
    setAlarmMinute,
    setAlarmPeriod,
  } = useAlarmTimeDraft({
    initialHour: primaryReminderTime.hour,
    initialMinute: primaryReminderTime.minute,
  });
  const savedAlarmTimeLabel = useMemo(() => {
    const savedTime = toAlarmDraftTime(
      primaryReminderTime.hour,
      primaryReminderTime.minute,
    );

    return `${savedTime.alarmPeriod} ${savedTime.alarmHour}:${String(
      savedTime.alarmMinute,
    ).padStart(2, "0")}`;
  }, [primaryReminderTime.hour, primaryReminderTime.minute]);

  const closeNameSheet = useCallback(() => {
    Keyboard.dismiss();
    setEditingSheet(null);
  }, []);

  const closeSheet = useCallback(() => {
    if (editingSheet === "name") {
      closeNameSheet();
      return;
    }

    setEditingSheet(null);
  }, [closeNameSheet, editingSheet]);

  const openNameSheet = useCallback(() => {
    setNameSheetInitialName(displayName);
    setEditingSheet("name");
  }, [displayName]);

  const openAlarmTimeSheet = useCallback(() => {
    const savedTime = toAlarmDraftTime(
      primaryReminderTime.hour,
      primaryReminderTime.minute,
    );

    setAlarmPeriod(savedTime.alarmPeriod);
    setAlarmHour(savedTime.alarmHour);
    setAlarmMinute(savedTime.alarmMinute);
    setEditingSheet("time");
  }, [
    primaryReminderTime.hour,
    primaryReminderTime.minute,
    setAlarmHour,
    setAlarmMinute,
    setAlarmPeriod,
  ]);

  const confirmAlarmTime = useCallback(async () => {
    const saved = await saveReminderTime(
      toReminderTime({ alarmPeriod, alarmHour, alarmMinute }),
    );

    if (saved) {
      setEditingSheet(null);
    }
  }, [
    alarmHour,
    alarmMinute,
    alarmPeriod,
    saveReminderTime,
  ]);

  useEffect(() => {
    return () => {
      dismissTopLevelSheet();
    };
  }, [dismissTopLevelSheet]);

  const snapPoints = useMemo(() => {
    return editingSheet === "time" ? [345] : [300];
  }, [editingSheet]);

  useEffect(() => {
    if (!editingSheet) {
      dismissTopLevelSheet();
      return;
    }

    presentTopLevelSheet({
      snapPoints,
      onClose: closeSheet,
      keyboardBehavior: "interactive",
      androidKeyboardInputMode:
        editingSheet === "name" ? "adjustPan" : undefined,
      enableContentPanningGesture: editingSheet !== "time",
      children:
        editingSheet === "name" ? (
          <View className="flex-1 px-[16px] pb-[16px]">
            <NameEditSheetContent
              initialName={nameSheetInitialName}
              onClose={closeSheet}
              onConfirm={saveName}
            />
          </View>
        ) : (
          <AlarmTimeSheetContent
            alarmHour={alarmHour}
            alarmMinute={alarmMinute}
            alarmPeriod={alarmPeriod}
            onChangeHour={setAlarmHour}
            onChangeMinute={setAlarmMinute}
            onChangePeriod={setAlarmPeriod}
            onClose={closeSheet}
            onConfirm={confirmAlarmTime}
          />
        ),
    });
  }, [
    alarmHour,
    alarmMinute,
    alarmPeriod,
    closeSheet,
    confirmAlarmTime,
    dismissTopLevelSheet,
    editingSheet,
    nameSheetInitialName,
    presentTopLevelSheet,
    setAlarmHour,
    setAlarmMinute,
    setAlarmPeriod,
    snapPoints,
    saveName,
  ]);

  return {
    alarmTimeLabel: savedAlarmTimeLabel,
    displayName,
    openAlarmTimeSheet,
    openNameSheet,
  };
};
