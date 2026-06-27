import { BoardRecord } from "@/features/board/types";
import { AppText } from "@/shared/ui";
import AppCheckbox from "@/shared/ui/checkbox";
import StickerBubbleBurst from "@/shared/ui/sticker-bubble-burst";
import { useState } from "react";
import { View } from "react-native";
import { useBoardItemUi } from "../../hooks/use-board-item-ui";
import { useCollectSticker } from "../../hooks/use-collect-sticker";

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
  } = useBoardItemUi({
    board,
  });

  const { mutate: collectSticker, isPending } = useCollectSticker();
  const actionDisabled = boardDisabled || isPending;

  const handlePress = () => {
    if (isCompleted || isTodayDone || actionDisabled) return;
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
          disabled={actionDisabled}
          variant={
            isCompleted ? "completed" : isTodayDone ? "todayDone" : "default"
          }
          onPress={handlePress}
        />
        {!isCompleted && !isTodayDone && burstKey > 0 ? (
          <StickerBubbleBurst key={burstKey} onDone={() => setBurstKey(0)} />
        ) : null}
      </View>
    </View>
  );
};

export default BoardItemCollectAction;
