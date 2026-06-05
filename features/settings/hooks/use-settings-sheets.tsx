import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { useCallback, useEffect, useState } from "react";
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

  const closeSheet = useCallback(() => {
    setEditingSheet(null);
    resetDraftName();
  }, [resetDraftName]);

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
      setEditingSheet(null);
    }
  }, [saveDraftName]);

  useEffect(() => {
    return () => {
      dismissTopLevelSheet();
    };
  }, [dismissTopLevelSheet]);

  useEffect(() => {
    if (!editingSheet) {
      dismissTopLevelSheet();
      return;
    }

    presentTopLevelSheet({
      snapPoints: [editingSheet === "time" ? 345 : 300],
      onClose: closeSheet,
      children:
        editingSheet === "name" ? (
          <NameEditSheetContent
            draftName={draftName}
            isSaving={isSavingName}
            onChangeDraftName={setDraftName}
            onClose={closeSheet}
            onConfirm={handleSaveName}
          />
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
  ]);

  return {
    alarmTimeLabel,
    displayName,
    openAlarmTimeSheet,
    openNameSheet,
  };
};
