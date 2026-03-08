import { useState } from "react";

export type StepItem = { label: string; value: string };
export type StepDirection = "none" | "forward" | "backward";
export type StepperProps = {
  steps: StepItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: (api: {
    steps: StepItem[];
    currentValue: string;
    currentIndex: number;
    direction: StepDirection;
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
  const [direction, setDirection] = useState<StepDirection>("none");
  const currentIndex = Math.max(
    steps.findIndex((s) => s.value === value),
    0,
  );

  const setStepValue = (nextValue: string, nextDirection: StepDirection) => {
    setDirection(nextDirection);
    setValue(nextValue);
    onValueChange?.(nextValue);
  };

  const next = () => {
    const nextValue = steps[currentIndex + 1];
    if (nextValue) {
      setStepValue(nextValue.value, "forward");
    }
  };
  const prev = () => {
    const prevValue = steps[currentIndex - 1];
    if (prevValue) {
      setStepValue(prevValue.value, "backward");
    }
  };
  const goTo = (nextValue: string) => {
    const nextIndex = steps.findIndex((s) => s.value === nextValue);
    if (nextIndex < 0 || nextIndex === currentIndex) return;

    const nextDirection = nextIndex > currentIndex ? "forward" : "backward";
    setStepValue(nextValue, nextDirection);
  };

  return children({
    steps,
    currentValue: value,
    currentIndex,
    direction,
    next,
    prev,
    goTo,
  });
};

export default Stepper;
