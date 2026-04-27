import { Poppins } from 'next/font/google';

export const poppins = Poppins({
    variable: '--font-poppins', // Optional: for Tailwind CSS integration
    subsets: ['latin'],
    display: 'swap',
    weight: ['100', '400', '500', '700', '900'], // Specify required weights
  
});
