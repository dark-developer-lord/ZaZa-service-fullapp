import { CategoryItem } from '@entities/category'

export interface SubCategory extends CategoryItem {
  parent: CategoryItem
}
