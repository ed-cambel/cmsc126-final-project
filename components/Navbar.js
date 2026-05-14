'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapIcon, FireIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
    const pathname = usePathname()

    return (
        <nav className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl'>
            <div className='bg-[#b5d98a] rounded-2xl border-2 border-[#8abe5a] flex justify-around items-center h-16 px-2 shadow-2xl'>
                {/* map page for navigation bar */}
                <Link href="/" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl border-2 h-full w-full
                    ${pathname === '/' ? 'border-[#5a8a2a] text-[#2a5a00] bg-[#a0c870]' : 'border-[#8abe5a] text-[#3a6a10] hover:bg-[#a0c870]'}`}>
                    <MapIcon className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Interactive Map</span>
                </Link>

                {/* discover page for navigation bar */}
                <Link href="/discover" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl border-2 h-full w-full
                    ${pathname === '/discover' ? 'border-[#5a8a2a] text-[#2a5a00] bg-[#a0c870]' : 'border-[#8abe5a] text-[#3a6a10] hover:bg-[#a0c870]'}`}>
                    <FireIcon className="h-6 w-6" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Discover</span>
                </Link>

                {/* add page for navigation bar */}
                <Link href="/add" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl border-2 h-full w-full
                    ${pathname === '/add' ? 'border-[#5a8a2a] text-[#2a5a00] bg-[#a0c870]' : 'border-[#8abe5a] text-[#3a6a10] hover:bg-[#a0c870]'}`}>
                    <PlusIcon className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Contribute</span>
                </Link>

                {/* profile page for navigation bar */}
                <Link href="/profile" className={`flex flex-col items-center justify-center gap-1 px-3 rounded-xl border-2 h-full w-full
                    ${pathname === '/profile' ? 'border-[#5a8a2a] text-[#2a5a00] bg-[#a0c870]' : 'border-[#8abe5a] text-[#3a6a10] hover:bg-[#a0c870]'}`}>
                    <UserIcon className="h-6 w-6" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Profile</span>
                </Link>
            </div>
        </nav>
    )
}