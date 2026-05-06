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

const BoardItemAction = ({ board }: Props) => {
  const [burstKey, setBurstKey] = useState(0);
  const { progressColor, progressPercent, boardDisabled } = useBoardItemUi({
    board,
  });
  const { mutate: collectSticker, isPending } = useCollectSticker();

  const handlePress = () => {
    if (boardDisabled) return;
    if (isPending) return;
    setBurstKey((key) => key + 1);

    collectSticker({ boardId: board.id, source: "app" });
  };

  return (
    <View className="shrink-0 flex-row items-center gap-[8px]">
      <AppText
        weight="bold"
        className={["text-[17px] leading-[17px]", progressColor].join(" ")}
      >
        {progressPercent}%
      </AppText>
      <View className="relative h-[34px] w-[34px] overflow-visible">
        <AppCheckbox disabled={boardDisabled} onPress={handlePress} />
        {burstKey > 0 ? (
          <BoardItemBubbleBurst key={burstKey} onDone={() => setBurstKey(0)} />
        ) : null}
      </View>
    </View>
  );
};

export default BoardItemAction;
