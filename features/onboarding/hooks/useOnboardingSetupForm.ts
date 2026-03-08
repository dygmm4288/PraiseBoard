import {
  BOARD_SETUP_DEFAULT_VALUES,
  type BoardSetupFormValues,
} from "@/entities/board/board.schema";
import { useForm, type FieldPath } from "react-hook-form";

export type ValidateBeforeNextOptions = {
  fields?: FieldPath<BoardSetupFormValues>;
  shouldFocus?: boolean;
};

const useOnboardingSetupForm = () => {
  const form = useForm<BoardSetupFormValues>({
    mode: "onBlur",
    defaultValues: structuredClone(BOARD_SETUP_DEFAULT_VALUES),
  });

  const validateBeforeNext = async (
    options: ValidateBeforeNextOptions,
  ): Promise<boolean> => {
    const { fields, shouldFocus } = options;

    if (!fields || fields.length === 0) return true;

    return await form.trigger(fields as any, { shouldFocus });
  };

  return {
    form,
    validateBeforeNext,
  };
};

export default useOnboardingSetupForm;
