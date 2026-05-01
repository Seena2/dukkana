import { Product } from "./product.types";

export interface CartItemType{
    product: Product;
    quantity: number;
    price:number;
}
export interface CartStateType{
    items: cartItems[];
    totalItems: number;
    totalPrice: number;
}

export interface cartItems{
    id:string;
    cartId:string;
    productId:string;
    quantity: number;
    price: number;
    product: Product;
    createdAt: string;
    updatedAt: string;
}