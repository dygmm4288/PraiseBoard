import { useCreateBoard } from "../../hooks/use-create-board";
import BoardForm from "./board-form";

type BoardCreateProps = {
  onCreated?: () => void;
  onClose: () => void;
};

const BoardCreate = ({ onCreated, onClose }: BoardCreateProps) => {
  const { changeFormData, createBoard, formData } = useCreateBoard();

  const handleCreateBoard = () => {
    createBoard()?.then(() => {
      onCreated?.();
    });
  };

  return (
    <BoardForm
      title="새로운 습관 만들기"
      formData={formData}
      onChangeFormData={changeFormData}
      onClose={onClose}
      onSubmit={handleCreateBoard}
    />
  );
};

export default BoardCreate;
