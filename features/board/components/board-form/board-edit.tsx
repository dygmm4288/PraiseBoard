import { BoardCreateFormValues } from "@/features/board/schema";
import { useDeleteBoard } from "../../hooks/use-delete-board";
import { useUpdateBoard } from "../../hooks/use-update-board";
import BoardForm from "./board-form";

type BoardEditProps = {
  boardId: string;
  initialValues: BoardCreateFormValues;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
};

const BoardEdit = ({
  boardId,
  initialValues,
  onClose,
  onUpdated,
  onDeleted,
}: BoardEditProps) => {
  const { changeFormData, formData, updateBoard } = useUpdateBoard(
    boardId,
    initialValues,
  );
  const { deleteBoard, isDeleting } = useDeleteBoard(boardId);

  const handleUpdateBoard = () => {
    updateBoard()?.then(() => {
      onUpdated?.();
    });
  };

  const handleDeleteBoard = () => {
    deleteBoard().then(() => {
      onClose();
      onDeleted?.();
    });
  };

  return (
    <BoardForm
      title="습관 수정하기"
      mode="edit"
      formData={formData}
      onChangeFormData={changeFormData}
      onClose={onClose}
      onSubmit={handleUpdateBoard}
      onDelete={handleDeleteBoard}
      isDeleting={isDeleting}
    />
  );
};

export default BoardEdit;
