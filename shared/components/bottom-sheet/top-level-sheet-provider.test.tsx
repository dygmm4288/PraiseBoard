import { act, render, screen } from "@testing-library/react-native";
import type { PropsWithChildren, ReactNode } from "react";
import { Text } from "react-native";
import {
  TopLevelSheetProvider,
  useTopLevelSheet,
} from "./top-level-sheet-provider";
import type { TopLevelSheetControls } from "./top-level-sheet-state";

const mockPresent = jest.fn();
const mockDismiss = jest.fn();
const mockKeyboardDismiss = jest.fn();
const mockHideToast = jest.fn();
let mockPathname = "/";
let mockBottomSheetProps: {
  children?: ReactNode;
  onChange?: (index: number) => void;
  onDismiss: () => void;
  onRequestClose: () => void;
} | null = null;

jest.mock("expo-router", () => ({
  usePathname: () => mockPathname,
}));

jest.mock("react-native-keyboard-controller", () => ({
  KeyboardController: {
    dismiss: () => mockKeyboardDismiss(),
  },
}));

jest.mock("@/shared/toasts/toast", () => ({
  toast: {
    hideToast: () => mockHideToast(),
  },
}));

jest.mock("@gorhom/bottom-sheet", () => {
  const React = jest.requireActual<typeof import("react")>("react");

  return {
    BottomSheetModalProvider: ({ children }: PropsWithChildren) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock("./bottom-sheet", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } =
    jest.requireActual<typeof import("react-native")>("react-native");

  return {
    __esModule: true,
    default: React.forwardRef(function MockAppBottomSheet(
      props: {
        children?: ReactNode;
        onChange?: (index: number) => void;
        onDismiss: () => void;
        onRequestClose: () => void;
      },
      ref,
    ) {
      React.useImperativeHandle(ref, () => ({
        dismiss: mockDismiss,
        present: mockPresent,
      }));
      mockBottomSheetProps = props;

      return React.createElement(
        View,
        { testID: "mock-bottom-sheet" },
        props.children,
      );
    }),
  };
});

let sheetApi: ReturnType<typeof useTopLevelSheet>;

const SheetApiCapture = () => {
  sheetApi = useTopLevelSheet();
  return null;
};

const TestApp = () => (
  <TopLevelSheetProvider>
    <SheetApiCapture />
  </TopLevelSheetProvider>
);

const presentSheet = async (
  sheetKey: string,
  label: string,
  captureControls?: (controls: TopLevelSheetControls) => void,
) => {
  let wasAccepted = false;

  await act(async () => {
    wasAccepted = sheetApi.presentTopLevelSheet({
      sheetKey,
      snapPoints: [300],
      renderContent: (controls) => {
        captureControls?.(controls);
        return <Text>{label}</Text>;
      },
    });
  });

  return wasAccepted;
};

beforeEach(() => {
  mockPathname = "/";
  mockBottomSheetProps = null;
});

test("이전 sheet의 늦은 dismiss가 교체된 sheet를 닫지 않는다", async () => {
  await render(<TestApp />);
  let firstControls: TopLevelSheetControls | undefined;

  await presentSheet("first", "첫 번째", (controls) => {
    firstControls = controls;
  });
  const dismissFirstModal = mockBottomSheetProps?.onDismiss;

  await presentSheet("second", "두 번째");
  expect(mockDismiss).toHaveBeenCalledTimes(1);

  await act(async () => {
    dismissFirstModal?.();
  });
  expect(screen.getByText("두 번째")).toBeTruthy();
  expect(mockPresent).toHaveBeenCalledTimes(2);

  await act(async () => {
    firstControls?.dismiss();
  });
  expect(mockDismiss).toHaveBeenCalledTimes(1);
  expect(screen.getByText("두 번째")).toBeTruthy();
});

test("같은 sheetKey의 연속 요청은 현재 sheet를 다시 열지 않는다", async () => {
  await render(<TestApp />);

  const firstAccepted = await presentSheet("board-create", "기존 입력");
  const duplicateAccepted = await presentSheet("board-create", "새 입력");

  expect(firstAccepted).toBe(true);
  expect(duplicateAccepted).toBe(false);
  expect(mockDismiss).not.toHaveBeenCalled();
  expect(mockPresent).toHaveBeenCalledTimes(1);
  expect(screen.getByText("기존 입력")).toBeTruthy();
  expect(screen.queryByText("새 입력")).toBeNull();
});

test("화면이 바뀌면 대기 중인 교체 요청을 취소한다", async () => {
  const view = await render(<TestApp />);

  await presentSheet("first", "첫 번째");
  const dismissFirstModal = mockBottomSheetProps?.onDismiss;
  await presentSheet("second", "두 번째");
  expect(mockDismiss).toHaveBeenCalledTimes(1);

  mockPathname = "/settings";
  await view.rerender(<TestApp />);

  await act(async () => {
    dismissFirstModal?.();
  });
  expect(screen.queryByText("첫 번째")).toBeNull();
  expect(screen.queryByText("두 번째")).toBeNull();
  expect(mockPresent).toHaveBeenCalledTimes(1);
});

test("화면이 바뀌면 현재 sheet를 닫는다", async () => {
  const view = await render(<TestApp />);

  await presentSheet("current", "현재");
  mockPathname = "/settings";
  await view.rerender(<TestApp />);

  expect(mockKeyboardDismiss).toHaveBeenCalledTimes(1);
  expect(mockDismiss).toHaveBeenCalledTimes(1);
  expect(mockHideToast).toHaveBeenCalledTimes(1);
});

test("현재 sheet의 dismiss는 keyboard와 modal을 닫는다", async () => {
  await render(<TestApp />);
  let controls: TopLevelSheetControls | undefined;

  await presentSheet("current", "현재", (nextControls) => {
    controls = nextControls;
  });

  await act(async () => {
    controls?.dismiss();
  });

  expect(mockKeyboardDismiss).toHaveBeenCalledTimes(1);
  expect(mockDismiss).toHaveBeenCalledTimes(1);
  expect(mockHideToast).toHaveBeenCalledTimes(1);
});
