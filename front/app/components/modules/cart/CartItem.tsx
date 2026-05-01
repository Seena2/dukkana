'use cleint'
import { CartItemType } from '@/types/cart.types'
import styles from './caartItem.module.scss'
import Link from 'next/link'
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';



function CartItem({item}:{item:CartItemType}) {
    const {decrementProductQuantity, incrementProductQuantity,removeProductFromCart} =useCart();
    const {product, quantity} = item;
    const itemTotal =product.price *quantity;

    const handleDecrement= async()=>{
        await decrementProductQuantity(product.id);
    }

    const handleIncrement= async()=>{
        if(quantity < product.stock){
         await incrementProductQuantity(product.id)
        }else{
            alert(`Only ${product.stock} items available`)
        }
    }
  const handleRemove= async()=>{
    if(window.confirm(`Remove ${product.name} from cart? `)){
        await removeProductFromCart(product.id);
    }
  }
  return (
    <div className={styles.cartItem}>
      <Link href={product.id} className={styles.imageWrapper}>
        <Image src={product.imageUrl.trimEnd() ?? ""} alt={product.name} width={120} height={120}/>
       </Link>
        <div className={styles.details}>
             <div className={styles.info}>
                <Link href={`/${product.id}`} className={styles.productName}>{product.name}</Link>
                <span className={styles.category}>{product.categoryId}</span>
                <span className={styles.price}>{product.price.toFixed(2)}</span>
                {product.stock <= 5 &&(
                    <span className={styles.lowStock}>Only {product.stock} left in stock</span>
                )}
             </div>
             <div className={styles.actions}>
                <div className={styles.quantityControl}>
                  <button className={styles.quantityButton} onClick={handleDecrement} disabled={quantity<=0} aria-label="Decrease quantity">-</button>
                   <span className={styles.quantityValue} >{quantity}</span>
                   <button className={styles.quantityButton} onClick={handleIncrement} 
                //    disabled={!isInStock} 
                   aria-label="Increase quantity">+</button>
                </div>
                <div className={styles.itemTotal}> ${itemTotal.toFixed(2)} </div>
                <button className={styles.removeButton} onClick={handleRemove} aria-label='Remove item'><Trash2 size={18}/></button>
             </div>
        </div>
    </div>
  )
}

export default CartItem
