import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./fonts";


export const metadata: Metadata = {
  title: "Dukkana",
  description: "E-commerce site",
};

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" >
      <body className={`${poppins.variable}`}>{children}</body>
    </html>
  );
}
