'use client'

import Link from 'next/link';
import styles from  './footer.module.scss';
function Footer() {
  return (
    <footer className={styles.footer}>
     <div className={styles.footerContainer}>
     <div className={styles.footerContent}>
     <div className={styles.brand}>
      <h3>Dukkana</h3>
      <p>serving finest products</p>
     </div>
     <div className={styles.section}>
      <h4>Shop</h4>
      <ul>
        <li><Link href={'/'}>All products</Link></li>
        <li><Link href={'/'}>Categories</Link></li>
        <li><Link href={'/'}>New arrivals</Link></li>
        <li><Link href={'/'}>Deals</Link></li>
      </ul>
     </div>
     <div className={styles.section}>
      <h4>Support</h4>
      <ul>
        <li><Link href={'/'}>Help center</Link></li>
        <li><Link href={'/'}>Contact Us</Link></li>
        <li><Link href={'/'}>Shipping info</Link></li>
        <li><Link href={'/'}>Returns & Exchanges</Link></li>
      </ul>
     </div>
     <div className={styles.section}>
      <h4>Company</h4>
      <ul>
        <li><Link href={'/'}>About us</Link></li>
        <li><Link href={'/'}>Careers</Link></li>
        <li><Link href={'/'}>Privacy policy</Link></li>
        <li><Link href={'/'}>Terms of service</Link></li>
      </ul>
     </div>

     </div>

     </div>
    </footer>
  )
}

export default Footer
