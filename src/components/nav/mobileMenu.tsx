"use client";
import { AlignLeft } from 'lucide-react'
import React, { useState } from 'react'
import SideMenu from './sideMenu'

function MobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <button onClick={()=>{setIsMobileMenuOpen(!isMobileMenuOpen)}} className=''>
        <AlignLeft size={24} className='hover:text-gray-400 hover:cursor-pointer md:hidden hoverEffect'/>
      </button>
      <div className="md:hidden">
        <SideMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      </div>
    </>
  )
}

export default MobileMenu
