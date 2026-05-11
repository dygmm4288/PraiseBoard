import { Icon } from "@/assets/icons";
import { BoardRecord } from "@/features/board/types";
import { AppText } from "@/shared/ui";
import { Pressable } from "react-native";
import { useBoardItemUi } from "../../hooks/use-board-item-ui";
import { useRouter } from "expo-router";

type Props = {
  board: BoardRecord;
};

const BoardItemGotoAction = ({ board }: Props) => {
  const router = useRouter();
  const { progressColor, progressPercent } = useBoardItemUi({
    board,
  });

  const handlePress = () => {
    router.push(`/archives/${board.id}`);
  };

  return (
    <Pressable
      className="shrink-0 flex-row items-center gap-[6px]"
      onPress={handlePress}
    >
      <AppText
        weight="bold"
        className={["text-[17px] leading-[25px]", progressColor].join(" ")}
      >
        {progressPercent}%
      </AppText>
      <Icon name="ChevronRightSmall" width={5} height={10} />
    </Pressable>
  );
};

export default BoardItemGotoAction;
