# ShanuFx Portfolio — Next.js 15 Migration
## Full Implementation Plan + Master Prompt (Code-Verified Edition)
> Based on complete source analysis of the actual Vite/React codebase

---

## What Changed After Reading the Real Code

The original plan had several inaccuracies. Here are the **real** values extracted directly from source:

| Item | Assumed (Before) | Actual (From Code) |
|---|---|---|
| Body font | Clash Display | **DM Sans** (`font-family: 'DM Sans', sans-serif`) |
| Heading font | — | **Syne** (`font-family: 'Syne', sans-serif`) |
| Mono font | JetBrains Mono | **JetBrains Mono** ✅ (correct) |
| Skills `level` field | Numeric 1–100 | **Text string**: `'Specialist'\|'Expert'\|'Advanced'\|'Proficient'\|'Learning'` |
| Skills name field | `name` | **`label`** (`orderBy('label')`) |
| Project description field | `description` | **`desc`** |
| Project URL field | `url` | **`link`** |
| Experience title field | `title` | **`role`** |
| Experience description | `description` | **`desc`** |
| Services description | `description` | **`desc`** |
| Testimonials `rating` field | Exists | **Does not exist** — no rating field |
| Particle count | 80 | **65** |
| Particle color | violet/cyan/pink | **`rgba(122,162,247,0.5)`** (blue) |
| Particle connection dist | 120px | **140px** |
| AdBlock timeout | 3000ms | **1500ms** |
| Settings maintenance key | `maintenanceMode` | **`maintenance`** |
| Admin categories | Web/Mobile/IoT/Tools | **Web/Android/Bot/IoT/Desktop/Other** |
| Hero title | "SHANUDHA TIROSH" | **"I am\nShanuFx"** (ShanuFx in gradient) |
| Profile image | local | **`https://shanudhatirosh.github.io/assets/img/profile.jpg`** |
| Secret admin link | Hidden nav | **Hidden in hero** — the `;` at end of `println()` text navigates to `/admin` |
| bg variables | Custom | `--bg: #04040a`, `--bg-card: rgba(255,255,255,0.03)`, etc. |
| Public testimonials | No | **Yes** — TestimonialsPage has public submit form |
| Font loading | next/font | **Google Fonts CDN** (keep as CDN in `<head>`) |
| Font Awesome | npm | **CDN link tag v6.5.0** (keep CDN approach) |

---

## Actual Firestore Schema (From Real Code)

```
skills        { label, icon, level: string, color }
              level enum: 'Specialist'|'Expert'|'Advanced'|'Proficient'|'Learning'
              query: orderBy('label')

projects      { title, category, status, desc, link, icon, color, tags[], createdAt, updatedAt? }
              category: 'Web'|'Android'|'Bot'|'IoT'|'Desktop'|'Other'
              status: 'Active'|'Completed'|'Archived'
              query: orderBy('createdAt', 'desc')

experiences   { role, company, period, desc, order }
              query: orderBy('order')

services      { title, icon, color, desc, order }
              query: orderBy('order')

testimonials  { name, role, text, avatar, createdAt }
              query: orderBy('createdAt', 'desc')

contactMessages { name, email, message, read, createdAt }
              query: orderBy('createdAt', 'desc')

settings/admin { uid, email, name }

siteSettings/notifications { discordWebhook, siteTitle, maintenance }

admins        { [uid]: true }
```

---

## Actual CSS Classes In Use (From globals.css + admin.css)

Public site: `.bg-noise`, `.grid-bg`, `.glass-card`, `.text-gradient`, `.btn-primary`, `.btn-outline`, `.badge`, `.badge-purple`, `.badge-cyan`, `.badge-green`, `.badge-pink`, `.section-divider`, `.form-input`, `.skill-card`, `.floating`, `.typing-cursor`, `.tech-tag`, `.project-card`, `.card-glow`, `.desktop-nav`, `.mobile-menu-btn`, `.mobile-nav-overlay`, `.mobile-nav-link`

Admin: `.admin-layout`, `.admin-nav`, `.admin-brand`, `.admin-badge`, `.admin-main`, `.admin-stats`, `.stat-card`, `.stat-val`, `.stat-lbl`, `.tab-bar`, `.tab-btn`, `.admin-table`, `.admin-section`, `.admin-section-header`, `.btn-admin`, `.btn-admin-primary`, `.btn-admin-danger`, `.btn-admin-outline`, `.admin-modal-overlay`, `.admin-modal`, `.auth-screen`, `.auth-card`, `.auth-logo`, `.google-btn`, `.admin-spinner`, `.msg-card`

---

## STATIC_PROJECTS (Actual 16 Projects From Showcase.jsx)

Main Projects (6):
- NovaMesh Android (Android) — github.com/ShanudhaTirosh/Novamesh
- SHANU-MD (Bot) — github.com/ShanudhaTirosh/SHANU-MD
- Smart IoT Plant (IoT) — github.com/ShanudhaTirosh/Esp8266-smart-iot-progect
- NovaNetX VPN Platform (Web) — github.com/ShanudhaTirosh
- HotspotX Android (Android) — github.com/ShanudhaTirosh
- FlexPOS / NexusPOS (Web) — github.com/ShanudhaTirosh

Mini Utilities (10) — all link to `/projects_sub/`:
- Financial Calculator, Image Gallery, QR Code Generator, To-Do List App,
  Typing Speed Test, Unit Converter, Standard Calculator, Calendar Widget,
  Analog Clock, Math Solver

