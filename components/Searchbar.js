'use client'

import { useState } from 'react'
import { UserCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import Link from 'next/link'
import Image from 'next/image'

export default function Searchbar() {
    return (
        <header className='font-sans flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200'>

            {/* Logo */}
            <Link href="#" className='font-sans flex items-center gap-2 flex-shrink-0'>
                <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0'>
                    <Image src="/images/logo.jpg" alt="Logo" width={40} height={40} className='rounded-full' />
                </div>
                <span className='text-xl tracking-wide font-semibold font-inter whitespace-nowrap'>STaDi</span>
            </Link>

            {/* Search Bar */}
            <div className='font-inter flex-1 flex items-center gap-2.5 bg-gray-100 border border-gray-300 rounded-full px-4 h-[38px] shadow-sm'>
                <MagnifyingGlassIcon className='w-5 h-5 text-gray-500 shrink-0' />
                <input type='text' placeholder='Search here...' className='flex-1 bg-transparent outline-none text-sm' />
            </div>

            {/* User Icon */}
            <Link href="/profile" className='w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0'>
                <UserCircleIcon className='w-9 h-9 text-gray-500' />
            </Link>

        </header>
    )
}