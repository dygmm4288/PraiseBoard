import BoardEditView from "@/features/board/components/board-edit/board-edit-view";
import { useNavigation } from "expo-router";

const BoardEditModal = () => {
  const navigation = useNavigation();

  return (
    <BoardEditView
      title="타이틀"
      onBack={() => navigation.goBack()}
      onDelete={() => {}}
    />
  );
};

export default BoardEditModal;