---

## MASTER IMPLEMENTATION PROMPT
### (Paste this entire block into Cursor / Claude Code / Windsurf)

---

```
=================================================================
SHANUFX PORTFOLIO — NEXT.JS 15 MASTER IMPLEMENTATION PROMPT
Source-Verified Edition — Based on actual codebase analysis
=================================================================

## ROLE
You are a senior full-stack developer migrating the ShanuFx portfolio from
Vite/React 19 to Next.js 15 (App Router). You have the full source code context.
Preserve every feature and every pixel of the existing design. The only changes
allowed are: framework migration, SEO upgrades, ISR, and TypeScript strictness.

## IDENTITY & BRAND
- Developer: Shanudha Tirosh | Brand: ShanuFx | GitHub: ShanudhaTirosh
- Age: 17.5-year-old system developer from Sri Lanka
- School: G/Dharmashoka College
- Featured project: NovaMesh (Android network stability tool)
- Profile image: https://shanudhatirosh.github.io/assets/img/profile.jpg
- Social: GitHub/ShanudhaTirosh | LinkedIn/shanudhatirosh | Facebook/tirosh.shanudha | Instagram/shanudha_tirosh

## TECHNOLOGY STACK
- Framework: Next.js 15 (App Router, TypeScript strict)
- Styling: Copy existing globals.css + admin.css EXACTLY — custom CSS vars only, no Tailwind
- Animations: Framer Motion 12 (same version as original)
- Backend: Firebase v12 (Firestore client SDK for admin dashboard, Admin SDK for Server Actions)
- Icons: FontAwesome 6.5.0 via CDN (add to layout <head>), Lucide React
- Fonts: Google Fonts CDN (Syne, DM Sans, JetBrains Mono) — add link tag to layout <head>
- Deployment: Vercel (enables ISR)

## EXACT CSS VARIABLES (copy verbatim from original globals.css)
:root {
  --primary:       #7c3aed;
  --primary-light: #a855f7;
  --primary-dark:  #5b21b6;
  --cyan:          #06b6d4;
  --cyan-glow:     rgba(6,182,212,0.25);
  --green:         #10b981;
  --pink:          #f472b6;
  --danger:        #f43f5e;
  --bg:            #04040a;
  --bg-card:       rgba(255,255,255,0.03);
  --bg-card-h:     rgba(255,255,255,0.07);
  --border:        rgba(255,255,255,0.06);
  --border-h:      rgba(124,58,237,0.5);
  --text:          #f1f0f7;
  --text-2:        #94a3b8;
  --text-3:        #4b5563;
  --grad:          linear-gradient(135deg,#7c3aed 0%,#06b6d4 100%);
  --grad-glow:     radial-gradient(ellipse at top,rgba(124,58,237,0.18) 0%,transparent 70%);
  --shadow-glow:   0 0 50px rgba(124,58,237,0.25);
  --shadow-card:   0 8px 32px rgba(0,0,0,0.45);
}

## PROJECT STRUCTURE
app/
  layout.tsx                    ← Root layout: Google Fonts, FA CDN, AuthProvider wrappers, metadata
  page.tsx                      ← Home (SSG) — all sections assembled
  showcase/page.tsx             ← SSG + revalidate:300
  testimonials/page.tsx         ← SSG + revalidate:300 + public submit form
  (admin)/
    layout.tsx                  ← AdminGuard (auth check, redirect to /admin if not authed)
    login/page.tsx              ← Google Sign-In page
    dashboard/page.tsx          ← Full dashboard (single page with tab state, like original)
  api/
    contact/route.ts            ← Server Action handler
    revalidate/route.ts         ← On-demand ISR cache purge
  not-found.tsx                 ← 404 page

components/
  layout/
    Navbar.tsx
    Footer.tsx
    ParticleCanvas.tsx          ← MUST be dynamic({ ssr: false })
    AdBlockDetector.tsx         ← 'use client', 1500ms timeout
    RightClickProtector.tsx     ← 'use client'
  home/
    Hero.tsx
    About.tsx
    SkillsSection.tsx
    Experience.tsx
    Services.tsx
    Testimonials.tsx            ← limit prop support
    Innovations.tsx             ← NovaMesh featured projects section
    CTABanner.tsx
    ContactForm.tsx
  showcase/
    ShowcaseClient.tsx          ← 'use client' — filter/search logic
  testimonials/
    TestimonialsClient.tsx      ← 'use client' — public submit form
  admin/
    modals/
      ProjectModal.tsx
      SkillModal.tsx
      ExperienceModal.tsx
      ServiceModal.tsx
      TestimonialModal.tsx
      ConfirmModal.tsx
    Toast.tsx
    DashboardClient.tsx         ← 'use client' — full dashboard clone

lib/
  firebase/
    config.ts                   ← Client SDK init with getApps() guard
    admin.ts                    ← Firebase Admin SDK for Server Actions
    firestore.ts                ← Typed collection helpers
    auth.ts                     ← signInWithGoogle, signOut
  context/
    AuthContext.tsx              ← Exact port of original AuthContext.jsx
  hooks/
    useTyping.ts                ← Port exactly from Home.jsx (same params: words, speed=80, eraseSpeed=40, pause=2000)
    useScrollSpy.ts             ← IntersectionObserver, threshold 0.2, rootMargin "-20% 0px -20% 0px"
    useAdBlock.ts               ← 1500ms timeout, /ads.js probe
  actions/
    contact.ts                  ← 'use server' Server Action
  types/
    index.ts                    ← All TypeScript interfaces

public/
  ads.js                        ← EXACT CONTENT: window.canRunAds = true;
  projects_sub/                 ← All 10 HTML mini-projects (copy verbatim)
    Financial Calculator.html
    ImageGallery.html
    QRCodeGenerator.html
    ToDoList.html
    TypingSpeedTest.html
    UnitConverter.html
    calculator.html
    calender.html
    clock.html
    mathsolver.html
  assets/img/
    profile.jpg
    shanufx_logo.png
    og-index.jpg
    og-projects.jpg
    og-showcase.jpg
    favicon.png
    favicon-48.png
    favicon-96.png
    apple-touch-icon.png

styles/
  globals.css                   ← Copy verbatim from src/styles/globals.css
  admin.css                     ← Copy verbatim from src/styles/admin.css

next.config.ts
.env.local

## TYPESCRIPT INTERFACES (lib/types/index.ts)
```ts
export interface Skill {
  id: string;
  label: string;
  icon: string;
  level: 'Specialist' | 'Expert' | 'Advanced' | 'Proficient' | 'Learning';
  color: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Web' | 'Android' | 'Bot' | 'IoT' | 'Desktop' | 'Other';
  status: 'Active' | 'Completed' | 'Archived';
  desc: string;
  link: string;
  icon: string;
  color: string;
  tags: string[];
  stars?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  desc: string;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  color: string;
  desc: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  createdAt?: unknown;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt?: unknown;
}

