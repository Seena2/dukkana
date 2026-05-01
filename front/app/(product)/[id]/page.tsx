import Footer from '@/app/components/footer/Footer';
import Product from '@/app/components/modules/product/Product';
import Header from '@/app/components/navbar/Header';
import React from 'react'

// NextJs caching strategy
export const revalidate=false;

interface PageProps{
  params: Promise<{id:string}>
}

export default async function page({params}:PageProps) {
  const {id} = await params;
  return (
    <>
    <Header/>
        <Product productId={id}/>
    <Footer/>
    </>
  )
}

// NextJs dynamic metadata
export function generateMetaData(){
return{
    title: 'page title',
    description: 'Page description',
    icons:{},
}
}


