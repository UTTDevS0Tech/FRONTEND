import { createFetch } from '@vueuse/core'

export const useApiCitaEscritorio = createFetch({
  baseUrl: 'https://api.carlosd-dev.me/api',
  options: {
    immediate: false,
    updateDataOnError: true,

    async beforeFetch({ options }) {
      const token = localStorage.getItem('token')

      options.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      return { options }
    },

    afterFetch(ctx) {
      return ctx
    },

    onFetchError(ctx) {
      return ctx
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})