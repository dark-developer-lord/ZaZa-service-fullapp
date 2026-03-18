export enum RouterPaths {
  main = '/',
  orders = '/orders',
  orders_ = '/orders/',
  editOrder_ = '/orders/edit/',
  users = '/users',
  users_ = '/users/',
  posTerminal = '/pos-terminal',

  /** Onboarding */
  onboarding = '/onboarding',

  /** Chats */
  chats = '/chats',
  channels = '/channels',

  /** Categories */
  categories = '/categories',
  subCategories = '/sub-categories',

  attributes = '/attributes',

  /** Foods */
  products = '/products',
  foods = '/products',
  createProduct = '/products/create',
  createArrival = '/warehouse/create-receipt/',
  editProduct_ = '/products/edit/',
  addOns = '/add-ons',

  /** Warehouse */
  warehouse = '/warehouse',
  warehouses = '/warehouses',
  createReceipt = '/warehouse/create-receipt/',
  editReceipt_ = '/warehouse/edit-receipt/',

  showSale_ = '/warehouse/sale/',

  createTransfer = '/warehouse/create-transfer/',
  editTransfer_ = '/warehouse/edit-transfer/',

  /** Stores */
  stores = '/stores',

  /** Analytic */
  analytic = '/analytic',
  finance = '/finance',
  installment = '/installment',
  editInstallment_ = '/installment/edit/',
  financeIndicators = '/analytic/finance/indicators',
  transactionCategories = '/analytic/transaction-categories/',
  transactionSubCategories = '/analytic/transaction-subcategories',
  cashFlow = '/analytic/finance/cash-flow',
  financialOverview = '/financial-overview',
  counterparties = '/counterparties',
  counterpartyTypes = '/counterparties/types',

  /** Couriers */
  couriers = '/couriers',

  restaurants = '/restaurants',
  banners = '/banners',

  /** Customers */
  customers = '/customers',
  customers_ = '/customers/',
  pointsReport = '/points-report',
  topUpPoints = '/top-up-points',

  campaigns = '/campaigns',
  campaignRules = '/campaigns-rules',

  /** Admins */
  admins = '/admins',
  employees = '/employees',

  /** Settings */
  panelSettings = '/settings/panels',
  profileSettings = '/settings/profile',
  metaSettings = '/settings/meta',

  zones = '/zones',
  createZone = '/zones/create',
  editZone_ = '/zones/edit/',
}
