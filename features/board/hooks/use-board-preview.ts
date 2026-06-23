import { useCallback, useState } from "react";
import { BoardRecord } from "../types";

type Props = {
  boardId: string;
  board: BoardRecord;
};

const useBoardPreview = ({ board }: Props) => {
  // preview animation control hook
  const [completionPreviewDone, setCompletionPreviewDone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCompletionPreviewDone = useCallback(() => {
    setCompletionPreviewDone(true);
    // router.setParams({ from: undefined, boardId: undefined });
  }, []);

  return {
    isCompleted,
  };
};

export default useBoardPreview;
