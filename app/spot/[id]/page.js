// study spot page - contains info about a specific study spot: name, location, hours, reviews, etc.
// redirects from discover page, can redirect to review page
// can be viewed by guest or user
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { UserCircleIcon, ChevronLeftIcon, MapPinIcon, ClockIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const STORAGE_BASE_URL = "https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/photos/";

const FILTER_DEFS = [
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

function getFilterLabel(category, value) {
  if (!value) return '';
  const normalizedValue = String(value).toLowerCase().trim();
  const def = FILTER_DEFS.find(d => d.category === category && d.value === normalizedValue);
  return def ? def.label : normalizedValue.replace(/_/g, ' ').toUpperCase();
}

function StarRating({ rating, interactive = false, onRate }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate && onRate(star)}
          className={`text-lg ${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'} ${star <= Math.floor(rating) ? 'text-[#CFA000]' : 'text-[#2E6B3E]'}`}
        >★</button>
      ))}
    </div>
  );
}

function TagPill({ label }) {
  return (
    <span className="text-[10px] px-3 py-1 rounded-full bg-[#F5F2EA] text-[#0F2D1C] border border-[#0F2D1C] font-bold uppercase tracking-wider">
      {label}
    </span>
  );
}

export default function SpotPage() {
  const { id } = useParams();
  const router = useRouter();

  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        const { data: spotData, error: spotError } = await supabase
          .from('spots')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (spotError || !spotData) {
          setLoading(false);
          return;
        }

        // check if bookmarked
        if (currentUser) {
          const { data: savedData } = await supabase
            .from('saved_spots')
            .select('spot_id')
            .eq('user_id', currentUser.id)
            .eq('spot_id', id)
            .maybeSingle();
          setBookmarked(!!savedData);
        }

        const { data: photosData } = await supabase
          .from('photos')
          .select('storage_url')
          .eq('spot_id', id);

        const { data: statsData } = await supabase
          .from('spots_with_stats')
          .select('computed_rating, computed_review_count')
          .eq('id', id)
          .maybeSingle();

        setSpot({
          ...spotData,
          computed_rating: statsData?.computed_rating ?? spotData.rating ?? 0,
          computed_review_count: statsData?.computed_review_count ?? spotData.review_count ?? 0,
          photos: photosData || []
        })

        const { data: reviewData, error: reviewError } = await supabase
          .from('reviews')
          .select(`*, profiles(username, avatar_url)`)
          .eq('spot_id', id)
          .order('created_at', { ascending: false });

        console.log('reviews:', reviewData);
        console.log('review error:', reviewError);

        setReviews(reviewData || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!user) { router.push('/login'); return; }
    if (!reviewRating) return alert('Please select a rating.');
    if (!reviewText.trim()) return alert('Please write a review.');

    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      spot_id: id,
      user_id: user.id,
      stars: reviewRating,
      body: reviewText,
    });

    if (error) {
      alert('Error: ' + error.message);
      setSubmitting(false);
      return;
    }

    // refresh reviews
    const { data: reviewData } = await supabase
      .from('reviews')
      .select(`*, profiles(username, avatar_url)`)
      .eq('spot_id', id)
      .order('created_at', { ascending: false });

    setReviews(reviewData || []);

    // refresh stats
    const { data: statsData } = await supabase
      .from('spots_with_stats')
      .select('computed_rating, computed_review_count')
      .eq('id', id)
      .maybeSingle();

    setSpot(prev => ({
      ...prev,
      computed_rating: statsData?.computed_rating ?? prev.computed_rating,
      computed_review_count: statsData?.computed_review_count ?? prev.computed_review_count,
    }));

    setReviews(reviewData || []);
    setReviewRating(0);
    setReviewText('');
    setSubmitting(false);
  };

  const handleBookmark = async () => {
    if (!user) { router.push('/login'); return; }
    setBookmarking(true);

    if (bookmarked) {
      await supabase
        .from('saved_spots')
        .delete()
        .eq('user_id', user.id)
        .eq('spot_id', id);
      setBookmarked(false);
    } else {
      await supabase
        .from('saved_spots')
        .insert({ user_id: user.id, spot_id: id });
      setBookmarked(true);
    }
    setBookmarking(false);
  };

  const tags = spot ? [
    spot.has_wifi ? 'WiFi' : 'No WiFi',
    spot.has_outlets ? 'Outlet' : null,
    spot.noise_level ? getFilterLabel('noise', spot.noise_level) : null,
    spot.environment ? getFilterLabel('environment', spot.environment) : null,
    spot.location_type ? getFilterLabel('location', spot.location_type) : null,
  ].filter(Boolean) : [];

  const resolveUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${STORAGE_BASE_URL}${path}`;
  };

  const primaryPhoto = resolveUrl(spot?.photos?.[0]?.storage_url);

  if (loading) return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center text-sm text-[#0F2D1C]">
      Loading...
    </div>
  );

  if (!spot) return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center text-sm text-[#B33A1A]">
      Spot not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F2EA]">

      {/* Header */}
      <div className="relative w-full flex items-center px-6 py-3 border-[#0F2D1C] bg-[#F5F2EA] border-b-2 shrink-0 z-10">
        <Link href="/" className='flex items-center gap-1 text-base font-medium text-[#0F2D1C] hover:text-[#C4811A] transition'>
          <ChevronLeftIcon className='w-6 h-6' /> Back
        </Link>
        
        <h1 className="text-xl font-bold text-[#0F2D1C] absolute left-1/2 -translate-x-1/2 tracking-wide uppercase">
          {spot.name}
        </h1>

        <button
          onClick={handleBookmark}
          disabled={bookmarking}
          className="ml-auto flex items-center gap-1 text-[#0F2D1C] hover:text-[#C4811A] transition disabled:opacity-50"
        >
          {bookmarked
            ? <BookmarkSolidIcon className="w-6 h-6 text-[#C4811A]" />
            : <BookmarkIcon className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex h-[calc(100vh-49px)]">

        {/* LEFT */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">

          {/* Hero */}
          <div className="shrink-0 w-full h-75 rounded-2xl bg-[#EBE6D8] flex items-center justify-center text-[#D4CCBA] text-sm overflow-hidden shadow-sm">
            {primaryPhoto
              ? <img src={primaryPhoto} alt={spot.name} className="w-full h-full object-cover" />
              : <span className="italic">[ no photo available ]</span>}
          </div>

          {/* Spot info */}
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-black text-[#0F2D1C] tracking-wide uppercase">{spot.name}</h1>

            <div className="flex items-center gap-3">
              <StarRating rating={spot.computed_rating ?? 0} />
              <span className="text-sm text-[#6B6355] font-semibold">
                {spot.computed_rating ? Number(spot.computed_rating).toFixed(1) : '—'}
              </span>
              <span className="text-xs text-[#D4CCBA]">·</span>
              <span className="text-xs text-[#6B6355]">{spot.computed_review_count ?? 0} reviews</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => <TagPill key={i} label={tag} />)}
            </div>

            {spot.address && (
              <div className="flex items-center gap-1.5 text-xs text-[#6B6355]">
                <MapPinIcon className="w-4 h-4 text-[#C4811A] shrink-0" />
                {spot.address}
              </div>
            )}

            {spot.opening_hours && (
              <div className="flex items-center gap-1.5 text-xs text-[#6B6355]">
                <ClockIcon className="w-4 h-4 text-[#C4811A] shrink-0" />
                {spot.is_24hr
                  ? 'Open 24/7'
                  : `${spot.opening_hours.open ?? '?'} — ${spot.opening_hours.close ?? '?'}`}
                {spot.opening_hours.days?.length > 0 && ` · ${spot.opening_hours.days.join(', ')}`}
              </div>
            )}

            {spot.description && (
              <p className="text-sm text-[#6B6355] leading-relaxed border-t border-[#D4CCBA] pt-3">
                {spot.description}
              </p>
            )}
          </div>

          {/* Photo gallery */}
          {spot.photos?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {spot.photos.map((photo, i) => (
                <img
                  key={i}
                  src={resolveUrl(photo.storage_url)}
                  alt=""
                  className="w-36 h-24 object-cover rounded-xl shrink-0 border border-[#D4CCBA]"
                />
              ))}
            </div>
          )}

          <div className="border-t border-dashed border-[#D4CCBA]" />

          {/* Reviews list */}
          <div className="flex flex-col gap-4 pb-8">
            <h2 className="text-sm font-black text-[#0F2D1C] tracking-widest uppercase flex items-center gap-2">
              <span className="w-1 h-4 bg-[#C4811A] rounded-full inline-block" />
              Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <p className="text-xs text-[#6B6355] italic">No reviews yet — be the first!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="flex flex-col gap-2 py-4 border-b border-[#EBE6D8] last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#D4CCBA] flex items-center justify-center">
                      <UserCircleIcon className="w-6 h-6 text-[#0F2D1C]" />
                    </div>
                    <span className="text-xs font-bold text-[#0F2D1C]">
                      {review.profiles?.username ?? 'Anonymous'}
                    </span>
                    <StarRating rating={review.stars} />
                  </div>
                  <p className="text-xs text-[#6B6355] leading-relaxed pl-9">{review.body}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[360px] flex-shrink-0 bg-[#0F2D1C] border-l border-[#1E4A2A] px-6 py-8 flex flex-col gap-6 overflow-y-auto">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-black text-[#CFA000] tracking-widest uppercase text-center">
              Leave a Review
            </h2>
            <div className="h-px bg-[#1E4A2A] w-full" />
          </div>

          {!user ? (
            <div className="flex flex-col gap-4 items-center text-center mt-4">
              <UserCircleIcon className="w-12 h-12 text-[#2E6B3E]" />
              <p className="text-sm text-[#D4CCBA]">You need to be logged in to leave a review.</p>
              <Link
                href="/login"
                className="w-full py-3 text-sm font-bold rounded-xl bg-[#C4811A] text-[#F5F2EA] hover:bg-[#CFA000] hover:text-[#0F2D1C] transition text-center uppercase tracking-widest"
              >
                Log In
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">Your Rating</h3>
                <div className="bg-[#1E4A2A] rounded-xl p-3 flex items-center justify-center">
                  <StarRating rating={reviewRating} interactive onRate={setReviewRating} />
                </div>
                {reviewRating > 0 && (
                  <p className="text-xs text-[#8FBB9E] text-center">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">Your Review</h3>
                <textarea
                  placeholder="Share your experience with this spot..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-[#1E4A2A] outline-none focus:border-[#CFA000] bg-[#1E4A2A] text-[#F5F2EA] placeholder-[#4A7C59] resize-none transition"
                />
                <p className="text-[10px] text-[#4A7C59] text-right">{reviewText.length} chars</p>
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full py-3 text-sm font-bold rounded-xl bg-[#C4811A] text-[#F5F2EA] hover:bg-[#CFA000] hover:text-[#0F2D1C] transition-all duration-200 uppercase tracking-widest disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}