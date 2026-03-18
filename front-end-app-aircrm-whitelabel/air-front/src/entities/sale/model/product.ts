export interface Product {
    id: number
    product_name: string
    product_image: string
    price: string
    product_purchase_price: string
    quantity: number
    discount: number
    discount_type: "percent" | "amount"
}