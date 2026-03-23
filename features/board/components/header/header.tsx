import { Icon } from "@/assets/icons";
import { AppText } from "@/shared/ui";
import ButtonToggle from "@/shared/ui/button-toggle";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useBoard, useBoardUI } from "../../hooks";

const HEADER_TOGGLE_OPTIONS = [
  {
    value: "board" as const,
    accessibilityLabel: "보드 보기",
    render: () => <Icon name="BoardToggle" size={24} />,
  },
  {
    value: "list" as const,
    accessibilityLabel: "리스트 보기",
    render: () => <Icon name="BoardList" size={24} />,
  },
];

type HEADER_MODE = (typeof HEADER_TOGGLE_OPTIONS)[number]["value"];

const Header = () => {
  const router = useRouter();
  const [mode, setMode] = useState<HEADER_MODE>("board");
  const { boardData } = useBoard();
  const { titleMode } = useBoardUI();

  return (
    <View className="flex justify-between flex-row">
      <ButtonToggle
        value={mode}
        onChange={(v) => setMode(v)}
        options={HEADER_TOGGLE_OPTIONS}
      />
      {titleMode === "header" && (
        <AppText variant="button1" className="text-gray-700">
          {boardData?.title}
        </AppText>
      )}
      <View className="flex flex-row gap-[9px]">
        <Icon name="Share" />
        <Pressable
          accessibilityLabel="설정 열기"
          onPress={() => router.push("/settings")}
        >
          <Icon name="Setting" />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
