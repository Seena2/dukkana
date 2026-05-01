import React, { useEffect } from 'react'

import styles from './similarProducts.module.scss'
import ProductCard from '../landing/ProductCard'
import { useProducts } from '@/hooks/useProducts';

function SimilarProducts({category,currentProductId}:{category:string;currentProductId:string}) {
    const {products, getProducts} =useProducts()
    // Fetch similar products when category cahnges
    useEffect(()=>{
        if(category){
            getProducts({category, limit:8})
        }
    },[category, getProducts])
    // get the first 4 realted/similar products
    const similarProducts=products.filter((product)=>product.id!==currentProductId).slice(0,4)
    return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Similar Products</h3>
          <p>You might also interested in this products</p>

        </div>
        <div className={styles.grid}>
          {similarProducts.map((product)=>(<ProductCard key={product.id} product={product}/>))}

        </div>
      </div>
    </section>
  )
}

export default SimilarProducts

