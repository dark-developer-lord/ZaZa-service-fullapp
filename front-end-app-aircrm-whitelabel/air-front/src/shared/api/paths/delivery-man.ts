export enum DeliveryManApi {
  login = '/auth/delivery-man/login',
  profile = '/delivery-man/profile',
  getOrders = '/delivery-man/current-orders',
  getLatestOrders = '/delivery-man/latest-orders',
  getOrderDeliveryHistory = '/order-delivery-history',
  changeCourierOrderStatus = '/delivery-man/order/status',
  changeIndividualOrderStatus = '/delivery-man/update-order-status'
}