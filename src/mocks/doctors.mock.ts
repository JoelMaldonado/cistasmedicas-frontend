import type { Doctor } from '@/types/doctor.types'

export const mockDoctors: Doctor[] = [
  {
    id: 'doc-1',
    fullName: 'Dra. Lucía Ramírez',
    email: 'lucia.ramirez@citasmedicas.com',
    specialty: 'Cardiología',
    licenseNumber: 'CMP-10234',
  },
  {
    id: 'doc-2',
    fullName: 'Dr. Andrés Salazar',
    email: 'andres.salazar@citasmedicas.com',
    specialty: 'Pediatría',
    licenseNumber: 'CMP-10567',
  },
  {
    id: 'doc-3',
    fullName: 'Dra. Camila Torres',
    email: 'camila.torres@citasmedicas.com',
    specialty: 'Dermatología',
    licenseNumber: 'CMP-10892',
  },
  {
    id: 'doc-4',
    fullName: 'Dr. Fernando Rojas',
    email: 'fernando.rojas@citasmedicas.com',
    specialty: 'Medicina General',
    licenseNumber: 'CMP-11045',
  },
  {
    id: 'doc-5',
    fullName: 'Dra. Valeria Chávez',
    email: 'valeria.chavez@citasmedicas.com',
    specialty: 'Ginecología',
    licenseNumber: 'CMP-11298',
  },
]
