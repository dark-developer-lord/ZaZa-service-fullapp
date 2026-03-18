import { AddOnsPage } from '@pages/add-ons'
import { AdminsPage } from '@pages/admins'
import { AnalyticPage } from '@pages/analytic'
import { AttributesPage } from '@pages/attributes'
import { BannersPage } from '@pages/banners'
import { CampaignRulesPage } from '@pages/campaign-rules'
import { CampaignsPage } from '@pages/campaigns'
import { CategoriesPage } from '@pages/categories'
import { CouriersPage } from '@pages/couriers'
import { CreateArrivalPage } from '@pages/create-arrival'
import { EditArrivalPage } from '@pages/edit-arrival'
import { CreateTransferPage } from '@pages/create-transfer'
import { EditTransferPage } from '@pages/edit-transfer'
import { CreateProductPage } from '@pages/create-product'
import { CreateZonePage } from '@pages/create-zone'
import { CustomersPage, CustomerEditPage } from '@pages/customers'
import { EditProductPage } from '@pages/edit-product'
import { OrderEditPage } from '@pages/edit-order'
import { EmployeesPage } from '@pages/employees'
import { WarehousePage } from '@pages/warehouse'
import { CashFlowPage } from '@pages/cash-flow'
import { FinancePage } from '@pages/finance'
import { MessengerCallbackPage } from '@pages/messenger-callback'
import { FinanceIndicatorsPage } from '@pages/finance-indicators'
import { InstallmentPage } from '@pages/installment'
import { InstallmentEditPage  } from '@pages/edit-installment'
import { CounterpartiesPage } from '@pages/counterparties'
import { CounterpartyTypesPage } from '@pages/counterparty-types'

// re - do
import { Page as LoginPage } from '@pages/login/ui/page'
import { Page as RegisterPage } from '@pages/register/ui/page'
import { Page as SaasLoginPage } from '@pages/saas-login/ui/page'
import { SaasRegisterPage } from '@pages/saas-register'
import { Page as DeliveryManLoginPage } from '@pages/delivery-man-login/ui/page'
import { Page as EmployeeLoginPage } from '@pages/employee-login/ui/page'
import { FinancialOverviewPage } from '@pages/financial-overview'
import { WalletsPage } from '@pages/wallets'

import { MainPage } from '@pages/main'
import { NotFoundPage } from '@pages/not-found'
import { OrderShowPage } from '@pages/order-show'
import { OrdersPage } from '@pages/orders'
import { PointsReportPage } from '@pages/points-report'
import { PosTerminalPage } from '@pages/pos-terminal'
import { RestaurantsPage } from '@pages/warehouses'
import { SaleShowPage } from '@pages/sale-show'
import { StoresPage } from '@pages/stores'
import { SubCategoriesPage } from '@pages/sub-categories'
import { TransactionSubCategoriesPage } from '@pages/transaction-sub-categories'
import { TransactionCategoriesPage } from '@pages/transaction-categories'
import { ChatsPage } from '@pages/chats'
import { ZonesPage } from '@pages/zones'
import { OnboardingPage } from '@pages/onboarding'
import { PanelSettingsPage } from '@pages/panel-settings'
import { ProfileSettingsPage } from '@pages/profile-settings'

import { PermissionModules, ProtectedRoute } from '@shared/auth'
import { Layout } from '@shared/layout'
import { RouteBase, RouterPaths } from '@shared/lib'
import { RouterLoader } from '@shared/ui'
import { Navigate } from 'react-router-dom'

import { navList } from './nav-list'

