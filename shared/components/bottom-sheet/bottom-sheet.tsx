import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import BottomSheetHandle from "./bottom-sheet-handle";

export type SheetState = "hidden" | "peek" | "half" | "full";

type Props = {
  state: SheetState;
  onChangeState: (state: SheetState) => void;
  snapPoints?: Array<string | number>;
  enablePanDownToClose?: boolean;
} & PropsWithChildren;

const STATE_TO_INDEX = {
  hidden: -1,
  peek: 0,
  half: 1,
  full: 2,
} satisfies Record<SheetState, number>;

const INDEX_TO_STATE = {
  [-1]: "hidden",
  0: "peek",
  1: "half",
  2: "full",
} as const satisfies Record<number, SheetState>;

const DEFAULT_SNAP_POINTS = ["25%", "50%", "90%"] as const;

const AppBottomSheet = ({
  state,
  onChangeState,
  children,
  snapPoints = [...DEFAULT_SNAP_POINTS],
  enablePanDownToClose = true,
}: Props) => {
  const sheetRef = useRef<BottomSheet>(null);
  const resolvedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  useEffect(() => {
    const index = STATE_TO_INDEX[state];

    if (index === -1) {
      sheetRef.current?.close();
    } else {
      sheetRef.current?.snapToIndex(index);
    }
  }, [state]);

  const handleChange = useCallback(
    (index: number) => {
      const nextState = INDEX_TO_STATE[index as keyof typeof INDEX_TO_STATE];

      if (nextState) {
        onChangeState(nextState);
      }
    },
    [onChangeState],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={STATE_TO_INDEX[state]}
      snapPoints={resolvedSnapPoints}
      animateOnMount={false}
      enableDynamicSizing={false}
      enablePanDownToClose={enablePanDownToClose}
      onChange={handleChange}
      handleComponent={BottomSheetHandle}
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheet>
  );
};

export default AppBottomSheet;
