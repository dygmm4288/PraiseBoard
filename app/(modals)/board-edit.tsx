import { Icon } from "@/assets/icons";
import BoardEditContent from "@/features/board/components/board-edit/board-edit-content";
import { AppText, Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { useNavigation } from "expo-router";
import { Pressable } from "react-native";

const BoardEditModal = () => {
  const navigation = useNavigation();

  return (
    <Screen className="flex flex-col gap-[10px]">
      <ScreenHeader
        left={
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="ChevronLeft" />
          </Pressable>
        }
        title={"타이틀"}
        right={
          <Pressable onPress={() => {}}>
            <AppText variant="button1" className="text-gray-700">
              삭제
            </AppText>
          </Pressable>
        }
      />
      <BoardEditContent />
    </Screen>
  );
};

export default BoardEditModal;
