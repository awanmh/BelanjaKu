import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "BelanjaKu",
  description: "Ecommerce App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX: Tambahkan suppressHydrationWarning di html tag juga jika perlu
    // dan pastikan class font diaplikasikan dengan benar
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}