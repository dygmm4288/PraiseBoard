import { Icon } from "@/assets/icons";
import { COLOR } from "@/shared/constants/colors.constant";
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
            variant="label12"
            weight="semibold"
            className="text-labelGray"
          >
            {label}
          </AppText>
        )}
        {typeof resolvedValue === "string" ? (
          <AppText variant="body14" className="text-black" numberOfLines={1}>
            {resolvedValue}
          </AppText>
        ) : (
          resolvedValue
        )}
      </View>
      <View className="flex-row items-center gap-[8px]">
        {right}
        {showChevron && (
          <Icon name="ChevronRightSmall" size={18} color={COLOR["black"]} />
        )}
      </View>
    </Row>
  );
};

export default SettingLink;
