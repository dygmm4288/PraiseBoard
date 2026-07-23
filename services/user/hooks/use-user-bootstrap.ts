import { useEffect, useState } from "react";
import { bootstrapUser } from "../actions/bootstrap-user";
import { AuthState } from "../model/user.interface";

type UserBootstrapState = {
  isInitialized: boolean;
  authUserId: string | null;
  profileId: string | null;
  deviceId: string | null;
  authState: AuthState;
};

export const useUserBootstrap = (): UserBootstrapState => {
  const [state, setState] = useState<UserBootstrapState>({
    isInitialized: false,
    authUserId: null,
    profileId: null,
    deviceId: null,
    authState: "public",
  });

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const result = await bootstrapUser();

        if (!isMounted) return;

        setState({
          isInitialized: true,
          ...result,
        });
      } catch (error) {
        console.error("유저 bootstrap 중 오류 발생", error);

        if (!isMounted) return;

        setState({
          isInitialized: true,
          authUserId: null,
          profileId: null,
          deviceId: null,
          authState: "public",
        });
      }
    };

    void initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
};
