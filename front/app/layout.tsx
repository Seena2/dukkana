import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./fonts";
import Providers from "@/providers";

export const metadata: Metadata = {
  title: "Dukkana",
  description: "E-commerce site",
};

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
