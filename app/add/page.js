// add study spot page 
// redirects from main page, redirects to main page after submission
// can be viewed by guest or user

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon } from '@heroicons/react/24/outline'


// constants for spot descriptors
const TAG_GROUPS = [
  { label: 'Connectivity', category: 'connectivity', values: ['wifi', 'no_wifi', 'outlet', 'no_outlet'] },
  { label: 'Noise', category: 'noise', values: ['silent', 'quiet', 'moderate', 'noisy'] },
  { label: 'Environment', category: 'environment', values: ['air_conditioned', 'outdoor'] },
  { label: 'Location', category: 'location', values: ['inside_upv', 'outside_upv'] }
];


export default function AddPage() {
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
  const handleSubmit = () => {
    if (!form.name || !form.address) {
      alert('Name and address are required.');
      return;
    }
    console.log({ ...form, tags: selectedTags, images });
    alert('Submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">

        {/* Header */}
        <div className='relative w-full flex items-center px-4 py-2.5 bg-white border-b border-gray-200'>
          <Link href="/spot/123" className='flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700'>
            <ChevronLeftIcon className='w-5 h-5' /> Back
          </Link>
          <h1 className='text-[32px] font-semibold absolute left-1/2 -translate-x-1/2'>Add a Study Spot</h1>
        </div>

        <div className="flex gap-6 px-6 py-6">
          {/* Left Column */}
          <div className="w-[50%] flex flex-col gap-4">

            {/* Location Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Eg. TLRC"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.name ? 'border-red-400' : 'border-gray-300'} outline-none focus:border-[#8abe5a] bg-white`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.address ? 'border-red-400' : 'border-gray-300'} outline-none focus:border-[#8abe5a] bg-white`}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* Pin on map -- TODO: implement Leaflet API here*/}

            <div className="w-full flex-1 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400 bg-white">
              [ Pin on map placeholder ]
            </div>

            {/* Description */}
            <div className='flex-1 flex flex-col'>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
              <textarea
                placeholder="Describe the spot..."
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-[#8abe5a] bg-white resize-none"
              />
            </div>
          </div>

          {/* Right Columns */}
          <div className="w-[50%] flex-1 bg-[#f0f7e0] border border-[#c5e08a] rounded-2xl p-4 flex flex-col gap-4">

            {/* Descriptors for page */}
            {TAG_GROUPS.map(({ label, category, values }) => (
              <div key={category}>
                <div className="bg-[#a0c840] text-white text-xs font-bold px-3 py-1.5 rounded-lg mb-2">
                  {label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {values.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleTagClick(category, val)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition ${selectedTags[category] === val
                        ? 'bg-[#6a9e20] text-white border-[#6a9e20]'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                    >
                      {val.replace(/_/g, ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Photo Uploader */}
            <div>
              <div className="bg-[#a0c840] text-white text-xs font-bold px-3 py-1.5 rounded-lg mb-2">
                Photos
              </div>
              <div className="flex gap-2 flex-wrap">
                <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white transition text-gray-400 text-xl">
                  +
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
                {images.map((src, i) => (
                  <div key={i} className="relative w-16 h-16">
                    <Image src={src} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                    <button
                      onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit -- TODO: onCLick - data should be add to database */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 text-sm font-semibold rounded-xl border border-[#a0c840] text-[#4a7a10] hover:bg-[#a0c840] hover:text-white transition"
            >
              SUBMIT STUDY SPOT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}