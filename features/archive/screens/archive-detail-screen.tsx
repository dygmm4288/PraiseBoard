import ArchiveDetailItem from "@/features/archive/components/detail/archive-detail-item";
import { useArchiveDetailQuery } from "@/features/archive/queries/use-archive-detail-query";
import { AppText, Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const ArchiveDetailScreen = () => {
  const params = useLocalSearchParams();
  const boardId = typeof params.id === "string" ? params.id : null;
  const month = getCurrentMonth();
  const {
    data: detail,
    isLoading,
    error,
  } = useArchiveDetailQuery(boardId, month);

  return (
    <Screen>
      <ScreenHeader title="상세보기" />
      <ScrollView className="pt-[12px]">
        {isLoading ? (
          <AppText>ArchiveDetailLoading</AppText>
        ) : error ? (
          <AppText>ArchiveDetailError</AppText>
        ) : (
          <ArchiveDetailItem detail={detail} />
        )}
      </ScrollView>
    </Screen>
  );
};

export default ArchiveDetailScreen;
