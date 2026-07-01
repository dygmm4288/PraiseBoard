import { AppText } from "@/shared/ui";
import { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardInputError } from "../../hooks/use-onboard-input-error";

type Props = PropsWithChildren<{
  footer?: ReactNode;
  inputError?: OnboardInputError | null;
}>;

const OnboardChatStepLayout = ({ children, footer, inputError }: Props) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Number.isFinite(insets.bottom)
    ? Math.max(0, insets.bottom)
    : 0;

  return (
    <View className="flex-1">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingTop: 36 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={12}
        extraKeyboardSpace={8}
      >
        {children}
      </KeyboardAwareScrollView>
      {footer ? (
        <KeyboardStickyView
          offset={{ closed: 0, opened: bottomInset }}
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <View
            className="bg-white"
            style={{
              marginHorizontal: -16,
              paddingBottom: bottomInset,
            }}
          >
            {inputError ? (
              <View
                key={inputError.id}
                pointerEvents="none"
                className="absolute inset-x-0 z-10 items-center"
                style={{ top: -36 }}
              >
                <View
                  className="rounded-full bg-[#48464B] px-[15px] py-[6px]"
                  style={{
                    shadowColor: "rgba(67,66,70,0.22)",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 1,
                    shadowRadius: 24,
                    elevation: 8,
                  }}
                >
                  <AppText
                    variant="caption1"
                    weight="semibold"
                    className="text-white"
                  >
                    {inputError.message}
                  </AppText>
                </View>
              </View>
            ) : null}
            {footer}
          </View>
        </KeyboardStickyView>
      ) : null}
    </View>
  );
};

export default OnboardChatStepLayout;
