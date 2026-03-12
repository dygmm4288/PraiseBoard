import { cn } from "@/shared/utils/cn";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

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
  const hasValue = typeof value === "string" && value.length > 0;

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
      {reset && hasValue ? (
        <Pressable
          onPress={onReset}
          hitSlop={8}
          accessibilityRole='button'
          accessibilityLabel='입력값 지우기'
          className='ml-2 h-6 w-6 items-center justify-center rounded-full bg-gray-100'>
          <Text className='text-gray-500'>x</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default AppInput;
