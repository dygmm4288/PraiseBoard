import { Icon } from "@/assets/icons";
import { COLOR } from "@/shared/constants/colors.constant";
import { AppText } from "@/shared/ui";
import { View } from "react-native";
import { BoardItemUi } from "../../hooks/use-board-item-ui";

type Props = {
  ui: BoardItemUi;
};

const BoardItemGotoAction = ({ ui }: Props) => {
  const { isCompleted, progressPercent } = ui;
  const progressColor = isCompleted ? "text-secondary-50" : "text-primary-500";

  return (
    <View className="shrink-0 flex-row items-center gap-[6px]">
      <AppText
        weight="bold"
        className={[
          "min-w-[38px] text-center text-[17px] leading-[25px]",
          progressColor,
        ].join(" ")}
      >
        {progressPercent}%
      </AppText>
      <Icon
        name="ChevronRightSmall"
        size={18}
        color={isCompleted ? COLOR["secondary50"] : COLOR["primary50"]}
      />
    </View>
  );
};

export default BoardItemGotoAction;
