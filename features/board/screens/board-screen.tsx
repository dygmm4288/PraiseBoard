import OnboardCompletionPreview from "@/features/onboarding/components/onboard/onboard-completion-preview";
import { useFnbContentInset } from "@/features/navigation";
import { useCurrentProfile, useUser } from "@/services/user";
import { Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { ScrollView } from "react-native";
import BoardToday from "../components/board-today/board-today";
import BoardHomeWhaleMessage from "../components/board/board-home-whale-message";
import BoardList from "../components/board/board-list";
import useHomeCompletionPreview from "../hooks/use-home-completion-preview";
import { useHomeBoardsQuery } from "../queries/use-board-query";

export const BoardScreenContent = () => {
  const { profileId } = useUser();
  const { nickname } = useCurrentProfile(profileId);
  const { data: homeBoards } = useHomeBoardsQuery(profileId);
  const { previewBoard, showCompletionPreview, closePreview } =
    useHomeCompletionPreview({ boards: homeBoards });

  const showPreviewBoard = !!(showCompletionPreview && previewBoard);
  const fnbContentInset = useFnbContentInset();

  return (
    <>
      <ScreenHeader title="홈" className="px-screen" />
      <ScrollView
        className="flex-1 "
        contentContainerStyle={{
          gap: 12,
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: fnbContentInset,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BoardHomeWhaleMessage />
        <BoardToday />
        <BoardList showPreviewBoard={showPreviewBoard} />
      </ScrollView>
      {showPreviewBoard ? (
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
    <Screen padded={false} safeEdges={["top", "left", "right"]}>
      <BoardScreenContent />
    </Screen>
  );
};

export default BoardScreen;
