import { useState } from "react";

export type StepItem = { label: string; value: string };
export type StepperProps = {
  steps: StepItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: (api: {
    steps: StepItem[];
    currentValue: string;
    currentIndex: number;
    next: () => void;
    prev: () => void;
    goTo: (value: string) => void;
  }) => React.ReactNode;
};

const Stepper = ({
  steps,
  defaultValue,
  onValueChange,
  children,
}: StepperProps) => {
  const [value, setValue] = useState(defaultValue ?? steps[0]?.value);
  const currentIndex = Math.max(
    steps.findIndex((s) => s.value === value),
    0,
  );

  const next = () => {
    const nextValue = steps[currentIndex + 1];
    if (nextValue) {
      setValue(nextValue.value);
      onValueChange?.(nextValue.value);
    }
  };
  const prev = () => {
    const prevValue = steps[currentIndex + 1];
    if (prevValue) {
      setValue(prevValue.value);
      onValueChange?.(prevValue.value);
    }
  };

  return children({
    steps,
    currentValue: value,
    currentIndex,
    next,
    prev,
    goTo: setValue,
  });
};

export default Stepper;
