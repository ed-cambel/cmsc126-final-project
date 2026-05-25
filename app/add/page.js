// add study spot page 
// redirects from main page, redirects to main page after submission
// can be viewed by guest or user

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

const supabase = createClient();

// constants for spot descriptors
const TAG_GROUPS = [
  { label: 'Connectivity', category: 'connectivity', values: ['wifi', 'no_wifi', 'outlet', 'no_outlet'] },
  { label: 'Noise', category: 'noise', values: ['silent', 'quiet', 'moderate', 'noisy'] },
  { label: 'Environment', category: 'environment', values: ['air_conditioned', 'outdoor'] },
  { label: 'Location', category: 'location', values: ['inside_upv', 'outside_upv'] }
];


export default function AddPage() {
  const router = useRouter();
  // state variable declarations for form inputs, tags, and images
  const [form, setForm] = useState({ name: '', address: '', description: '' });
  const [selectedTags, setSelectedTags] = useState({});
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  // error handling for forms
  const handleTagClick = (category, value) => {
    setSelectedTags(prev => {
      const updated = { ...prev };
      if (updated[category] === value) {
        delete updated[category];
      } else {
        updated[category] = value;
      }
      return updated;
    });
  };

  // image upload handler
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...urls].slice(0, 3));
  };

  // form submission handler
  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.name || !form.address) {
      newErrors.name = !form.name ? 'Name is required.' : '';
      newErrors.address = !form.address ? 'Address is required.' : '';
      setErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const {data: {user} } = await supabase.auth.getUser();

    const {error} = await supabase.from('spots').insert({
      name: form.name,
      address: form.address,
      description: form.description,
      added_by: user?.id,
      has_wifi: selectedTags.connectivity === 'wifi',
      has_outlets: selectedTags.connectivity === 'outlet',
      noise_level: selectedTags.noise,
      environment: selectedTags.environment,
      location_type: selectedTags.location,
      lat: 0,
      lng: 0 // TODO: integrate geocoding API to get lat/lang from address
    })

    if (error) {
      alert('Error submitting spot: ' + error.message);
      return;
    }

    console.log({ ...form, tags: selectedTags, images });
    alert('Submitted!');

    router.push('/'); // redirect to main page after submission
  };

  return (
    <div className="min-h-screen bg-[#F5F2EA]">
      <div className="w-full">

        {/* Header */}
        <div className='relative w-full flex items-center px-6 py-3 border-[#0F2D1C] bg-[#F5F2EA] border-b-2 '>
          <Link href="/" className='flex items-center gap-1 text-base font-medium text-[#0F2D1C] hover:text-[#C4811A] transition'>
            <ChevronLeftIcon className='w-6 h-6' /> Back
          </Link>
          <h1 className='text-xl font-bold text-[#0F2D1C] absolute left-1/2 -translate-x-1/2 tracking-wide uppercase'>Add a Study Spot</h1>
        </div>

        <div className="flex flex-1 gap-6 px-6 py-6 style={{ minHeight: 'calc(100vh - 57px)' }">
          {/* Left Column */}
          <div className="w-[50%] flex flex-col gap-4">

            {/* Location Name */}
            <div>
              <label className="text-xs font-bold text-[#0F2D1C] mb-1 block uppercase tracking-wider">
                Location Name <span className="text-[#B33A1A]">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Eg. Campus Union Building - TLRC"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className={`w-full px-3 py-2 text-sm rounded-lg border outline-none focus:border-[#0F2D1C] bg-white text-[#0F2D1C] placeholder-[#D4CCBA] transition ${errors.name ? 'border-[#B33A1A] border-2' : 'border-[#D4CCBA]'}`}
              />
              {errors.name && <p className="text-xs text-[#B33A1A] mt-1">{errors.name}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-bold text-[#0F2D1C] mb-1 block uppercase tracking-wider">
                Address <span className="text-[#B33A1A]">*</span>
              </label>
              <input
                required
                type="text"
                value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className={`w-full px-3 py-2 text-sm rounded-lg border outline-none focus:border-[#0F2D1C] bg-white text-[#0F2D1C] placeholder-[#D4CCBA] transition ${errors.address ? 'border-[#B33A1A] border-2' : 'border-[#D4CCBA]'}`}
              />
              {errors.address && <p className="text-xs text-[#B33A1A] mt-1">{errors.address}</p>}
            </div>

            {/* Pin on map -- TODO: implement Leaflet API here*/}

            <div className="w-full flex-1 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400 bg-white">
              [ Pin on map placeholder ]
            </div>

            {/* Description */}
            <div className='flex-1 flex flex-col'>
              <label className="text-xs font-bold text-[#0F2D1C] mb-1 block uppercase tracking-wider">Description</label>
              <textarea
                placeholder="Describe the spot..."
                value={form.description}
                rows={4}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4CCBA] outline-none focus:border-[#0F2D1C] bg-white text-[#0F2D1C] placeholder:[#D4CCBA] resize-none transition"
              />
            </div>
          </div>

          {/* Right Columns */}
          <div className="w-[50%] flex flex-col bg-[#0F2D1C] border border-[#c5e08a] rounded-2xl p-5 gap-4">

            {/* Descriptors for page */}
            {TAG_GROUPS.map(({ label, category, values }) => (
              <div key={category}>
                <div className="text-[#CFA000] text-[10px] uppercase tracking-widest font-bold rounded-lg mb-2">
                  {label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {values.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleTagClick(category, val)}
                      className={`px-3 py-1 text-[10px] font-semibold rounded-full border transition uppercase tracking-wide ${selectedTags[category] === val
                        ? 'bg-[#CFA000] text-[#0F2D1C] border-[#CFA000]'
                        : 'bg-transparent text-[#D4CCBA] border-[#1E4A2A] hover:border-[#D4CCBA]'}`}
                    >
                      {val.replace(/_/g, ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="border-t border-[#1E4A2A]" />

            {/* Photo Uploader */}
            <div>
              <div className="text-[#CFA000] text-[10px] font-bold uppercase tracking-widest mb-2">
                Photos
              </div>
              <div className="flex gap-2 flex-wrap">
                <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-[#1E4A2A] rounded-lg cursor-pointer hover:border-[#D4CCBA] transition text-[#D4CCBA] text-xl">
                  +
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
                {images.map((src, i) => (
                  <div key={i} className="relative w-16 h-16">
                    <Image src={src} alt="" fill className="object-cover rounded-lg border border-[#1E4A2A]" />
                    <button
                      onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#B33A1A] text-white rounded-full text-[10px] flex items-center justify-center"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit -- TODO: onCLick - data should be add to database */}
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-auto w-full py-2.5 text-sm font-bold rounded-xl bg-[#C4811A] text-[#F5F2EA] hover:bg-[#CFA000] hover:text-[#0F2D1C] transition-all duration-200 uppercase tracking-widest flex items-center justify-center gap-2 group"
            >
              SUBMIT STUDY SPOT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}