import { createFetch } from "@vueuse/core";
import { useAuthStore } from "../stores/auth";

export const useApiFetchDiego = createFetch({
    baseUrl: 'https://flamelike-unplunderously-tamekia.ngrok-free.dev/api',
    options: {
        async beforeFetch({ options }) {
            const authStore = useAuthStore()

            if (authStore.token) {
                options.headers = {
                    ...options.headers,
                    'ngrok-skip-browser-warning': 'true',
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
                
                    }

                    return { 
                        options }
                },
                
           
                onFetchError(contextodelerror) {
                    const authStore = useAuthStore()

                    if (contextodelerror.response?.status === 401) {
                        authStore.logout()
                    }
                    return contextodelerror
                },
  },

  fetchOptions : {
    mode: 'cors'
  }
  })