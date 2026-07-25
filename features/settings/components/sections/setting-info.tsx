import {
  openAppStore,
  type AppVersionQueryStatus,
  useAppVersion,
} from "@/services/app-settings";
import { toast } from "@/shared/toasts/toast";
import { AppText } from "@/shared/ui";
import { View } from "react-native";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingLink from "../setting-link";

const VERSION_STATUS_LABEL: Record<AppVersionQueryStatus, string> = {
  checking: "확인 중",
  unavailable: "확인 실패",
  required: "업데이트가 필요해요",
  available: "새 버전이 있어요",
  current: "최신 버전",
};

const SettingInfo = () => {
  const { currentVersion, shouldOpenStore, status } = useAppVersion();

  const handleOpenStore = async () => {
    if (!shouldOpenStore) return;

    try {
      await openAppStore();
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
            variant="body14"
            className="text-black"
          >
            whaledone26@gmail.com
          </AppText>
        }
        showChevron={false}
      />
      <SettingLink
        value={`앱 버전 ${currentVersion}`}
        right={
          <View
            className={[
              "rounded-[30px] px-[9px] py-[3px]",
              shouldOpenStore ? "bg-danger-surface" : "bg-surface-subtle",
            ].join(" ")}
          >
            <AppText
              variant="label12"
              weight="semibold"
              className={
                shouldOpenStore || status === "unavailable"
                  ? "text-danger"
                  : "text-content-tertiary"
              }
            >
              {VERSION_STATUS_LABEL[status]}
            </AppText>
          </View>
        }
        onLink={handleOpenStore}
      />
    </SettingSectionLayout>
  );
};

export default SettingInfo;
