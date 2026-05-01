'use client'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './productList.module.scss'
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import { metadata } from '@/app/layout';
function ProductList() {
    const [search, setSearch] =useState("");
    const [page,setPage]=useState(1);
    //the value after user completes entering the search item, to prevent triggering api calls while the user is typing
    const [debouncedSearch,setDebouncedSearch]=useState(""); 
    const {isLoading,products, getProducts,error,meta} =useProducts();

    const limit=10;

    // fetch data on component mount
    useEffect(()=>{
        getProducts({page,limit,search:debouncedSearch,})
    },[getProducts,page,limit,debouncedSearch])


    const handleSearch= useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
        const value= e.target.value;
        setSearch(value);
        setPage(1);
        setTimeout(()=>{
            setDebouncedSearch(value);
        },500)
    },[]);
    const handlePrevious = ()=>{
        if(page>1){
            setPage(page-1);
        }
    }
    const handleNext = ()=>{
        if(meta && page < meta.totalPages){
            setPage(page + 1);
        }
    }
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
            <h2>Products</h2>
            <p>latest and popular collections</p>
        </div>
        <div className={styles.searchBar}>
            <input type="text" placeholder='Search products...' value={search} onChange={handleSearch} />
        </div>
        {isLoading ? (
            <div className={styles.loading}>Loading products ...</div>):
            products.length === 0 ?(<div className={styles.empty}>
                {debouncedSearch ? `Product  ${debouncedSearch} not found`: 'No product available' }
                </div>):
            (
                <>
                <div className={styles.productListGrid}>
                    { products.map((product)=>( <ProductCard key={product.id} product={product}/> )) }
                </div>
                {/* pagination */}
                {meta && meta.totalPages >0 &&(
                   <div className={styles.pagination}>
                    <button onClick={handlePrevious} disabled={page===1}>Prev</button>
                    <span className={styles.pageInfo}> Page {page} of {meta.totalPages}</span>
                    <button onClick={handleNext} disabled={page >= meta.totalPages}>Next</button>
                   </div>
                )}
                </>
            )
        }
      </div>
    </section>
  )
}

export default ProductList
