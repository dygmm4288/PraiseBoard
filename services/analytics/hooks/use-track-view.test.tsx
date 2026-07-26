import { renderHook, waitFor } from "@testing-library/react-native";
import { navigationAnalytics } from "../events/navigation.analytics";
import { useTrackView } from "./use-track-view";

jest.mock("../events/navigation.analytics", () => ({
  navigationAnalytics: {
    viewed: jest.fn().mockResolvedValue(undefined),
  },
}));

const viewTrackedMock = jest.mocked(navigationAnalytics.viewed);

beforeEach(() => {
  viewTrackedMock.mockClear();
});

test("화면 component lifecycle마다 view event를 한 번 기록한다", async () => {
  const first = await renderHook(() => useTrackView("stats"));

  await waitFor(() => expect(viewTrackedMock).toHaveBeenCalledTimes(1));
  await first.rerender({});
  expect(viewTrackedMock).toHaveBeenCalledWith("stats");

  await first.unmount();
  const second = await renderHook(() => useTrackView("stats"));
  await waitFor(() => expect(viewTrackedMock).toHaveBeenCalledTimes(2));
  await second.unmount();
});
