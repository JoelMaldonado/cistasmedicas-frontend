import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { UserRole } from '@/types/user.types'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    roles?: UserRole[]
  }
}

export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      return `/dashboard/${authStore.role}`
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return '/login'
    }

    if (to.meta.roles && authStore.role && !to.meta.roles.includes(authStore.role)) {
      return '/unauthorized'
    }

    return true
  })
}
