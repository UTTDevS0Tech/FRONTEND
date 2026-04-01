//import PersonalView from '@/views/PersonalView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'
import DashboardClienteView from '@/views/DashboardClienteView.vue'
import DashboardAdmin from '@/views/DashboardAdminView.vue'
import DashboardPersonal from '@/views/DashboardPersonal.vue'
import AdminServiciosView from '@/views/AdminServiciosView.vue'
import AgendarCita from '@/components/CitasForm.vue'
import AdminTipoServiciosView from '@/views/AdminTipoServiciosView.vue'
import CitaEscritorioView from '@/views/CitaEscritorioView.vue'

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
      path: '/dashboard/cliente/cita',
      name: 'agendar-cita',
      component: AgendarCita,
      meta: {requiresAuth: true, role: 3}
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm
    },
    {
      path: '/dashboard/cliente',
      name: 'dashboard/cliente',
      component: DashboardClienteView,
      meta: { requiresAuth: true, role: 3 }
    },
    {
      path: '/dashboard/admin',
      name: 'dashboard/admin',
      component: DashboardAdmin,
      meta: { requiresAuth: true, role: 2 }
    },
    {
      path: '/dashboard/personal',
      name: 'dashboard/personal',
      component: DashboardPersonal,
      meta: { requiresAuth: true, role: 1 }
    },
    {
      path: '/dashboard/personal/citas-escritorio',
      name: 'dashboard/personal/citas-escritorio',
      component: CitaEscritorioView,
      meta: { requiresAuth: true, role: 4 }
    },
    {
      path: '/dashboard/admin/servicios',
      name: 'dashboard/admin/servicios',
      component: AdminServiciosView,
      meta: { requiresAuth: true, role: 2 }
    }, 
    {
    path: '/dashboard/admin/tipos-servicio',
    name: 'dashboard/admin/tipos-servicio',
    component: AdminTipoServiciosView,
    meta: { requiresAuth: true, role: 2 }
  }
  ],
})
/*
router.beforeEach((to, from, next) => {
// y este before each es por q se va a lanzar antes de mandarlo a la vista
  //usamos una instancia de mi tienda pinia, el to.matech.some es para que agarre la ruta con el nombre tal 
  // y el record.meta.requiresAuth es para que verifique tenga el meta: { requiresAuth: true 
  //despues de eso el if es para saber si hay token, si no hay te manda al login
  //si si hay te manda al dashboard,
  //el otro elseif es para cuando alguien meta la ruta /;login pero su token siga vigente entonce lo rediriga al dashboard
  const useAuthStore1 = useAuthStore()
  const userRol = useAuthStore1.user.role_id
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(!useAuthStore1.token){
      next('/login')
    }
    if(to.meta.role && to.meta.role !=== userRol) {
      return redirigir(userRol, next) 
    }

next()

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
*/

router.beforeEach((to,from, next ) => {
  const useAuthStore1 = useAuthStore()
  const tavalidado = !!useAuthStore1.token
  const user_role = useAuthStore1.user?.rol_id

  if( to.matched.some(record => record.meta.requiresAuth)) {
    if(!tavalidado){
        return next({name: 'login'})
    }
    if(to.meta.role && to.meta.role !== user_role) {
      return redirigir(user_role, next)
    }
    next()
  } else if(to.name === 'login' && tavalidado) {
    redirigir(user_role, next)
  }
  else {
    next()
  }
})

//para que no batallen en entender el undefined es para cuando no se tenga un rol es como el compare de seguridad: eh compare ponte al tiro esto no trae basicamente
function redirigir(rol_id: number |undefined, next: any) {
  if (rol_id === 2) return next({ name: 'dashboard/admin' })
  if (rol_id === 1) return next({ name: 'dashboard/personal'})
  if (rol_id === 4) return next({ name: 'dashboard/personal/citas-escritorio'})
  if (rol_id === 3) return next({ name: 'dashboard/cliente' })
  next('/login')
}

//correecion to.matech es una lista de todas las rutas y el some es para decir "cual tieene la authRequired"
export default router