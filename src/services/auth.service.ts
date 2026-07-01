import type { User, UserRole } from '@/types/user.types'
import { mockDelay } from '@/services/mockDelay'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export interface AuthResult {
  user: User
  token: string
}

function resolveRoleFromEmail(email: string): UserRole {
  const normalized = email.toLowerCase()
  if (normalized.includes('admin')) return 'admin'
  if (normalized.includes('doctor')) return 'doctor'
  return 'patient'
}

function nameFromEmail(email: string): string {
  const [localPart] = email.split('@')
  return localPart
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const authService = {
  login(payload: LoginPayload): Promise<AuthResult> {
    const role = resolveRoleFromEmail(payload.email)
    const user: User = {
      id: `user-${role}`,
      email: payload.email,
      fullName: nameFromEmail(payload.email),
      role,
    }
    return mockDelay({ user, token: `mock-token-${role}-${Date.now()}` })
  },

  register(payload: RegisterPayload): Promise<AuthResult> {
    const user: User = {
      id: 'user-patient',
      email: payload.email,
      fullName: payload.fullName,
      role: 'patient',
    }
    return mockDelay({ user, token: `mock-token-patient-${Date.now()}` })
  },
}
