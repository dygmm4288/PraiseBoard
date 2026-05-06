import { images } from "@/assets/images";
import { AppButton, AppText, Screen } from "@/shared/ui";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { type ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";
import BoardCard from "../components/board/board-card";
import BoardList from "../components/board/board-list";
import BoardPanel from "../components/board/board-panel";
import BoardTodayAchievement from "../components/board/board-today-achievement";
import BoardWhaleMessage from "../components/board/board-whale-message";
import Header from "../components/header/header";
import { useBoard, useBoardUI } from "../hooks";

const SHELL_GRADIENT_COLORS = ["#F1F2F4", "#E8DEFF", "#F1F2F4"] as const;

const BoardScreenShell = ({ children }: { children: ReactNode }) => {
  return (
    <Screen className="relative flex-1 px-0 pt-0 flex flex-col">
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
      <Header />
      {children}
    </Screen>
  );
};

export const BoardScreenContent = () => {
  const { boardSheetState, setBoardSheetState, titleMode } = useBoardUI();
  const { collectSticker, boardData } = useBoard();

  return (
    <BoardScreenShell>
      <View className="flex-1 px-[6px] pt-[30px]">
        <View className="flex-1 justify-between">
          <View className="flex flex-col gap-[30px]">
            {titleMode === "main" && (
              <View className="w-full flex flex-col items-center gap-[3px]">
                <AppText variant="title3" className="text-gray-700">
                  {boardData?.title}
                </AppText>
                <AppText variant="body3" className="text-gray-500">
                  {boardData?.rewardMemo ?? "보상을 비워뒀어요."}
                </AppText>
              </View>
            )}
            {boardData ? (
              <View className="gap-[10px] px-[10px]">
                <BoardWhaleMessage
                  todayStickerCount={boardData.todayStickerCount}
                  latestStickerCollectedAt={boardData.latestStickerCollectedAt}
                />
                <BoardTodayAchievement count={boardData.todayStickerCount} />
              </View>
            ) : null}
          </View>
          <View className="items-center pb-[30px]">
            <AppButton
              variant="primary"
              size="sm"
              className="w-max self-center"
              onPress={collectSticker}
            >
              구슬 모으기
            </AppButton>
          </View>
        </View>
      </View>
      <BoardPanel state={boardSheetState} onChangeState={setBoardSheetState}>
        <BoardCard className="max-w-none rounded-none bg-white px-[15px] pb-[20px] pt-[10px]" />
      </BoardPanel>
    </BoardScreenShell>
  );
};

const BoardScreen = () => {
  const router = useRouter();
  return (
    <Screen>
      <AppButton onPress={() => router.push("/boards/create")}>
        create
      </AppButton>
      <BoardList />
    </Screen>
  );
};

export default BoardScreen;
