import { BoardRecord } from "@/features/board/types";
import { useRouter } from "expo-router";
import { useBoardItemUi } from "../../hooks/use-board-item-ui";
import BoardItemCollectAction from "./board-item-collect-action";
import BoardItemContainer from "./board-item-container";
import BoardItemGotoAction from "./board-item-goto-action";
import BoardItemMeta from "./board-item-meta";

type Props = {
  board: BoardRecord;
  actionType: "collect" | "goto";
};

const BoardItem = ({ board, actionType = "collect" }: Props) => {
  const router = useRouter();
  const ui = useBoardItemUi({ board });
  const isGotoAction = actionType === "goto";

  const handlePress = () => {
    if (!isGotoAction) return;

    router.push(`/archives/${board.id}`);
  };

  return (
    <BoardItem.Container
      ui={ui}
      onPress={isGotoAction ? handlePress : undefined}
      shouldDimTodayDone={!isGotoAction}
    >
      <BoardItem.Meta
        board={board}
        ui={ui}
        shouldApplyTodayDoneState={!isGotoAction}
      />
      {actionType === "collect" && (
        <BoardItem.CollectAction board={board} ui={ui} />
      )}
      {actionType === "goto" && <BoardItem.GotoAction ui={ui} />}
    </BoardItem.Container>
  );
};

BoardItem.Container = BoardItemContainer;
BoardItem.Meta = BoardItemMeta;
BoardItem.CollectAction = BoardItemCollectAction;
BoardItem.GotoAction = BoardItemGotoAction;

export default BoardItem;
