import { Icon } from "@/assets/icons";
import { AppText } from "@/shared/ui";
import ButtonToggle from "@/shared/ui/button-toggle";
import { useState } from "react";
import { View } from "react-native";

type Props = {
  title: string;
  showTitle: boolean;
};

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

const Header = ({ title, showTitle }: Props) => {
    // TODO: 로컬 상태로 승격해야함.
  const [mode, setMode] = useState<HEADER_MODE>("board");

  return (
    <View className="flex justify-between flex-row">
      <ButtonToggle
        value={mode}
        onChange={(v) => setMode(v)}
        options={HEADER_TOGGLE_OPTIONS}
      />
      {showTitle && (
        <AppText variant="button1" className="text-gray-700">
          {title}
        </AppText>
      )}
      <View className="flex flex-row gap-[9px]">
        <Icon name="Share" />
        <Icon name="Setting" />
      </View>
    </View>
  );
};

export default Header;
