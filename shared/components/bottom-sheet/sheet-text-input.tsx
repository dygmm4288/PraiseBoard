import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ComponentProps, forwardRef } from "react";

type SheetTextInputProps = ComponentProps<typeof BottomSheetTextInput>;
type SheetTextInputRef = SheetTextInputProps["ref"];

export const SheetTextInput = forwardRef<
  unknown,
  SheetTextInputProps
>(function SheetTextInput(props, ref) {
  return <BottomSheetTextInput ref={ref as SheetTextInputRef} {...props} />;
});

export default SheetTextInput;
