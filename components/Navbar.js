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
            <div className='font-sans bg-white rounded-2xl flex justify-around items-center h-16 shadow-2xl'>
                <Link href="/" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl h-full w-full
                    ${pathname === '/' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                    <MapIcon className="w-5 h-5" />
                    <span className={`${inter.className} text-xs font-semibold uppercase tracking-wide`}>Interactive Map</span>
                </Link>

                <Link href="/discover" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl h-full w-full
                    ${pathname === '/discover' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                    <FireIcon className="h-6 w-6" />
                    <span className={`${inter.className} text-xs font-semibold uppercase tracking-wide`}>Discover</span>
                </Link>

                <Link href="/add" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl h-full w-full
                    ${pathname === '/add' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                    <PlusIcon className="w-5 h-5" />
                    <span className={`${inter.className} text-xs font-semibold uppercase tracking-wide`}>Contribute</span>
                </Link>

                <Link href="/profile" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl h-full w-full
                    ${pathname === '/profile' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                    <UserIcon className="h-6 w-6" />
                    <span className={`${inter.className} text-xs font-semibold uppercase tracking-wide`}>Profile</span>
                </Link>
            </div>
        </nav>
    )
}