import { createFetch } from "@vueuse/core";
import { useAuthStore } from "../stores/auth";

export const useApiFetchDiego = createFetch({
  baseUrl: 'https://api.carlosd-dev.me/api',
  options: {
    async beforeFetch({ options }) {
      const authStore = useAuthStore();

      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };
      }

      return { options };
    },

    onFetchError(contextodelerror) {
      const authStore = useAuthStore();

      if (contextodelerror.response?.status === 401) {
        authStore.logout();
      }

      return contextodelerror;
    },
  },

  fetchOptions: {
    mode: 'cors',
  },
});