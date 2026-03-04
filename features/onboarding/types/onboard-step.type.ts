import { BoardSetupFormValues } from "@/shared/schemas/board.schema";
import { UseFormReturn } from "react-hook-form";

export type OnboardStepProps = {
  form: UseFormReturn<BoardSetupFormValues>;
  onPress: () => Promise<void>;
};
