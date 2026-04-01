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
        //trae token? si o no? si trae lo agrega al header, si no trae nada no agrega nada
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
      // si el token expiró, nos regresa al login pa
      if (ctx.response?.status === 401) {
        authStore.logout()
      }
      return ctx
    },
  },
  // pa q el backend no se ponga de morrita
  fetchOptions: {
    mode: 'cors',
  },
})