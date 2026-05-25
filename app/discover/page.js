// discover page - can see listings of different study spots
// redirects from main page, can redirect to individual spot pages
// can be viewed by guest or user

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Filterbar from '@/components/Filterbar';

// Mock data for study spots - TODO: replace with Supabase data later
const SPOTS = [
  { id: 1, name: "TLRC", tags: { connectivity: "wifi", noise: "moderate", environment: "air_conditioned", location: "inside_upv" }, rating: 4.5, reviews: 12, dist: "0.1 km", description: "A productive space inside the Teaching and Learning Resource Center with fast wifi and plenty of outlets.", image_url: "https://placehold.co/600x400/EBE6D8/6B6355?text=TLRC", is_featured: false },
  { id: 2, name: "UPV Library", tags: { connectivity: "wifi", noise: "silent", environment: "air_conditioned", location: "inside_upv" }, rating: 4.8, reviews: 34, dist: "0.3 km", description: "The main university library — silent, air-conditioned, and stocked with study tables and power outlets.", image_url: "https://placehold.co/600x400/D4CCBA/2A241E?text=UPV+Library", is_featured: true },
  { id: 3, name: "AS Garden", tags: { connectivity: "no_wifi", noise: "quiet", environment: "outdoor", location: "inside_upv" }, rating: 4.2, reviews: 8, dist: "0.4 km", description: "A peaceful outdoor garden beside the AS building, great for reading or light studying in the breeze.", image_url: "https://placehold.co/600x400/C0DD97/27500A?text=AS+Garden", is_featured: false },
  { id: 4, name: "Beans and Bubbles", tags: { connectivity: "wifi", noise: "moderate", environment: "air_conditioned", location: "outside_upv" }, rating: 4.6, reviews: 21, dist: "0.6 km", description: "A popular café just outside campus with strong wifi, good coffee, and a chill study atmosphere.", image_url: "https://placehold.co/600x400/EBE6D8/6B6355?text=Beans+%26+Bubbles", is_featured: false },
  { id: 5, name: "Chancellor's Park", tags: { connectivity: "no_wifi", noise: "quiet", environment: "outdoor", location: "inside_upv" }, rating: 3.9, reviews: 5, dist: "0.2 km", description: "An open park area near the Chancellor's office — quiet in the mornings, good for solo studying.", image_url: "https://placehold.co/600x400/B8D98A/2E6B3E?text=Chancellor%27s+Park", is_featured: false },
  { id: 6, name: "UPV Computer L3", tags: { connectivity: "wifi", noise: "silent", environment: "air_conditioned", location: "inside_upv" }, rating: 4.7, reviews: 19, dist: "0.5 km", description: "Third floor computer lab with reliable wifi, silent environment, and individual workstations.", image_url: "https://placehold.co/600x400/EBE6D8/0F2D1C?text=Computer+L3", is_featured: false },
  { id: 7, name: "Jollibee Miagao", tags: { connectivity: "wifi", noise: "noisy", environment: "air_conditioned", location: "outside_upv" }, rating: 3.5, reviews: 44, dist: "1.2 km", description: "The nearest Jollibee branch — not the quietest, but air-conditioned with free wifi and long hours.", image_url: "https://placehold.co/600x400/FAC775/633806?text=Jollibee+Miagao", is_featured: false },
  { id: 8, name: "Open Pavilion", tags: { connectivity: "no_wifi", noise: "moderate", environment: "outdoor", location: "inside_upv" }, rating: 4.0, reviews: 7, dist: "0.3 km", description: "A shaded outdoor pavilion on campus — good for group study sessions when the weather is nice.", image_url: "https://placehold.co/600x400/C0DD97/173404?text=Open+Pavilion", is_featured: false },
];



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
  return (
    <Link
      href={`/spot/${spot.id}`}
      className={`shrink-0 w-56 rounded-2xl border p-3 flex flex-col gap-2 hover:shadow-[#EBE6D8] transition bg-[#F5F2EA] ${active ? 'border-[#0F2D1C] border-2' : 'border-[#D4CCBA]'}`}
    >
      {/* Placeholder for spot photo -- TODO: fetch images from Supabase */}
      <div className="w-full h-32 rounded-xl bg-[#EBE6D8] flex items-center justify-center text-[#6B6355] text-xs overflow-hidden">
        [ photo ]
      </div>

      {/* Spot name */}
      <div className="text-sm font-bold text-[#2A241E]">{spot.name}</div>

      {/* Rating and distance */}
      <div className="flex items-center gap-1"> 
        <StarRating rating={spot.rating} />
        <span className="text-[10px] text-[#6B6355]">({spot.reviews} Reviews) · {spot.dist}</span>
      </div>

      {/* Tag pills — show first 3 tags only */}
      <div className="flex flex-wrap gap-1">
        {Object.values(spot.tags).slice(0, 3).map((val, i) => (
          <TagPill key={i} label={val} />
        ))}
      </div>
    </Link>
  );
}

