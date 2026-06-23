import OnboardCompletionPreview from "@/features/onboarding/components/onboard/onboard-completion-preview";
import { useCurrentProfile, useUser } from "@/services/user";
import { Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { ScrollView } from "react-native";
import { useBoardSheet } from "../hooks/use-board-sheet";
import useHomeCompletionPreview from "../hooks/use-home-completion-preview";
import BoardToday from "../components/board-today/board-today";
import BoardHomeWhaleMessage from "../components/board/board-home-whale-message";
import BoardList from "../components/board/board-list";
import { useHomeBoardsQuery } from "../queries/use-board-query";

export const BoardScreenContent = () => {
  const { profileId } = useUser();
  const { nickname } = useCurrentProfile(profileId);
  const { data: homeBoards } = useHomeBoardsQuery(profileId);
  const { openCreateSheet } = useBoardSheet();
  const { previewBoard, showCompletionPreview, closePreview } =
    useHomeCompletionPreview({ boards: homeBoards });

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
      {showCompletionPreview && previewBoard ? (
        <OnboardCompletionPreview
          nickname={nickname}
          board={previewBoard}
          onDone={closePreview}
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
