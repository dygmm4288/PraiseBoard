import OnboardCompletionPreview from "@/features/onboarding/components/onboard/onboard-completion-preview";
import { useCurrentProfile, useUser } from "@/services/user";
import { Screen } from "@/shared/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import ScreenHeader from "@/shared/ui/screen-header";
import { View } from "react-native";
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
    params.from === "onboarding" && params.boardId
      ? homeBoards?.find((board) => board.id === params.boardId)
      : null;
  const showCompletionPreview = !!previewBoard && !completionPreviewDone;

  const handleCompletionPreviewDone = useCallback(() => {
    setCompletionPreviewDone(true);
    router.replace("/");
  }, [router]);

  return (
    <>
      <ScreenHeader title="홈" />
      <View className="flex min-h-[660px] flex-col gap-[12px]">
        <BoardHomeWhaleMessage />
        <BoardToday />
        <BoardList onCreateBoardPress={openCreateSheet} />
      </View>
      {showCompletionPreview ? (
        <OnboardCompletionPreview
          nickname={nickname}
          title={previewBoard.title}
          rewardMemo={previewBoard.rewardMemo}
          emoji={previewBoard.emoji}
          onDone={handleCompletionPreviewDone}
        />
      ) : null}
    </>
  );
};

const BoardScreen = () => {
  return (
    <Screen>
      <BoardScreenContent />
    </Screen>
  );
};

export default BoardScreen;
