//import PersonalView from '@/views/PersonalView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
//import DashboardView from '@/views/DashboardView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [     
    
    /*{
      path: '/personal',
      name: 'personal',
      component: PersonalView
    },
    */

    {
      path: '/login',
      name: 'login',
      component: LoginForm
    },
    /*{
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    }*/

  ],
})

router.beforeEach((to, from, next) => {
// y este before each es por q se va a lanzar antes de mandarlo a la vista
  //usamos una instancia de mi tienda pinia, el to.matech.some es para que agarre la ruta con el nombre tal 
  // y el record.meta.requiresAuth es para que verifique tenga el meta: { requiresAuth: true 
  //despues de eso el if es para saber si hay token, si no hay te manda al login
  //si si hay te manda al dashboard,
  //el otro elseif es para cuando alguien meta la ruta /;login pero su token siga vigente entonce lo rediriga al dashboard
  const useAuthStore1 = useAuthStore()
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(!useAuthStore1.token){
      next('/login')
    }
    else{
      next()
  }
  } else if (to.name === 'login' && useAuthStore1.token) {
    next('/dashboard')
  } else {
    next()
  }

})


//correecion to.matech es una lista de todas las rutas y el some es para decir "cual tieene la authRequired"
export default router