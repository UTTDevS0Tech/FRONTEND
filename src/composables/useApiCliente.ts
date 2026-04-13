import { createFetch } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

export const useApiCliente = createFetch({
  baseUrl: 'https://api.carlosd-dev.me/api',

  options: {
    async beforeFetch({ options }) {
      const authStore = useAuthStore()

      // Siempre aceptar JSON
      options.headers = {
        ...options.headers,
        Accept: 'application/json',
      }

      // Si hay token, lo agrega
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
    mode: 'cors',
  },
})