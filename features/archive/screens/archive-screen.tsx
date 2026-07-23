import { BoardItem } from "@/features/board";
import { FnbScrollView } from "@/features/navigation";
import { Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import ArchiveSection from "../components/list/archive-list";
import useArchive from "../hooks/use-archive";

const ArchiveScreen = () => {
  const { activeBoards, completedBoards } = useArchive();

  return (
    <Screen padded={false} safeEdges={["top", "left", "right"]}>
      <ScreenHeader title={"보관함"} className="px-screen" />
      <FnbScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 30,
          flexGrow: 1,
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
      </FnbScrollView>
    </Screen>
  );
};

export default ArchiveScreen;
