import { Icon } from "@/assets/icons";
import { BoardRecord } from "@/features/board/types";
import { COLOR } from "@/shared/constants/colors.constant";
import { AppText } from "@/shared/ui";
import { View } from "react-native";
import { useBoardItemUi } from "../../hooks/use-board-item-ui";

type Props = {
  board: BoardRecord;
};

const BoardItemGotoAction = ({ board }: Props) => {
  const { isCompleted, progressPercent } = useBoardItemUi({
    board,
  });
  const progressColor = isCompleted ? "text-primary-700" : "text-primary-500";

  return (
    <View className="shrink-0 flex-row items-center gap-[6px]">
      <AppText
        weight="bold"
        className={["text-[17px] leading-[25px]", progressColor].join(" ")}
      >
        {progressPercent}%
      </AppText>
      <Icon name="ChevronRightSmall" size={18} color={COLOR["primary50"]} />
    </View>
  );
};

export default BoardItemGotoAction;
