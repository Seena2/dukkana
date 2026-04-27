'use client'

import Link from 'next/link'
import styles from './header.module.scss'
import { ShoppingCart } from 'lucide-react'
import Dashboard from './Dashboard'

function Header() {
  const totalItems=2
  const isAuthenticated= false;
  const handleDashboard = ()=>{
    // Redirect user to the Dashboard
  }

  const handleLogin=()=>{

  }
    const handleLogout=()=>{

  }
  return (
    <header className={styles.header}>
        <nav className={styles.navbar}>
            {/* logo */}
            <Link href={"/"} className={styles.logo}><h1>Dukkana</h1></Link>
            
            {/* icons */}
            <div className={styles.menu_icons}>
              <Link href={"/cart"} className={styles.cartButton}>
              <ShoppingCart size={20}/>
              {totalItems>0 && (<span className={styles.cartTag}>{totalItems}</span>)}
              </Link>
              { isAuthenticated ? (
                <>
                <Dashboard onClick={handleDashboard}/>
                <button onClick={handleLogout} className={styles.logoutBtn}>Log Out</button>
               
                </>
              ) : ( <button onClick={handleLogin} className={styles.loginBtn}>Login</button>)

              }
            </div>

        </nav>
    </header>
  )
}

export default Header
