import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, View } from "react-native";
import AlarmTimeSheetContent from "../components/sheets/alarm-time-sheet-content";
import NameEditSheetContent from "../components/sheets/name-edit-sheet-content";
import { toReminderTime, useAlarmTimeDraft } from "./use-alarm-time-draft";
import { useSettingsProfile } from "./use-settings-profile";

type EditingSheet = "name" | "time" | null;

export const useSettingsSheets = () => {
  const { dismissTopLevelSheet, presentTopLevelSheet } = useTopLevelSheet();
  const [editingSheet, setEditingSheet] = useState<EditingSheet>(null);
  const [nameSheetInitialName, setNameSheetInitialName] = useState("");
  const { displayName, profile, saveName, saveReminderTime } =
    useSettingsProfile();
  const {
    alarmHour,
    alarmMinute,
    alarmPeriod,
    alarmTimeLabel,
    setAlarmHour,
    setAlarmMinute,
    setAlarmPeriod,
  } = useAlarmTimeDraft({
    initialHour: profile?.reminder_hour,
    initialMinute: profile?.reminder_minute,
  });

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
    setEditingSheet("time");
  }, []);

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
    return editingSheet === "time" ? [345, "50%"] : [300];
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
    alarmTimeLabel,
    displayName,
    openAlarmTimeSheet,
    openNameSheet,
  };
};
