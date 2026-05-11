import { BoardRecord } from "@/features/board/types";
import BoardItemCollectAction from "./board-item-collect-action";
import BoardItemContainer from "./board-item-container";
import BoardItemGotoAction from "./board-item-goto-action";
import BoardItemMeta from "./board-item-meta";

type Props = {
  board: BoardRecord;
  actionType: "collect" | "goto";
};

const BoardItem = ({ board, actionType = "collect" }: Props) => {
  return (
    <BoardItem.Container board={board}>
      <BoardItem.Meta board={board} />
      {actionType === "collect" && <BoardItem.CollectAction board={board} />}
      {actionType === "goto" && <BoardItem.GotoAction board={board} />}
    </BoardItem.Container>
  );
};

BoardItem.Container = BoardItemContainer;
BoardItem.Meta = BoardItemMeta;
BoardItem.CollectAction = BoardItemCollectAction;
BoardItem.GotoAction = BoardItemGotoAction;

export default BoardItem;
