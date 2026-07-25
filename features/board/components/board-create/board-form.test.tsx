import { fireEvent, render } from "@testing-library/react-native";
import BoardForm from "./board-form";

const mockToastError = jest.fn();
const mockHideToast = jest.fn();

jest.mock("@/shared/toasts/toast", () => ({
  toast: {
    error: (message: string) => mockToastError(message),
    hideToast: () => mockHideToast(),
  },
}));

jest.mock("@/shared/components", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Pressable } =
    jest.requireActual<typeof import("react-native")>("react-native");

  return {
    BottomSheetHeader: () => null,
    BottomSheetInput: ({
      testID,
      onBlur,
      onMaxLengthExceeded,
    }: {
      testID?: string;
      onBlur?: () => void;
      onMaxLengthExceeded?: () => void;
    }) =>
      React.createElement(Pressable, {
        testID,
        onBlur,
        onPress: onMaxLengthExceeded,
      }),
  };
});

jest.mock("@/shared/ui", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Text } =
    jest.requireActual<typeof import("react-native")>("react-native");

  return {
    AppText: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(Text, null, children),
    ConfirmModal: () => null,
  };
});

jest.mock("@/features/emoji", () => ({
  EmojiPickerModal: () => null,
  useBoardEmojiOptions: () => [],
}));

jest.mock("@gorhom/bottom-sheet", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } =
    jest.requireActual<typeof import("react-native")>("react-native");

  return {
    BottomSheetScrollView: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => React.createElement(View, null, children),
  };
});

const renderBoardForm = () =>
  render(
    <BoardForm
      title="습관 추가"
      formData={{
        title: "123456789012345",
        emoji: "🌱",
        targetCount: 30,
        rewardMemo: "12345678901234567890",
        limitCount: 1,
      }}
      onChangeFormData={() => jest.fn()}
      onClose={jest.fn()}
      onSubmit={jest.fn()}
    />,
  );

beforeEach(() => {
  mockToastError.mockClear();
  mockHideToast.mockClear();
});

test("습관 이름 글자 수를 초과하면 toast를 노출한다", async () => {
  const { getByTestId } = await renderBoardForm();

  await fireEvent.press(getByTestId("board-title-input"));

  expect(mockToastError).toHaveBeenCalledWith(
    "습관 이름은 15자까지 입력할 수 있어요.",
  );
});

test("보상 글자 수를 초과하면 toast를 노출한다", async () => {
  const { getByTestId } = await renderBoardForm();

  await fireEvent.press(getByTestId("board-reward-input"));

  expect(mockToastError).toHaveBeenCalledWith(
    "보상은 20자까지 입력할 수 있어요.",
  );
});

test("습관 입력창의 focus가 해제되면 toast를 즉시 제거한다", async () => {
  const { getByTestId } = await renderBoardForm();

  await fireEvent(getByTestId("board-title-input"), "blur");
  await fireEvent(getByTestId("board-reward-input"), "blur");

  expect(mockHideToast).toHaveBeenCalledTimes(2);
});
