// discover page - can see listings of different study spots
// redirects from main page, can redirect to individual spot pages
// can be viewed by guest or user

'use client';
import { useState } from 'react';
import Link from 'next/link';

// ── Static spot data, replace with Supabase fetch later ──
const SPOTS = [
  { id: 1, name: "ICS Lobby", tags: { connectivity: "wifi", noise: "moderate", environment: "air_conditioned", location: "inside_upv" }, rating: 4.5, reviews: 12, dist: "0.1 km" },
  { id: 2, name: "Main Library", tags: { connectivity: "wifi", noise: "silent", environment: "air_conditioned", location: "inside_upv" }, rating: 4.8, reviews: 34, dist: "0.3 km" },
  { id: 3, name: "AS Garden", tags: { connectivity: "no_wifi", noise: "quiet", environment: "outdoor", location: "inside_upv" }, rating: 4.2, reviews: 8, dist: "0.4 km" },
  { id: 4, name: "Café Morado", tags: { connectivity: "wifi", noise: "moderate", environment: "air_conditioned", location: "outside_upv" }, rating: 4.6, reviews: 21, dist: "0.6 km" },
  { id: 5, name: "SOLAIR Benches", tags: { connectivity: "no_wifi", noise: "quiet", environment: "outdoor", location: "inside_upv" }, rating: 3.9, reviews: 5, dist: "0.2 km" },
  { id: 6, name: "Engineering Reading Room", tags: { connectivity: "wifi", noise: "silent", environment: "air_conditioned", location: "inside_upv" }, rating: 4.7, reviews: 19, dist: "0.5 km" },
  { id: 7, name: "Jollibee Miagao", tags: { connectivity: "wifi", noise: "noisy", environment: "air_conditioned", location: "outside_upv" }, rating: 3.5, reviews: 44, dist: "1.2 km" },
  { id: 8, name: "Open Pavilion", tags: { connectivity: "no_wifi", noise: "moderate", environment: "outdoor", location: "inside_upv" }, rating: 4.0, reviews: 7, dist: "0.3 km" },
];

// ── Quick filter options shown at the top of the page ──
const QUICK_FILTERS = ['All', 'WiFi', 'Silent', 'Outdoor', 'Air Conditioned'];

// ── Renders a star rating string based on a numeric rating ──
function StarRating({ rating }) {
  return (
    <span className="text-xs text-gray-500">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))} {rating}
    </span>
  );
}

// ── Small pill badge for a single spot tag ──
function TagPill({ label }) {
  return (
    <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
      {label.replace(/_/g, ' ').toUpperCase()}
    </span>
  );
}

// ── Section header with red title and a divider line ──
function SectionHeader({ title }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <h2 className="text-sm font-black text-red-700 tracking-widest uppercase">{title}</h2>
      <div className="h-px bg-gray-200 w-full" />
    </div>
  );
}

// ── Individual spot card used in horizontal scroll sections ──
// active prop highlights the first card with a purple border
function SpotCard({ spot, active }) {
  return (
    <Link
      href={`/spot/${spot.id}`}
      className={`flex-shrink-0 w-56 rounded-2xl border p-3 flex flex-col gap-2 hover:shadow-md transition bg-white ${active ? 'border-purple-400 border-2' : 'border-gray-200'}`}
    >
      {/* Placeholder for spot photo */}
      <div className="w-full h-32 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 text-xs overflow-hidden">
        [ photo ]
      </div>

      {/* Spot name */}
      <div className="text-sm font-bold text-gray-800">{spot.name}</div>

      {/* Rating and distance */}
      <div className="flex items-center gap-1">
        <StarRating rating={spot.rating} />
        <span className="text-[10px] text-gray-400">({spot.reviews} Reviews) · {spot.dist}</span>
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

// ── Reusable horizontally scrollable section ──
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
  // ── Active quick filter state ──
  const [activeFilter, setActiveFilter] = useState('All');

  // ── Derived spot lists for each section ──
  const featured = SPOTS[1]; // single featured spot, swap with a flagged DB field later
  const topRated = [...SPOTS].sort((a, b) => b.rating - a.rating).slice(0, 5); // top 5 by rating
  const nearby = [...SPOTS].sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist)).slice(0, 5); // top 5 closest
  const recentlyAdded = SPOTS.slice(-4).reverse(); // last 4 added, swap with created_at sort later
  const bestForStudying = SPOTS.filter(s => s.tags.noise === 'silent' && s.tags.connectivity === 'wifi'); // silent + wifi
  const outdoor = SPOTS.filter(s => s.tags.environment === 'outdoor'); // outdoor environment tag
  const hiddenGems = SPOTS.filter(s => s.rating >= 4.0 && s.reviews <= 8); // high rated, few reviews

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto pb-32">
      <div className="px-6 py-5 flex flex-col gap-8">

        {/* Quick filter pill buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full border transition ${activeFilter === f
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Featured This Week — large hero card with photo on the left */}
        <div className="flex flex-col">
          <SectionHeader title="Featured This Week" />
          <Link href={`/spot/${featured.id}`} className="flex bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition">
            {/* Featured photo placeholder */}
            <div className="w-[45%] h-52 bg-gray-100 flex items-center justify-center text-gray-300 text-xs flex-shrink-0">
              [ photo ]
            </div>

            {/* Featured spot details */}
            <div className="flex flex-col justify-between p-5 flex-1">
              <div className="flex flex-col gap-2">
                <div className="h-5 bg-gray-800 rounded w-full" />
                <div className="flex items-center gap-1">
                  <StarRating rating={featured.rating} />
                  <span className="text-[10px] text-gray-400">({featured.reviews} Reviews)</span>
                </div>
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>

              {/* CTA button */}
              <button className="w-full py-2 text-xs font-bold rounded-lg bg-yellow-200 text-yellow-800 hover:bg-yellow-300 transition tracking-widest">
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
  );
}