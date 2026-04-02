import React, { FC, useState } from 'react'
import Logo from './logo';
import { X } from 'lucide-react';
import { navbarMenu } from '../../../data/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SocialMediaLinks from '../socialMediaLinks';
import { useClickOutsideSideMenu } from '@/hooks/customHooks';


interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
const SideMenu: FC<SideMenuProps> = ({ isOpen, onClose }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathName=usePathname();
    const sideMenuRef=useClickOutsideSideMenu<HTMLElement>(onClose);//Clicking outside the side menu will close it
  return (
    <div className={`fixed top-0 left-0 h-full w-full inset-y-0  bg-black/50 text-white/80 shadow-lg transform 
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50 `}>
        <div className=" min-w-72 max-w-96 h-screen bg-black border-r border-gray-600 px-10 flex flex-col gap-6 ">
            <div className='flex items-center justify-between w-full' >
                <Logo className='text-white '/>
                <button onClick={onClose} className='text-white text-2xl p-4 hover:text-gray-400 hover:cursor-pointer'>
                    <X size={24} />
                </button>
            </div>
            <div ref={sideMenuRef as React.RefObject<HTMLDivElement>} className='flex flex-col space-y-3.5'>
                {navbarMenu.map((item, index) => (
                    <Link ref={sideMenuRef}  key={index} href={item.href} className={`block text-lg font-semibold tracking-wide hover:text-gray-400 transition-colors duration-300
                     ${pathName === item.href ? 'text-secondary' : ''}`}>
                        {item.title}
                    </Link>
                ))}
            </div>
            
            <SocialMediaLinks/>

        </div>
      
    </div>
  )
}

export default SideMenu
