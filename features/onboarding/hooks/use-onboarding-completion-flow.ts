import {
  board,
  boardKeys,
  normalizeBoardSetupPayload,
  type BoardListResult,
  type BoardRecord,
  type BoardSetupFormValues,
} from "@/features/board";
import { notification } from "@/services/notification";
import { useUser, userRepository } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";

const addBoardToHomeList = (
  boardList: BoardListResult | null | undefined,
  createdBoard: BoardRecord,
): BoardListResult => {
  if (!boardList) {
    return {
      items: [createdBoard],
      pageInfo: {},
    };
  }

  if (boardList.items.some((board) => board.id === createdBoard.id)) {
    return boardList;
  }

  return {
    ...boardList,
    items: [createdBoard, ...boardList.items],
  };
};

type Props = {
  form: UseFormReturn<BoardSetupFormValues>;
};

const useOnboardingCompletionFlow = ({ form }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { completeOnboarding, overrideMode, profileId, setOverrideMode } =
    useUser();

  const persistOnboardingSetup = useCallback(async () => {
    if (!profileId) {
      throw new Error("profileId is required to create a board.");
    }

    const payload = normalizeBoardSetupPayload(form.getValues());
    if (!payload) {
      throw new Error("Onboarding payload is invalid.");
    }

    await userRepository.updateProfile(profileId, {
      nickname: payload.profiles.nickname,
    });
    return board.createBoardFromSetup(profileId, payload);
  }, [form, profileId]);

  const requestNotificationPermission = useCallback(async () => {
    try {
      await notification.requestPermissionFromOnboarding();
    } catch (error) {
      console.error("알림 권한 설정 중 오류 발생", error);
      toast.error("알림 권한 정보를 저장하는 중 오류가 발생했어요.");
    }
  }, []);

  const cacheCreatedBoardForHomePreview = useCallback(
    async (createdBoard: BoardRecord) => {
      if (!profileId) {
        throw new Error("profileId is required to cache onboarding board.");
      }

      queryClient.setQueryData<BoardListResult | null>(
        boardKeys.homeLists(profileId),
        (boardList) => addBoardToHomeList(boardList, createdBoard),
      );
      await queryClient.invalidateQueries({
        queryKey: boardKeys.all,
        refetchType: "active",
      });
    },
    [profileId, queryClient],
  );

  const openHomePreview = useCallback(
    (createdBoard: BoardRecord) => {
      router.replace({
        pathname: "/",
        params: {
          from: "onboarding",
          boardId: createdBoard.id,
        },
      });
    },
    [router],
  );

  const completeWithHomePreview = useCallback(async () => {
    let createdBoard: BoardRecord;

    try {
      createdBoard = await persistOnboardingSetup();
    } catch (error) {
      console.error("온보딩 보드 저장 중 오류 발생", error);
      toast.error("보드를 저장하는 중 오류가 발생했어요.");
      return;
    }

    await requestNotificationPermission();
    await completeOnboarding();

    if (overrideMode === "onboarding") {
      await setOverrideMode("real");
    }

    await cacheCreatedBoardForHomePreview(createdBoard);
    openHomePreview(createdBoard);
  }, [
    cacheCreatedBoardForHomePreview,
    completeOnboarding,
    openHomePreview,
    overrideMode,
    persistOnboardingSetup,
    requestNotificationPermission,
    setOverrideMode,
  ]);

  return {
    completeWithHomePreview,
  };
};

export default useOnboardingCompletionFlow;
