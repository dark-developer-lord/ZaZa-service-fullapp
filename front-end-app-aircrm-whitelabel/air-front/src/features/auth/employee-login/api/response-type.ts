import { Profile } from '@shared/auth'

export interface Response {
  token: string
  user: Profile
}
