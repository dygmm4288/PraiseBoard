import { useCallback, useState } from "react";

type Props = {
  defaultValue?: string;
};

const useInput = ({ defaultValue = "" }: Props = {}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChangeValue = useCallback((text: string) => {
    setValue(text);
  }, []);

  return [value, handleChangeValue, setValue] as const;
};

export default useInput;
