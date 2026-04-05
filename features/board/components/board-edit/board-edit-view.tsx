import { Icon } from "@/assets/icons";
import { AppText, Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { Pressable } from "react-native";
import BoardEditContent from "./board-edit-content";

type BoardEditViewProps = {
  title?: string;
  deleteLabel?: string;
  onBack?: () => void;
  onDelete?: () => void;
};

const BoardEditView = ({
  title = "타이틀",
  deleteLabel = "삭제",
  onBack,
  onDelete,
}: BoardEditViewProps) => {
  return (
    <Screen className="flex flex-col gap-[10px]">
      <ScreenHeader
        left={
          <Pressable onPress={onBack}>
            <Icon name="ChevronLeft" />
          </Pressable>
        }
        title={title}
        right={
          <Pressable onPress={onDelete}>
            <AppText variant="button1" className="text-gray-700">
              {deleteLabel}
            </AppText>
          </Pressable>
        }
      />
      <BoardEditContent />
    </Screen>
  );
};

export default BoardEditView;
