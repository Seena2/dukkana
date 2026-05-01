'use client'
import React, { useEffect } from 'react'
import BreadCramps from './Breadcrumbs'
import { useProducts } from '@/hooks/useProducts';
import styles from './product.module.scss'
import ProductDetails from './ProductDetails';
import SimilarProducts from './SimilarProducts';


function Product({productId}:{productId:string}) {
  const {getProduct,product, isLoading, error }= useProducts();
  useEffect(()=>{
    if(productId){
      getProduct(productId);
    }
  },[productId, getProduct])

 
  if(isLoading){
    return <div className={styles.messageContainer}>
      <div className={styles.messageContent}>
        <p>Loading product details ...</p>
      </div>
    </div> 
  }
   if( error || !product){
    return <div className={styles.messageContainer}>
      <div className={styles.messageContent}>
        <h2>Product not found</h2>
        <p>The product you are looking is not available.</p>
      </div>
    </div> 
  }
  return (
    <>
    <BreadCramps productName={product.name}/>
    <ProductDetails product={product}/>
    <SimilarProducts category={product.categoryId} currentProductId={product.id}/>
    </>
  )
}

export default Product

