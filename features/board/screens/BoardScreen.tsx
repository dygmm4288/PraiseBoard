import { images } from "@/assets/images";
import { board } from "@/services/board";
import { useUser } from "@/services/user";
import { ChatBubble } from "@/features/onboarding/components/chat/chat-bubble";
import { AppButton, AppText, Screen } from "@/shared/ui";
import { LinearGradient } from "expo-linear-gradient";
import { type ReactNode, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import BoardCard from "../components/board/board-card";
import Header from "../components/header/header";
import { BoardCardData } from "../types/board-card.type";

const SHELL_GRADIENT_COLORS = ["#F1F2F4", "#E8DEFF", "#F1F2F4"] as const;

const mapBoardToCardData = (input: Awaited<
  ReturnType<typeof board.getLatestBoard>
>): BoardCardData | null => {
  if (!input) return null;

  return {
    title: input.title,
    rewardMemo: input.rewardMemo,
    totalCount: input.targetCount,
    completedCount: input.currentCount,
  };
};

export type BoardScreenContentProps = {
  board: BoardCardData;
};

const BoardScreenShell = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <Screen className="relative flex-1 px-[14px] pt-0 flex flex-col">
      <LinearGradient
        pointerEvents="none"
        colors={SHELL_GRADIENT_COLORS}
        locations={[0, 0.45, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <Image
        source={images.illustrations.onboardWhale}
        style={{
          position: "absolute",
          top: 176,
          left: "50%",
          width: 317,
          height: 327,
          transform: [{ translateX: -158.5 }],
        }}
      />
      <Header title={title} showTitle={false} />
      {children}
    </Screen>
  );
};

export const BoardScreenContent = ({ board }: BoardScreenContentProps) => {
  return (
    <BoardScreenShell title={board.title}>
      <View className="flex-1 my-[30px] flex flex-col justify-between">
        <ChatBubble
          side="center"
          message="안녕! 오늘의 구슬을 모아볼까? 푸우~🐳"
        />
        <View className="flex-1 items-center justify-center py-6">
          <BoardCard data={board} />
        </View>
        <AppButton variant="primary" className="w-max self-center">
          구슬 모으기
        </AppButton>
      </View>
    </BoardScreenShell>
  );
};

const BoardScreenStatus = ({ message }: { message: string }) => {
  return (
    <BoardScreenShell title="">
      <View className="flex-1 items-center justify-center px-10">
        <AppText variant="body3" className="text-center text-gray-500">
          {message}
        </AppText>
      </View>
    </BoardScreenShell>
  );
};

const BoardScreen = () => {
  const { profileId } = useUser();
  const [boardData, setBoardData] = useState<BoardCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBoard = async () => {
      if (!profileId) {
        if (!isMounted) return;
        setBoardData(null);
        setErrorMessage("프로필 정보를 확인할 수 없어요.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const latestBoard = await board.getLatestBoard(profileId);

        if (!isMounted) return;

        setBoardData(mapBoardToCardData(latestBoard));
      } catch (error) {
        console.error("보드 조회 중 오류 발생", error);

        if (!isMounted) return;

        setBoardData(null);
        setErrorMessage("보드를 불러오는 중 오류가 발생했어요.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBoard();

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  if (isLoading) {
    return <BoardScreenStatus message="보드를 불러오는 중이에요." />;
  }

  if (errorMessage) {
    return <BoardScreenStatus message={errorMessage} />;
  }

  if (!boardData) {
    return (
      <BoardScreenStatus message="아직 받은 보드가 없어요. 온보딩을 완료해 주세요." />
    );
  }

  return <BoardScreenContent board={boardData} />;
};

export default BoardScreen;
