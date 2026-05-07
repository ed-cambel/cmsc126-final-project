import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">

            <Link href="/" className="font-medium text-sm text-gray-900">
                📍 STadi
            </Link>

            <div className="flex items-center gap-4 ml-auto">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
                    Map
                </Link>
                <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-900">
                    Profile
                </Link>
                <Link href="/add" className="text-sm text-gray-500 hover:text-gray-900">
                    Add Spot
                </Link>
                <Link href="/login" className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-700">
                    Log in
                </Link>
            </div>

        </nav>
    )
}