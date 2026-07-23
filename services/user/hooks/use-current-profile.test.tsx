import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  renderHook,
  waitFor,
} from "@testing-library/react-native";
import { PropsWithChildren } from "react";
import { UserProfile } from "../model/user.interface";
import { userApi } from "../user.api";
import { useCurrentProfile } from "./use-current-profile";

jest.mock("../user.api", () => ({
  userApi: {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  },
}));

const getProfileMock = jest.mocked(userApi.getProfile);
const updateProfileMock = jest.mocked(userApi.updateProfile);

const profile = {
  id: "profile-1",
  nickname: "김고래",
} as UserProfile;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: false,
      },
      mutations: {
        gcTime: Infinity,
        retry: false,
      },
    },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  getProfileMock.mockResolvedValue(profile);
  updateProfileMock.mockResolvedValue(profile);
});

test("같은 profile을 사용하는 두 소비자는 서버 조회를 공유한다", async () => {
  const { result } = await renderHook(
    () => ({
      first: useCurrentProfile("profile-1"),
      second: useCurrentProfile("profile-1"),
    }),
    {
      wrapper: createWrapper(),
    },
  );

  await waitFor(() => {
    expect(result.current.first.nickname).toBe("김고래");
    expect(result.current.second.nickname).toBe("김고래");
  });
  expect(getProfileMock).toHaveBeenCalledTimes(1);
});

test("프로필 수정 결과를 같은 query를 쓰는 소비자와 공유한다", async () => {
  const updatedProfile = {
    ...profile,
    nickname: "새이름",
  };

  updateProfileMock.mockResolvedValueOnce(updatedProfile);

  const { result } = await renderHook(
    () => ({
      first: useCurrentProfile("profile-1"),
      second: useCurrentProfile("profile-1"),
    }),
    {
      wrapper: createWrapper(),
    },
  );

  await waitFor(() => expect(result.current.first.profile).toEqual(profile));
  await act(async () => {
    await result.current.first.updateProfile({
      nickname: "새이름",
    });
  });
  await waitFor(() => {
    expect(result.current.first.nickname).toBe("새이름");
    expect(result.current.second.nickname).toBe("새이름");
  });
});
