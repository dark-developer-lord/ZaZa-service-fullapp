import { FC, ReactNode, SVGProps } from 'react'

import { PermissionModules } from '../../auth'

export interface NavGroupType {
  name: string
  id: string
  children: NavType[]
  module?: ('vendor' | 'admin' | 'vendor-employee')[]
}

interface NavItem {
  path: string
  icon?: FC<SVGProps<SVGSVGElement>>
  label: string
  chip?: ReactNode
  name?: string
  permission?: PermissionModules
  module?: ('vendor' | 'admin' | 'vendor-employee')[]
}

export interface NavType extends NavItem {
  name: string
  children?: NavItem[]
  module?: ('vendor' | 'admin' | 'vendor-employee')[]
}
