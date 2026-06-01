import { appSettings } from "@/services/app-settings";
import { toast } from "@/shared/toasts/toast";
import { AppText } from "@/shared/ui";
import { compareVersions } from "@/shared/utils/version";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import { Linking, Platform, View } from "react-native";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingLink from "../setting-link";

const APP_NAME = Constants.expoConfig?.name ?? "PraiseBoard";

const getStoreUrl = () => {
  if (Platform.OS === "ios") {
    return `https://apps.apple.com/search?term=${encodeURIComponent(APP_NAME)}`;
  }

  if (Platform.OS === "android") {
    const packageName = Constants.expoConfig?.android?.package;

    return packageName
      ? `market://details?id=${packageName}`
      : `https://play.google.com/store/search?q=${encodeURIComponent(
          APP_NAME,
        )}&c=apps`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(
    `${APP_NAME} app store`,
  )}`;
};

const SettingInfo = () => {
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const { data, error, isLoading } = useQuery({
    queryKey: ["app-settings"],
    queryFn: appSettings.getAppSettings,
    staleTime: 1000 * 60 * 10,
  });
  const latestVersion = data?.latest_version;
  const needsUpdate = latestVersion
    ? compareVersions(latestVersion, appVersion) > 0
    : false;
  const versionStatusLabel = isLoading
    ? "확인 중"
    : error
      ? "확인 실패"
      : needsUpdate
        ? "업데이트가 필요해요"
        : "최신 버전";
  const handleOpenStore = async () => {
    if (!needsUpdate) return;

    const storeUrl = getStoreUrl();

    try {
      await Linking.openURL(storeUrl);
    } catch {
      toast.error("스토어를 여는 중 오류가 발생했어요.");
    }
  };

  return (
    <SettingSectionLayout title="앱 정보">
      <SettingLink
        value="문의사항"
        right={
          <AppText
            variant="custom"
            className="text-[14px] leading-[20px] text-black"
          >
            whaledone26@gmail.com
          </AppText>
        }
        showChevron={false}
      />
      <SettingLink
        value={`앱 버전 ${appVersion}`}
        right={
          <View
            className={[
              "rounded-[30px] px-[9px] py-[3px]",
              needsUpdate ? "bg-danger-surface" : "bg-bgLightGray",
            ].join(" ")}
          >
            <AppText
              variant="custom"
              weight="semibold"
              className={[
                "text-[12px] leading-[20px]",
                needsUpdate || error ? "text-jinoRed" : "text-labelGray",
              ].join(" ")}
            >
              {versionStatusLabel}
            </AppText>
          </View>
        }
        onLink={handleOpenStore}
      />
    </SettingSectionLayout>
  );
};

export default SettingInfo;
