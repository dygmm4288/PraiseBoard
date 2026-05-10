import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
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
  enableBackdrop?: boolean;
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
  enableBackdrop = true,
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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) =>
      enableBackdrop ? (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.45}
          pressBehavior="close"
        />
      ) : null,
    [enableBackdrop],
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
      backdropComponent={renderBackdrop}
      backgroundStyle={{ borderRadius: 30 }}
    >
      <BottomSheetView className="flex-1">{children}</BottomSheetView>
    </BottomSheet>
  );
};

export default AppBottomSheet;
