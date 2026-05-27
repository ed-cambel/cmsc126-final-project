# STaDi: Study Ta Diri 📍

> A community-driven study spot finder for UP Visayas students.

STaDi helps UPV students discover, rate, and contribute study spots around and near the campus. Browse an interactive map, filter by vibe, and leave reviews — all with your UP Mail account.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| Language | JavaScript |

---

## Features

- 🗺️ **Interactive Map** — Browse study spots pinned on a live map
- 🔍 **Discover Page** — Filter spots by noise level, environment, location, WiFi, and outlets
- ⭐ **Reviews & Ratings** — Leave star ratings and written reviews per spot
- 🔖 **Bookmarks** — Save your favorite spots to your profile
- ➕ **Contribute** — Add new study spots to the community map
- 👤 **Profile Page** — View your saved spots and contributions
- 🔐 **UP Mail Auth** — Sign in via Google (UP Mail only) or register manually with `@up.edu.ph`

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project with the required tables set up

### Installation

```bash
git clone https://github.com/ed-cambel/cmsc126-final-project
cd cmsc126-final-project
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
├── (root)/             # Main map page
├── discover/           # Spot discovery + filtering
├── spot/[id]/          # Individual spot page with reviews
├── add/                # Contribute a new spot
├── profile/            # User profile + saved spots
├── login/              # Login page
├── signup/             # Registration page
└── auth/callback/      # OAuth callback handler

components/
├── Navbar.js           # Bottom navigation bar
├── Searchbar.js        # Global search bar
├── Filterbar.js        # Filter UI for spot discovery
├── map.js              # Interactive map component
└── add_map.js          # Map component for adding spots

context/
└── SearchContext.js    # Global search state

hooks/
└── useGeolocation.js   # Hook for user geolocation

lib/
├── supabase/
│   ├── client.js       # Browser Supabase client
│   └── server.js       # Server-side Supabase client
└── distance.js         # Distance calculation utilities
```

---

## Database Tables

| Table | Description |
|---|---|
| `profiles` | User profile info (name, college, degree, year level) |
| `spots` | Study spot listings |
| `reviews` | Star ratings and written reviews per spot |
| `saved_spots` | Bookmarked spots per user |
| `photos` | Uploaded photos per spot |
| `spots_with_stats` | View with computed ratings and review counts |

---

## Auth Flow

- **Google OAuth** — Restricted to `@up.edu.ph` accounts. Profile is auto-created from Google metadata on first sign-in.
- **Manual signup** — Requires a `@up.edu.ph` email, password (min 8 chars), and academic info.
- **Guest access** — Can browse and search spots, but cannot rate, review, bookmark, or contribute.

---

## Contributing

This project is a CMSC 126 final project. For questions or issues, open a GitHub issue or reach out to the team.

---

*Made with 💚 by UPV students, for UPV students.*
