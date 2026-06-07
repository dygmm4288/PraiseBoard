import { COLOR } from "@/shared/constants/colors.constant";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  title?: string;
  bottomBorderYn?: boolean;
} & PropsWithChildren;

const SettingSectionLayout = ({ title, children }: Props) => {
  return (
    <View className="w-full gap-[12px]">
      {title && (
        <AppText
          variant="custom"
          weight="semibold"
          className="px-[8px] text-[12px] leading-[20px] text-labelGray"
        >
          {title}
        </AppText>
      )}
      <View className="w-full rounded-[20px]" style={styles.card}>
        <View
          className={cn(
            "w-full overflow-hidden rounded-[20px] bg-white py-[16px]",
          )}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: COLOR.textDarkPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
});

export default SettingSectionLayout;
