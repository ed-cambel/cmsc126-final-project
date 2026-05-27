// components/Searchbar.js
// allows users to search for study spots by name
// available on select pages only

'use client'

import { useState, useRef, useEffect } from 'react'
import { UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/context/SearchContext'
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const supabase = createClient();

export default function Searchbar() {
    const { setSearchLocation } = useSearch();
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length < 3) return;

        const delay = setTimeout(async () => {
            try {
                const results = []

                // search db first
                const { data: spots, error } = await supabase
                    .from('spots')
                    .select('id, name, lat, lng')
                    .ilike('name', `%${searchQuery}%`)
                    .limit(3);

                if (spots) {
                    spots.forEach(spot => {
                        results.push({
                            place_id: `spot-${spot.id}`,
                            display_name: spot.name,
                            lat: spot.lat,
                            lon: spot.lng,
                            isSpot: true,
                            spotId: spot.id

                        })
                    });
                }

                // check nominatim if db results < 3
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
                );

                const nominatim = await response.json();
                nominatim.forEach(item => results.push({ ...item, isSpot: false }));

                setSuggestions(results);
                setShowDropdown(results.length > 0);
            } catch (error) {
                console.error("Search error:", error);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [searchQuery]);

    const handleSelectSuggestion = (item) => {
        if (item.isSpot && item.spotId) {
            router.push(`/spot/${item.spotId}`);
            setSearchQuery('');
            setShowDropdown(false);
            return;
        }

        const latlng = [parseFloat(item.lat), parseFloat(item.lon)];
        setSearchQuery(item.display_name);
        setSearchLocation(latlng);
        setPinnedLocation(latlng);
        setShowDropdown(false);
    };

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
            <div ref={dropdownRef} className='flex-1 relative'>
                <div className='flex items-center gap-2.5 bg-[#1E4A2A] border-2 border-[#2E6B3E] rounded-full px-4 h-[38px] focus-within:border-[#C4811A] focus-within:ring-1 focus-within:ring-[#C4811A] transition'>
                    <MagnifyingGlassIcon className='w-5 h-5 text-[#8FBB9E] shrink-0' />
                    <input
                        type='text'
                        placeholder='Search here...'
                        value={searchQuery}
                        onChange={e => {
                            const val = e.target.value;
                            setSearchQuery(val);
                            if (val.trim().length < 3) {
                                setSuggestions([]);
                                setShowDropdown(false);
                            }
                        }}
                        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                        className='flex-1 bg-transparent outline-none text-sm text-[#F5F2EA] placeholder-[#8FBB9E]'
                    />
                </div>

                {showDropdown && (
                    <div className='absolute top-full mt-1 left-0 right-0 bg-[#F5F2EA] rounded-xl shadow-xl border border-[#D4CCBA] max-h-60 overflow-y-auto z-50'>
                        {suggestions.map(item => (
                            <button
                                key={item.place_id}
                                type='button'
                                onClick={() => handleSelectSuggestion(item)}
                                className='w-full text-left px-4 py-2 text-xs text-[#0F2D1C] hover:bg-[#D4CCBA] transition border-b border-[#D4CCBA] last:border-0'
                            >
                                <div className='flex items-center gap-2'>
                                    {item.isSpot && (
                                        <span style={{
                                            fontSize: '9px',
                                            padding: '1px 6px',
                                            borderRadius: '999px',
                                            backgroundColor: '#C4811A',
                                            color: '#F5F2EA',
                                            fontWeight: 700,
                                            whiteSpace: 'nowrap'
                                        }}>SPOT</span>
                                    )}
                                    <span className='truncate'>{item.display_name}</span>
                                </div>
                                {item.sublabel && (
                                    <div className='text-[10px] text-[#0F2D1C]/60 truncate mt-0.5'>{item.sublabel}</div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* User Icon */}
            <Link href="/profile" className='w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-[#2E6B3E] hover:border-[#C4811A] transition'>
                <UserIcon className='w-7 h-7 text-[#A8C4A0]' />
            </Link>

        </header>
    )
}