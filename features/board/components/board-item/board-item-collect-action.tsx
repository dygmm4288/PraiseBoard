import { BoardRecord } from "@/features/board/types";
import { AppText } from "@/shared/ui";
import AppCheckbox from "@/shared/ui/checkbox";
import { useState } from "react";
import { View } from "react-native";
import { useBoardItemUi } from "../../hooks/use-board-item-ui";
import { useCollectSticker } from "../../hooks/use-collect-sticker";
import BoardItemBubbleBurst from "./board-item-bubble-burst";

type Props = {
  board: BoardRecord;
};

const BoardItemCollectAction = ({ board }: Props) => {
  const [burstKey, setBurstKey] = useState(0);
  const {
    progressColor,
    progressPercent,
    boardDisabled,
    isCompleted,
    isTodayDone,
  } =
    useBoardItemUi({
      board,
    });

  const { mutate: collectSticker, isPending } = useCollectSticker();

  const handlePress = () => {
    if (isCompleted) return;
    if (isTodayDone) return;
    if (boardDisabled) return;
    if (isPending) return;
    setBurstKey((key) => key + 1);

    collectSticker({ boardId: board.id, source: "app" });
  };

  return (
    <View className="shrink-0 flex-row items-center gap-[8px]">
      <AppText
        weight="bold"
        className={[
          "text-[17px] leading-[17px]",
          isCompleted ? "text-secondary-50" : progressColor,
        ].join(" ")}
      >
        {progressPercent}%
      </AppText>
      <View className="relative h-[34px] w-[34px] overflow-visible">
        <AppCheckbox
          disabled={boardDisabled}
          variant={
            isCompleted ? "completed" : isTodayDone ? "todayDone" : "default"
          }
          onPress={handlePress}
        />
        {!isCompleted && !isTodayDone && burstKey > 0 ? (
          <BoardItemBubbleBurst key={burstKey} onDone={() => setBurstKey(0)} />
        ) : null}
      </View>
    </View>
  );
};

export default BoardItemCollectAction;
