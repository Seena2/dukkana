import React from 'react'
import Header from '../components/navbar/Header'
import Footer from '../components/footer/Footer'
import CheckOut from '../components/modules/checkout/CheckOut'

function page() {
    
  return (
    <>
    <Header/>
        <CheckOut/>
    <Footer/>
    </>
  )
}

export default page
