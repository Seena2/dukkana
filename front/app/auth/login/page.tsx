import Footer from '@/app/components/footer/Footer'
import LoginForm from '@/app/components/modules/auth/LoginForm'
import Header from '@/app/components/navbar/Header'
import React from 'react'

function page() {
  return (
    <>
      <Header/>
      <LoginForm/>
      <Footer/>
    </>
  )
}

export default page
