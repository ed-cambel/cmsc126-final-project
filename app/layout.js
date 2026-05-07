import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'STadi',
  description: 'Find your next study spot',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}