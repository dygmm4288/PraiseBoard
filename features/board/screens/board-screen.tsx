import OnboardCompletionPreview from "@/features/onboarding/components/onboard/onboard-completion-preview";
import { useCurrentProfile, useUser } from "@/services/user";
import { Screen } from "@/shared/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import ScreenHeader from "@/shared/ui/screen-header";
import { ScrollView } from "react-native";
import { useBoardSheet } from "../hooks/use-board-sheet";
import BoardToday from "../components/board-today/board-today";
import BoardHomeWhaleMessage from "../components/board/board-home-whale-message";
import BoardList from "../components/board/board-list";
import { useHomeBoardsQuery } from "../queries/use-board-query";

export const BoardScreenContent = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; boardId?: string }>();
  const { profileId } = useUser();
  const { nickname } = useCurrentProfile(profileId);
  const { data: homeBoards } = useHomeBoardsQuery(profileId);
  const { openCreateSheet } = useBoardSheet();
  const [completionPreviewDone, setCompletionPreviewDone] = useState(false);
  const previewBoard =
    params.from === "onboarding" && typeof params.boardId === "string"
      ? homeBoards?.find((board) => board.id === params.boardId)
      : null;
  const showCompletionPreview = !!previewBoard && !completionPreviewDone;

  const handleCompletionPreviewDone = useCallback(() => {
    setCompletionPreviewDone(true);
    router.setParams({ from: undefined, boardId: undefined });
  }, [router]);

  useEffect(() => {
    if (
      params.from === "onboarding" &&
      typeof params.boardId === "string" &&
      homeBoards &&
      !previewBoard &&
      !completionPreviewDone
    ) {
      router.setParams({ from: undefined, boardId: undefined });
    }
  }, [
    completionPreviewDone,
    homeBoards,
    params.boardId,
    params.from,
    previewBoard,
    router,
  ]);

  return (
    <>
      <ScreenHeader title="홈" className="px-screen" />
      <ScrollView
        className="flex-1 overflow-visible"
        contentContainerStyle={{
          gap: 12,
          minHeight: 660,
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BoardHomeWhaleMessage />
        <BoardToday />
        <BoardList onCreateBoardPress={openCreateSheet} />
      </ScrollView>
      {showCompletionPreview ? (
        <OnboardCompletionPreview
          nickname={nickname}
          board={previewBoard}
          onDone={handleCompletionPreviewDone}
        />
      ) : null}
    </>
  );
};

const BoardScreen = () => {
  return (
    <Screen padded={false}>
      <BoardScreenContent />
    </Screen>
  );
};

export default BoardScreen;
