import { COLOR } from "@/shared/constants/colors.constant";
import { cn } from "@/shared/utils/cn";
import { PropsWithChildren } from "react";
import { View } from "react-native";

type Props = PropsWithChildren<{
  className?: string;
}>;

const CARD_SHADOW_COLOR = COLOR.textDarkPurple;

const StatsCard = ({ children, className }: Props) => {
  return (
    <View
      className={cn("rounded-[20px] bg-white px-[20px] py-[16px]", className)}
      style={{
        shadowColor: CARD_SHADOW_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {children}
    </View>
  );
};

export default StatsCard;
