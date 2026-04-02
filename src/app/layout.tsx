import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/nav/navbar";
import Footer from "@/components/footer";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"],});

// const geistMono = Geist_Mono({variable: "--font-geist-mono", subsets: ["latin"],});

export const metadata: Metadata = {
  title: {
    template: "%s- Dukkana online store",
    default: "Dukkana online store",
  },
  description: "a site where you can buy items online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      className={cn("font-poppins", "antialiased", "font-sans", geist.variable)}
    >
      <body className={`min-h-full flex flex-col`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
