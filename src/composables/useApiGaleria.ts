import { createFetch } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

export const useApiGaleria = createFetch({
  baseUrl: 'https://api.carlosd-dev.me/api',
  options: {
    async beforeFetch({ options }) {
      const authStore = useAuthStore()

      options.headers = {
        ...options.headers,
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
      }

      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`,
        }
      }

      return { options }
    },

    onFetchError(contextodelerror) {
      const authStore = useAuthStore()

      if (contextodelerror.response?.status === 401) {
        authStore.logout()
      }

      return contextodelerror
    },
  },

  fetchOptions: {
    mode: 'cors'
  }
})