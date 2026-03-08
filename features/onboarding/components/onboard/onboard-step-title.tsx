import AppInputButton from "@/shared/components/InputButton";
import { AppChatBubble } from "@/shared/components/ui";
import { Controller } from "react-hook-form";
import { OnboardStepProps } from "../types/onboard-step.type";

const OnboardStepTitle = ({ form, onPress }: OnboardStepProps) => {
  return (
    <>
      <AppChatBubble
        side="right"
        message={form.getValues("profiles.nickname")}
      />

      <Controller
        name="boards.title"
        control={form.control}
        render={({ field }) => (
          <AppInputButton
            value={field.value}
            onChangeValue={field.onChange}
            onPress={onPress}
            buttonProps={{
              label: "다음",
            }}
          />
        )}
      ></Controller>
    </>
  );
};

export default OnboardStepTitle;
