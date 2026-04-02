
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';


const socialMediaLinksData=[
    {
        name:"Facebook",
        href:"https://facebook.com",
        icon:<FaFacebook size={20} className="text-white hover:text-gray-400 h-5 w-5"/>
        
    },
    {
        name:"Twitter",
        href:"https://twitter.com",
        icon:<FaTwitter size={20} className="text-white hover:text-gray-400 h-5 w-5"/>
    },
    {
        name:"Instagram",
        href:"https://instagram.com",
        icon:<FaInstagram size={20} className="text-white hover:text-gray-400"/>
    }
];

interface SocialMediaLinksProps {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}


function SocialMediaLinks() {
  return (
    <TooltipProvider >
      <div className='flex  gap-4 border-t border-gray-600 pt-4'>
      
      {socialMediaLinksData.map((item)=>(
        <Tooltip key={item.name}>
          <TooltipTrigger asChild>
            <Link  href={item.href} target="_blank" rel="noopener noreferrer" className='p-2 border rounded-full hoverEffect hover:border-gray-600'>
                {item.icon}
            </Link>
          </TooltipTrigger>
          <TooltipContent className='bg-gray-800 text-white text-xs rounded-md px-2 py-1'>
            {item.name}
          </TooltipContent>
        </Tooltip>
       
      ))}
      </div>
    </TooltipProvider>
  );
}

export default SocialMediaLinks
