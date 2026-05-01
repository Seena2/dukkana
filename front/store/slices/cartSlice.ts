import { cartItems, CartStateType } from "@/types/cart.types";
import { Product } from "@/types/product.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: CartStateType = {
    items: [],
    totalItems:0,
    totalPrice:0,

}
const calculteTotal =(items:cartItems[]) =>{
    const totalItems = items.reduce((sum,item)=>sum +item.quantity,0);
    const totalPrice = items.reduce((sum,item)=>sum +item.product.price * item.quantity,0);
    return {totalItems,totalPrice}
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        addToCart: (state,action: PayloadAction<Product>) =>{
            // check if the item already exist on the cart, increment the items quantity, else add the item to the cart as new
            const existingItemOnCart = state.items.find((item)=> item.product.id === action.payload.id)
            if(existingItemOnCart){
                existingItemOnCart.quantity += 1;
            }else{
                state.items.push({
                    product: action.payload,
                    quantity:1,
                    price: action.payload.price,
                    id: crypto.randomUUID(),
                    cartId:"",
                    productId:action.payload.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),

                })
            }
            const total = calculteTotal(state.items);
            state.totalItems =total.totalItems;
            state.totalPrice= total.totalPrice;
        },
        decrementQuantity: (state,action: PayloadAction<string>) =>{
             const item = state.items.find((item)=> item.product.id === action.payload)
            if(item){
                if(item.quantity<=1){
                    state.items= state.items.filter((item)=>item.product.id!== action.payload)
                }
                
            else{
               item.quantity -=1
            }
            const total = calculteTotal(state.items);
            state.totalItems =total.totalItems;
            state.totalPrice= total.totalPrice;
        }
       
        },
        incrementQuantity: (state,action: PayloadAction<string>) =>{
             const item = state.items.find((item)=> item.product.id === action.payload)
            if(item){
                
               item.quantity +=1
            
            const total = calculteTotal(state.items);
            state.totalItems =total.totalItems;
            state.totalPrice= total.totalPrice;
        }
       
        },
        removeProductFromCart: (state,action: PayloadAction<string>) =>{
             state.items = state.items.filter((item)=> item.product.id !== action.payload)
                    
            
            const total = calculteTotal(state.items);
            state.totalItems =total.totalItems;
            state.totalPrice= total.totalPrice;
        },
        clearCart: (state) =>{
             state.items = [];
            state.totalItems = 0;
            state.totalPrice= 0;
        },
    }
})

export const {addToCart, decrementQuantity,incrementQuantity,removeProductFromCart,clearCart} = cartSlice.actions;
export default cartSlice.reducer;