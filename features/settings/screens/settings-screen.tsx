import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import SettingEnv from "../components/sections/setting-env";
import SettingInfo from "../components/sections/setting-info";
import SettingNotification from "../components/sections/setting-notification";
import SettingProfile from "../components/sections/setting-profile";
import AlarmTimeSheetContent from "../components/sheets/alarm-time-sheet-content";
import NameEditSheetContent from "../components/sheets/name-edit-sheet-content";
import { useAlarmTimeDraft } from "../hooks/use-alarm-time-draft";
import { useSettingsProfile } from "../hooks/use-settings-profile";

type EditingSheet = "name" | "time" | null;

const SettingsScreen = () => {
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
  ]);

  return (
    <Screen className="pb-[118px]">
      <ScreenHeader title="설정" className="px-[8px]" />
      <ScrollView
        className="mt-[12px] flex-1"
        contentContainerClassName="gap-[30px] pb-[24px]"
        showsVerticalScrollIndicator={false}
      >
        {/* 내 정보 */}
        <SettingProfile
          name={displayName}
          onEditName={() => {
            resetDraftName();
            setEditingSheet("name");
          }}
        />

        {/* 알림 */}
        <SettingNotification
          alarmTimeLabel={alarmTimeLabel}
          onEditAlarmTime={() => setEditingSheet("time")}
        />
        {/* 환경 */}
        <SettingEnv />

        {/* 앱 정보 */}
        <SettingInfo />
      </ScrollView>
    </Screen>
  );
};

export default SettingsScreen;
