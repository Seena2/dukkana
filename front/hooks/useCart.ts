import { IRootState } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { cartItems } from "@/types/cart.types";
import { Product } from "@/types/product.types";
import { useDispatch, useSelector } from "react-redux";
import {decrementQuantity as decrementQuantityAction, incrementQuantity as incrementQuantityAction,
    removeProductFromCart as  removeProductFromCartAction, clearCart as clearCartAction
  } from '@/store/slices/cartSlice';


export function useCart(){
    const cart= useSelector((state:IRootState)=>state.cart); //get cart state
    const dispatch = useDispatch();
    const items: cartItems[] = cart.items;
    
    const addProductToCart = async(product: Product)=>{
        dispatch(addToCart(product))
    } 
    // note, this is alias for decrementQuantity
    const decrementProductQuantity = async(productId:string)=>{
        dispatch(decrementQuantityAction(productId))
    }
    const incrementProductQuantity = async(productId:string)=>{
        dispatch(incrementQuantityAction(productId))
    }
    const removeProductFromCart = async(productId:string)=>{
        dispatch(removeProductFromCartAction(productId))
    }
    const clearCart = async()=>{
        dispatch(clearCartAction())
    }
    return {
        items, 
        totalItems: items.reduce((total,item)=>total + item.quantity,0),
        totalPrice:cart.totalPrice, addProductToCart, decrementProductQuantity,incrementProductQuantity,
         removeProductFromCart,clearCart
    }

}