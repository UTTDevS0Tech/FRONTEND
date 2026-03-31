// src/composables/useApiTipoServicios.ts
import { createFetch } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

export const useApiFetchTipoServicios = createFetch({
  baseUrl: 'https://api.carlosd-dev.me/api',
  options: {
    async beforeFetch({ options }) {
      const authStore = useAuthStore()

      options.headers = {
        Accept: 'application/json',
        ...(authStore.token
          ? { Authorization: `Bearer ${authStore.token}` }
          : {}),
          // pa que no se sobreescriban los headers, si ya hay algo en options.headers lo mantiene y le agrega lo nuevo, si no hay nada solo pone lo nuevo
        ...(options.headers as Record<string, string>),
      }

      return { options }
    },
    onFetchError(ctx) {
      const authStore = useAuthStore()
      if (ctx.response?.status === 401) {
        authStore.logout()
      }
      return ctx
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})