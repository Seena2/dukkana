'use client'

import Link from 'next/link'
import styles from './header.module.scss'
import { ShoppingCart } from "lucide-react";
// import Dashboard from "../modules/landing/Dashboard";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  // initialize useRouter to redirect user
  const router = useRouter();

  const handleDashboard = () => {
    // if user exist and the user is admin render admin dashboard else user dashboard
    if (user && user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };
  const handleLogout = async () => {
    // clear access token, update state and logout the user
    await logout();
  };
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        {/* logo */}
        <Link href={"/"} className={styles.logo}>
          <h1>Dukkana</h1>
        </Link>

        {/* icons */}
        <div className={styles.menu_icons}>
          <Link href={"/cart"} className={styles.cartButton}>
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className={styles.cartTag}>{totalItems}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              {/* <Dashboard onClick={handleDashboard} /> */}
              <button
                onClick={handleLogout}
                className={styles.logoutBtn}
                disabled={isLoading}
              >
                {isLoading ? "Logging out... " : "Logout"}
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className={styles.loginBtn}>
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header
