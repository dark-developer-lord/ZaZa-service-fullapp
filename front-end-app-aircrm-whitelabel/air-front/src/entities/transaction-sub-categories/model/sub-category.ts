import { TransactionCategoryItem } from '@entities/transaction-category'

export interface TransactionSubCategoryItem extends TransactionCategoryItem {
  parent: {
    id: number,
    name: string
  }
}

/** Alias for backward compatibility */
export type SubCategory = TransactionSubCategoryItem
