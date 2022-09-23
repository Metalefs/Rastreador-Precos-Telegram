import { Product } from "./product"

export interface ProductList {
    [key: string]: {
       product:Product,
       origin: string
    }
}