import { act, renderHook, waitFor } from "@testing-library/react-native";
import { localStorage } from "@/infra/storage";
import { useVibrationEnabled } from "./use-vibration-enabled";

jest.mock("@/infra/storage", () => ({
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const getItemMock = jest.mocked(localStorage.getItem);
const setItemMock = jest.mocked(localStorage.setItem);

beforeEach(() => {
  getItemMock.mockResolvedValue(null);
  setItemMock.mockResolvedValue();
});

test("저장된 진동 설정을 복원한다", async () => {
  getItemMock.mockResolvedValue("true");

  const { result } = await renderHook(() => useVibrationEnabled());

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.isVibrationEnabled).toBe(true);
  expect(getItemMock).toHaveBeenCalledWith("vibration_enabled");
});

test("변경한 진동 설정을 로컬 저장소에 저장한다", async () => {
  const { result } = await renderHook(() => useVibrationEnabled());

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  await act(async () => {
    await result.current.updateVibrationEnabled(true);
  });

  expect(setItemMock).toHaveBeenCalledWith("vibration_enabled", "true");
  expect(result.current.isVibrationEnabled).toBe(true);
});
