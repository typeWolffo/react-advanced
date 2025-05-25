import { API } from "./generated-api";

const refreshTokenState = (() => {
  const MAX_REFRESH_ATTEMPTS = 5;
  let attempts = 0;

  return {
    incrementAttempt: () => {
      attempts += 1;
      return attempts;
    },

    resetAttempts: () => {
      attempts = 0;
    },

    hasReachedMaxAttempts: () => attempts >= MAX_REFRESH_ATTEMPTS,
    MAX_REFRESH_ATTEMPTS,
  };
})();

export const ApiClient = new API({
  // baseURL: 'http://localhost:3000',
  baseURL: import.meta.env.VITE_APP_URL,
  secure: true,
  withCredentials: true,
});



ApiClient.instance.interceptors.response.use(
  (response) => {
    refreshTokenState.resetAttempts();

    return response;
  },
  async (error) => {
    if (error.config?.url?.includes("/logout")) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !error.config._retry &&
      !refreshTokenState.hasReachedMaxAttempts()
    ) {
      error.config._retry = true;
      refreshTokenState.incrementAttempt();

      try {
        await ApiClient.api.authControllerRefreshTokens().catch(() => {
          if (refreshTokenState.hasReachedMaxAttempts()) {
            console.log(
              `Max refresh token attempts (${refreshTokenState.MAX_REFRESH_ATTEMPTS}) reached. Logging out.`,
            );

            refreshTokenState.resetAttempts();

            window.location.href = "/login";
          }
        });

        return ApiClient.instance(error.config);
      } catch {
        return Promise.reject(error);
      }
    }

    // if (
    //   error.response?.status === 403 &&
    //   error.response?.data?.errorCode === CustomErrorCode.USER_BANNED
    // ) {
    //   useAuthStore.setState({
    //     isLoggedIn: false,
    //   });

    //   localStorage.setItem(CURRENT_USER_STORAGE_KEY, DEFAULT_CURRENT_USER_STORAGE);

    //   if (useAuthStore.getState().isLoggedIn) window.location.href = "/auth/login";
    // }

    return Promise.reject(error);
  },
);
