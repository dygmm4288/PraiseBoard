import { render } from "@testing-library/react-native";
import { ToastRouteSync } from "./toast-route-sync";

const mockHideToast = jest.fn();
let mockPathname = "/";

jest.mock("expo-router", () => ({
  usePathname: () => mockPathname,
}));

jest.mock("./toast", () => ({
  toast: {
    hideToast: () => mockHideToast(),
  },
}));

beforeEach(() => {
  mockPathname = "/";
});

test("최초 mount에서는 토스트를 숨기지 않는다", async () => {
  await render(<ToastRouteSync />);

  expect(mockHideToast).not.toHaveBeenCalled();
});

test("pathname이 바뀔 때만 현재 토스트를 숨긴다", async () => {
  const view = await render(<ToastRouteSync />);

  mockPathname = "/settings";
  await view.rerender(<ToastRouteSync />);
  expect(mockHideToast).toHaveBeenCalledTimes(1);

  await view.rerender(<ToastRouteSync />);
  expect(mockHideToast).toHaveBeenCalledTimes(1);
});
