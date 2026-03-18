import { OrderDeliveryMan } from "@entities/orders"
import { Product } from "./product"

export interface SaleShow {
    id: number
    name: string
    sale_name: string | null
    status: "completed" | "pending"
    delivery_charge: number
    phone: string
    total_price: number
    products: Product[]
    delivery_man: OrderDeliveryMan | null
    discount: number | null
    installment?: {
        id: number
        initial_payment: string
        total_due: string
        remaining_balance: string
        due_date: string
        is_paid: boolean
        status: string
        notes: string | null
    } | null
}