import { View } from "react-native";
import { AppButton, AppButtonProps, AppInput, AppInputProps } from "../ui";

type Props = {
  value?: string;
  onChangeValue?: (v: string) => void;
  onPress?: (value: string) => void;
  inputProps?: AppInputProps;
  buttonProps?: AppButtonProps;
};

const AppInputButton = ({
  value,
  onChangeValue,
  onPress,
  inputProps = {},
  buttonProps = {},
}: Props) => {
  return (
    <View>
      <AppInput value={value} onChangeText={onChangeValue} {...inputProps} />
      <AppButton onPress={() => onPress?.(value || "")} {...buttonProps} />
    </View>
  );
};

export default AppInputButton;
