'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

const supabase = createClient();

const AddSpotMap = dynamic(() => import("@/components/add_map"), {
  loading: () => <div className="text-xs text-gray-400 p-4">Loading map canvas...</div>,
  ssr: false,
});

const TAG_GROUPS = [
  { label: 'Connectivity', category: 'connectivity', values: ['wifi', 'no_wifi', 'outlet', 'no_outlet'] },
  { label: 'Noise', category: 'noise', values: ['silent', 'quiet', 'moderate', 'noisy'] },
  { label: 'Environment', category: 'environment', values: ['air_conditioned', 'outdoor'] },
  { label: 'Location', category: 'location', values: ['inside_upv', 'outside_upv'] }
];

export default function EditSpotPage() {
  const router = useRouter();
  const params = useParams(); 
  const spotId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [form, setForm] = useState({ name: '', address: '', description: '', lat: null, lng: null, is_24hr: false, opening_hours: {} });
  const [selectedTags, setSelectedTags] = useState({});
  const [errors, setErrors] = useState({});

  // ── Photo States ──
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]); 

  useEffect(() => {
    const fetchSpotData = async () => {
      // 1. Fetch spot data AND related photos using foreign key join
      const { data, error } = await supabase
        .from('spots')
        .select('*, photos(*)')
        .eq('id', spotId)
        .single();

      if (error || !data) {
        setMessage({ type: 'error', text: 'Spot not found!' });
        setTimeout(() => router.push('/profile'), 2000);
        return;
      }

      setForm({
        name: data.name || '',
        address: data.address || '',
        description: data.description || '',
        lat: data.lat || null,
        lng: data.lng || null,
        is_24hr: data.is_24hr || false,
        opening_hours: data.opening_hours || {}
      });

      let connectivityTag = '';
      if (data.has_wifi) connectivityTag = 'wifi';
      else if (data.has_outlets) connectivityTag = 'outlet';

      setSelectedTags({
        connectivity: connectivityTag,
        noise: data.noise_level || '',
        environment: data.environment || '',
        location: data.location_type || ''
      });

      // 2. Set existing photos
      setExistingPhotos(data.photos || []);
      setLoading(false);
    };

    fetchSpotData();
  }, [spotId, router]);

  const handleTagClick = (category, value) => {
    setSelectedTags(prev => {
      const updated = { ...prev };
      if (updated[category] === value) delete updated[category];
      else updated[category] = value;
      return updated;
    });
  };

  // ── Photo Handlers ──
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Calculate how many slots are left (max 5 total)
    const currentTotal = existingPhotos.length + newImages.length;
    const slotsLeft = 5 - currentTotal;
    
    if (slotsLeft <= 0) return;

    const allowedFiles = files.slice(0, slotsLeft);
    const addedImages = allowedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setNewImages(prev => [...prev, ...addedImages]);
  };

  const handleRemoveExistingPhoto = (photo) => {
    // Add to deleted queue to process on submit
    setDeletedPhotos(prev => [...prev, photo]);
    // Instantly hide it from the UI
    setExistingPhotos(prev => prev.filter(p => p.id !== photo.id));
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMapLocationSelect = ({ lat, lng, address }) => {
    setForm(prev => ({ ...prev, lat, lng, address: address ? address : prev.address }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const newErrors = {};
    if (!form.name) newErrors.name = 'Spot name is required';
    if (!form.address && (form.lat === null || form.lng === null)) {
      newErrors.address = 'Either an address or a pinned location on the map is required';
    }
    if (form.lat === null || form.lng === null) {
      newErrors.address = 'Please pin the location on the map';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    // 1. Update text data in spots table
    const { error } = await supabase.from('spots').update({
      name: form.name,
      address: form.address,
      description: form.description,
      has_wifi: selectedTags.connectivity === 'wifi',
      has_outlets: selectedTags.connectivity === 'outlet',
      noise_level: selectedTags.noise,
      environment: selectedTags.environment,
      location_type: selectedTags.location,
      lat: form.lat,
      lng: form.lng,
      is_24hr: form.is_24hr,
      opening_hours: form.is_24hr ? null : form.opening_hours
    }).eq('id', spotId);

    if (error) {
      setMessage({ type: 'error', text: 'Error updating spot: ' + error.message });
      setSubmitting(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    // 2. Delete removed photos from DB & Storage
    if (deletedPhotos.length > 0) {
      const deletedIds = deletedPhotos.map(p => p.id);
      
      // Delete from DB table
      await supabase.from('photos').delete().in('id', deletedIds);
      
      // Try extracting filepath from storage_url to delete from bucket to save storage space
      const filePaths = deletedPhotos.map(p => {
        const parts = p.storage_url.split('/spot-photos/');
        return parts.length > 1 ? parts[1] : null;
      }).filter(Boolean);

      if (filePaths.length > 0) {
        await supabase.storage.from('spot-photos').remove(filePaths);
      }
    }

    // 3. Upload newly added photos
    if (newImages.length > 0) {
      for (const img of newImages) {
        const file = img.file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('spot-photos').upload(fileName, file);
        if (uploadError) continue;

        const { data: publicUrlData } = supabase.storage.from('spot-photos').getPublicUrl(fileName);
        await supabase.from('photos').insert({ 
            spot_id: spotId, 
            uploaded_by: user.id, 
            storage_url: publicUrlData.publicUrl 
        });
      }
    }

    setMessage({ type: 'success', text: 'Spot updated successfully! Redirecting...' });
    
    setTimeout(() => {
      router.push('/profile');
    }, 1500);
  };

  if (loading) return <div className="p-10 text-center text-sm text-gray-500">Loading spot details...</div>;

  const totalPhotosCount = existingPhotos.length + newImages.length;

  return (
    <div className="min-h-screen w-full bg-[#F5F2EA] flex flex-col overflow-y-auto pb-24">
      <div className='relative w-full flex items-center px-6 py-3 border-[#0F2D1C] bg-[#F5F2EA] border-b-2 shrink-0 z-10'>
        <Link href="/profile" className='flex items-center gap-1 text-base font-medium text-[#0F2D1C] hover:text-[#C4811A] transition'>
          <ChevronLeftIcon className='w-6 h-6' /> Cancel
        </Link>
        <h1 className='text-xl font-bold text-[#0F2D1C] absolute left-1/2 -translate-x-1/2 tracking-wide uppercase'>Edit Study Spot</h1>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-6 py-6 items-stretch">
        <div className="w-full md:w-[50%] flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-[#0F2D1C] mb-1 block uppercase tracking-wider">
              Location Name <span className="text-[#B33A1A]">*</span>
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className={`w-full px-3 py-2 text-sm rounded-lg border outline-none focus:border-[#0F2D1C] bg-white text-[#0F2D1C] transition ${errors.name ? 'border-[#B33A1A] border-2' : 'border-[#D4CCBA]'}`}
            />
            {errors.name && <p className="text-xs text-[#B33A1A] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F2D1C] mb-1 block uppercase tracking-wider">
              Address <span className="text-[#B33A1A]">*</span>
            </label>
            <input
              required
              type="text"
              value={form.address}
              onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
              className={`w-full px-3 py-2 text-sm rounded-lg border outline-none focus:border-[#0F2D1C] bg-white text-[#0F2D1C] transition ${errors.address ? 'border-[#B33A1A] border-2' : 'border-[#D4CCBA]'}`}
            />
            {errors.address && <p className="text-xs text-[#B33A1A] mt-1">{errors.address}</p>}
          </div>

          <div className="w-full flex flex-col">
            <label className="text-xs font-bold text-[#0F2D1C] mb-1 block uppercase tracking-wider flex items-center justify-between">
              <span>Pin on map <span className="text-[#B33A1A]">*</span></span>
              {form.lat && (
                <span className="text-xs text-emerald-800 font-semibold lowercase tracking-normal">
                  ✓ Pinned ({form.lat.toFixed(4)}, {form.lng.toFixed(4)})
                </span>
              )}
            </label>
            <div className="w-full h-[350px] bg-white rounded-lg shadow-inner overflow-hidden border border-gray-200">
              <AddSpotMap onLocationSelect={handleMapLocationSelect} />
            </div>
          </div>

          <div className='flex flex-col'>
            <label className="text-xs font-bold text-[#0F2D1C] mb-1 block uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              rows={4}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4CCBA] outline-none focus:border-[#0F2D1C] bg-white text-[#0F2D1C] resize-none transition"
            />
          </div>
        </div>

        <div className="w-full md:w-[50%] flex flex-col bg-[#0F2D1C] border rounded-2xl p-5 gap-4 border-[#1E4A2A] ">
          <div>
            <div className="text-[#CFA000] text-[10px] font-bold uppercase tracking-widest mb-2">Opening Hours</div>
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_24hr ?? false}
                onChange={e => setForm(p => ({ ...p, is_24hr: e.target.checked }))}
                className="accent-[#CFA000]"
              />
              <span className="text-[10px] text-[#D4CCBA] uppercase tracking-wide">Open 24/7</span>
            </label>
            
            {!form.is_24hr && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <label key={day} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.opening_hours?.days?.includes(day) ?? false}
                        onChange={e => {
                          const days = form.opening_hours?.days ?? [];
                          const updated = e.target.checked ? [...days, day] : days.filter(d => d !== day);
                          setForm(p => ({ ...p, opening_hours: { ...p.opening_hours, days: updated } }));
                        }}
                        className="accent-[#CFA000]"
                      />
                      <span className="text-[10px] text-[#D4CCBA] uppercase tracking-wide">{day}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 items-center">
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[9px] text-[#D4CCBA] uppercase tracking-wide">Opens</span>
                    <input
                      type="time"
                      value={form.opening_hours?.open || ''}
                      className="w-full px-2 py-1.5 text-[10px] rounded-md bg-[#1E4A2A] border border-[#2E6B3E] text-[#D4CCBA] outline-none focus:border-[#CFA000]"
                      onChange={e => setForm(p => ({ ...p, opening_hours: { ...p.opening_hours, open: e.target.value } }))}
                    />
                  </div>
                  <span className="text-[#D4CCBA] text-xs mt-4">—</span>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[9px] text-[#D4CCBA] uppercase tracking-wide">Closes</span>
                    <input
                      type="time"
                      value={form.opening_hours?.close || ''}
                      className="w-full px-2 py-1.5 text-[10px] rounded-md bg-[#1E4A2A] border border-[#2E6B3E] text-[#D4CCBA] outline-none focus:border-[#CFA000]"
                      onChange={e => setForm(p => ({ ...p, opening_hours: { ...p.opening_hours, close: e.target.value } }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {TAG_GROUPS.map(({ label, category, values }) => (
            <div key={category}>
              <div className="text-[#CFA000] text-[10px] uppercase tracking-widest font-bold rounded-lg mb-2">{label}</div>
              <div className="flex flex-wrap gap-2">
                {values.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleTagClick(category, val)}
                    className={`px-3 py-1 text-[10px] font-semibold rounded-full border transition uppercase tracking-wide ${selectedTags[category] === val ? 'bg-[#CFA000] text-[#0F2D1C] border-[#CFA000]' : 'bg-transparent text-[#D4CCBA] border-[#1E4A2A] hover:border-[#D4CCBA]'}`}
                  >
                    {val.replace(/_/g, ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="border-t border-[#1E4A2A]" />

          {/* ── Photo Management Section ── */}
          <div>
            <div className="text-[#CFA000] text-[10px] font-bold uppercase tracking-widest mb-2">
              Spot Photos <span className="text-[#D4CCBA] font-normal normal-case tracking-normal">({totalPhotosCount}/5)</span>
            </div>
            <div className="flex gap-4 flex-wrap">
              
              {/* Add New Upload Button (Hides if limit reached) */}
              {totalPhotosCount < 5 && (
                <label className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-[#1E4A2A] rounded-lg cursor-pointer hover:border-[#D4CCBA] transition text-[#D4CCBA] text-2xl flex-shrink-0">
                  +
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              )}

              {/* Display Existing Photos from Database */}
              {existingPhotos.map((photo) => (
                <div key={photo.id} className="relative w-28 h-28 flex-shrink-0">
                  <img 
                    src={photo.storage_url} 
                    alt="Existing spot photo" 
                    className="w-full h-full object-cover rounded-lg border border-[#1E4A2A]" 
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingPhoto(photo)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-[#B33A1A] hover:bg-red-700 text-white rounded-full flex items-center justify-center z-10 transition shadow-md"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Display Newly Selected Images */}
              {newImages.map((img, i) => (
                <div key={`new-${i}`} className="relative w-28 h-28 flex-shrink-0">
                  <img 
                    src={img.preview} 
                    alt="New upload preview" 
                    className="w-full h-full object-cover rounded-lg border border-[#1E4A2A] opacity-80" 
                  />
                  <div className="absolute inset-0 bg-black/10 rounded-lg pointer-events-none" /> {/* Tint to show it's pending */}
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-[#B33A1A] hover:bg-red-700 text-white rounded-full flex items-center justify-center z-10 transition shadow-md"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-4">
            {message.text && (
                <div className={`p-3 rounded-lg text-xs font-bold border ${
                    message.type === 'success' 
                        ? 'bg-[#1E4A2A]/40 border-[#2E6B3E] text-[#D4CCBA]' 
                        : 'bg-[#B33A1A]/20 border-[#B33A1A] text-[#F5F2EA]'
                }`}>
                    {message.text}
                </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-2.5 text-sm font-bold rounded-xl bg-[#C4811A] text-[#F5F2EA] hover:bg-[#CFA000] hover:text-[#0F2D1C] transition-all duration-200 uppercase tracking-widest flex items-center justify-center gap-2 group shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}