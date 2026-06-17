import { BoardItem, canCreateBoard, useBoardSheet } from "@/features/board";
import { toast } from "@/shared/toasts/toast";
import ScreenHeader from "@/shared/ui/screen-header";
import { ScrollView } from "react-native";
import ArchiveActionBtn from "../components/btn/archive-action-btn";
import ArchiveSection from "../components/list/archive-list";
import useArchive from "../hooks/use-archive";

const ArchiveScreen = () => {
  const { activeBoards, completedBoards } = useArchive();
  const { openCreateSheet } = useBoardSheet();

  const openCreateBoard = () => {
    if (!canCreateBoard(activeBoards.length)) {
      return toast.chatError("앗! 최대 3개를 다 만들었어요.");
    }

    openCreateSheet();
  };

  return (
    <>
      <ScreenHeader title={"보관함"} className="px-screen" />
      <ScrollView
        className="flex-1 overflow-visible"
        contentContainerStyle={{
          gap: 30,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ArchiveSection
          title={`진행 습관 ${activeBoards.length}개`}
          action={<ArchiveActionBtn label="+ 추가" onPress={openCreateBoard} />}
        >
          {activeBoards.map((board) => (
            <BoardItem board={board} key={board.id} actionType="goto" />
          ))}
        </ArchiveSection>
        <ArchiveSection title={`완료 습관 ${completedBoards.length}개`}>
          {completedBoards.map((board) => (
            <BoardItem board={board} key={board.id} actionType="goto" />
          ))}
        </ArchiveSection>
      </ScrollView>
    </>
  );
};

export default ArchiveScreen;
