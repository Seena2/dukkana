'use client'
import styles from './cart.module.scss'
import { useCart } from '@/hooks/useCart'
import CartItem from './CartItem';
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

function Cart() {
  const { items, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClearCart = async () => {
    if (window.confirm(`Are you sure you want to clear the entire cart`)) {
      await clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <section>
        <div className={styles.emptyCart}>
          <ShoppingCart className={styles.empty} size={64} />
          <h3>Your cart is empty</h3>
          <p>Add some products to ger started</p>
          <Link href={"/"} className={styles.continueBtn}>
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }
  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/auth/login ? redirect = /cart");
    } else {
      router.push("/checkout");
    }
  };
  return (
    <section className={styles.section}>
      <div className={styles.containter}>
        <div className={styles.header}>
          <h2>Shopping cart</h2>
          <button onClick={handleClearCart} className={styles.clearButton}>
            Clear cart
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
          <div className={styles.summary}>
            <h2>Order summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{totalPrice.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <hr className={styles.dividerLine} />
            <div className={styles.total}>
              <span>Total</span>
              <span>{totalPrice.toFixed(2)}</span>
            </div>
            <button className={styles.checkoutbutton} onClick={handleCheckout}>
              Process to checkout
            </button>
            <Link href={"/shipping"} className={styles.shipBtn}>
              Continue shipping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart
