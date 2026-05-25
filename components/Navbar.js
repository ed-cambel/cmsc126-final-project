// components/Navbar.js
// should redirect from page to page

'use client'
import Link from 'next/link'
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

import { usePathname } from 'next/navigation'
import { MapIcon, FireIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
    const pathname = usePathname()

    return (
        <nav className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl'>
            <div className='font-sans text-[#D4CCBA] bg-[#0F2D1C] rounded-2xl flex justify-around items-center h-16 shadow-2xl'>
                {/* Interactive Map Page*/}
                <Link href="/" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl h-full w-full
                    ${pathname === '/' ? 'bg-[#C4811A]' : 'hover:bg-[#1E4A2A]'}`}>
                    <MapIcon className="w-5 h-5" />
                    <span className={`${inter.className} text-xs font-semibold uppercase tracking-wide`}>Interactive Map</span>
                </Link>

                {/* Discover */}
                <Link href="/discover" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl h-full w-full
                    ${pathname === '/discover' ? 'bg-[#C4811A]' : 'hover:bg-[#1E4A2A]'}`}>
                    <FireIcon className="h-6 w-6" />
                    <span className={`${inter.className} text-xs font-semibold uppercase tracking-wide`}>Discover</span>
                </Link>

                {/* Add Study Spot Page */}
                <Link href="/add" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl h-full w-full
                    ${pathname === '/add' ? 'bg-[#C4811A]' : 'hover:bg-[#1E4A2A]'}`}>
                    <PlusIcon className="w-5 h-5" />
                    <span className={`${inter.className} text-xs font-semibold uppercase tracking-wide`}>Contribute</span>
                </Link>

                {/* Profile Page * - can also be accessed by clicking avatar icon*/}
                <Link href="/profile" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl h-full w-full
                    ${pathname === '/profile' ? 'bg-[#C4811A]' : 'hover:bg-[#1E4A2A]'}`}>
                    <UserIcon className="h-6 w-6" />
                    <span className={`${inter.className} text-xs font-semibold uppercase tracking-wide`}>Profile</span>
                </Link>
            </div>
        </nav>
    )
}