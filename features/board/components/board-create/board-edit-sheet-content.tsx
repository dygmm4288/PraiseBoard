import { BoardCreateFormValues } from "@/features/board/schema";
import { useDeleteBoard } from "../../hooks/use-delete-board";
import { useUpdateBoard } from "../../hooks/use-update-board";
import BoardForm from "./board-form";

type BoardEditSheetContentProps = {
  boardId: string;
  currentCount: number;
  initialValues: BoardCreateFormValues;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
};

const BoardEditSheetContent = ({
  boardId,
  currentCount,
  initialValues,
  onClose,
  onUpdated,
  onDeleted,
}: BoardEditSheetContentProps) => {
  const { changeFormData, formData, updateBoard } = useUpdateBoard(
    boardId,
    initialValues,
  );
  const { cancelDelete, deleteBoard, isDeleting } = useDeleteBoard({
    id: boardId,
    currentCount,
    targetCount: initialValues.targetCount,
  });

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
      onDeleteCancel={cancelDelete}
      isDeleting={isDeleting}
    />
  );
};

export default BoardEditSheetContent;
