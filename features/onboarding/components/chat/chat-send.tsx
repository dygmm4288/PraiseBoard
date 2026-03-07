import { Pressable, View } from "react-native";

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

const ChatSend = ({ onPress, disabled = false }: Props) => {
  return (
    <View>
      <Pressable disabled={disabled} onPress={onPress} />
    </View>
  );
};

export default ChatSend;
