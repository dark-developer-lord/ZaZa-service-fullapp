import { CategoryItem } from "./category";

export interface SubCategoryItem {
    id: number
    image: string
    name: string
    parent: CategoryItem
    parent_id: number
    position: number
    priority: number
    status: boolean
}