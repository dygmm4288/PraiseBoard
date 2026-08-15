import { Icon } from "@/assets/icons";
import ArchiveDetailItem from "@/features/archive/components/detail/archive-detail-item";
import ArchiveDetailSkeleton from "@/features/archive/components/detail/archive-detail-skeleton";
import { useArchiveDetailQuery } from "@/features/archive/queries/use-archive-detail-query";
import { useBoardSheet } from "@/features/board";
import DebugForceCompleteBoardButton from "@/features/debug/debug-force-complete-board-button";
import { useTrackView } from "@/services/analytics";
import { useTodayKey } from "@/shared/hooks/use-today-key";
import { AppText, Screen } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { formatMonthKey } from "@/shared/utils/date";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ArchiveDetailScreen = () => {
  useTrackView("detail");
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const boardId = typeof params.id === "string" ? params.id : null;
  const todayKey = useTodayKey();
  const [month, setMonth] = useState(() => todayKey.slice(0, 7));
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
      currentCount: board.currentCount,
      limitCount: board.limitCount,
      rewardMemo: board.rewardMemo,
      onDeleted: () => router.back(),
    });
  };

  return (
    <Screen padded={false} safeEdges={["top", "left", "right"]}>
      <View className="px-screen">
        <View className="h-[45px] flex-row items-center justify-between px-[8px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
            className="h-[39px] w-[39px] items-center justify-center rounded-full bg-surface-subtle"
            onPress={() => router.back()}
          >
            <Icon name="ChevronLeft" size={18} />
          </Pressable>

          <AppText
            variant="title18"
            weight="bold"
            className="text-black"
          >
            상세보기
          </AppText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="보드 수정"
            disabled={!detail?.board}
            className={cn(
              "h-[39px] w-[39px] items-center justify-center rounded-full bg-surface-subtle",
              !detail?.board && "opacity-40",
            )}
            onPress={handleOpenEditSheet}
          >
            <Icon name="Edit" size={18} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ArchiveDetailSkeleton />
        ) : error ? (
          <AppText>ArchiveDetailError</AppText>
        ) : (
          <>
            <ArchiveDetailItem
              detail={detail}
              onMonthChange={(date) => setMonth(formatMonthKey(date))}
            />
            <DebugForceCompleteBoardButton boardId={boardId} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

export default ArchiveDetailScreen;
