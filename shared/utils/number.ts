export const toSafeInteger = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

export const toPadZero = (
  value: number,
  digit: number = 2,
  direction: 'prefix' | 'suffix' = 'prefix',
): string => {
  const numStr = String(value);

  if (numStr.length >= digit) return numStr;

  const zeros = '0'.repeat(digit - numStr.length);

  return direction === 'suffix' ? `${numStr}${zeros}` : `${zeros}${numStr}`;
};
