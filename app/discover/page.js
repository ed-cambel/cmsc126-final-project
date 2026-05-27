// discover page - can see listings of different study spots
// redirects from main page, can redirect to individual spot pages
// can be viewed by guest or user

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Filterbar from '@/components/Filterbar';
import { createClient } from '@/lib/supabase/client';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

const supabase = createClient();

const FILTER_DEFS = [
  { category: "connectivity", value: "wifi", label: "WIFI" },
  { category: "connectivity", value: "no_wifi", label: "NO WIFI" },
  { category: "connectivity", value: "outlet", label: "OUTLET" },
  { category: "connectivity", value: "no_outlet", label: "NO OUTLET" },
  { category: "noise", value: "silent", label: "SILENT" },
  { category: "noise", value: "quiet", label: "QUIET" },
  { category: "noise", value: "moderate", label: "MODERATE" },
  { category: "noise", value: "noisy", label: "NOISY" },
  { category: "environment", value: "air_conditioned", label: "AIR CONDITIONED" },
  { category: "environment", value: "non_air_conditioned", label: "NON-AIR CONDITIONED" },
  { category: "environment", value: "indoor", label: "INDOOR" },
  { category: "environment", value: "outdoor", label: "OUTDOOR" },
  { category: "location", value: "inside_upv", label: "INSIDE UPV" },
  { category: "location", value: "outside_upv", label: "OUTSIDE UPV" },
];

// 🛠️ FIXED: Normalized string lookups to catch case variations from Database Views
function getFilterLabel(category, value) {
  if (!value) return '';
  const normalizedValue = String(value).toLowerCase().trim();

  const def = FILTER_DEFS.find(d => d.category === category && d.value === normalizedValue);
  return def ? def.label : normalizedValue.replace(/_/g, ' ').toUpperCase();
}

// makes a star rating string based on a numeric rating
function StarRating({ rating }) {
  const numericRating = Number(rating) || 0;
  return (
    <span className="text-xs text-[#C4811A]">
      {'★'.repeat(Math.floor(numericRating))}
      {'☆'.repeat(5 - Math.floor(numericRating))}
      <span className='text-[#6B6355] ml-1'>{numericRating.toFixed(1)}</span>
    </span>
  );
}

