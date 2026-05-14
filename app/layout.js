'use client'
import './globals.css'
import { usePathname } from 'next/navigation'

// import font
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

// import components
import Navbar from '@/components/Navbar'


export default function RootLayout({ children }) {
  const pathname = usePathname()
  const hideNavbar = ['/login', '/signup']

  return (
    <html lang="en">

      <body className={`${inter.className} antialiased pb-16`}>
        {children}
        {!hideNavbar.includes(pathname) && <Navbar />}
      </body>
    </html>
  )
}