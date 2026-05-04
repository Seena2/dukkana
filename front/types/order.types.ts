export interface OrderItem{
    productId:string;
    qauntity:number;
    //  name:string;
    // price:number;
}

export interface CreateOrderRequest{
    items:OrderItem[];
    shippingAddress:string;
}

export interface Order{
    id:string;
    userId:string;
    cartitems:OrderItem[];
    shippingAddress:string;
    totalPrice:number;
    // status:'pending' |'paid' | 'shipped' | 'delivered' |'cancelled';
    status:string;
    createdAt:string;
    updatedAt:string;
}
export interface OrderResponse{
    success:boolean;
    data:Order;
    message?:string;
}