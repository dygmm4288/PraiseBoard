import ArchiveDetailItem from "@/features/archive/components/detail/archive-detail-item";
import { useArchiveDetailQuery } from "@/features/archive/queries/use-archive-detail-query";
import { useBoardSheet } from "@/features/board/hooks/use-board-sheet";
import { Icon } from "@/assets/icons";
import { AppText, Screen } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const ArchiveDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const boardId = typeof params.id === "string" ? params.id : null;
  const month = getCurrentMonth();
  const { openEditSheet } = useBoardSheet();
  const {
    data: detail,
    isLoading,
    error,
  } = useArchiveDetailQuery(boardId, month);

  const handleOpenEditSheet = () => {
    const board = detail?.board;

    if (!board) return;

    openEditSheet({
      id: board.id,
      title: board.title,
      emoji: board.emoji,
      targetCount: board.targetCount,
      limitCount: board.limitCount,
      rewardMemo: board.rewardMemo,
      onDeleted: () => router.back(),
    });
  };

  return (
    <Screen padded={false}>
      <View className="px-screen">
        <View className="h-[45px] flex-row items-center justify-between px-[8px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
            className="h-[39px] w-[39px] items-center justify-center rounded-full bg-bgLightGray"
            onPress={() => router.back()}
          >
            <Icon name="ChevronLeft" size={18} />
          </Pressable>

          <AppText
            variant="custom"
            weight="bold"
            className="text-[18px] leading-[32px] text-black"
          >
            상세보기
          </AppText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="보드 수정"
            disabled={!detail?.board}
            className={cn(
              "h-[39px] w-[39px] items-center justify-center rounded-full bg-bgLightGray",
              !detail?.board && "opacity-40",
            )}
            onPress={handleOpenEditSheet}
          >
            <Icon name="Edit" size={18} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        className="flex-1 overflow-visible"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
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
