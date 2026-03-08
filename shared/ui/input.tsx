import { cn } from "@/shared/lib/cn";
import { Button, TextInput, TextInputProps, View } from "react-native";

export interface AppInputProps extends TextInputProps {
  reset?: boolean;
  inputClassName?: string;
  onReset?: () => void;
}

export const AppInput = ({
  inputClassName = "",
  reset = false,
  onReset = () => {},
  value = "",
  ...props
}: AppInputProps) => {
  return (
    <View className='flex flex-row justify-between w-full rounded-xl border border-gray-300 p-4'>
      <TextInput
        className={cn("w-full", inputClassName)}
        value={value}
        {...props}
      />
      {reset && value && <Button title={"하이"} onPress={onReset} />}
    </View>
  );
};

export default AppInput;
