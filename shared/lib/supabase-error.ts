type SupabaseLikeError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

type SupabaseErrorContext = {
  domain: string;
  operation: string;
  params?: Record<string, unknown>;
};

export const throwLoggedSupabaseError = (
  error: unknown,
  context: SupabaseErrorContext,
): never => {
  const supabaseError = error as SupabaseLikeError;

  console.error(`[Supabase][${context.domain}.${context.operation}]`, {
    message: supabaseError.message,
    code: supabaseError.code,
    details: supabaseError.details,
    hint: supabaseError.hint,
    params: context.params,
    raw: error,
  });

  throw error;
};

export const throwLoggedSupabaseEmptyDataError = (
  context: SupabaseErrorContext,
): never => {
  return throwLoggedSupabaseError(new Error("SUPABASE_EMPTY_DATA"), context);
};

export const ensureSupabaseData = <T>(
  data: T | null,
  context: SupabaseErrorContext,
): T => {
  if (data === null) {
    return throwLoggedSupabaseEmptyDataError(context);
  }

  return data;
};
