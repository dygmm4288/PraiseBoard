import { BoardSetupFormValues } from "@/features/board";
import { UseFormReturn } from "react-hook-form";

export type OnboardStepProps = {
  form: UseFormReturn<BoardSetupFormValues>;
  onNext: () => void;
};
