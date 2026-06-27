import ArchiveDetailItem from "@/features/archive/components/detail/archive-detail-item";
import { archiveKeys } from "@/features/archive/queries/archive.query.key";
import { useArchiveDetailQuery } from "@/features/archive/queries/use-archive-detail-query";
import { archive } from "@/features/archive/service";
import { boardKeys, useBoardSheet } from "@/features/board";
import { Icon } from "@/assets/icons";
import { toast } from "@/shared/toasts/toast";
import { AppButton, AppText, Screen } from "@/shared/ui";
import useTodayKey from "@/shared/hooks/use-today-key";
import { cn } from "@/shared/utils/cn";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const ArchiveDetailScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
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
      limitCount: board.limitCount,
      rewardMemo: board.rewardMemo,
      onDeleted: () => router.back(),
    });
  };

  const handleForceComplete = async () => {
    if (!boardId) return;

    try {
      await archive.forceSetComplete(boardId);
      await queryClient.invalidateQueries({ queryKey: boardKeys.all });
      await queryClient.invalidateQueries({ queryKey: archiveKeys.all });
      toast.chatError("보드를 강제 완료했어요.");
    } catch (error) {
      console.error("보드 강제 완료 중 오류 발생", error);
      toast.chatError("보드 강제 완료에 실패했어요.");
    }
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
          <>
            <ArchiveDetailItem
              detail={detail}
              onMonthChange={(date) => setMonth(formatMonthKey(date))}
            />
            <AppButton
              variant="tertiary"
              className="mt-6"
              disabled={!boardId}
              onPress={handleForceComplete}
            >
              디버그: 강제 완료
            </AppButton>
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

export default ArchiveDetailScreen;
