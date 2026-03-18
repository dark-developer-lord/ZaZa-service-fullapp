export interface Profile {
  id: number
  f_name: string
  l_name: string
  email: string
  image: string | null
  role: Role
  zone_id: number | null
  created_at: string
  updated_at: string
}

export type LoginSource = 'vendor' | 'vendor-employee' | 'admin' | 'delivery-man' | 'saas'

export interface SaasProfile {
  id: number
  name: string
  email: string
  phone: string
}

export interface VendorProfile {
  id: number
  name: string
  f_name?: string
  l_name?: string
  email: string
  phone: string
  restaurant: {
    id: number
    name: string
    slug: string
    zone: {
      id: number
      name: string
    }
  }
  created_at: string
  updated_at: string
}

export interface EmployeeProfile {
  id: number
  employee_number: number
  f_name: string
  l_name: string
  email: string | null
  phone: string
  image: string | null
  role: any | null
  created_at: string
}

interface Role {
  id: number
  name: string
  status: number
}
