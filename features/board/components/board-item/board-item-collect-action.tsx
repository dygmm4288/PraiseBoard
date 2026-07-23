import { BoardRecord } from "@/features/board/types";
import { AppText } from "@/shared/ui";
import AppCheckbox from "@/shared/ui/checkbox";
import StickerBubbleBurst from "@/shared/ui/sticker-bubble-burst";
import { useState } from "react";
import { View } from "react-native";
import { BoardItemUi } from "../../hooks/use-board-item-ui";
import { useCollectSticker } from "../../hooks/use-collect-sticker";

type Props = {
  board: BoardRecord;
  ui: BoardItemUi;
};

const BoardItemCollectAction = ({ board, ui }: Props) => {
  const [burstKey, setBurstKey] = useState(0);
  const {
    progressColor,
    progressPercent,
    boardDisabled,
    isCompleted,
    isTodayDone,
  } = ui;

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
          "min-w-[38px] text-center text-[17px] leading-[25px]",
          isCompleted ? "text-secondary-50" : progressColor,
        ].join(" ")}
      >
        {progressPercent}%
      </AppText>
      <View className="relative h-[34px] w-[34px] overflow-visible">
        <AppCheckbox
          testID={`collect-sticker-${board.id}`}
          accessibilityLabel={`${board.title} 스티커 받기`}
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