export interface SiteSettings {
  discordWebhook?: string;
  siteTitle?: string;
  maintenance?: boolean;
}

export type UserRole = 'primary' | 'admin' | null;
```

## FIREBASE CONFIG (lib/firebase/config.ts)
```ts
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

## AUTH CONTEXT (lib/context/AuthContext.tsx)
Port EXACTLY from src/context/AuthContext.jsx:
- onAuthStateChanged listener
- Check settings/admin doc for primary admin (uid match)
- Check admins/[uid] doc for secondary admin
- signInWithGoogle: signInWithPopup + first-user-becomes-primary logic (setDoc settings/admin)
- signOutUser: signOut(auth)
- Export: { user, role, loading, signInWithGoogle, signOutUser }
- Role type: 'primary' | 'admin' | null

## ROOT LAYOUT (app/layout.tsx)
```tsx
// Add to <head>:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

// Wrap children with:
<AuthProvider>
  <AdBlockDetector>
    <RightClickProtector>
      {children}
    </RightClickProtector>
  </AdBlockDetector>
</AuthProvider>

// Import globals.css and admin.css
```

## METADATA (app/layout.tsx)
```ts
export const metadata: Metadata = {
  title: { default: 'ShanuFx | Shanudha Tirosh', template: '%s | ShanuFx' },
  description: 'System developer specializing in Android internals, IoT automation, and full-stack architecture. Creator of NovaMesh.',
  keywords: ['ShanuFx', 'Shanudha Tirosh', 'Android developer', 'NovaMesh', 'IoT', 'Sri Lanka'],
  authors: [{ name: 'Shanudha Tirosh' }],
  openGraph: {
    type: 'website',
    siteName: 'ShanuFx Portfolio',
    images: [{ url: '/assets/img/og-index.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: '/assets/img/favicon.png',
    apple: '/assets/img/apple-touch-icon.png',
  },
};
```

## RIGHTCLICKPROTECTOR (components/layout/RightClickProtector.tsx)
'use client'
```tsx
// Exact port of original:
// Block contextmenu only when !user (not logged in at all)
// NOT based on role — any logged-in user (even non-admin) gets right-click
const { user } = useAuth();
useEffect(() => {
  const handler = (e: MouseEvent) => { if (!user) e.preventDefault(); };
  window.addEventListener('contextmenu', handler);
  return () => window.removeEventListener('contextmenu', handler);
}, [user]);
```

## ADBLOCK DETECTOR (components/layout/AdBlockDetector.tsx)
'use client'
Exact port of original AdBlockDetector from App.jsx:
- Only runs when !user (skip for any logged-in user)
- Sets window.canRunAds = false first
- Appends (script src="/ads.js") to document.head-
- onload: check if window.canRunAds === true; resolve(!window.canRunAds)
- onerror: resolve(true) — explicitly blocked
- setTimeout 1500ms: resolve(window.canRunAds !== true)
- If blocked: show full-screen overlay (z-index 1000) with glassmorphism card
- Overlay content: "🛡️ Shields Detected" heading, Brave-specific instructions, 
  "I've disabled it, reload" button (calls window.location.reload())
- Note at bottom: "No ads here! Shields just break some of my custom networking optimizations."
- Overlay NOT dismissible (no close button, just reload)
- Use exact same inline styles from original App.jsx (rgba(5,5,10,0.9) backdrop, etc.)

## PARTICLE CANVAS (components/layout/ParticleCanvas.tsx)
Must be imported as: const ParticleCanvas = dynamic(() => import('./ParticleCanvas'), { ssr: false })

