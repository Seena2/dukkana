import { Product } from '@/types/product.types'
import Link from 'next/link'
import styles from './productCard.module.scss'
import Image from 'next/image';

function ProductCard({product}:{product:Product}) {
  const id = product.id;
  const isInStock =product.stock >0;
  return (
    <Link href={`/${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image src={product.imageUrl.trimEnd() ?? "/images/shoe.png"} alt={product.name} width={400} height={400} loading='lazy'/>
        
      </div>
      <div className={styles.cardContent}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productDescription}>{product.description}</p>
        <div className={styles.cardFooter}>
          <span className={styles.price}>{product.price.toFixed(2)}</span>
          <span className={`styles.stock ${!isInStock? styles.outOfStock : ""}`}>
            {isInStock ? product.stock + "In stock" :"Out of Stock"}
            </span>
        </div>
      </div>
      </Link>
  )
}

export default ProductCard
