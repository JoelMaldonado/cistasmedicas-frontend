import type { Patient } from '@/types/patient.types'

export const mockPatients: Patient[] = [
  {
    id: 'pat-1',
    fullName: 'Kevin Hurtado',
    email: 'kevin.hurtado@example.com',
    phone: '+51 987 654 321',
    birthDate: '1998-04-12',
  },
  {
    id: 'pat-2',
    fullName: 'María Fernández',
    email: 'maria.fernandez@example.com',
    phone: '+51 976 543 210',
    birthDate: '1990-08-23',
  },
  {
    id: 'pat-3',
    fullName: 'Jorge Vidal',
    email: 'jorge.vidal@example.com',
    phone: '+51 965 432 109',
    birthDate: '1985-01-05',
  },
  {
    id: 'pat-4',
    fullName: 'Ana Belén Quispe',
    email: 'ana.quispe@example.com',
    phone: '+51 954 321 098',
    birthDate: '2000-11-30',
  },
]
