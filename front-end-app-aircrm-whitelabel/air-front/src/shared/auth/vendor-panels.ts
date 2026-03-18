const VENDOR_PANELS_KEY = 'vendor_enabled_panels'

export interface VendorPanelConfig {
  id: string
  label: string
  description: string
  /** Which login sources can toggle / see this panel. Defaults to all. */
  module?: ('vendor' | 'admin' | 'vendor-employee')[]
}

/**
 * Ordered list of all available navigation panel groups.
 * `id` must match the `id` field in `navList` (nav-list.ts).
 */
export const PANEL_CONFIGS: VendorPanelConfig[] = [
  {
    id: 'panel',
    label: 'POS Терминал',
    description: 'Приём новых заказов и оформление продаж',
  },
  {
    id: 'orders',
    label: 'Заказы',
    description: 'Список текущих заказов и чаты с клиентами',
  },
  {
    id: 'main',
    label: 'Основное',
    description: 'Склад, финансы и управление магазинами',
  },
  {
    id: 'couriers',
    label: 'Курьеры',
    description: 'Управление курьерами и доставкой',
  },
  {
    id: 'customers',
    label: 'Клиенты',
    description: 'База клиентов и история покупок',
  },
  {
    id: 'employees',
    label: 'Сотрудники',
    description: 'Сотрудники, роли и права доступа',
  },
  {
    id: 'marketing',
    label: 'Маркетинг',
    description: 'Баннеры, акции и программа лояльности',
    module: ['admin'],
  },
  {
    id: 'zones',
    label: 'Зоны доставки',
    description: 'Настройка зон и стоимости доставки',
    module: ['admin'],
  },
  {
    id: 'analytics',
    label: 'Аналитика',
    description: 'Детальные финансовые отчёты и показатели',
  },
  {
    id: 'messengers',
    label: 'Мессенджеры',
    description: 'Instagram DM, WhatsApp и Facebook Messenger',
  },
]

/**
 * Returns the list of enabled panel IDs, or `null` if the user has not
 * customised anything (meaning all panels are enabled by default).
 */
export const getEnabledPanels = (): string[] | null => {
  const stored = localStorage.getItem(VENDOR_PANELS_KEY)
  if (stored === null) return null
  try {
    return JSON.parse(stored) as string[]
  } catch {
    return null
  }
}

/**
 * Persists the list of enabled panel IDs to localStorage.
 * Pass `null` to reset to default (all enabled).
 * Fires a `panel-settings-changed` CustomEvent so that the sidebar
 * can update reactively without a full page reload.
 */
export const setEnabledPanels = (panelIds: string[] | null) => {
  if (panelIds === null) {
    localStorage.removeItem(VENDOR_PANELS_KEY)
  } else {
    localStorage.setItem(VENDOR_PANELS_KEY, JSON.stringify(panelIds))
  }
  window.dispatchEvent(new CustomEvent('panel-settings-changed'))
}

/** Returns `true` if the given panel group ID is currently enabled. */
export const isPanelEnabled = (id: string): boolean => {
  const enabled = getEnabledPanels()
  if (enabled === null) return true // all enabled by default
  return enabled.includes(id)
}