Exact port from original ParticleCanvas.jsx:
- COUNT = 65 dots
- Each dot: random x/y, vx/vy = (random-0.5)*0.45
- Dot render: radius 1.5, color 'rgba(122,162,247,0.5)' (EXACT — blue, not violet)
- Bounce off walls: vx*=-1, vy*=-1
- Connection lines: if dist < 140, draw line with strokeStyle `rgba(122,162,247,${0.18*(1-dist/140)})`, lineWidth 0.6
- Canvas style: position fixed, inset 0, zIndex 0, opacity 0.35, pointerEvents none
- resize handler: also re-inits all dots (call init() on resize)
- No mouse interaction (original doesn't have it)

## NAVBAR (components/layout/Navbar.tsx)
'use client'
Exact port from original Navbar.jsx:

Nav sections observed by scroll spy:
['home', 'about', 'skills', 'experience', 'services', 'testimonials', 'innovations', 'contact']

Section → active link mapping:
home → 'home', about → 'about', skills → 'about', experience → 'about',
services → 'about', testimonials → 'about', innovations → 'innovations', contact → 'contact'

Nav links:
{ label: 'Home',        type: 'hash',  sectionId: 'home'        }
{ label: 'About',       type: 'hash',  sectionId: 'about'       }
{ label: 'Innovations', type: 'hash',  sectionId: 'innovations' }
{ label: 'Showcase',    type: 'route', to: '/showcase'          }
{ label: 'Feedback',    type: 'route', to: '/testimonials'      }
{ label: 'Contact',     type: 'hash',  sectionId: 'contact'     }

Logo: square div (36x36, gradient bg, "S" letter) + "ShanuFx" text
Scroll threshold for glass background: 30px (not 50px)
FAB scroll-to-top: shows when scrolled (scrollY > 30), violet glass style
FAB scroll-to-bottom: shows when scrollPct < 95, cyan glass style
Mobile: hamburger shows at ≤768px, full-screen overlay with large (2rem) links

## HOME PAGE (app/page.tsx)
Fetch skills with getDocs at build time, pass as prop to SkillsSection.
All other sections (Experience, Services, Testimonials) ALSO fetch at build time for SSG.
export const revalidate = 300

## HERO SECTION (components/home/Hero.tsx)
'use client' — needs useTyping hook

ROLES array (exact from source):
const ROLES = [
  'Android System Specialist',
  'NovaMesh Developer',
  'IoT Integrator',
  'Full-Stack Architect',
  'Performance Engineer',
  'Creative Technologist',
];

Layout: two columns (flex-wrap, gap 4rem, justify-content space-between)
Left side:
- Mono header: `System.out.println("Hello, World!");`
  The semicolon `;` must be a HIDDEN NAVIGATION TRIGGER — onClick navigates to /admin.
  Style it identically to the rest of the text (no underline, cursor: default)
  This is the secret admin link — do not make it obvious.
- H1: `I am` (line break) `ShanuFx` where ShanuFx has className="text-gradient"
  fontSize: clamp(2.8rem,7vw,5.5rem), fontFamily: Syne, fontWeight 900
- Typing text: className="typing-cursor", height 1.8rem, color #94a3b8
- Terminal text block: 3 lines starting with ">" in JetBrains Mono:
  > Pushing Android System Internals to the limit.
  > Stabilizing mobile networking with NovaMesh.
  > Full-stack development, performance-first mindset.
- Badges row: Internals (purple), Networking (cyan), IoT (green), Full-Stack (pink)
- CTAs: "Explore Innovations" (btn-primary, href="#innovations") | GitHub (btn-outline, external)

Right side (profile image):
- Three glow rings (absolute positioned): inner (inset -12px, violet), outer (inset -24px, cyan), glow blob
- Profile img: 260x260, borderRadius 50%, border '2px solid rgba(255,255,255,0.08)'
  className="floating" for the float animation
- Floating chips (absolute): bottom-right "Performance" (violet bolt icon), top-left "NovaMesh" (cyan network icon)
- Both chips use className="glass-card" with borderRadius 12

Framer Motion:
- Left div: initial={{opacity:0,x:-40}} animate={{opacity:1,x:0}} transition={{duration:0.7,delay:0.2}}
- Right div: initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.7,delay:0.4}}
- Scroll indicator: initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:1}}
  Renders at absolute bottom center: "SCROLL" label + thin vertical gradient line

Section id: "home", minHeight '100vh', paddingTop '6rem', paddingBottom '4rem'

## USETYPNG HOOK (lib/hooks/useTyping.ts)
Port EXACTLY from Home.jsx:
```ts
function useTyping(words: string[], speed = 80, eraseSpeed = 40, pause = 2000) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'type'|'erase'>('type');
  const idx = useRef(0);
  const charIdx = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const word = words[idx.current];

    if (phase === 'type') {
      if (charIdx.current < word.length) {
        timer = setTimeout(() => {
          setText(word.slice(0, charIdx.current + 1));
          charIdx.current++;
        }, speed);
      } else {
        timer = setTimeout(() => setPhase('erase'), pause);
      }
    } else {
      if (charIdx.current > 0) {
        timer = setTimeout(() => {
          setText(word.slice(0, charIdx.current - 1));
          charIdx.current--;
        }, eraseSpeed);
      } else {
        idx.current = (idx.current + 1) % words.length;
        setPhase('type');
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, words, speed, eraseSpeed, pause]);

  return text;
}
```

## ABOUT SECTION (components/home/About.tsx)
Section id: "about", padding '6rem 1.5rem'
Badge: "The Architect" (purple)
H2: "My Journey"
className="section-divider"

