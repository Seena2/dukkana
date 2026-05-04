'use client'
import  { useEffect, useState } from 'react'
import styles from './checkout.module.scss'
import { CheckIcon, CreditCard} from 'lucide-react'
import PaymentCard from './PaymentCard';
import { usePayment } from '@/hooks/usePayment';
import  { StripePaymentProvider,StripePaymentForm } from './StripePaymentForm';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { OrderItem } from '@/types/order.types';
import { useOrder } from '@/hooks/useOrder';
import { useAuth } from '@/hooks/useAuth';



type Step = 1 | 2| 3 | 4;
function CheckOut() {
    const steps = [
        {number:1, title:"Payment"},
        {number:2, title:'Shipping Address'},
        {number:3, title:'Processing'},
        {number:4, title:'Complete'},
    ]
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const [stripeError, setStripeError] = useState<string | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
    const [orderId,setOrderId] = useState<string>('');

    const {clientSecret,confirmPayment, createPaymentIntent}=usePayment();
    const {totalPrice,items, clearCart}=useCart();

    const {isAuthenticated} = useAuth();
    const router =useRouter();
    const {createOrder} =useOrder();

    useEffect(()=>{
        if(!isAuthenticated){
            router.push('/auth/login?redirect=/checkout')
        }
    },[isAuthenticated, router])

    useEffect(()=>{
        if(items.length ===0 && !orderId){
            router.push("/cart")
        }
    },[orderId,items,router]);
    useEffect(()=>{
        const createOrderAutomatically = async()=>{
            if(selectedPaymentMethod && !orderId && !isCreatingOrder && !clientSecret ){
                setIsCreatingOrder(true);
                setStripeError(null);
                try {
                    const cartItems: OrderItem[] = items.map((item)=>({
                        productId:item.productId,
                        qauntity: item.quantity,
                        price: item.product.price
                    }))
                    const order= await createOrder({
                        items:cartItems,
                        shippingAddress:"123 Main St, City, Country",
                    })
                    if(!order){
                        throw new Error('Failed to create order');
                    }
                    setOrderId(order.id);
                    if(selectedPaymentMethod ==='Stripe'){
                        const paymentCreated = await createPaymentIntent({
                            orderId:order.id,
                            amount: totalPrice,
                            currency: 'USD',
                            description:`Payment for order ${order.id}`,
                        })
                        if(!paymentCreated){
                            throw new Error('Failed to create payment intent');
                        }
                    }
                } catch (error) {
                    const errorMessage=error instanceof Error ? error.message:'Failed to create payment intent';
                    setStripeError(errorMessage);
                    console.log('Error creating order or payment intent:',error);
                }finally{
                    setIsCreatingOrder(false);
                }
            }
        }
        createOrderAutomatically();
       
    },[orderId,selectedPaymentMethod,isCreatingOrder, clientSecret, items,createOrder, createPaymentIntent, totalPrice]);

    const handlePaymentMethodSelection=(method:string)=>{
        setSelectedPaymentMethod(method);
        setStripeError(null);
        //You can also add additional logic here,such as updating order summary or enabling next button based on the selected payment method.
    }
    const handlePaymentSuccess= async(paymentIntentId:string)=>{
        try {
            setCurrentStep(2);
            const confirmed = await confirmPayment({ orderId,paymentIntentId });
            if(!confirmed){
                throw new Error('Payment confirmation failed');
            }
            await clearCart();
        } catch (error) {
            const errorMessage =error instanceof Error ? error.message : 'Payment confirmation failed';
            setStripeError(errorMessage);
            console.log('Eror confirming payment:',error);
        }
        
    }
    const handlePaymentError= async(errorMessage:string)=>{
        setStripeError(errorMessage);
    }
  return (
    <section className={styles.checkoutSection}>
    <div className={styles.container}>
        <div className={styles.header}>
            <h1>Checkout</h1>
            <p>Complete your purchase</p>
        </div>
        <div className={styles.steps}>
            {steps.map((step,index)=>(
                <div key={index} className={styles.stepsWrapper}>
                    <div key={index} className={`${styles.step} ${currentStep >= step.number ? styles.activeStep:""} 
                    ${currentStep>step.number ? styles.completedStep:""}`}>
                        <div className={styles.stepNumber}>
                            {currentStep >step.number ? ( <CheckIcon size={20} strokeWidth={3}/> ):(step.number)}
                        </div>
                        <span className={styles.stepCaption}>{step.title}</span>
                    </div>
                    {index < steps.length-1 && <div className={styles.stepConnector}></div>}
                </div>
            ))}
        </div>
        <div className={styles.paymentCard}>
            {currentStep ===1 && (<div className={styles.container}>
                <h2>Select payment method</h2>
                <div className={styles.paymentMethods}>
                    <PaymentCard method='Stripe' selectedMethod={selectedPaymentMethod}  onSelect={handlePaymentMethodSelection} icon={<CreditCard/>} title="Credit/Debit card"
                            description='Pay securly with stripe'>
                        {stripeError && <p className={styles.errorMessage}>{stripeError}</p>}
                        {isCreatingOrder && !clientSecret && 
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <div className={styles.loadingText}>Processing your payment...</div>
                         </div>
                         }
                         { clientSecret && <StripePaymentProvider clientSecret={clientSecret}  amount={totalPrice}
                                    onSuccess={handlePaymentSuccess} onError={handlePaymentError}> 
                                    <StripePaymentForm  amount={totalPrice} onSuccess={handlePaymentSuccess} onError={handlePaymentError}/>
                           </StripePaymentProvider>
                         }
                
                    </PaymentCard>
                    {/* Other payment methods */}

                </div>
                {/* payment summary */}
                         <div className={styles.summary}>
                            <h3>Order summary</h3>
                            <div className={styles.row}>
                                <span>Items : ({items.length})</span>
                                <span> ${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className={styles.row}>
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <hr className={styles.divider} />
                            <div className={styles.summaryTotal}>
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>

                         </div>

            </div>)}
            {
                currentStep ===2 &&(<div className={styles.shippingAddress}>
                    <h3>Shipping Address</h3>
                    {/* Shipping address details form */}
                    <p>123,Main Streat</p>
                </div>)
            }
            {
                currentStep ===3 &&(<div className={styles.stepCompleted}>
                    <div className={styles.success}>
                        <CheckIcon size={20} strokeWidth={3} className={styles.successIcon}/>
                        <h2>Order Placed Succssfully</h2>
                        <p>Your order has been placed successfully. you will receive a confirmation email shortly.</p>
                        <p>Order Id:{orderId}</p>
                        <div className={styles.shippingAddress}>
                            <h4>Shipping to:</h4>

                            <strong>
                                {/* note, this address should be dynamic with user provided address */}
                                <p>John Doe,</p>
                                <p>123 Main Street, Apt 4B </p>
                                <p>San Francisco, CA 94103 United States </p>
                            </strong>
                        </div>
                        <button onClick={()=> router.push('user/orders')} className={styles.continueButton} >Go to my orders</button>
                    </div>
                   
                </div>)
            }
        </div>
    </div>
    </section>
  )
}

export default CheckOut
