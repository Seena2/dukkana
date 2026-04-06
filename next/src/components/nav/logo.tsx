import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

function Logo({className}:{className?:string}) {
  return (
    <>
      <Link href={"/"} className={cn("text-2xl text-primary font-bold tracking-wider hover:text-secondary group ",className)}>
            <h2><span className='font-bold'>D</span>ukkana</h2>
      </Link> 
    </>
  )
}

export default Logo