Left column (bio text):
- Mono prefix: `[ INIT ] I'm a 17.5-year-old System Developer from Sri Lanka.`
- Para 1: student at G/Dharmashoka College, specializes in Android System Internals and IoT automation
- Para 2: creator of NovaMesh, system-level utilities
- Para 3 in mono+violet: "Exploring the limits of system performance. ⚡"
- Stats grid (3 columns): [['20+','Repositories'],['5k+','Reach'],['1','Purpose']]
  Each stat: className="glass-card", value has className="text-gradient" with Syne font 1.8rem

Right column (skills list):
- className="glass-card", padding 2rem, borderRadius 20, position relative, overflow hidden
- Title: terminal icon + "Mission Critical Skills"
- 6 skill items (li elements) with icons and text:
  ['fab fa-android','#7c3aed','Android Internals & OS Optimization']
  ['fas fa-wifi','#06b6d4','Networking Stability & Hotspot Systems']
  ['fas fa-layer-group','#7c3aed','Back-End Architecture (Node.js)']
  ['fas fa-microchip','#06b6d4','IoT Engineering (C++ / Arduino)']
  ['fas fa-shield-virus','#10b981','Cybersecurity & Defensive Coding']
  ['fas fa-project-diagram','#f472b6','API Design & System Integration']
  Each li: JetBrains Mono, 0.8rem, hover changes bg + color

All Framer Motion: whileInView, viewport once:true, x-axis offset animations

## SKILLS SECTION (components/home/SkillsSection.tsx)
Section id: "skills", padding '4rem 1.5rem'
Badge: "Tech Arsenal" (cyan)
H2: "Technical Skills"
Mono subtext: "_Optimizing stack for maximum performance"
Props: { skills: Skill[] } — passed from page.tsx getDocs

Grid: repeat(auto-fill, minmax(150px,1fr)), gap 1rem
Each skill card:
- className="skill-card glass-card", padding '1.5rem 1rem', textAlign center
- Circular icon bg: width/height 48, borderRadius '50%', bg `${s.color}18`
- H3: s.label (Syne font, 0.9rem)
- Level badge: s.level text, s.color color, JetBrains Mono, uppercase, 0.65rem
Framer Motion per card: initial scale 0.9 → whileInView scale 1, whileHover y:-5, delay i*0.05

## EXPERIENCE COMPONENT (components/home/Experience.tsx)
Section id: "experience", padding '6rem 1.5rem'
Badge: "Timeline" (purple), H2: "Experience"
Fetches from Firestore at BUILD TIME (getDocs, orderBy('order'))
If empty → return null (like original)

Timeline style:
- borderLeft: '2px solid rgba(124,58,237,0.2)', marginLeft '1rem', paddingLeft '2rem'
- Each entry: dot (absolute, left -2.4rem, top 0.2rem, 14x14, borderRadius 50%, bg #7c3aed, boxShadow '0 0 10px #7c3aed')
- className="glass-card", padding 2rem, borderRadius 16
- Row: role (h3, 1.2rem, --text) + period (span, cyan, JetBrains Mono)
- Company (h4, 0.9rem, #a855f7)
- Desc (p, text-2, 0.9rem)
Framer: whileInView, x:-30 → x:0, delay i*0.15

## SERVICES COMPONENT (components/home/Services.tsx)
Section id: "services", padding '6rem 1.5rem', bg 'rgba(255,255,255,0.01)'
Badge: "What I Do" (cyan), H2: "Services"
Fetches at BUILD TIME (getDocs, orderBy('order'))
If empty → return null

Grid: repeat(auto-fit, minmax(250px,1fr)), gap 2rem
Each service card:
- className="glass-card", padding 2rem, borderRadius 20, textAlign center, overflow hidden
- Top-right radial glow: position absolute, top -30, right -30, 100x100, bg `${srv.color}33`
- Icon circle: 60x60, margin auto, bg `${srv.color}1a`, borderRadius 50%, fontSize 1.8rem
- H3, desc p
Framer: whileHover y:-8, whileInView y:30→0, delay i*0.1

## TESTIMONIALS COMPONENT (components/home/Testimonials.tsx)
Section id: "testimonials", padding '6rem 1.5rem'
Badge: "Feedback" (purple), H2: "Testimonials"
Props: { testimonials: Testimonial[], limit?: number }
If limit → show only first `limit` items
Show "View All Testimonials →" link to /testimonials if limit && more exist

Each card:
- className="glass-card", padding 2rem, borderRadius 20, position relative
- Quote icon: fa-quote-left, position absolute, top 1.5rem, right 2rem, 2rem, color rgba(255,255,255,0.05)
- Text: italic, color #e2e8f0, 0.95rem, lineHeight 1.7, marginBottom 2rem
- Avatar: 50x50, borderRadius 50%, border '2px solid rgba(124,58,237,0.5)'
- Name (h4, 1rem, --text) + Role (span, cyan, JetBrains Mono 0.8rem)
Framer: initial scale 0.95 → whileInView scale 1, delay i*0.15

## INNOVATIONS SECTION (components/home/Innovations.tsx)
Section id: "innovations", padding '6rem 1.5rem'
Badge: "Featured Innovation" (purple)
H2: "Powered by [gradient]NovaMesh[/gradient]"
Subtext link: "VIEW PREMIUM SHOWCASE" (btn-outline) → href="/showcase"

3 hardcoded project cards (exact from Home.jsx):
1. NovaMesh Android — icon 'fas fa-network-wired', color '#7c3aed'
   desc: "A flagship utility providing granular control over Android's networking stack..."
   tags: ['System-Level Stability','Hotspot Optimization','Traffic Management']
   link: https://github.com/ShanudhaTirosh/Novamesh

2. SHANU-MD — icon 'fab fa-whatsapp', color '#10b981'
   desc: "An advanced multi-device WhatsApp bot built for speed, stability..."
   tags: ['Node.js','Baileys','Multi-device']
   link: https://github.com/ShanudhaTirosh/SHANU-MD

3. Smart IoT Plant — icon 'fas fa-seedling', color '#06b6d4'
   desc: "ESP-8266 powered automated plant care system..."
   tags: ['ESP8266','C++','IoT','Blynk']
   link: https://github.com/ShanudhaTirosh/Esp8266-smart-iot-progect

Each card: className="project-card glass-card", borderRadius 20, padding 2rem
- className="card-glow" div inside
- Icon box: 52x52, borderRadius 14, bg `${p.color}18`
- Tags: className="tech-tag" each
- Link: "explore.repo() _ <fa-github>" or "view.demo() _ <fa-external-link-alt>"
  Color changes on hover to #f1f0f7
Framer: whileInView y:30→0, delay i*0.15

## CTA BANNER (components/home/CTABanner.tsx)
Gradient bg overlay: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))
With top + bottom border: 1px solid rgba(124,58,237,0.1)
H2: "Ready to see what I can build?"
Link: "Explore the Premium Showcase →" (btn-primary) → href="/showcase"

