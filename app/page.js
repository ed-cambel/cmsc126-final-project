// main landing page
'use client'; 

import { useState } from 'react';
import Link from 'next/link';

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
  { category: "location", value: "outside_upv", label: "Outside UPV" }
];

export default function StudySpotMap() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Instead of a Map, React plays nicer with plain objects for state
  const [selectedFilters, setSelectedFilters] = useState({});

  // Toggle filter logic
  const handleTagClick = (category, value) => {
    setSelectedFilters(prev => {
      const updated = { ...prev };
      // If the value is already selected, deselect it
      if (updated[category] === value) {
        delete updated[category];
      } else {
        updated[category] = value;
      }
      return updated;
    });
  };

  const removeFilter = (category) => {
    setSelectedFilters(prev => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  // Helper to get the label for a selected filter value
  const getFilterLabel = (category, value) => {
    const def = FILTER_DEFS.find(d => d.category === category && d.value === value);
    return def ? def.label : value;
  };

  
  return (
    <>
      <header>
        <div className="top-bar">
          <div className="left-group">
            <div className="box-style">LOGO</div>
            <div className="box-style search-wrapper">
              <span>🔍</span>
              <input type="text" placeholder="SEARCH BAR" />
            </div>
          </div>
          <div className="right-group">
            <button className="box-style">+ ADD STUDY SPOT</button>
            <div className="profile-icon">👤</div>
          </div>
        </div>

        <div className="filter-bar">
          <span className="filter-label">FILTER</span>
          <button
            className="filter-tag"
            onClick={() => setIsModalOpen(true)}
            style={{ background: '#d1d5db', borderColor: 'black' }}
          >
            ⚙️ ALL FILTERS
          </button>

          {/* Render active filters */}
          {Object.entries(selectedFilters).map(([category, value]) => (
            <button key={category} className="filter-tag dynamic">
              <span>{getFilterLabel(category, value)}</span>
              <span
                onClick={() => removeFilter(category)}
                style={{ marginLeft: '8px', cursor: 'pointer' }}
              >
                ✖
              </span>
            </button>
          ))}
        </div>
      </header>

      <main>
        <div className="map-placeholder">
          [ INTERACTIVE MAP BACKGROUND ]
        </div>

        <div className="map-controls">
          <button>⌖</button>
          <button>+</button>
          <button>−</button>
        </div>

        <aside className="side-card">
          <div className="side-card-header">
            <h2>Study Spot Name</h2>
            <div style={{ fontSize: '14px', color: '#4b5563' }}>★★★★☆ 4.5/5 (RATING)</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Descriptor • Descriptor • 0.5 km</div>
          </div>
          <div className="side-card-body">
            {/* Fake Skeletons */}
            <div className="skeleton-box">
              <div className="skeleton-line" style={{ width: '80%', background: '#6b7280' }}></div>
              <div className="skeleton-line" style={{ width: '100%' }}></div>
              <div className="skeleton-line" style={{ width: '60%' }}></div>
            </div>
            <div className="skeleton-box">
              <div className="skeleton-line" style={{ width: '70%', background: '#6b7280' }}></div>
              <div className="skeleton-line" style={{ width: '90%' }}></div>
              <div className="skeleton-line" style={{ width: '50%' }}></div>
            </div>
            <div className="skeleton-box">
              <div className="skeleton-line" style={{ width: '85%', background: '#6b7280' }}></div>
              <div className="skeleton-line" style={{ width: '100%' }}></div>
              <div className="skeleton-line" style={{ width: '40%' }}></div>
            </div>
          </div>
        </aside>
      </main>

      <footer>
        <Link href="/" className="nav-btn active">
          INTERACTIVE MAP
        </Link>
        <Link href="/discover" className="nav-btn">
          DISCOVER PLACES
        </Link>
        <Link href="/add" className="nav-btn">
          ADD STUDY SPOT
        </Link>
        <Link href="/profile" className="nav-btn">
          PROFILE
        </Link>
      </footer>

      {/* MODAL */}
      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            // Close if they click the background, but not the modal itself
            if (e.target.className === 'modal-backdrop') {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="filter-modal">
            <div className="modal-header">
              <span>Filters</span>
              <button onClick={() => setIsModalOpen(false)}>✖</button>
            </div>

            {/* Connectivity */}
            <div className="filter-category">
              <div className="category-title">Connectivity</div>
              <div className="tag-group">
                {['wifi', 'no_wifi', 'outlet', 'no_outlet'].map((val) => (
                  <button
                    key={val}
                    className={`modal-tag ${selectedFilters.connectivity === val ? 'selected' : ''}`}
                    onClick={() => handleTagClick('connectivity', val)}
                  >
                    {getFilterLabel('connectivity', val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Noise Level */}
            <div className="filter-category">
              <div className="category-title">Noise Level</div>
              <div className="tag-group">
                {['silent', 'quiet', 'moderate', 'noisy'].map((val) => (
                  <button
                    key={val}
                    className={`modal-tag ${selectedFilters.noise === val ? 'selected' : ''}`}
                    onClick={() => handleTagClick('noise', val)}
                  >
                    {getFilterLabel('noise', val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Environment */}
            <div className="filter-category">
              <div className="category-title">Environment</div>
              <div className="tag-group">
                {['air_conditioned', 'non_air_conditioned', 'indoor', 'outdoor'].map((val) => (
                  <button
                    key={val}
                    className={`modal-tag ${selectedFilters.environment === val ? 'selected' : ''}`}
                    onClick={() => handleTagClick('environment', val)}
                  >
                    {getFilterLabel('environment', val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="filter-category">
              <div className="category-title">Location</div>
              <div className="tag-group">
                {['inside_upv', 'outside_upv'].map((val) => (
                  <button
                    key={val}
                    className={`modal-tag ${selectedFilters.location === val ? 'selected' : ''}`}
                    onClick={() => handleTagClick('location', val)}
                  >
                    {getFilterLabel('location', val)}
                  </button>
                ))}
              </div>
            </div>

            <button className="apply-btn" onClick={() => setIsModalOpen(false)}>
              Show Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}