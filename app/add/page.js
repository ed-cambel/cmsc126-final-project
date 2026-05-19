// add study spot page 
// redirects from main page, redirects to main page after submission
// can be viewed by guest or user

'use client';

import { useState } from 'react';

export default function AddPage() {
  const [form, setForm] = useState({ name: '', address: '', description: '' });
  const [selectedTags, setSelectedTags] = useState({});
  const [images, setImages] = useState([]);

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...urls].slice(0, 3));
  };

  const handleSubmit = () => {
    if (!form.name || !form.address) {
      alert('Name and address are required.');
      return;
    }
    console.log({ ...form, tags: selectedTags, images });
    alert('Submitted!');
  };

  return (
    <div>
      <button onClick={() => window.history.back()}>Back to map</button>
      <h1>Add Study Spot</h1>

      <input
        type="text"
        placeholder="Location Name *"
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
      />

      <input
        type="text"
        placeholder="Address *"
        value={form.address}
        onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
      />

      <div>[Pin on map placeholder]</div>

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
      />

      <div>
        <p>Connectivity</p>
        {['wifi', 'no_wifi', 'outlet', 'no_outlet'].map(val => (
          <button
            key={val}
            type="button"
            onClick={() => handleTagClick('connectivity', val)}
          >
            {selectedTags['connectivity'] === val ? `[${val}]` : val}
          </button>
        ))}
      </div>

      <div>
        <p>Noise</p>
        {['silent', 'quiet', 'moderate', 'noisy'].map(val => (
          <button
            key={val}
            type="button"
            onClick={() => handleTagClick('noise', val)}
          >
            {selectedTags['noise'] === val ? `[${val}]` : val}
          </button>
        ))}
      </div>

      <div>
        <p>Environment</p>
        {['air_conditioned', 'outdoor'].map(val => (
          <button
            key={val}
            type="button"
            onClick={() => handleTagClick('environment', val)}
          >
            {selectedTags['environment'] === val ? `[${val}]` : val}
          </button>
        ))}
      </div>

      <div>
        <p>Location</p>
        {['inside_upv', 'outside_upv'].map(val => (
          <button
            key={val}
            type="button"
            onClick={() => handleTagClick('location', val)}
          >
            {selectedTags['location'] === val ? `[${val}]` : val}
          </button>
        ))}
      </div>

      <div>
        <p>Photos</p>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        {images.map((src, i) => (
          <div key={i}>
            <img src={src} alt="" width={80} />
            <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={handleSubmit}>Submit for Review</button>
    </div>
  );
}