export interface SaasModule {
  code: string
  name: string
  group: string
  enabled: boolean
}

export interface Response {
  token: string
  user: {
    id: number
    name: string
    email: string
    phone: string
  }
  tenant: {
    id: number
    name: string
    slug: string
    sector_type: 'goods' | 'services'
    panel_preset: 'goods' | 'services'
    timezone: string
    currency: string
    is_active: boolean
    modules: SaasModule[]
  }
}
