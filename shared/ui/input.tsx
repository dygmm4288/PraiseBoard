import { cn } from "@/shared/utils/cn";
import { Button, TextInput, TextInputProps, View } from "react-native";

export interface AppInputProps extends TextInputProps {
  reset?: boolean;
  inputClassName?: string;
  onReset?: () => void;
  className?: string;
  placeholder?: string;
}

export const AppInput = ({
  inputClassName = "",
  reset = false,
  onReset = () => {},
  value = "",
  className = "",
  placeholder,
  ...props
}: AppInputProps) => {
  return (
    <View
      className={cn(
        "flex flex-row justify-between w-full min-h-[40px] rounded-[20px] border border-gray-200 px-[14px] py-[8px]",
        className,
      )}
    >
      <TextInput
        className={cn("w-full", inputClassName)}
        placeholder={placeholder}
        value={value}
        {...props}
      />
      {reset && value && <Button title={"하이"} onPress={onReset} />}
    </View>
  );
};

export default AppInput;
