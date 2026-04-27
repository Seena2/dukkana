"use client";
import { navbarMenu } from '../../../data/data'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

function Menu() {
     const pathName=usePathname(); 
  return (
  <div className=' hidden md:inline-flex w-1/3 items-center gap-4 capitalize font-normal text-light-black'>
          {navbarMenu.map((menuItem)=>( 
            <Link href={menuItem?.href} key={menuItem?.title} className={`hover:text-secondary relative group 
            ${pathName===menuItem?.href && "text-secondary"}`}>
              {menuItem?.title}
              <span className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-secondary group-hover:w-1/2 group-hover:left-0 hoverEffect  ${pathName===menuItem?.href && "w-1/2"}`}></span>
              <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-secondary group-hover:w-1/2 group-hover:right-0 hoverEffect ${pathName===menuItem?.href && "w-1/2"}`}></span>
             
              </Link>
          ))}
        </div>
  )
}

export default Menu
