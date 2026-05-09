import BoardItem from "@/features/board/components/board-item/board-item";
import { canCreateBoard } from "@/features/board/domain/policies/board-policy";
import { Calendar, CalendarStickerCount } from "@/shared/components";
import { toast } from "@/shared/toasts/toast";
import ScreenHeader from "@/shared/ui/screen-header";
import { ScrollView } from "react-native";
import ArchiveActionBtn from "../components/btn/archive-action-btn";
import ArchiveSection from "../components/list/archive-list";
import useArchive from "../hooks/use-archive";

const CALENDAR_DUMMY_STICKER_COUNTS: CalendarStickerCount[] = [
  { date: "2026-05-03", count: 2 },
  { date: "2026-05-05", count: 5 },
  { date: "2026-05-06", count: 1 },
  { date: "2026-05-07", count: 2 },
  { date: "2026-05-08", count: 4 },
  { date: "2026-05-09", count: 6 },
  { date: "2026-05-17", count: 3 },
  { date: "2026-05-21", count: 1 },
  { date: "2026-05-28", count: 5 },
];

const ArchiveScreen = () => {
  const { activeBoards, completedBoards } = useArchive();

  const openCreateBoard = () => {
    if (!canCreateBoard(activeBoards.length)) {
      return toast.chatError("앗! 최대 3개를 다 만들었어요.");
    }
    console.log("open create board");
  };

  return (
    <>
      <ScreenHeader title={"보관함"} />
      <ScrollView className="flex flex-col gap-[30px] pt-[12px] overflow-auto">
        <Calendar
          className="mx-[16px] mb-[24px]"
          defaultDate={new Date(2026, 4, 1)}
          stickerCounts={CALENDAR_DUMMY_STICKER_COUNTS}
        />
        <ArchiveSection
          title={`진행 습관 ${activeBoards.length}개`}
          action={<ArchiveActionBtn label="+ 추가" onPress={openCreateBoard} />}
        >
          {activeBoards.map((board) => (
            <BoardItem board={board} key={board.id} />
          ))}
        </ArchiveSection>
        <ArchiveSection title={`완료 습관 ${completedBoards.length}개`}>
          {completedBoards.map((board) => (
            <BoardItem board={board} key={board.id} />
          ))}
        </ArchiveSection>
      </ScrollView>
    </>
  );
};

export default ArchiveScreen;
