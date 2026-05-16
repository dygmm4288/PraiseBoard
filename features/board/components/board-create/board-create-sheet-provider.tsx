import AppBottomSheet, {
  SheetState,
} from "@/shared/components/bottom-sheet/bottom-sheet";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { View } from "react-native";
import BoardCreate from "./board-create";

type BoardCreateSheetContextValue = {
  openCreateSheet: () => void;
  closeCreateSheet: () => void;
};

const BoardCreateSheetContext =
  createContext<BoardCreateSheetContextValue | null>(null);

export const BoardCreateSheetProvider = ({ children }: PropsWithChildren) => {
  const [createSheetState, setCreateSheetState] =
    useState<SheetState>("hidden");

  const openCreateSheet = useCallback(() => {
    setCreateSheetState("peek");
  }, []);

  const closeCreateSheet = useCallback(() => {
    setCreateSheetState("hidden");
  }, []);

  const value = useMemo(
    () => ({
      openCreateSheet,
      closeCreateSheet,
    }),
    [closeCreateSheet, openCreateSheet],
  );

  return (
    <BoardCreateSheetContext.Provider value={value}>
      {children}
      <AppBottomSheet
        state={createSheetState}
        onChangeState={setCreateSheetState}
        snapPoints={["100%"]}
      >
        {createSheetState !== "hidden" ? (
          <View className="flex-1 px-[20px] pb-[28px] pt-[8px]">
            <BoardCreate onCreated={closeCreateSheet} />
          </View>
        ) : null}
      </AppBottomSheet>
    </BoardCreateSheetContext.Provider>
  );
};

export const useBoardCreateSheet = () => {
  const context = useContext(BoardCreateSheetContext);

  if (!context) {
    throw new Error(
      "useBoardCreateSheet must be used within BoardCreateSheetProvider",
    );
  }

  return context;
};
