import { BoardSetupFormValues } from "@/entities/board/board.schema";
import { UseFormReturn } from "react-hook-form";

export type OnboardStepProps = {
  form: UseFormReturn<BoardSetupFormValues>;
  onSend: () => Promise<void>;
};
