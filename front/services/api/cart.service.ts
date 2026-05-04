import { CartResponse } from "@/types/cart.types";
import { ProductCart } from "@/types/product.types";
import { apiClient } from "./axios.config";

export class CartService{
    private static ENDPOINT= '/cart';
    static async mergeCartWithOrder(localCart: ProductCart[]):Promise<CartResponse>{
    const response = await apiClient.post<CartResponse>(`${this.ENDPOINT}/merge`,{items:localCart});
    return response.data;
    }
}