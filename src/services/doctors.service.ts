import type { Doctor } from '@/types/doctor.types'
import { mockDoctors } from '@/mocks/doctors.mock'
import { mockDelay } from '@/services/mockDelay'

export interface CreateDoctorPayload {
  fullName: string
  email: string
  password: string
  specialty: string
  licenseNumber: string
}

export const doctorsService = {
  getAll(): Promise<Doctor[]> {
    return mockDelay([...mockDoctors])
  },

  getById(id: string): Promise<Doctor | undefined> {
    return mockDelay(mockDoctors.find((doctor) => doctor.id === id))
  },

  create(payload: CreateDoctorPayload): Promise<Doctor> {
    const doctor: Doctor = {
      id: `doc-${Date.now()}`,
      fullName: payload.fullName,
      email: payload.email,
      specialty: payload.specialty,
      licenseNumber: payload.licenseNumber,
    }
    return mockDelay(doctor)
  },
}