## CONTACT FORM (components/home/ContactForm.tsx)
'use client'
Section id: "contact", padding '6rem 1.5rem', maxWidth 600, margin auto
Badge: "Let's Connect" (purple), H2: "Get In Touch"
Mono subtext: "_Open for collaborations and technical discussions"

Form card: className="glass-card", borderRadius 24, padding 2.5rem
Top accent: absolute top 0, height 3, background linear-gradient(90deg,#7c3aed,#06b6d4,#7c3aed)

Fields (exact labels from original):
- "Your Identity" → name input, icon: fa-user, placeholder "Name / Organization"
- "Communication Channel" → email input, icon: fa-envelope, placeholder "email@address.com"
- "Transmission Details" → message textarea, icon: fa-terminal (top 1.2rem), rows 5, minHeight 120

Submit button: "DISPATCH MESSAGE <fa-paper-plane>" | sending: "<fa-spinner fa-spin> Sending..." | ok: "<fa-check> Sent!"
States: null | 'sending' | 'ok' | 'err'
Success msg: "✅ Message received! I'll get back to you soon." (green, 0.82rem)
Error msg: "❌ Error sending. Please try again." (red, 0.82rem)
Button width 100%, borderRadius 14, Framer whileHover scale 1.02, whileTap scale 0.98

On submit: call Server Action sendContactMessage(formData) which:
1. Validates all fields required
2. Writes to contactMessages collection via Firebase Admin SDK
3. Fire-and-forget: ping siteSettings/notifications.discordWebhook if set
4. Returns success/error status

Social links below form ("Direct Uplinks"):
- fa-facebook → https://web.facebook.com/tirosh.shanudha/
- fa-instagram → https://www.instagram.com/shanudha_tirosh/
- fa-linkedin-in → https://www.linkedin.com/in/shanudhatirosh/
- fa-github → https://github.com/ShanudhaTirosh
Color: #4b5563, hover: color #a855f7 + translateY(-4px)

## HOME PAGE ASSEMBLY (app/page.tsx)
```tsx
export const revalidate = 300;

async function getData() {
  const [skillsSnap, expSnap, srvSnap, testSnap] = await Promise.all([
    getDocs(query(collection(db, 'skills'), orderBy('label'))),
    getDocs(query(collection(db, 'experiences'), orderBy('order'))),
    getDocs(query(collection(db, 'services'), orderBy('order'))),
    getDocs(query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'))),
  ]);
  return { skills, experiences, services, testimonials };
}

export default async function Home() {
  const { skills, experiences, services, testimonials } = await getData();
  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="bg-noise" />
      <div className="grid-bg" />
      <ParticleCanvas />     {/* dynamic import, ssr:false */}
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <SkillsSection skills={skills} />
        <Experience experiences={experiences} />
        <Services services={services} />
        <Testimonials testimonials={testimonials} limit={3} />
        <Innovations />
        <CTABanner />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
```

## SHOWCASE PAGE (app/showcase/page.tsx)
export const revalidate = 300;
Fetch Firestore projects at build time (getDocs, orderBy createdAt desc)
Merge: [...firestoreProjects, ...STATIC_PROJECTS]
Pass merged array to ShowcaseClient component

STATIC_PROJECTS (all 16 — copy exact from Showcase.jsx):
6 main projects + 10 mini utilities (sub1-sub10)
Mini utils link field starts with '/projects_sub/' — this is how local vs external is detected

ShowcaseClient ('use client'):
- State: cat ('All'), search ('')
- CATS = ['All', 'Android', 'Web', 'Bot', 'IoT']
- Filter: matchCat && matchSrch (title + tags)
- getProjectLink: return p.link (field already set in static data)
- Render: category filter pills (gradient bg when active), search input, AnimatePresence grid
- Detect github vs local link: resolvedLink.includes('github.com') → "explore.repo() _ <fa-github>" else "view.demo() _ <fa-external-link-alt>"

## TESTIMONIALS PAGE (app/testimonials/page.tsx)
export const revalidate = 300;
Fetch testimonials at build time, pass to TestimonialsClient
TestimonialsClient ('use client'):
- Renders all testimonials (no limit)
- Has public submit form (exact from TestimonialsPage.jsx):
  Fields: name, role, avatar (optional), text
  On submit: addDoc to testimonials collection
  Avatar fallback: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff`
  Status: null | 'submitting' | 'ok' | 'err'

## ADMIN GUARD ((admin)/layout.tsx)
'use client'
Exact port of AdminGuard.jsx:
- loading → show spinner (.admin-spinner)
- !user → redirect to /admin
- user + !role → show "Access Denied" screen
- user + role → render children

## ADMIN LOGIN ((admin)/login/page.tsx)
Port exactly from Login.jsx:
- On mount: if user && role → redirect to /admin/dashboard
- Same auth card UI: .auth-screen, .auth-card, .auth-logo
- Google sign-in button with SVG Google logo
- "Back to Website" link → /

## ADMIN DASHBOARD ((admin)/dashboard/page.tsx → DashboardClient.tsx)
'use client'
Port EXACTLY from Dashboard.jsx as a single component.

TABS (exact from original):
const TABS = [
  { key:'projects',     label:'Projects',     icon:'fas fa-rocket',        count: projects.length },
  { key:'skills',       label:'Skills',       icon:'fas fa-code',          count: skills.length },
  { key:'experiences',  label:'Timeline',     icon:'fas fa-history',       count: experiences.length },
  { key:'services',     label:'Services',     icon:'fas fa-concierge-bell',count: services.length },
  { key:'testimonials', label:'Testimonials', icon:'fas fa-comment-dots',  count: testimonials.length },
  { key:'messages',     label:'Messages',     icon:'fas fa-envelope',      count: messages.filter(m=>!m.read).length },
  { key:'settings',     label:'Settings',     icon:'fas fa-cog' },
];

Real-time onSnapshot listeners (all start on mount):
- projects: orderBy('createdAt','desc')
- skills: orderBy('label')
- experiences: orderBy('order')
- services: orderBy('order')
- testimonials: orderBy('createdAt','desc')
- contactMessages: orderBy('createdAt','desc')

Also on mount: getDoc(siteSettings/notifications) → setSettings(d.data())

Stats bar (4 cards):
Projects (violet rocket) | Skills (cyan code) | Messages (pink envelope, "X unread" sub) | Status (green circle, "Live")

All CRUD operations — port exactly from Dashboard.jsx:
- saveProject(form, id): updateDoc if id, else addDoc; fields: title,category,status,desc,link,icon,color,tags[]
- saveSkill(form, id): fields: label,icon,level,color
- saveExp(form, id): fields: role,company,period,desc,order
- saveSrv(form, id): fields: title,icon,color,desc,order
- saveTest(form, id): fields: name,role,text,avatar
- All deletes use ConfirmModal pattern
- markRead: updateDoc contactMessages/id { read: true }
- deleteMsg: ConfirmModal → deleteDoc

Settings tab fields (exact from original):
- Discord Webhook URL (url input)
- Site Title (text input)
- Maintenance Mode (toggle switch .toggle-switch / .toggle-slider)
- "Initialize Default Data" button

initializeDefaultData inserts exact same default content as original:
3 experiences, 4 services, 3 testimonials (exact text from Dashboard.jsx)

Danger zone (primary admin only): "Export All Data" button (shows toast "Feature coming soon")

## ALL MODALS (port exactly from Dashboard.jsx)

### ProjectModal
Fields: title (text), link/url (url), icon (text), tags (text, comma-separated),
category (select: Web/Android/Bot/IoT/Desktop/Other),
status (select: Active/Completed/Archived), color (color picker), desc (textarea)
handleSave splits tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)

### SkillModal (maxWidth 400)
Fields: label (text), icon (text), level (select: Specialist/Expert/Advanced/Proficient/Learning), color (color picker)

### ExperienceModal
Fields: role (text), company (text), period (text, "e.g. 2023 - Present"), order (number), desc (textarea)

### ServiceModal
Fields: title (text), icon (text), color (color picker), order (number), desc (textarea)

### TestimonialModal
Fields: name (text), role/company (text), avatar URL (text), text (textarea)

### ConfirmModal (maxWidth 360)
Red heading "⚠ Confirm Delete", message text, Cancel + Delete buttons

### Toast
Auto-dismisses after 3500ms, className="toast toast-{type}"

## FOOTER (components/layout/Footer.tsx)
Exact port from Footer.jsx:
- Logo: "ShanuFx" gradient text
- Nav links: Home(/#home), About(/#about), Innovations(/#innovations), Showcase(/showcase), Contact(/#contact)
- Social icons: GitHub, LinkedIn, Facebook, Instagram (circle buttons, hover purple + lift)
- Copyright: `© {year} Shanudha Tirosh (ShanuFx) · Built with React + Firebase · Sri Lanka`
Note: Do not add "Next.js" to copyright — keep original text.

## NOT FOUND (app/not-found.tsx)
Exact port from NotFound.jsx:
- "404" in huge gradient text (8rem, Syne, fontWeight 900)
- Mono comment: "// Page not found in the filesystem"
- "Go Home" btn-primary button → /

## SERVER ACTION (lib/actions/contact.ts)
'use server'
```ts
export async function sendContactMessage(prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  
  if (!name || !email || !message) return { status: 'err' };
  
  // Write to Firestore via Admin SDK
  const { getFirestore } = await import('firebase-admin/firestore');
  const adminDb = getFirestore(adminApp);
  await adminDb.collection('contactMessages').add({
    name, email, message,
    read: false,
    createdAt: new Date(),
  });
  
  // Fire-and-forget Discord webhook
  const settingsDoc = await adminDb.doc('siteSettings/notifications').get();
  const webhook = settingsDoc.data()?.discordWebhook;
  if (webhook) {
    fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `📬 New message from **${name}** (${email}):\n${message}` }),
    }).catch(() => {});
  }
  
  return { status: 'ok' };
}
```
ContactForm uses useActionState/useFormState to consume this action.

## ISR REVALIDATION API (app/api/revalidate/route.ts)
```ts
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const token = req.headers.get('x-revalidate-token');
  if (token !== process.env.REVALIDATE_TOKEN) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { paths } = await req.json();
  for (const path of paths) revalidatePath(path);
  return Response.json({ revalidated: true });
}
```
After every admin CRUD write, call this with paths ['/', '/showcase', '/testimonials'].

## ENVIRONMENT VARIABLES (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
REVALIDATE_TOKEN=your_secret_token_here

## NEXT.CONFIG.TS
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'shanudhatirosh.github.io' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(admin)/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ];
  },
};

export default nextConfig;
```

