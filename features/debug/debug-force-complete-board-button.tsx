import { archiveKeys } from "@/features/archive/queries/archive.query.key";
import { boardKeys } from "@/features/board";
import { isDebugEnabled } from "@/shared/constants/environment";
import { reportError } from "@/shared/lib/report-error";
import { toast } from "@/shared/toasts/toast";
import { AppButton } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";
import { forceCompleteBoard } from "./debug-board";

type DebugForceCompleteBoardButtonProps = {
  boardId: string | null;
};

const DebugForceCompleteBoardButton = ({
  boardId,
}: DebugForceCompleteBoardButtonProps) => {
  const queryClient = useQueryClient();

  if (!isDebugEnabled) return null;

  const forceComplete = async () => {
    if (!boardId) return;

    try {
      await forceCompleteBoard(boardId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: boardKeys.all }),
        queryClient.invalidateQueries({ queryKey: archiveKeys.all }),
      ]);
      toast.error("보드를 강제 완료했어요.");
    } catch (error) {
      reportError(error, { scope: "debug.forceCompleteBoard" });
      toast.error("보드 강제 완료에 실패했어요.");
    }
  };

  return (
    <AppButton
      variant="tertiary"
      className="mt-6"
      disabled={!boardId}
      onPress={forceComplete}
    >
      디버그: 강제 완료
    </AppButton>
  );
};

export default DebugForceCompleteBoardButton;