// title: section heading, spots: array of spot objects
function HorizontalSection({ title, spots }) {
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
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedFilters, setSelectedFilters] = useState({});

  // TODO: replace with filtered data from Supabase based on activeFilter
  const featured = SPOTS[1];
  const topRated = [...SPOTS].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const nearby = [...SPOTS].sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist)).slice(0, 5);
  const recentlyAdded = SPOTS.slice(-4).reverse();
  const bestForStudying = SPOTS.filter(s => s.tags.noise === 'silent' && s.tags.connectivity === 'wifi');
  const outdoor = SPOTS.filter(s => s.tags.environment === 'outdoor');
  const hiddenGems = SPOTS.filter(s => s.rating >= 4.0 && s.reviews <= 8);

  return (
    <div className="min-h-screen bg-[#F5F2EA] overflow-y-auto pb-32">
      <div >

        {/* import Filterbar component */}
        <Filterbar
          selectedFilters={selectedFilters}
          onChange={setSelectedFilters}
          resultCount={SPOTS.length}
        />

        {/* Featured This Week  */}
        <div className="px-6 py-5 flex flex-col gap-8">
          <div className="flex flex-col">
            <SectionHeader title="Featured This Week" />
            {/* TODO: fetch featured spot from Supabase*/}

            <Link href={`/spot/${featured.id}`} className="flex h-70 bg-[#F5F2EA] border border-[#D4CCBA] rounded-2xl overflow-hidden hover:bg-[#EBE6D8] transition">
              { }
              <div className="w-[45%] h-70 bg-[#EBE6D8] flex items-center justify-center text-[#6B6355] text-xs shrink-0">
                [ photo ]
              </div>

              {/* Featured spot details -- TODO: replace with data from Supabase storage URL*/}
              <div className="flex flex-col justify-between p-5 flex-1">
                <div className="flex flex-col gap-2">
                  <div className="h-5 bg-[#6B6355] rounded w-full" />
                  <div className="flex items-center gap-1">
                    <StarRating rating={featured.rating} />
                    <span className="text-[10px] text-[#6B6355]">({featured.reviews} Reviews)</span>
                  </div>
                  <div className="h-3 bg-[#D4CCBA] rounded w-3/4" />
                  <div className="h-3 bg-[#D4CCBA] rounded w-2/3" />
                  <div className="h-3 bg-[#D4CCBA] rounded w-4/5" />
                </div>

                {/* CTA button */}
                <button className="w-full py-2 text-xs font-bold rounded-lg bg-[#C4811A] text-[#FFF8EC] hover:bg-[#E8A825] transition tracking-widest">
                  VIEW SPOT
                </button>
              </div>
            </Link>
          </div>
        

        
        {/* Top Rated — sorted by highest rating */}
        <HorizontalSection title="Top-Rated" spots={topRated} />

        {/* Nearest to You — sorted by distance */}
        <HorizontalSection title="Nearest to You" spots={nearby} />

        {/* Best for Studying — silent spots with wifi only */}
        {bestForStudying.length > 0 && <HorizontalSection title="Best for Studying" spots={bestForStudying} />}

        {/* Hidden Gems — high rating but low review count */}
        {hiddenGems.length > 0 && <HorizontalSection title="Hidden Gems" spots={hiddenGems} />}

        {/* Outdoor Spots — spots tagged as outdoor */}
        {outdoor.length > 0 && <HorizontalSection title="Outdoor Spots" spots={outdoor} />}

        {/* Recently Added — last 4 spots, swap with created_at sort from Supabase */}
        <HorizontalSection title="Recently Added" spots={recentlyAdded} />
      </div>
    </div>
    </div>
  );
}