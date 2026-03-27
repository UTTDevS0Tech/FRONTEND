import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '@/types'


export const useAuthStore = defineStore('login', () => {
    const token = ref<string | null>(localStorage.getItem('token'))
    const user = ref<User | null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null)

    const isAuthenticated = computed(() => !!token.value)

    function setLogin(newToken: string) {
        token.value = newToken
        
        localStorage.setItem('token', newToken)
    }

    function setUsuario(newUser: User) {
        user.value = newUser
        localStorage.setItem('user', JSON.stringify(newUser))
    }
    


function logout(){
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    
}

 

  return { token, user, setLogin, logout, isAuthenticated, setUsuario }
})