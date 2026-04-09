import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiFetchDiego } from '@/composables/useApi'
import type {ApiResponse, AdminPersonal, AdminPersonalPayload, AdminPersonalUpdatePayload,} from '@/types'