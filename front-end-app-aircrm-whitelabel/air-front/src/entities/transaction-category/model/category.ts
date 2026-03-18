export interface TransactionCategoryItem {
  id: number
  name: string
  admin_id: number
}

/** Aliases for backward compatibility */
export type CategoryItem = TransactionCategoryItem
export type Category = TransactionCategoryItem