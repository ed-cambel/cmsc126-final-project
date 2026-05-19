// study spot page - contains info about a specific study spot: name, location, hours, reviews, etc.
// redirects from discover page, can redirect to review page
// can be viewed by guest or user

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';

// ── Dummy spot data, replace with Supabase fetch using params.id later ──
const SPOT = {
  id: 1,
  name: 'Beans and Bubbles',
  rating: 4.5,
  reviews: 12,
  dist: '0.6 km',
  description: 'A cozy café perfect for studying or working remotely. Offers reliable WiFi, plenty of outlets, and a calm atmosphere. Known for their milk teas and sandwiches.',
  tags: ['WiFi', 'Moderate', 'Air Conditioned', 'Outside UPV', 'Indoor', 'Outlet'],
  images: [],
};

// ── Dummy reviews, replace with Supabase fetch later ──
const REVIEWS = [
  { id: 1, username: 'Username', rating: 4, body: 'Great place to study. The WiFi is fast and the drinks are good. Can get a bit noisy during lunch hours but overall a solid spot.' },
  { id: 2, username: 'Username', rating: 4.5, body: 'Love the vibe here. Aircon is strong and the staff are friendly. Would recommend for long study sessions.' },
  { id: 3, username: 'Username', rating: 3.5, body: 'Decent spot but limited seating. Go early to get a good table. The Spanish latte is worth trying.' },
];

// ── Renders star rating ──
function StarRating({ rating, interactive = false, onRate }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate && onRate(star)}
          className={`text-base ${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'} ${star <= Math.floor(rating) ? 'text-gray-700' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── Tag pill badge ──
function TagPill({ label }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
      {label}
    </span>
  );
}

export default function SpotPage() {
  // ── Review form state ──
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewImages, setReviewImages] = useState([]);

  // ── Handle review image upload, max 3 images ──
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(f => URL.createObjectURL(f));
    setReviewImages(prev => [...prev, ...urls].slice(0, 3));
  };

  // ── Handle review submission, replace with Supabase insert later ──
  const handleSubmitReview = () => {
    if (!reviewRating) return alert('Please select a rating.');
    if (!reviewText.trim()) return alert('Please write a review.');
    console.log({ rating: reviewRating, body: reviewText, images: reviewImages });
    alert('Review submitted!');
    setReviewRating(0);
    setReviewText('');
    setReviewImages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page header */}
      <div className="relative w-full flex items-center px-4 py-2.5 bg-white border-b border-gray-200">
        <Link href="/" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
          ← Back
        </Link>
      </div>

      <div className="flex gap-0 min-h-[calc(100vh-45px)]">

        {/* ── LEFT CONTENT ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5">

          {/* Hero image */}
          <div className="w-full h-56 rounded-xl bg-gray-200 flex items-center justify-center text-gray-300 text-sm overflow-hidden">
            {SPOT.images.length > 0
              ? <img src={SPOT.images[0]} className="w-full h-full object-cover" />
              : '[ photo ]'
            }
          </div>

          {/* Spot name */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black text-red-700 tracking-wide uppercase">{SPOT.name}</h1>

            {/* Rating and distance */}
            <div className="flex items-center gap-2">
              <StarRating rating={SPOT.rating} />
              <span className="text-xs text-gray-500">{SPOT.rating} ({SPOT.reviews} Reviews) · {SPOT.dist}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {SPOT.tags.map((tag, i) => <TagPill key={i} label={tag} />)}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed mt-1">{SPOT.description}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-300" />

          {/* Reviews section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-gray-700">Reviews ({REVIEWS.length})</h2>
            <div className="border-t border-dashed border-gray-300" />

            {REVIEWS.map(review => (
              <div key={review.id} className="flex flex-col gap-1.5 py-3 border-b border-gray-100 last:border-0">
                {/* Reviewer info */}
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="w-6 h-6 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-700">{review.username}</span>
                  <StarRating rating={review.rating} />
                </div>

                {/* Review body */}
                <p className="text-xs text-gray-500 leading-relaxed pl-8">{review.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL: Leave a Review ── */}
        <div className="w-[300px] flex-shrink-0 bg-gray-50 border-l border-gray-200 px-5 py-6 flex flex-col gap-4">

          <h2 className="text-sm font-black text-gray-800 tracking-widest uppercase text-center">Leave a Review</h2>

          {/* Image upload previews */}
          <div className="flex gap-2 flex-wrap">
            {reviewImages.map((src, i) => (
              <div key={i} className="relative w-16 h-16">
                <img src={src} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                <button
                  onClick={() => setReviewImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center"
                >✕</button>
              </div>
            ))}
          </div>

          {/* Upload button */}
          <label className="w-full py-2 text-xs font-semibold border border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition">
            + UPLOAD
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          </label>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Review form */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-gray-700">Review</h3>

            {/* Interactive star rating */}
            <StarRating rating={reviewRating} interactive onRate={setReviewRating} />

            {/* Review text */}
            <textarea
              placeholder="Write your review..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-gray-400 bg-white resize-none"
            />

            {/* Submit */}
            <button
              onClick={handleSubmitReview}
              className="w-full py-2.5 text-xs font-bold rounded-lg border border-gray-400 hover:bg-gray-800 hover:text-white transition"
            >
              SUBMIT REVIEW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}