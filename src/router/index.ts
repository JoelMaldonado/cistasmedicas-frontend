import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { setupGuards } from '@/router/guards'
import { useAuthStore } from '@/stores/auth.store'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [{ path: '', component: () => import('@/views/auth/LoginView.vue') }],
  },
  {
    path: '/register',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [{ path: '', component: () => import('@/views/auth/RegisterView.vue') }],
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: () => `/dashboard/${useAuthStore().role ?? 'patient'}`,
      },
      { path: 'patient', component: () => import('@/views/dashboard/PatientDashboardView.vue'), meta: { roles: ['patient'] } },
      { path: 'doctor', component: () => import('@/views/dashboard/DoctorDashboardView.vue'), meta: { roles: ['doctor'] } },
      { path: 'admin', component: () => import('@/views/dashboard/AdminDashboardView.vue'), meta: { roles: ['admin'] } },
    ],
  },
  {
    path: '/doctors',
    component: DashboardLayout,
    meta: { requiresAuth: true, roles: ['patient'] },
    children: [
      { path: '', component: () => import('@/views/doctors/DoctorsListView.vue') },
      { path: ':doctorId/slots', component: () => import('@/views/appointments/AvailableSlotsView.vue') },
    ],
  },
  {
    path: '/appointments',
    component: DashboardLayout,
    meta: { requiresAuth: true, roles: ['patient'] },
    children: [{ path: '', component: () => import('@/views/appointments/MyAppointmentsView.vue') }],
  },
  {
    path: '/doctor',
    component: DashboardLayout,
    meta: { requiresAuth: true, roles: ['doctor'] },
    children: [
      { path: 'appointments', component: () => import('@/views/appointments/DoctorAppointmentsView.vue') },
      { path: 'slots/generate', component: () => import('@/views/appointments/GenerateSlotsView.vue') },
    ],
  },
  {
    path: '/admin',
    component: DashboardLayout,
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      { path: 'doctors', component: () => import('@/views/doctors/DoctorsManagementView.vue') },
      { path: 'doctors/create', component: () => import('@/views/doctors/CreateDoctorView.vue') },
    ],
  },
  {
    path: '/unauthorized',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('@/views/UnauthorizedView.vue') }],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

setupGuards(router)

export default router
