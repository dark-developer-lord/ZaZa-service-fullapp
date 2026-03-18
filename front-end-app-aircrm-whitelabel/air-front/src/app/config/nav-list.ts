import { PermissionModules } from '@shared/auth'
import { NavGroupType } from '@shared/layout'
import {
  OrderStatus,
  orderStatusLabels,
  OrderStatusType,
  RouterPaths,
  ReportType,
  reportTypeLabels,
  ReportTypeType
} from '@shared/lib'
import ReportsIcon from '@icons/reports-new-icon.svg?react'
import FinanceIcon from '@icons/finance.svg?react'
import AnalyticIcon from '@icons/analytic.svg?react'
import InstallmentIcon from '@icons/installment.svg?react'
import CourierIcon from '@icons/courier.svg?react'
import CustomersIcon from '@icons/customers.svg?react'
import NewOrder from '@icons/new-order.svg?react'
import WarehouseIcon from '@icons/warehouse.svg?react'
import LocationIcon from '@icons/location.svg?react'
import OrdersIcon from '@icons/orders-new-icon.svg?react'
import CommunicationIcon from '@icons/communication.svg?react'
import EmployeeIcon from '@icons/employee.svg?react'

export const navList: NavGroupType[] = [
  {
    id: 'panel',
    name: 'Панель',
    children: [
      {
        name: 'panel',
        icon: NewOrder,
        path: RouterPaths.posTerminal,
        label: 'Новый заказ',
        module: ['vendor', 'admin', 'vendor-employee'],
        permission: PermissionModules.posTerminal,
      },
    ],
  },
  {
    id: 'orders',
    name: 'Заказы',
    children: [
      {
        name: 'orders',
        icon: OrdersIcon,
        path: RouterPaths.orders,
        label: 'Заказы',
        module: ['vendor', 'admin', 'vendor-employee'],
        permission: PermissionModules.order,
        children: [
          {
            path: '/orders',
            label: 'Все',
            name: 'all',
          },
          ...Object.keys(OrderStatus).map((status) => ({
            path: `/orders?status=${status}`,
            label: orderStatusLabels[status as OrderStatusType].label,
            name: status,
          })),
        ],
      },
    ],
  },
  {
    id: 'main',
    name: 'Основное',
    children: [
      {
        name: 'warehouse',
        icon: WarehouseIcon,
        path: '/warehouse',
        label: 'Склад',
        module: ['vendor', 'admin', 'vendor-employee'],
        permission: PermissionModules.food,
        children: [
          {
            label: 'Список товаров',
            path: RouterPaths.warehouse,
          },
          ...Object.keys(ReportType).map((type) => ({
            // path: `/orders?status=${status}`,
            path:`${RouterPaths.warehouse}?report=${ReportType[type as ReportTypeType]}`,
            label: reportTypeLabels[type as ReportTypeType].label,
            name: type,
          })),
        ],
      },
      {
        name: 'finance',
        icon: FinanceIcon,
        path: '/financial-overview',
        label: 'Финансы',
        module: ['vendor', 'admin', 'vendor-employee'],
        permission: PermissionModules.finance,
      },
      {
        name: 'restaurants',
        icon: LocationIcon,
        path: RouterPaths.stores,
        label: 'Магазины',
        permission: PermissionModules.restaurant,
        module: ['admin'],
        children: [
          {
            label: 'Список магазинов',
            path: RouterPaths.stores
          },
          // {
          //   label: 'Иморт магазина',
          //   path: '8'
          // }
        ]
      },
    ],
  },
  {
    id: 'zones',
    name: 'Зоны доставки',
    children: [
      {
        name: 'zones',
        icon: LocationIcon,
        path: RouterPaths.zones,
        label: 'Зоны доставки',
        permission: PermissionModules.zone,
        module: ['admin'],
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Маркетинг',
    children: [
      {
        name: 'banners',
        icon: ReportsIcon,
        path: RouterPaths.banners,
        label: 'Баннеры',
        permission: PermissionModules.banner,
        module: ['admin'],
      },
      {
        name: 'campaigns',
        icon: AnalyticIcon,
        path: RouterPaths.campaigns,
        label: 'Акции',
        permission: PermissionModules.campaign,
        module: ['admin'],
      },
      {
        name: 'campaignRules',
        icon: InstallmentIcon,
        path: RouterPaths.campaignRules,
        label: 'Правила акций',
        permission: PermissionModules.campaign,
        module: ['admin'],
      },
      {
        name: 'pointsReport',
        icon: ReportsIcon,
        path: RouterPaths.pointsReport,
        label: 'Отчёт по баллам',
        permission: PermissionModules.point,
        module: ['admin'],
      },
    ],
  },
  {
    id: 'couriers',
    name: 'Курьеры',
    children: [
      {
        name: 'couriers',
        icon: CourierIcon,
        path: RouterPaths.couriers,
        label: 'Курьеры',
        permission: PermissionModules.deliveryman,
        module: ['vendor', 'admin', 'vendor-employee'],
      }
    ]
  },
  {
    id: 'customers',
    name: 'Клиенты',
    children: [
      {
        name: 'clients',
        icon: CustomersIcon,
        path: RouterPaths.customers,
        label: 'Клиенты',
        permission: PermissionModules.customer,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      // {
      //   name: 'wallet',
      //   icon: WalletIcon,
      //   path: RouterPaths.customers,
      //   label: 'Кошелёк клиентов',
      //   permission: PermissionModules.customer,
      //   module: ['admin'],
      //   children: [
      //     {
      //       label: 'Отчет по баллам',
      //       path: '9'
      //     },
      //     {
      //       label: 'Пополнить баллы клиента',
      //       path: '10'
      //     }
      //   ]
      // },
    ],
  },
  {
    id: 'employees',
    name: 'Сотрудники',
    children: [
      {
        label: 'Сотрудники',
        name: 'employees',
        icon: EmployeeIcon,
        path: RouterPaths.employees,
        permission: PermissionModules.employee,
        module: ['vendor'],
      },
    ],
  },
  {
    id: 'messengers',
    name: 'Мессенджеры',
    children: [
      {
        name: 'chats',
        icon: CommunicationIcon,
        path: RouterPaths.chats,
        label: 'Мессенджеры',
        module: ['vendor', 'admin'],
      },
    ],
  },
]
