# 🎬 Netflix GPT

A Netflix-inspired movie browsing app powered by **OpenAI GPT** for intelligent movie recommendations, built with React, Redux Toolkit, Firebase, and the TMDB API.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-10A37F?logo=openai&logoColor=white)

---

## ✨ Features

- 🔐 **Firebase Authentication** — sign up and sign in with email & password
- 🎥 **Hero Video Banner** — auto-plays the official YouTube trailer of the top now-playing movie (muted)
- 🎞️ **Movie Rows** — horizontally scrollable lists of now-playing and popular movies powered by TMDB
- 🤖 **GPT-Powered Search** — type a natural language query (e.g. *"funny movies from the 90s"*) and get 5 AI recommendations, each enriched with real TMDB movie data
- 🌐 **Multi-language UI** — GPT search interface available in English, Hindi, and Spanish
- 📱 **Responsive Design** — mobile-first layout with Tailwind CSS
- ☁️ **Firebase Hosting** — production deployment via Firebase

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + Create React App |
| Styling | Tailwind CSS v3 |
| State Management | Redux Toolkit v2 |
| Routing | React Router DOM v7 |
| Auth + Hosting | Firebase v12 |
| Movie Data | [TMDB API](https://developer.themoviedb.org/docs) |
| AI Recommendations | OpenAI `gpt-3.5-turbo` via `openai` SDK v6 |

---

## 📁 Project Structure

```
netflix-gpt/
├── public/                          # Static assets
└── src/
    ├── App.js                       # Root: Redux Provider + Body
    ├── index.js                     # React entry point
    ├── components/
    │   ├── Body.js                  # Route definitions (/ and /browse)
    │   ├── Login.js                 # Sign-in / Sign-up form
    │   ├── Browse.js                # Main browse page
    │   ├── Header.js                # Navigation bar + auth state listener
    │   ├── MainContainer.js         # Hero banner (video + title overlay)
    │   ├── VideoBackground.js       # YouTube trailer iframe
    │   ├── VideoTitle.js            # Movie title/overview overlay
    │   ├── SecondaryContainer.js    # All movie rows
    │   ├── MovieList.js             # Horizontal scrollable movie row
    │   ├── MovieCard.js             # Individual movie poster card
    │   ├── GptSearch.js             # GPT search page wrapper
    │   ├── GptSearchBar.js          # Search input + GPT + TMDB logic
    │   └── GptMovieSuggestions.js   # Renders GPT result movie lists
    ├── hooks/
    │   ├── useNowPlayingMovies.js   # Fetches TMDB "now playing" movies
    │   ├── usePopularMovies.js      # Fetches TMDB "popular" movies
    │   └── useMovieTrailer.js       # Fetches YouTube trailer key from TMDB
    └── utils/
        ├── appStore.js              # Redux store configuration
        ├── userSlice.js             # User auth state slice
        ├── moviesSlice.js           # Movie data state slice
        ├── gptSlice.js              # GPT search state slice
        ├── configSlice.js           # Language preference slice
        ├── firebase.js              # Firebase app + auth init
        ├── openai.js                # OpenAI client init
        ├── constants.js             # API keys, URLs, supported languages
        ├── languageConstants.js     # i18n strings (EN, Hindi, Spanish)
        └── validate.js              # Email & password validation helpers
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- A [TMDB API](https://developer.themoviedb.org/docs/getting-started) account and API read token
- An [OpenAI](https://platform.openai.com/) account and API key
- A [Firebase](https://console.firebase.google.com/) project with **Email/Password** authentication enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aryan7170/netflix-gpt.git
cd netflix-gpt

# 2. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_TMDB_KEY=your_tmdb_bearer_token
REACT_APP_OPENAI_KEY=your_openai_api_key
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

### Running Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

### Deploying to Firebase Hosting

```bash
npm run build
firebase deploy
```

---

## 🔄 How It Works — End-to-End Flow

### 1. App Bootstrap

`index.js` renders `<App />`, which wraps everything in a Redux `<Provider>` and mounts `<Body />`.

`Body.js` sets up two client-side routes using React Router:
- `/` → Login page
- `/browse` → Browse page

### 2. Authentication

- The **Login page** (`Login.js`) presents a toggleable Sign In / Sign Up form.
- On form submit, `validate.js` checks the email format and password strength before any Firebase call is made.
- Firebase's `createUserWithEmailAndPassword` or `signInWithEmailAndPassword` is called; on success the user profile is stored in Redux.
- **`Header.js` is the single source of truth for auth state**: it subscribes to `onAuthStateChanged` on mount and automatically navigates to `/browse` when logged in or back to `/` when logged out. This correctly handles page refreshes and token expiry.

### 3. Browse Page

Once on `/browse`, `Browse.js`:
1. Calls `useNowPlayingMovies()` and `usePopularMovies()` — custom hooks that fetch from TMDB and cache results in Redux. If data already exists in the store, the fetch is skipped.
2. Renders `<Header />` plus either the standard browse layout or the GPT search view, depending on `store.gpt.showGptSearch`.

**Standard Browse Layout:**

```
Header
└─ MainContainer
     ├─ VideoTitle  (movie name & overview overlaid on the video)
     └─ VideoBackground  (YouTube iframe — autoplay, muted)
└─ SecondaryContainer
     ├─ MovieList "Now Playing"
     ├─ MovieList "Trending"
     ├─ MovieList "Popular"
     ├─ MovieList "Upcoming Movies"
     └─ MovieList "Horror"
```

`VideoBackground.js` uses `useMovieTrailer(movieId)` to call the TMDB `/movie/{id}/videos` endpoint, filter for a `Trailer` type result, and store the YouTube video key in Redux.

### 4. GPT Movie Search

Clicking **"GPT Search"** in the header dispatches `toggleGptSearchView`, swapping the browse layout for `<GptSearch />`.

**Search flow (`GptSearchBar.js`):**

```
User types a natural language query
          │
          ▼
Build prompt → "Act as a Movie Recommendation system...suggest 5 movies for: {query}"
          │
          ▼
Call OpenAI gpt-3.5-turbo  →  "Movie A, Movie B, Movie C, Movie D, Movie E"
          │
          ▼
Split by comma → ["Movie A", "Movie B", "Movie C", "Movie D", "Movie E"]
          │
          ▼
Promise.all → searchMovieTMDB(movie) × 5  (5 parallel TMDB searches)
          │
          ▼
Dispatch addGptMovieResult({ movieNames, movieResults }) to Redux
          │
          ▼
GptMovieSuggestions renders one MovieList row per GPT suggestion
```

### 5. Redux State Shape

```
store
├── user     → { uid, email, displayName, photoURL } | null
├── movies   → { nowPlayingMovies: [...], popularMovies: [...], trailerVideo: {...} }
├── gpt      → { showGptSearch: bool, movieNames: [...], movieResults: [[...], ...] }
└── config   → { lang: "en" | "hindi" | "spanish" }
```

---

## 🌐 Internationalization

The GPT search UI supports three languages. Use the dropdown in the header (visible only when GPT Search is active) to switch:

| Language | Search Placeholder |
|---|---|
| English | *What would you like to watch today?* |
| Hindi | *आज आप क्या देखना चाहेंगे?* |
| Spanish | *¿Qué te gustaría ver hoy?* |

The selected language key is stored in `store.config.lang` and looked up in `src/utils/languageConstants.js`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the development server at `localhost:3000` |
| `npm run build` | Create an optimised production build in `/build` |
| `npm test` | Run tests in interactive watch mode |
| `npm run eject` | Eject from CRA (irreversible) |

---

## 🔮 Potential Improvements

The following issues and enhancements have been identified in the codebase:

### 🔴 Security

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 1 | **OpenAI API key exposed in the browser** | `src/utils/openai.js` — `dangerouslyAllowBrowser: true` | Move GPT calls to a server-side proxy (e.g. a Firebase Cloud Function) so the API key is never sent to the client. |

### 🟠 Bugs & Missing Logic

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 2 | **Mislabeled movie categories** | `src/components/SecondaryContainer.js` | "Trending", "Upcoming Movies", and "Horror" rows all show `nowPlayingMovies` data. Each should fetch its own TMDB endpoint (`/trending`, `/movie/upcoming`, `/discover/movie?with_genres=27`). |
| 3 | **No error handling after the GPT call** | `src/components/GptSearchBar.js` | The `if (!gptResults.choices)` block contains only a `// TODO` comment. It should display a user-facing error message or retry prompt. |
| 4 | **GPT prompt is always in English** | `src/components/GptSearchBar.js` | The prompt sent to OpenAI is hard-coded in English regardless of the selected UI language. The prompt should be localised to match the selected language. |

### 🟡 UX & Polish

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 5 | **Non-functional "Play" and "More Info" buttons** | `src/components/VideoTitle.js` | Buttons are rendered but have no `onClick` handlers. Wire them up or remove them. |
| 6 | **No loading states** | `src/components/Browse.js`, all hooks | Add skeleton loaders or spinners while movies and trailers are being fetched to prevent blank content areas. |
| 7 | **Debug `console.log` statements in production code** | `src/components/GptSearchBar.js` | Remove all debug logs before shipping to production. |

### 🟡 Code Quality & Maintainability

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 8 | **`react-router-dom` listed under `devDependencies`** | `package.json` | `react-router-dom` is a runtime dependency and should be listed under `dependencies`. |
| 9 | **Incomplete `useEffect` dependency arrays** | All three custom hooks | All hooks use empty `[]` dependency arrays but reference values that could change. Satisfy the `exhaustive-deps` ESLint rule or add a suppression comment with justification. |
| 10 | **No test coverage** | `src/setupTests.js` | Only the CRA boilerplate setup exists. Add unit tests for `validate.js`, Redux slices, and key components. |
| 11 | **Hardcoded Firebase config values** | `src/utils/firebase.js` | `appId`, `messagingSenderId`, and `measurementId` are committed directly in source. Consider moving all config to environment variables for cleaner separation of concerns. |
