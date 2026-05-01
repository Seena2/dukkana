'use client'
import styles from './cart.module.scss'
import { useCart } from '@/hooks/useCart'
import CartItem from './CartItem';
function Cart() {
    const {items,clearCart} = useCart();
    const handleClearCart= async()=>{
        if(window.confirm(`Are you sure you want to clear the entire cart`)){
            await clearCart();
        }
    }
  return (
    <section className={styles.section}>
      <div className={styles.containter}>
        <div className={styles.header}>
            <h2>Shopping cart</h2>
            <button onClick={handleClearCart} className={styles.clearButton}>Clear cart</button>
        </div>
        <div className={styles.content}>
         <div className={styles.itemsList}>
            {items.map((item)=>(<CartItem key={item.product.id} item={item}/>))}
         </div>

        </div>
      </div>
    </section>
  )
}

export default Cart
