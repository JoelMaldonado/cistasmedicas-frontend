export type UserRole = 'admin' | 'doctor' | 'patient'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
}
