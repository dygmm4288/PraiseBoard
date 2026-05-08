import { AppText } from "@/shared/ui";
import { GestureResponderEvent, Pressable } from "react-native";

type Props = {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
};

const ArchiveActionBtn = ({ label, onPress }: Props) => {
  return (
    <Pressable
      className="flex justify-center items-center px-[9px] py-[5px] rounded-full bg-primary-500"
      onPress={onPress}
    >
      <AppText variant="button2" className="text-white">
        {label}
      </AppText>
    </Pressable>
  );
};

export default ArchiveActionBtn;
