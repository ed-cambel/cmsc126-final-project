'use client'
import './globals.css'
import { usePathname } from 'next/navigation'

// import font
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700', '900']
})

// import components
import Navbar from '@/components/Navbar'
import Searchbar from '@/components/Searchbar'


export default function RootLayout({ children }) {
  const pathname = usePathname()
  const hideNavbar = ['/login', '/signup']
  const shouldHideSearchbar = hideNavbar.includes(pathname) || pathname.startsWith('/spot/')
  const shouldHideNavbar = hideNavbar.includes(pathname)

  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.className} antialiased overflow-hidden`}>
        {!shouldHideSearchbar && <Searchbar />}
        {children}
        {!shouldHideNavbar && <Navbar />}
      </body>
    </html>
  )
}