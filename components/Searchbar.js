// components/Searchbar.js
// allows users to search for study spots by name
// available on select pages only

'use client'

import { UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import Link from 'next/link'
import Image from 'next/image'

export default function Searchbar() {
    return (
        <header className='font-sans flex items-center gap-3 px-4 py-2.5 bg-[#0F2D1C] border-1.5 border-gray-200'>

            {/* Logo */}
            <Link href="#" className='font-sans flex items-center gap-2 shrink-0'>
                <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0'>
                    <Image src="/images/logo.jpg" alt="Logo" width={40} height={40} className='rounded-full' />
                </div>
                <span className='text-[#D4CCBA] text-xl tracking-wide font-semibold font-inter whitespace-nowrap'>STaDi</span>
            </Link>

            {/* Search Bar */}
            <div className='font-inter flex-1 flex items-center gap-2.5 bg-[#1E4A2A] border-2 border-[#2E6B3E] rounded-full px-4 h-[38px] focus-within:border-[#C4811A] focus-within:ring-1 focus-within:ring-[#C4811A] transition'>
                <MagnifyingGlassIcon className='w-5 h-5 text-[#A8C4A0] shrink-0' />
                <input type='text' placeholder='Search here...' className='flex-1 bg-transparent outline-none text-sm text-[#EDF5D8] placeholder-[#A8C4A0]' />
            </div>

            {/* User Icon */}
            <Link href="/profile" className='w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-[#2E6B3E] hover:border-[#C4811A] transition'>
                <UserIcon className='w-7 h-7 text-[#A8C4A0]' />
            </Link>

        </header>
    )
}