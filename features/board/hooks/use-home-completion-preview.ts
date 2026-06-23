import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { BoardRecord } from "../types";

type HomePreviewParams = {
  from?: string;
  boardId?: string;
};

type Props = {
  boards?: BoardRecord[];
};

const useHomeCompletionPreview = ({ boards }: Props) => {
  const router = useRouter();
  const params = useLocalSearchParams<HomePreviewParams>();
  const [isDone, setIsDone] = useState(false);
  const isPreviewRoute =
    params.from === "onboarding" && typeof params.boardId === "string";
  const previewBoard = useMemo(() => {
    if (!isPreviewRoute) return null;
    return boards?.find((board) => board.id === params.boardId) ?? null;
  }, [boards, isPreviewRoute, params.boardId]);

  const closePreview = useCallback(() => {
    setIsDone(true);
    router.replace("/");
  }, [router]);

  useEffect(() => {
    if (!isPreviewRoute || !boards || previewBoard || isDone) {
      return;
    }

    router.replace("/");
  }, [boards, isDone, isPreviewRoute, previewBoard, router]);

  return {
    previewBoard,
    showCompletionPreview: !!previewBoard && !isDone,
    closePreview,
  };
};

export default useHomeCompletionPreview;
