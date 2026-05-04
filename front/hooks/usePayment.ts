import { useCallback, useState } from "react";
import { CreatePaymentIntentRequest } from "@/types/payment.types";
import { PaymentServive } from "@/services/api/payment.service";


export function usePayment(){
    const [clientSecret,setCleintSecret] =useState<string|null>(null);
    const [isloading,setIsLoading] =useState(false);
    const [error,setError] = useState<string|null>(null);
    const [paumentId,setPaymentId] =useState<string|null>(null);
    
    const createPaymentIntent =useCallback(async(data:CreatePaymentIntentRequest):Promise<boolean>=>{
        setIsLoading(true);
        setError(null);
        try{
            // Make API call to create payment intent
            const response = await PaymentServive.createPaymentIntent(data);
            if(response.success && response.data){
                setCleintSecret(response.data.clientSecret);
                setPaymentId(response.data.paymentId);
                return true
            }
            throw new Error(response.message || 'Failed to create payment intent');
        }catch(error){
            const errorMessage=error instanceof Error ? error.message:'failed to create payment intent';
            setError(errorMessage);
            return false;
        }finally{
            setIsLoading(false);
        }
    },[]);
    const confirmPayment =useCallback(async(data:ConfirmPaymentRequest):Promise<boolean>=>{
        setIsLoading(true);
        setError(null);
        try{
            // Make API call to create payment intent
            const response = await PaymentServive.confirmPayment(data);
            if(response.success){
                return true
            }
            throw new Error(response.message || 'Failed to confirm payment');
        }catch(error){
            const errorMessage=error instanceof Error ? error.message:'Failed to confirm payment';
            setError(errorMessage);
            return false;
        }finally{
            setIsLoading(false);
        }
    },[]);
    return {
        clientSecret,createPaymentIntent,confirmPayment
    }
}