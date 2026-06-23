import { BoardItem, canCreateBoard, useBoardSheet } from "@/features/board";
import { toast } from "@/shared/toasts/toast";
import ScreenHeader from "@/shared/ui/screen-header";
import { ScrollView } from "react-native";
import ArchiveSection from "../components/list/archive-list";
import useArchive from "../hooks/use-archive";

const ArchiveScreen = () => {
  const { activeBoards, completedBoards } = useArchive();

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
          emptyMessage="진행 중인 습관이 없어요."
        >
          {activeBoards.map((board) => (
            <BoardItem board={board} key={board.id} actionType="goto" />
          ))}
        </ArchiveSection>
        <ArchiveSection
          title={`완료 습관 ${completedBoards.length}개`}
          emptyMessage="완료한 습관이 없어요."
        >
          {completedBoards.map((board) => (
            <BoardItem board={board} key={board.id} actionType="goto" />
          ))}
        </ArchiveSection>
      </ScrollView>
    </>
  );
};

export default ArchiveScreen;
