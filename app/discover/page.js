// discover page - can see listings of different study spots
// redirects from main page, can redirect to individual spot pages
// can be viewed by guest or user

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Filterbar from '@/components/Filterbar';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// makes a star rating string based on a numeric rating
function StarRating({ rating }) {
  return (
    <span className="text-xs text-[#C4811A]">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span className='text-[#6B6355]'>{rating}</span>
    </span>
  );
}

// descriptor tags
function TagPill({ label }) {
  return (
    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#EDF5D8] text-[#6B6355] border border-[#D4CCBA]">
      {label.replace(/_/g, ' ').toUpperCase()}
    </span>
  );
}

// section header for each category
function SectionHeader({ title }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <h2 className="text-sm font-black text-[#0F2D1C] tracking-widest uppercase">{title}</h2>
      <div className="h-px bg-[#D4CCBA] w-full" />
    </div>
  );
}

// card component for each spot in each category
function SpotCard({ spot, active }) {
  const tags = [
    spot.has_wifi ? 'wifi' : 'no_wifi',
    spot.noise_level, 
    spot.environment,
    spot.location_type
  ].filter(Boolean); // filter out any undefined tags

  return (
    <Link
      href={`/spot/${spot.id}`}
      className={`shrink-0 w-56 rounded-2xl border p-3 flex flex-col gap-2 hover:shadow-[#EBE6D8] transition bg-[#F5F2EA] ${active ? 'border-[#0F2D1C] border-2' : 'border-[#D4CCBA]'}`}
    >
      {/* Placeholder for spot photo -- TODO: fetch images from Supabase */}
      <div className="w-full h-32 rounded-xl bg-[#EBE6D8] flex items-center justify-center text-[#6B6355] text-xs overflow-hidden">
        {spot.images?.[0]
          ? <img src={spot.images[0]} alt={spot.name} className="w-full h-full object-cover" />
          : '[ no photo ]'}
      </div>

      {/* Spot name */}
      <div className="text-sm font-bold text-[#2A241E]">{spot.name}</div>

      {/* Rating and distance */}
      <div className="flex items-center gap-1">
        <StarRating rating={spot.computed_rating} />
        <span className="text-[10px] text-[#6B6355]">({spot.computed_review_count ?? 0} reviews)</span>
      </div>

      {/* Tag pills — show first 3 tags only */}
      <div className="flex flex-wrap gap-1">
        {tags.slice(0, 3).map((val, i) => <TagPill key={i} label={val} />)}
      </div>
    </Link>
  );
}

// title: section heading, spots: array of spot objects
function HorizontalSection({ title, spots }) {
  if (!spots || spots.length === 0) return null;

  return (
    <div className="flex flex-col">
      <SectionHeader title={title} />
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {spots.map((spot, i) => <SpotCard key={spot.id} spot={spot} active={i === 0} />)}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const [spots, setSpots] = useState([]); 
  const [featured, setFeatured] = useState(null); // can be used to set the featured spot of the week from Supabase
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // fetch all spots with stats
      const { data, error } = await supabase
        .from('spots_with_stats')
        .select('*');

      if (error) {
        console.error('Error fetching spots:', error);
        return;
      }

      setSpots(data);

      // featured: highest rated from last 7 days, fallback to all-time top
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      let { data: featuredData } = await supabase
        .from('spots_with_stats')
        .select('*')
        .gte('created_at', lastWeek)
        .order('computed_rating', { ascending: false })
        .limit(1);

      if (!featuredData || featuredData.length === 0) {
        const { data: fallback } = await supabase
          .from('spots_with_stats')
          .select('*')
          .order('computed_rating', { ascending: false })
          .limit(1);
        featuredData = fallback;
      }

      setFeatured(featuredData?.[0] ?? null);
      setLoading(false);
    };

    fetchData();
  }, []);

  const topRated = [...spots].sort((a, b) => (b.computed_rating ?? 0) - (a.computed_rating ?? 0)).slice(0, 5);
  const recentlyAdded = [...spots].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  const bestForStudying = spots.filter(s => s.noise_level === 'silent' && s.has_wifi);
  const hiddenGems = spots.filter(s => (s.computed_rating ?? 0) >= 4.0 && (s.computed_review_count ?? 0) <= 8);
  const outdoor = spots.filter(s => s.environment === 'outdoor');
  return (
    <div className="min-h-screen bg-[#F5F2EA] overflow-y-auto pb-32">
      <div >

        {/* import Filterbar component */}
        <Filterbar
          selectedFilters={selectedFilters}
          onChange={setSelectedFilters}
          resultCount={spots.length}
        />

        {/* Featured This Week  */}
        <div className="px-6 py-5 flex flex-col gap-8">
          <div className="flex flex-col">
            <SectionHeader title="Featured This Week" />
            {loading ? (
              <div className="h-70 bg-[#EBE6D8] rounded-2xl animate-pulse" />
            ) : featured ? (
              <Link href={`/spot/${featured.id}`} className="flex h-70 bg-[#F5F2EA] border border-[#D4CCBA] rounded-2xl overflow-hidden hover:bg-[#EBE6D8] transition">
                <div className="w-[45%] h-70 bg-[#EBE6D8] flex items-center justify-center text-[#6B6355] text-xs shrink-0 overflow-hidden">
                  {featured.images?.[0]
                    ? <img src={featured.images[0]} alt={featured.name} className="w-full h-full object-cover" />
                    : '[ no photo ]'}
                </div>
                <div className="flex flex-col justify-between p-5 flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="text-base font-bold text-[#0F2D1C]">{featured.name}</div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={featured.computed_rating} />
                      <span className="text-[10px] text-[#6B6355]">({featured.computed_review_count ?? 0} reviews)</span>
                    </div>
                    <p className="text-xs text-[#6B6355] line-clamp-3">{featured.description}</p>
                  </div>
                  <button className="w-full py-2 text-xs font-bold rounded-lg bg-[#C4811A] text-[#F5F2EA] hover:bg-[#CFA000] hover:text-[#0F2D1C] transition tracking-widest">
                    VIEW SPOT
                  </button>
                </div>
              </Link>
            ) : (
              <div className="text-xs text-[#6B6355]">No featured spot available.</div>
            )}
          </div>

          {loading ? (
            <div className="text-xs text-[#0F2D1C]">Loading spots...</div>
          ) : (
            <>
              <HorizontalSection title="Top-Rated" spots={topRated} />
              <HorizontalSection title="Recently Added" spots={recentlyAdded} />
              <HorizontalSection title="Best for Studying" spots={bestForStudying} />
              <HorizontalSection title="Hidden Gems" spots={hiddenGems} />
              <HorizontalSection title="Outdoor Spots" spots={outdoor} />
            </>
          )}
      </div>
    </div>
    </div>
  );
}