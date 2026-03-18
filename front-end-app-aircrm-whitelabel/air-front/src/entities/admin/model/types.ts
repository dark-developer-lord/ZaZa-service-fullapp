export interface Admin {
  id: number
  f_name: string
  l_name: string
  image: string
  email: string
  phone: string
  role: { id: number; name: string }
  created_at: string
}
