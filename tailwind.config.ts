import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'], // default body font
                poppins: ['var(--font-poppins)', 'sans-serif'], // headings / special UI
            },

            colors: {
                linen: '#F5F2EA',
            },
        },
    },
    plugins: [],
}

export default config