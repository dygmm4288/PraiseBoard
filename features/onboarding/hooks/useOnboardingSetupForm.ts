import {
  BOARD_SETUP_DEFAULT_VALUES,
  boardSetupDraftSchema,
  type BoardSetupFormValues,
} from "@/entities/board/board.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn, type FieldPath } from "react-hook-form";

export type ValidateBeforeNextOptions = {
  fields?: FieldPath<BoardSetupFormValues> | FieldPath<BoardSetupFormValues>[];
  shouldFocus?: boolean;
};

const useOnboardingSetupForm = (
  defaultValues: BoardSetupFormValues = BOARD_SETUP_DEFAULT_VALUES,
) => {
  const form = useForm<BoardSetupFormValues>({
    defaultValues: structuredClone(defaultValues),
    resolver: zodResolver(boardSetupDraftSchema),
  });

  return {
    form,
  };
};
/**
 * 다음 단계로 이동하기 전에 지정한 필드들의 유효성을 검사하고,
 * 첫 번째 에러 메시지를 반환합니다.
 * @param form `react-hook-form`의 폼 인스턴스
 * @param options 검사 대상 필드와 포커스 이동 여부
 * @returns 유효성 검사가 통과하면 `null`, 실패하면 첫 번째 에러 메시지
 */
export const validateBeforeNext = async (
  form: UseFormReturn<BoardSetupFormValues>,
  options: ValidateBeforeNextOptions,
): Promise<string | null> => {
  const { fields, shouldFocus } = options;

  if (!fields || (Array.isArray(fields) && fields.length === 0)) return null;

  const targetFields = Array.isArray(fields) ? fields : [fields];
  const ok = await form.trigger(
    targetFields.length === 1 ? targetFields[0] : targetFields,
    { shouldFocus },
  );
  if (ok) return null;

  for (const field of targetFields) {
    const normalizedPath = field.includes("[")
      ? field.replace(/\[(\d+)\]/g, ".$1")
      : field;
    const segments = normalizedPath.split(".");
    let error: any = form.formState.errors;

    for (let i = 0; i < segments.length; i++) {
      if (!error) break;
      error = error[segments[i]];
    }

    if (typeof error?.message === "string") return error.message;
  }

  return null;
};

export default useOnboardingSetupForm;
