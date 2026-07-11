import { AppInput, type AppInputProps } from "@/shared/ui";
import SheetTextInput from "./sheet-text-input";

type BottomSheetInputProps = Omit<AppInputProps, "inputComponent">;

const BottomSheetInput = (props: BottomSheetInputProps) => {
  return <AppInput {...props} inputComponent={SheetTextInput} />;
};

export type { BottomSheetInputProps };
export default BottomSheetInput;
