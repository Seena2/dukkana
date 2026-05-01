import React from 'react'
import styles from './breadcrumb.module.scss'
import Link from 'next/link'

function Breadcrumbs({productName}:{productName?:string}) {
  return (
    <div className={styles.breadcrumb}>
      <div className={styles.container} aria-label='Breadcrumb'>
        <nav className={styles.navbar}>
          <Link href={'/'} className={styles.navLink}>Store</Link>
          <span  className={styles.separator}>/</span>
          <span  className={styles.current}>{productName}</span>
          
        </nav>
      </div>
    </div>
  )
}

export default Breadcrumbs
