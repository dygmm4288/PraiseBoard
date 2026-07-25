export type ErrorSeverity = "error" | "warning";

export type ErrorContext = {
  scope: string;
  severity?: ErrorSeverity;
  details?: Record<string, unknown>;
};

const reportedErrors = new WeakSet<object>();

export const reportError = (
  error: unknown,
  { scope, severity = "error", details }: ErrorContext,
) => {
  if (
    (typeof error === "object" && error !== null) ||
    typeof error === "function"
  ) {
    if (reportedErrors.has(error)) return;
    reportedErrors.add(error);
  }

  const payload = {
    error,
    ...(details ? { details } : {}),
  };

  if (severity === "warning") {
    console.warn(`[Warning][${scope}]`, payload);
    return;
  }

  console.error(`[Error][${scope}]`, payload);
};