export const routes: RouteBase[] = [
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage/>
  },
  {
    path: '/auth/saas/login',
    element: <SaasLoginPage />,
  },
  {
    path: '/auth/saas/register',
    element: <SaasRegisterPage />,
  },
  {
    path: '/auth/delivery-man/login',
    element: <DeliveryManLoginPage/>
  },
  {
    path: '/auth/employee/login',
    element: <EmployeeLoginPage/>
  },
  {
    path: '/messenger-callback',
    element: <MessengerCallbackPage/>
  },
  {
    element: <Layout navigation={navList} />,
    loader: () => import('@shared/layout'),
    children: [
      {
        path: RouterPaths.onboarding,
        element: (
          <RouterLoader>
            <OnboardingPage />
          </RouterLoader>
        ),
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.panelSettings,
        element: (
          <RouterLoader>
            <PanelSettingsPage />
          </RouterLoader>
        ),
        module: ['vendor', 'vendor-employee'],
      },
      {
        path: RouterPaths.profileSettings,
        element: (
          <RouterLoader>
            <ProfileSettingsPage />
          </RouterLoader>
        ),
        module: ['vendor', 'vendor-employee', 'admin'],
      },
      {
        path: RouterPaths.posTerminal,
        element: (
          <ProtectedRoute permission={PermissionModules.posTerminal}>
            <RouterLoader>
              <PosTerminalPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        module: ['vendor', 'admin', 'vendor-employee'],
        permission: PermissionModules.posTerminal,
      },
      {
        path: RouterPaths.main,
        element: (
          <RouterLoader>
            <MainPage />
          </RouterLoader>
        ),
        permission: PermissionModules.dashboard,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.orders,
        element: (
          <ProtectedRoute permission={PermissionModules.order}>
            <RouterLoader>
              <OrdersPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.order,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.orders_ + ':id',
        element: (
          <ProtectedRoute permission={PermissionModules.order}>
            <RouterLoader>
              <OrderShowPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.order,
      },
      {
        path: RouterPaths.editOrder_ + ':id',
        element: (
          <RouterLoader>
            <OrderEditPage />
          </RouterLoader>
        ),
        permission: PermissionModules.orderUpdate,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.categories,
        element: (
          <RouterLoader>
            <CategoriesPage />
          </RouterLoader>
        ),
        permission: PermissionModules.category,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.subCategories,
        element: (
          <RouterLoader>
            <SubCategoriesPage />
          </RouterLoader>
        ),
        permission: PermissionModules.category,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.attributes,
        element: (
          <RouterLoader>
            <AttributesPage />
          </RouterLoader>
        ),
        permission: PermissionModules.attribute,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.warehouse,
        element: (
          <ProtectedRoute permission={PermissionModules.food}>
            <RouterLoader>
              <WarehousePage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.food,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.chats,
        element: (
          <RouterLoader>
            <ChatsPage/>
          </RouterLoader>
        ),
        permission: PermissionModules.chats,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.channels,
        element: <Navigate to="/chats?tab=channels" replace />,
        permission: PermissionModules.channels,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.createReceipt,
        element: (
          <RouterLoader>
            <CreateArrivalPage />
          </RouterLoader>
        ),
        permission: PermissionModules.food,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.createTransfer,
        element: (
          <RouterLoader>
            <CreateTransferPage />
          </RouterLoader>
        ),
        permission: PermissionModules.food,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.editTransfer_ + ':id',
        element: (
          <RouterLoader>
            <EditTransferPage />
          </RouterLoader>
        ),
        permission: PermissionModules.foodUpdate,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.stores,
        element: (
          <RouterLoader>
            <StoresPage />
          </RouterLoader>
        ),
        permission: PermissionModules.food,
        module: ['admin'],
      },
      {
        path: RouterPaths.editReceipt_ + ':id',
        element: (
          <RouterLoader>
            <EditArrivalPage />
          </RouterLoader>
        ),
        permission: PermissionModules.foodUpdate,
      },
      {
        path: RouterPaths.showSale_ + ':id',
        element: (
          <RouterLoader>
            <SaleShowPage />
          </RouterLoader>
        ),
        permission: PermissionModules.food,
      },
      {
        path: RouterPaths.addOns,
        element: (
          <RouterLoader>
            <AddOnsPage />
          </RouterLoader>
        ),
        permission: PermissionModules.addon,
      },
      {
        path: RouterPaths.createProduct,
        element: (
          <RouterLoader>
            <CreateProductPage />
          </RouterLoader>
        ),
        permission: PermissionModules.foodCreate,
        module: ['vendor', 'admin'],
      },
      {
        path: RouterPaths.editProduct_ + ':id',
        element: (
          <RouterLoader>
            <EditProductPage />
          </RouterLoader>
        ),
        permission: PermissionModules.foodUpdate,
      },
      {
        path: '/financial-overview',
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <FinancialOverviewPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: '/wallets',
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <WalletsPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.analytic,
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <AnalyticPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.installment,
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <InstallmentPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.editInstallment_ + ':id', // <- add ':id'
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <InstallmentEditPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.finance,
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <FinancePage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.cashFlow,
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <CashFlowPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.financeIndicators,
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <FinanceIndicatorsPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.counterparties,
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <CounterpartiesPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.transactionCategories,
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <TransactionCategoriesPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.transactionSubCategories,
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <TransactionSubCategoriesPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.counterpartyTypes,
        element: (
          <ProtectedRoute permission={PermissionModules.finance}>
            <RouterLoader>
              <CounterpartyTypesPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.finance,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.couriers,
        element: (
          <ProtectedRoute permission={PermissionModules.deliveryman}>
            <RouterLoader>
              <CouriersPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
        permission: PermissionModules.deliveryman,
        module: ['vendor', 'admin', 'vendor-employee'],
      },
      {
        path: RouterPaths.warehouses,
        permission: PermissionModules.warehouse,
        module: ['vendor', 'admin'],
        element: (
          <RouterLoader>
            <RestaurantsPage />
          </RouterLoader>
        ),
      },
      {
        path: RouterPaths.zones,
        permission: PermissionModules.zone,
        module: ['admin'],
        element: (
          <RouterLoader>
            <ZonesPage />
          </RouterLoader>
        ),
      },
      {
        path: RouterPaths.createZone,
        permission: PermissionModules.createZone,
        module: ['admin'],
        element: (
          <RouterLoader>
            <CreateZonePage />
          </RouterLoader>
        ),
      },
      {
        path: RouterPaths.banners,
        permission: PermissionModules.banner,
        module: ['admin'],
        element: (
          <RouterLoader>
            <BannersPage />
          </RouterLoader>
        ),
      },
      {
        path: RouterPaths.customers,
        permission: PermissionModules.customer,
        module: ['vendor', 'admin', 'vendor-employee'],
        element: (
          <ProtectedRoute permission={PermissionModules.customer}>
            <RouterLoader>
              <CustomersPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: RouterPaths.customers_ + ':id',
        permission: PermissionModules.customer,
        module: ['vendor', 'admin', 'vendor-employee'],
        element: (
          <ProtectedRoute permission={PermissionModules.customer}>
            <RouterLoader>
              <CustomerEditPage />
            </RouterLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: RouterPaths.pointsReport,
        permission: PermissionModules.point,
        module: ['admin'],
        element: (
          <RouterLoader>
            <PointsReportPage />
          </RouterLoader>
        ),
      },
      {
        path: RouterPaths.campaigns,
        permission: PermissionModules.campaign,
        module: ['admin'],
        element: (
          <RouterLoader>
            <CampaignsPage />
          </RouterLoader>
        ),
      },
      {
        path: RouterPaths.campaignRules,
        permission: PermissionModules.campaign,
        module: ['admin'],
        element: (
          <RouterLoader>
            <CampaignRulesPage />
          </RouterLoader>
        ),
      },
      {
        path: RouterPaths.admins,
        permission: PermissionModules.admin,
        module: ['admin'],
        element: (
          <RouterLoader>
            <AdminsPage />
          </RouterLoader>
        ),
      },
      {
        path: RouterPaths.metaSettings,
        module: ['vendor', 'admin'],
        element: <Navigate to="/chats?tab=meta" replace />,
      },
      {
        path: RouterPaths.employees,
        permission: PermissionModules.employee,
        module: ['vendor'],
        element: (
          <RouterLoader>
            <EmployeesPage />
          </RouterLoader>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]
