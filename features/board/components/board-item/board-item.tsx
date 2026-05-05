import { BoardRecord } from "@/features/board/types";
import BoardItemAction from "./board-item-action";
import BoardItemContainer from "./board-item-container";
import BoardItemMeta from "./board-item-meta";

type Props = {
  board: BoardRecord;
};

const BoardItem = ({ board }: Props) => {
  return (
    <BoardItem.Container board={board}>
      <BoardItem.Meta board={board} />
      <BoardItem.Action board={board} />
    </BoardItem.Container>
  );
};

BoardItem.Container = BoardItemContainer;
BoardItem.Meta = BoardItemMeta;
BoardItem.Action = BoardItemAction;

export default BoardItem;
