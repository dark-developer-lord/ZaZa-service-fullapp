import { PermissionModules } from './modules'

export const PermissionLabels: Record<PermissionModules, string> = {
  [PermissionModules.dashboard]: 'Панель управления',
  [PermissionModules.posTerminal]: 'POS Терминал',

  [PermissionModules.chats]: 'Чаты',
  [PermissionModules.channels]: 'Каналы',

  [PermissionModules.order]: 'Заказ',
  [PermissionModules.orderShow]: 'Просмотр заказа',
  [PermissionModules.orderUpdate]: 'Обновление заказа',
  [PermissionModules.orderUpdateStatus]: 'Обновление статуса заказа',

  [PermissionModules.food]: 'Склад',
  [PermissionModules.foodCreate]: 'Создание еды',
  [PermissionModules.foodUpdate]: 'Обновление еды',
  [PermissionModules.foodUpdateStatus]: 'Обновление статуса еды',
  [PermissionModules.foodDelete]: 'Удаление еды',

  [PermissionModules.addon]: 'Дополнение',
  [PermissionModules.addonCreate]: 'Создание дополнения',
  [PermissionModules.addonUpdate]: 'Обновление дополнения',
  [PermissionModules.addonUpdateStatus]: 'Обновление статуса дополнения',
  [PermissionModules.addonDelete]: 'Удаление дополнения',

  [PermissionModules.attribute]: 'Атрибут',
  [PermissionModules.attributeCreate]: 'Создание атрибута',
  [PermissionModules.attributeUpdate]: 'Обновление атрибута',
  [PermissionModules.attributeDelete]: 'Удаление атрибута',

  [PermissionModules.category]: 'Категория',
  [PermissionModules.categoryCreate]: 'Создание категории',
  [PermissionModules.categoryUpdate]: 'Обновление категории',
  [PermissionModules.categoryDelete]: 'Удаление категории',

  [PermissionModules.deliveryman]: 'Курьеры',
  [PermissionModules.deliverymanCreate]: 'Создание курьера',
  [PermissionModules.deliverymanUpdate]: 'Обновление курьера',
  [PermissionModules.deliverymanDelete]: 'Удаление курьера',

  [PermissionModules.restaurant]: 'Ресторан',
  [PermissionModules.restaurantCreate]: 'Создание ресторана',
  [PermissionModules.restaurantUpdate]: 'Обновление ресторана',
  [PermissionModules.restaurantDelete]: 'Удаление ресторана',

  [PermissionModules.banner]: 'Баннер',
  [PermissionModules.bannerCreate]: 'Создание баннера',
  [PermissionModules.bannerUpdate]: 'Обновление баннера',
  [PermissionModules.bannerUpdateStatus]: 'Обновление статуса баннера',
  [PermissionModules.bannerDelete]: 'Удаление баннера',

  [PermissionModules.campaign]: 'Кампания',
  [PermissionModules.campaignCreate]: 'Создание кампании',
  [PermissionModules.campaignUpdate]: 'Обновление кампании',
  [PermissionModules.campaignUpdateStatus]: 'Обновление статуса кампании',
  [PermissionModules.campaignDelete]: 'Удаление кампании',

  [PermissionModules.customer]: 'Клиенты',
  [PermissionModules.point]: 'Баллы',
  [PermissionModules.admin]: 'Администратор',
  [PermissionModules.employee]: 'Сотрудники',

  [PermissionModules.zone]: 'Зоны',
  [PermissionModules.createZone]: 'Добавление зоны',

  [PermissionModules.finance]: 'Финансы',
}