## SEO ADDITIONS
app/sitemap.ts — list /, /showcase, /testimonials (not admin routes)
app/robots.ts — disallow: /admin, /api

## IMPLEMENTATION ORDER (follow strictly)
1. next.config.ts + .env.local + .env.example
2. styles/globals.css (copy verbatim) + styles/admin.css (copy verbatim)
3. public/ (copy all files: ads.js, projects_sub/, assets/)
4. lib/types/index.ts
5. lib/firebase/config.ts + lib/firebase/admin.ts
6. lib/context/AuthContext.tsx
7. lib/hooks/useTyping.ts + useScrollSpy.ts + useAdBlock.ts
8. lib/actions/contact.ts
9. app/layout.tsx (metadata, providers, font/FA CDN links)
10. components/layout/ParticleCanvas.tsx (dynamic import in layout)
11. components/layout/RightClickProtector.tsx
12. components/layout/AdBlockDetector.tsx
13. components/layout/Navbar.tsx
14. components/layout/Footer.tsx
15. components/home/ (Hero → About → SkillsSection → Experience → Services → Testimonials → Innovations → CTABanner → ContactForm)
16. app/page.tsx
17. components/showcase/ShowcaseClient.tsx
18. app/showcase/page.tsx
19. components/testimonials/TestimonialsClient.tsx
20. app/testimonials/page.tsx
21. components/admin/ (all modals + Toast + DashboardClient)
22. app/(admin)/layout.tsx
23. app/(admin)/login/page.tsx
24. app/(admin)/dashboard/page.tsx
25. app/api/contact/route.ts + app/api/revalidate/route.ts
26. app/not-found.tsx
27. app/sitemap.ts + app/robots.ts

