import { Icon } from "@/assets/icons";
import { cn } from "@/shared/utils/cn";
import { ElementType, useCallback } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  View,
} from "react-native";

export interface AppInputProps extends TextInputProps {
  reset?: boolean;
  inputClassName?: string;
  className?: string;
  placeholder?: string;
  inputComponent?: ElementType<TextInputProps>;
  onReset?: () => void;
  onMaxLengthExceeded?: () => void;
}

export const AppInput = ({
  inputClassName = "",
  reset = false,
  value = "",
  className = "",
  placeholder,
  inputComponent: InputComponent = TextInput,
  maxLength,
  onChangeText,
  onKeyPress,
  onMaxLengthExceeded,
  onReset,
  ...props
}: AppInputProps) => {
  const hasValue = typeof value === "string" && value.length > 0;

  const handleChangeText = useCallback(
    (nextValue: string) => {
      onChangeText?.(nextValue);
    },
    [onChangeText],
  );

  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      onKeyPress?.(event);

      const key = event.nativeEvent.key;
      const isEditingKey = key === "Backspace" || key === "Enter";

      if (
        maxLength !== undefined &&
        typeof value === "string" &&
        value.length >= maxLength &&
        !isEditingKey
      ) {
        onMaxLengthExceeded?.();
      }
    },
    [maxLength, onKeyPress, onMaxLengthExceeded, value],
  );

  const handleReset = () => {
    if (onReset) {
      onReset();
      return;
    }

    onChangeText?.("");
  };

  return (
    <View
      className={cn(
        "w-full min-h-[40px] flex-row items-center rounded-[20px] border border-neutral-200 px-[14px]",
        className,
      )}
    >
      <InputComponent
        className={cn(
          "min-h-[40px] flex-1 self-stretch p-0 font-pretendard",
          inputClassName,
        )}
        textAlignVertical="center"
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChangeText={handleChangeText}
        onKeyPress={handleKeyPress}
        {...props}
      />
      {reset && hasValue ? (
        <Pressable
          onPress={handleReset}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="입력값 지우기"
        >
          <Icon name="Delete" size={14} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default AppInput;