// descriptor tags
function TagPill({ label, dark }) {
  return (
    <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-wide whitespace-nowrap uppercase border ${dark
      ? 'bg-[#0F2D1C] text-[#F5F2EA] border-[#1E4A2A]'
      : 'bg-[#F5F2EA] text-[#0F2D1C] border-[#0F2D1C]'
      }`}>
      {label}
    </span>
  );
}

// section header for each category
function SectionHeader({ title }) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <h2 className="text-base font-black text-[#0F2D1C] tracking-widest uppercase flex items-center gap-2">
        <span className="w-1 h-4 bg-[#C4811A] rounded-full inline-block"></span>
        {title}
      </h2>
      <div className="h-px bg-[#D4CCBA] w-full" />
    </div>
  );
}

// card component for each spot in each category
function SpotCard({ spot, savedIds, onBookmark }) {
  const [hovered, setHovered] = useState(false);
  const isBookmarked = savedIds?.has(spot.id);
  const tags = [
    (spot.has_wifi === true || String(spot.has_wifi) === 'true') ? getFilterLabel('connectivity', 'wifi') : null,
    (spot.has_outlets === true || String(spot.has_outlets) === 'true') ? getFilterLabel('connectivity', 'outlet') : null,
    spot.noise_level ? getFilterLabel('noise', spot.noise_level) : null,
    spot.environment ? getFilterLabel('environment', spot.environment) : null,
    spot.location_type ? getFilterLabel('location', spot.location_type) : null
  ].filter(Boolean);

  const displayImage = spot.photos?.[0]?.storage_url;

  return (
    <Link
      href={`/spot/${spot.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="shrink-0 w-56 h-64 rounded-2xl border border-[#D4CCBA] p-3 flex flex-col gap-2 transition bg-[#F5F2EA] hover:bg-[#1E4A2A] hover:border-[#0F2D1C] hover:shadow-lg relative"
    >
      {/* Bookmark button */}
      <button
        onClick={e => onBookmark(e, spot.id)}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-[#0F2D1C] flex items-center justify-center shadow hover:bg-[#1E4A2A] transition"
      >
        {isBookmarked
          ? <BookmarkSolidIcon className="w-4 h-4 text-[#CFA000]" />
          : <BookmarkIcon className="w-4 h-4 text-[#D4CCBA]" />}
      </button>

      <div className="w-full h-32 rounded-xl bg-[#EBE6D8] flex items-center justify-center text-[#6B6355] text-xs overflow-hidden shrink-0">
        {displayImage
          ? <img src={displayImage} alt={spot.name} className="w-full h-full object-cover" />
          : <span className="italic">[ no photo ]</span>}
      </div>

      <div className={`text-sm font-bold truncate ${hovered ? 'text-[#F5F2EA]' : 'text-[#2A241E]'}`}>{spot.name}</div>

      <div className="flex items-center gap-1">
        <StarRating rating={spot.computed_rating ?? spot.rating} />
        <span className={`text-[10px] ${hovered ? 'text-[#D4CCBA]' : 'text-[#6B6355]'}`}>
          ({spot.computed_review_count ?? spot.review_count ?? 0} reviews)
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mt-auto">
        {tags.slice(0, 3).map((val, i) => <TagPill key={i} label={val} dark={hovered} />)}
      </div>
    </Link>
  );
}

// title: section heading, spots: array of spot objects
function HorizontalSection({ title, spots, savedIds, onBookmark }) {
  if (!spots || spots.length === 0) return null;
  return (
    <div className="flex flex-col">
      <SectionHeader title={title} />
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {spots.map(spot => (
          <SpotCard key={spot.id} spot={spot} savedIds={savedIds} onBookmark={onBookmark} />
        ))}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const [spots, setSpots] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [savedIds, setSavedIds] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('spots_with_stats')
        .select(`
          *,
          photos (
            storage_url
          )
        `);

      if (error) {
        console.error('Error fetching spots:', error);
        setLoading(false);
        return;
      }

      setSpots(data || []);

      // checks if spot is bookmarked by current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: savedData } = await supabase
          .from('saved_spots')
          .select('spot_id')
          .eq('user_id', user.id);
        setSavedIds(new Set(savedData?.map(s => s.spot_id) ?? []));
        setCurrentUser(user);
      }

      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      let { data: featuredData } = await supabase
        .from('spots_with_stats')
        .select(`*, photos (storage_url)`)
        .gte('created_at', lastWeek)
        .order('computed_rating', { ascending: false })
        .limit(1);

      if (!featuredData || featuredData.length === 0) {
        const { data: fallback } = await supabase
          .from('spots_with_stats')
          .select(`*, photos (storage_url)`)
          .order('computed_rating', { ascending: false })
          .limit(1);
        featuredData = fallback;
      }

      setFeatured(featuredData?.[0] ?? null);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleBookmark = async (e, spotId) => {
    e.preventDefault(); // prevent Link navigation
    if (!currentUser) { router.push('/login'); return; }

    if (savedIds.has(spotId)) {
      await supabase
        .from('saved_spots')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('spot_id', spotId);
      setSavedIds(prev => { const next = new Set(prev); next.delete(spotId); return next; });
    } else {
      await supabase
        .from('saved_spots')
        .insert({ user_id: currentUser.id, spot_id: spotId });
      setSavedIds(prev => new Set(prev).add(spotId));
    }
  };

  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      // 🛠️ FIXED: Normalizing filter matching to handle subtle data variations
      if (selectedFilters.noise && String(spot.noise_level).toLowerCase() !== String(selectedFilters.noise).toLowerCase()) return false;
      if (selectedFilters.environment && String(spot.environment).toLowerCase() !== String(selectedFilters.environment).toLowerCase()) return false;
      if (selectedFilters.location && String(spot.location_type).toLowerCase() !== String(selectedFilters.location).toLowerCase()) return false;
      if (selectedFilters.wifi && !spot.has_wifi) return false;
      if (selectedFilters.outlets && !spot.has_outlets) return false;
      return true;
    });
  }, [spots, selectedFilters]);

  // Decoupled row arrays using useMemo
  const topRated = useMemo(() => [...filteredSpots].sort((a, b) => (b.computed_rating ?? 0) - (a.computed_rating ?? 0)).slice(0, 5), [filteredSpots]);
  const recentlyAdded = useMemo(() => [...filteredSpots].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5), [filteredSpots]);
  const bestForStudying = useMemo(() => filteredSpots.filter(s => String(s.noise_level).toLowerCase() === 'silent' && s.has_wifi), [filteredSpots]);
  const hiddenGems = useMemo(() => filteredSpots.filter(s => (s.computed_rating ?? s.rating ?? 0) >= 4.0 && (s.computed_review_count ?? s.review_count ?? 0) <= 8), [filteredSpots]);
  const outdoor = useMemo(() => filteredSpots.filter(s => String(s.environment).toLowerCase() === 'outdoor'), [filteredSpots]);

  const featuredImage = featured?.photos?.[0]?.storage_url;

  return (
    <div className="min-h-screen bg-[#F5F2EA] overflow-y-auto pb-32">
      <div>
        <Filterbar
          selectedFilters={selectedFilters}
          onChange={setSelectedFilters}
          resultCount={filteredSpots.length}
        />

        {/* Featured This Week */}
        <div className="px-6 py-5 flex flex-col gap-8">
          <div className="flex flex-col">
            <SectionHeader title="Featured This Week" />
            {loading ? (
              <div className="h-70 bg-[#EBE6D8] rounded-2xl animate-pulse" />
            ) : featured ? (
              <Link href={`/spot/${featured.id}`} className="flex h-70 bg-[#F5F2EA] border border-[#D4CCBA] rounded-2xl overflow-hidden hover:bg-[#EBE6D8] transition">
                <div className="w-[45%] h-70 bg-[#EBE6D8] flex items-center justify-center text-[#6B6355] text-xs shrink-0 overflow-hidden relative">
                  {featuredImage ? (
                    <img src={featuredImage} alt={featured.name} className="w-full h-full object-cover" />
                  ) : (
                    '[ no photo ]'
                  )}
                </div>
                <div className="flex flex-col justify-between p-5 flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="text-base font-bold text-[#0F2D1C]">{featured.name}</div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={featured.computed_rating ?? featured.rating} />
                      <span className="text-[10px] text-[#6B6355]">({featured.computed_review_count ?? featured.review_count ?? 0} reviews)</span>
                    </div>
                    <p className="text-xs text-[#6B6355] line-clamp-3">{featured.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {[
                        featured.has_wifi ? getFilterLabel('connectivity', 'wifi') : null,
                        featured.noise_level ? getFilterLabel('noise', featured.noise_level) : null,
                        featured.environment ? getFilterLabel('environment', featured.environment) : null,
                        featured.location_type ? getFilterLabel('location', featured.location_type) : null,
                      ].filter(Boolean).slice(0, 3).map((tag, i) => (
                        <TagPill key={i} label={tag} />
                      ))}
                    </div>
                  </div>
                  <button type="button" className="w-full py-2 text-xs font-bold rounded-lg bg-[#C4811A] text-[#F5F2EA] hover:bg-[#CFA000] hover:text-[#0F2D1C] transition tracking-widest uppercase">
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
              <HorizontalSection title="Top-Rated" spots={topRated} savedIds={savedIds} onBookmark={handleBookmark} />
              <HorizontalSection title="Recently Added" spots={recentlyAdded} savedIds={savedIds} onBookmark={handleBookmark} />
              <HorizontalSection title="Best for Studying" spots={bestForStudying} savedIds={savedIds} onBookmark={handleBookmark} />
              <HorizontalSection title="Hidden Gems" spots={hiddenGems} savedIds={savedIds} onBookmark={handleBookmark} />
              <HorizontalSection title="Outdoor Spots" spots={outdoor} savedIds={savedIds} onBookmark={handleBookmark} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}