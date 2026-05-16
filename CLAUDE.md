# ShanuFx Portfolio (shanufx-react)

## 1. Project Overview
This project is the personal portfolio and showcase platform for "ShanuFx" (Shanudha Tirosh), a system developer specializing in Android system internals, IoT automation, and full-stack architecture. The platform features a highly dynamic, visually stunning "glassmorphism" UI with real-time backend integration.

## 2. Technology Stack
- **Frontend Framework**: React 19 (via Vite 8)
- **Routing**: React Router v7 (`react-router-dom`)
- **Animations**: Framer Motion (`framer-motion`)
- **Backend & Database**: Firebase v12 (Auth & Firestore)
- **Styling**: Custom Vanilla CSS (`index.css`, `App.css`) with heavy emphasis on dark themes, vibrant gradients (Purple `#7c3aed`, Cyan `#06b6d4`, Pink `#f472b6`), blur/glassmorphism effects, and CSS variables.
- **Icons**: FontAwesome 6.5.0 (via CDN) & Lucide React

## 3. Architecture & Core Logic

### 3.1 Routing & Guards (`src/App.jsx`)
The application defines multiple routes protected by custom wrappers:
- **`RightClickProtector`**: Prevents right-clicking context menus for non-admin users by attaching a `contextmenu` event listener to the `window` and calling `e.preventDefault()`.
- **`AdBlockDetector`**: Detects ad-blockers/Brave Shields by injecting a fake script named `ads.js`. If the script executes successfully, it sets a global `window.canRunAds = true`. If the script fails to load (due to network blocking by an ad-blocker) or times out, the detector shows a full-screen, uncloseable glassmorphism overlay prompting the user to disable their ad-blocker. Does not apply to admins.
- **`AdminGuard`**: Protects the `/admin/dashboard` route, ensuring only authenticated users with 'admin' or 'primary' roles can access it. Unauthorized users are redirected or blocked.

### 3.2 Authentication & State (`src/context/AuthContext.jsx`)
- Uses Firebase Auth with Google Provider (`signInWithPopup`).
- **Role-Based Access Control (RBAC)**: 
  - Checks a Firestore document (`settings/admin`) for the **Primary Admin**. The very first user to log in automatically becomes the Primary Admin.
  - Checks the `admins` collection for secondary admins.
- Exports `user`, `role`, `loading`, `signInWithGoogle`, and `signOutUser`.

### 3.3 Public Pages & UI Logic
- **`Home.jsx`**: The main landing page. 
  - **Typing Logic**: Uses a custom `useTyping` hook with `useRef` to cycle through an array of roles (`ROLES`), managing 'type' and 'erase' phases with `setTimeout`.
  - **Data Fetching**: Fetches the `skills` collection from Firestore in real-time to populate the "Tech Arsenal" section.
  - **Contact Form**: Handles form submission via `handleContact`. Submits to the `contactMessages` collection with `read: false`. Tracks submission state (`null`, `'sending'`, `'ok'`, `'err'`) to disable the button and show success/error feedback dynamically.
- **`Showcase.jsx`**: Displays a combination of hardcoded local projects (`STATIC_PROJECTS`) and dynamic Firestore-fetched `projects` (merging both arrays). Features a category filter (`cat` state) and an active search bar that filters by title and tags. Resolves links dynamically to either external URLs or local HTML mini-projects (e.g. `/projects_sub/clock.html`).
- **`TestimonialsPage.jsx`**: A dedicated page for user feedback/testimonials, also bound to Firestore data in real-time.
- **`NotFound.jsx`**: 404 fallback page.

### 3.4 Components (`src/components/`)
- **`Navbar.jsx`**: Highly dynamic navigation bar. 
  - **Scroll Spy**: Uses `IntersectionObserver` with a `-20% 0px -20% 0px` root margin to detect which section of the page is in view and updates the `activeSection` state.
  - **Scroll Progress**: Tracks `window.scrollY` relative to `document.documentElement.scrollHeight` to calculate a `scrollPct` and render a top progress bar.
  - **Navigation**: Supports both Hash-based navigation (`#about`) with smooth-scrolling for the Home page, and standard `react-router` Links for external pages. Also implements conditional Scroll-To-Top and Scroll-To-Bottom floating action buttons depending on scroll position.
- **`ParticleCanvas.jsx`**: Renders the interactive, animated background canvas.
- **`Experience.jsx`, `Services.jsx`, `Testimonials.jsx`**: Feature-specific UI components that subscribe to their respective Firestore collections (`onSnapshot`) to render grids and lists dynamically.

### 3.5 Admin Dashboard (`src/admin/Dashboard.jsx`)
A fully-featured Content Management System (CMS) built entirely with React and Firestore.
- **Real-Time Subscriptions**: On mount, establishes multiple `onSnapshot` listeners to sync `projects`, `skills`, `experiences`, `services`, `testimonials`, and `contactMessages`.
- **Tabs System**: State-driven navigation (`tab` state) to switch between different entities (Projects, Skills, Timeline, Services, Testimonials, Messages, Settings) without reloading the page. Unread messages show a dynamic badge counter.
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality for all models. Forms are handled via modular popups (`ProjectModal`, `SkillModal`, etc.) mapped to local state. Form data is validated and submitted to Firestore using `addDoc` (for new) or `updateDoc` (for edits). Deletions are safeguarded by a global `ConfirmModal`.
- **Message Handling**: When an admin clicks on an unread message, it triggers a `markRead` function to update the `read: true` boolean in Firestore.
- **Settings & Defaults**: Contains a Site Settings tab to manage global configurations (like a Discord Webhook URL). It also includes an `initializeDefaultData` function that bulk-inserts sample records into Firestore if the database is empty.

## 4. Firebase Configuration
Firebase is initialized in `src/config/firebase.js` using environment variables. 
The application relies on the following Firestore Collections:
- `projects`
- `skills`
- `experiences`
- `services`
- `testimonials`
- `contactMessages` (Tracks `read` status)
- `settings` (Contains the `admin` doc for the primary owner)
- `siteSettings` (Contains `notifications` settings like Discord webhook and maintenance mode flag)
- `admins` (Contains secondary admin UIDs)

## 5. Development Conventions
- **Asset Management**: Uses a mix of public folder assets and external URLs.
- **Environment Variables**: Managed via Vite's `import.meta.env` (e.g., `VITE_FIREBASE_API_KEY`).
- **Styling**: Extensive use of inline styles combined with classes from `App.css` and `index.css` for structural layouts. Avoids heavy frameworks like Tailwind in favor of granular custom CSS for maximum design control.
