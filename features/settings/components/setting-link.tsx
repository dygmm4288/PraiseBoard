import { Icon } from "@/assets/icons";
import { AppText } from "@/shared/ui";
import { PropsWithChildren, ReactNode } from "react";
import { Pressable, View } from "react-native";

type SettingLinkProps = {
  label?: string;
  value?: ReactNode;
  right?: ReactNode;
  showChevron?: boolean;
  onLink?: () => void;
} & PropsWithChildren;

const SettingLink = ({
  label,
  value,
  children,
  right,
  showChevron = true,
  onLink,
}: SettingLinkProps) => {
  const Row = onLink ? Pressable : View;
  const resolvedValue = value ?? children;

  return (
    <Row
      accessibilityRole={onLink ? "button" : undefined}
      className="min-h-[40px] flex-row items-center justify-between gap-[16px] px-[20px]"
      onPress={onLink}
    >
      <View className="min-w-0 flex-1 gap-[3px]">
        {label && (
          <AppText
            variant="custom"
            weight="semibold"
            className="text-[12px] leading-[20px] text-[#8E8E95]"
          >
            {label}
          </AppText>
        )}
        {typeof resolvedValue === "string" ? (
          <AppText
            variant="custom"
            className="text-[14px] leading-[20px] text-[#1C1B1F]"
            numberOfLines={1}
          >
            {resolvedValue}
          </AppText>
        ) : (
          resolvedValue
        )}
      </View>
      <View className="flex-row items-center gap-[8px]">
        {right}
        {showChevron && <Icon name="ChevronRightSmall" width={5} height={10} />}
      </View>
    </Row>
  );
};

export default SettingLink;
