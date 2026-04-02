import { Heart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Fav() {
  return (
    <>
      <Link href={"/cart"} className='group relative '> 
        <Heart className={`w-5 h-5 hover:text-secondary hoverEffect`}/>
         <span className='absolute -top-1 -right-1 text-white bg-primary h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center'>0</span>
    </Link>
    </>
  )
}

export default Fav
