import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, View } from "react-native";
import AlarmTimeSheetContent from "../components/sheets/alarm-time-sheet-content";
import NameEditSheetContent from "../components/sheets/name-edit-sheet-content";
import { useAlarmTimeDraft } from "./use-alarm-time-draft";
import { useSettingsProfile } from "./use-settings-profile";

type EditingSheet = "name" | "time" | null;

export const useSettingsSheets = () => {
  const { dismissTopLevelSheet, presentTopLevelSheet } = useTopLevelSheet();
  const [editingSheet, setEditingSheet] = useState<EditingSheet>(null);
  const {
    displayName,
    draftName,
    isSavingName,
    resetDraftName,
    saveDraftName,
    setDraftName,
  } = useSettingsProfile();
  const {
    alarmHour,
    alarmMinute,
    alarmPeriod,
    alarmTimeLabel,
    setAlarmHour,
    setAlarmMinute,
    setAlarmPeriod,
  } = useAlarmTimeDraft();

  const closeNameSheet = useCallback(
    ({ resetName }: { resetName: boolean }) => {
      Keyboard.dismiss();
      setEditingSheet(null);

      if (resetName) {
        resetDraftName();
      }
    },
    [resetDraftName],
  );

  const closeSheet = useCallback(() => {
    if (editingSheet === "name") {
      closeNameSheet({ resetName: true });
      return;
    }

    setEditingSheet(null);
    resetDraftName();
  }, [closeNameSheet, editingSheet, resetDraftName]);

  const openNameSheet = useCallback(() => {
    resetDraftName();
    setEditingSheet("name");
  }, [resetDraftName]);

  const openAlarmTimeSheet = useCallback(() => {
    setEditingSheet("time");
  }, []);

  const handleSaveName = useCallback(async () => {
    const saved = await saveDraftName();
    if (saved) {
      closeNameSheet({ resetName: false });
    }
  }, [closeNameSheet, saveDraftName]);

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
              draftName={draftName}
              isSaving={isSavingName}
              onChangeDraftName={setDraftName}
              onClose={closeSheet}
              onConfirm={handleSaveName}
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
            onConfirm={() => setEditingSheet(null)}
          />
        ),
    });
  }, [
    alarmHour,
    alarmMinute,
    alarmPeriod,
    closeSheet,
    dismissTopLevelSheet,
    draftName,
    editingSheet,
    handleSaveName,
    isSavingName,
    presentTopLevelSheet,
    setAlarmHour,
    setAlarmMinute,
    setAlarmPeriod,
    setDraftName,
    snapPoints,
  ]);

  return {
    alarmTimeLabel,
    displayName,
    openAlarmTimeSheet,
    openNameSheet,
  };
};
