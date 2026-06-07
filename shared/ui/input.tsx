import { cn } from "@/shared/utils/cn";
import { ComponentType } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

export interface AppInputProps extends TextInputProps {
  reset?: boolean;
  inputClassName?: string;
  onReset?: () => void;
  className?: string;
  placeholder?: string;
  inputComponent?: ComponentType<TextInputProps>;
}

export const AppInput = ({
  inputClassName = "",
  reset = false,
  onReset = () => {},
  value = "",
  className = "",
  placeholder,
  inputComponent: InputComponent = TextInput,
  ...props
}: AppInputProps) => {
  const hasValue = typeof value === "string" && value.length > 0;

  return (
    <View
      className={cn(
        "w-full min-h-[40px] flex-row items-center rounded-[20px] border border-gray-200 px-[14px]",
        className,
      )}
    >
      <InputComponent
        className={cn("min-h-[40px] flex-1 self-stretch p-0", inputClassName)}
        textAlignVertical="center"
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        value={value}
        {...props}
      />
      {reset && hasValue ? (
        <Pressable
          onPress={onReset}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="입력값 지우기"
          className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-gray-100"
        >
          <Text className="text-gray-500">x</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default AppInput;