## STRICT RULES
1. Never use 'any' TypeScript type
2. Never rewrite CSS classes — use the exact class names from globals.css and admin.css
3. Never add Tailwind — this project uses custom CSS exclusively
4. ParticleCanvas MUST use dynamic() with { ssr: false }
5. getApps() guard on EVERY Firebase client init
6. All browser-API components (window, document, canvas) need 'use client'
7. The semicolon `;` in the hero println text is a secret /admin navigation trigger
8. Skill level is a TEXT string, not a number (Specialist/Expert/Advanced/Proficient/Learning)
9. Skill name field is `label`, not `name`
10. Project description field is `desc`, not `description`
11. Experience title field is `role`, not `title`
12. siteSettings maintenance key is `maintenance`, not `maintenanceMode`
13. Copyright text must remain "Built with React + Firebase" (not Next.js)
14. Font Awesome loaded via CDN link tag, not npm package
15. Google Fonts loaded via CDN link tag, not next/font
16. After every admin write, POST to /api/revalidate with paths ['/','/showcase','/testimonials']
=================================================================
```

---

## Key Differences This Prompt Fixes vs the Previous Version

1. **Fonts corrected** — DM Sans (body) + Syne (headings), not Clash Display/Sora
2. **Skill schema corrected** — `label` field, text `level` string, not numeric slider
3. **All `desc` fields** — not `description` across Experience, Service, Project
4. **Experience `role`** — not `title`
5. **Particle canvas exact** — 65 dots, blue color `rgba(122,162,247,0.5)`, 140px connection
6. **AdBlock timeout** — 1500ms not 3000ms
7. **`maintenance` key** — not `maintenanceMode`
8. **Hidden admin link** — the semicolon `;` in hero text, not a nav item
9. **Public testimonial form** — TestimonialsPage lets anyone submit
10. **All 16 STATIC_PROJECTS** — exact IDs, links, descriptions
11. **Showcase categories** — All/Android/Web/Bot/IoT (not Web/Mobile/IoT/Tools)
12. **Copyright text** — must keep "React + Firebase" as-is
13. **Section IDs** — exact 8 IDs including `innovations` section
14. **Scroll spy section mapping** — many sections map back to `about` link
15. **RightClickProtector** — blocks on `!user` (any login), not just non-admins
=================================================================