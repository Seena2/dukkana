import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Appearance, loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import styles from './stripePaymentForm.module.scss';

const stripePromise=loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); //Ensure to set your Stripe publishable key in the environment variables)
export function StripePaymentProvider({clientSecret,children,amount, onSuccess,onError}:
  {clientSecret:string; children?:React.ReactNode; amount:number;onSuccess:(paymentIntentId:string)=>void; onError:(errorMessage:string)=>void;}) {
  
  const appearance:Appearance={
    theme:'stripe',
    variables:{
        colorPrimary:'#0570de',
        colorBackground:'#ffffff',
        colorText:'#30313d',
        colorDanger:'#df1b41',
        fontFamily: 'Poppins,Ideal Sans, system-ui, sans-serif',
        spacingUnit:'4px',
        borderRadius:'4px',
    }
  }
    const options:StripeElementsOptions={
    clientSecret, appearance,
   }
    return (
    <Elements stripe={stripePromise} options={options}>
        {children}
    </Elements>
  )
}


export function StripePaymentForm({amount, onSuccess,onError,}:{amount:number; onSuccess:(paymentIntentId:string)=>void; onError:(errorMessage:string)=>void;}){
  const stripe=useStripe();
 const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFromSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  if(!stripe || !elements) return ;
    setIsLoading(true);
    setErrorMessage(null);
  try{
    const {error, paymentIntent} = await stripe.confirmPayment({elements, confirmParams:{
      return_url: `${window.location.origin}/checkout/success`},
      redirect:`if_required`
    });
    if(error){
      setErrorMessage(error.message || 'Payment failed');
      onError(error.message || 'Payment failed');
      alert(error.message || 'Payment failed');
    }else if(paymentIntent && paymentIntent.status === 'succeeded'){
      alert(`Payment successful, Amount:$${amount.toFixed(2)} with paymentIntentId: ${paymentIntent.id}`);
       onSuccess(paymentIntent.id);
    }
    

  }catch(error){
    setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    onError(error instanceof Error ? error.message :'An unexpected error occured');
    console.error('Error processing payment:',error);
  }finally{
    setIsLoading(false);
  }
}
return(
<form onSubmit={handleFromSubmit} className={styles.form}>
  <PaymentElement options={{layout:'tabs'}}/>
  <div className={styles.buttonContainer}>
  <button type='submit' disabled={isLoading || !stripe ||!elements} className={styles.submitButton}>
    {isLoading? <><Loader2 className={styles.spinner}>Processing...</Loader2></>: `Pay $${amount.toFixed(2)} Now`}
  </button>
  </div>
  {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
</form>
)
}
