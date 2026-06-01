import { useCurrentProfile, useUser } from "@/services/user";
import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { toast } from "@/shared/toasts/toast";
import { AppText, Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import SettingEnv from "../components/sections/setting-env";
import SettingInfo from "../components/sections/setting-info";
import SettingNotification from "../components/sections/setting-notification";
import SettingProfile from "../components/sections/setting-profile";

type EditingSheet = "name" | "time" | null;

const PERIODS = ["오전", "오후"] as const;
const HOURS = [7, 8, 9, 10, 11];
const MINUTES = [58, 59, 0, 1, 2];

const SheetIconButton = ({
  label,
  variant,
  onPress,
}: {
  label: string;
  variant: "neutral" | "primary";
  onPress: () => void;
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      className={[
        "h-[39px] w-[39px] items-center justify-center rounded-full",
        variant === "primary" ? "bg-primary-10" : "bg-bgLightGray",
      ].join(" ")}
      onPress={onPress}
    >
      <AppText
        variant="custom"
        weight="medium"
        className={[
          "text-[22px] leading-[24px]",
          variant === "primary" ? "text-primary-50" : "text-black",
        ].join(" ")}
      >
        {label}
      </AppText>
    </Pressable>
  );
};

const SheetHeader = ({
  title,
  onClose,
  onConfirm,
}: {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <View className="h-[45px] flex-row items-center justify-between px-[24px]">
      <SheetIconButton label="×" variant="neutral" onPress={onClose} />
      <AppText
        variant="custom"
        weight="bold"
        className="text-[18px] leading-[32px] text-black"
      >
        {title}
      </AppText>
      <SheetIconButton label="✓" variant="primary" onPress={onConfirm} />
    </View>
  );
};

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

const SettingsScreen = () => {
  const { dismissTopLevelSheet, presentTopLevelSheet } = useTopLevelSheet();
  const { profileId, authState } = useUser();
  const { nickname, updateProfile } = useCurrentProfile(profileId);
  const displayName =
    nickname || (authState === "anonymous" ? "김고래" : "이름 없음");
  const [editingSheet, setEditingSheet] = useState<EditingSheet>(null);
  const [draftName, setDraftName] = useState(displayName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [alarmPeriod, setAlarmPeriod] =
    useState<(typeof PERIODS)[number]>("오후");
  const [alarmHour, setAlarmHour] = useState(9);
  const [alarmMinute, setAlarmMinute] = useState(0);

  useEffect(() => {
    setDraftName(displayName);
  }, [displayName]);

  const alarmTimeLabel = useMemo(
    () =>
      `${alarmPeriod} ${alarmHour}:${String(alarmMinute).padStart(2, "0")}`,
    [alarmHour, alarmMinute, alarmPeriod],
  );

  const closeSheet = useCallback(() => {
    setEditingSheet(null);
    setDraftName(displayName);
  }, [displayName]);

  const handleSaveName = useCallback(async () => {
    const nextName = draftName.trim();

    if (!nextName) {
      toast.error("이름을 입력해 주세요.");
      return;
    }

    setIsSavingName(true);

    try {
      await updateProfile({ nickname: nextName });
      setEditingSheet(null);
    } catch {
      toast.error("이름을 저장하는 중 오류가 발생했어요.");
    } finally {
      setIsSavingName(false);
    }
  }, [draftName, updateProfile]);

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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1 px-[16px]"
          >
            <SheetHeader
              title="이름 변경하기"
              onClose={closeSheet}
              onConfirm={handleSaveName}
            />
            <View className="py-[21px]">
              <AppText
                variant="custom"
                weight="semibold"
                className="mb-[6px] text-[12px] leading-[20px] text-labelGray"
              >
                이름
              </AppText>
              <View className="h-[42px] flex-row items-center rounded-[12px] border border-primary-50 px-[12px]">
                <TextInput
                  className="min-w-0 flex-1 p-0 font-pretendard text-[14px] leading-[20px] text-black"
                  value={draftName}
                  maxLength={20}
                  editable={!isSavingName}
                  autoFocus
                  onChangeText={setDraftName}
                />
                {draftName.length > 0 && (
                  <Pressable
                    className="h-[22px] w-[22px] items-center justify-center"
                    onPress={() => setDraftName("")}
                  >
                    <AppText className="text-[18px] leading-[20px] text-labelGray">
                      ×
                    </AppText>
                  </Pressable>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View className="flex-1 px-[16px]">
            <SheetHeader
              title="시간 변경하기"
              onClose={closeSheet}
              onConfirm={() => setEditingSheet(null)}
            />
            <View className="flex-row justify-center gap-[9px] py-[21px]">
              <View className="w-[90px] gap-[9px] pt-[51px]">
                {PERIODS.map((period) => (
                  <PickerCell
                    key={period}
                    label={period}
                    selected={period === alarmPeriod}
                    onPress={() => setAlarmPeriod(period)}
                  />
                ))}
              </View>
              <View className="w-[90px] gap-[9px]">
                {HOURS.map((hour) => (
                  <PickerCell
                    key={hour}
                    label={String(hour)}
                    selected={hour === alarmHour}
                    onPress={() => setAlarmHour(hour)}
                  />
                ))}
              </View>
              <View className="w-[90px] gap-[9px]">
                {MINUTES.map((minute) => (
                  <PickerCell
                    key={minute}
                    label={String(minute).padStart(2, "0")}
                    selected={minute === alarmMinute}
                    onPress={() => setAlarmMinute(minute)}
                  />
                ))}
              </View>
            </View>
          </View>
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
            setDraftName(displayName);
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
