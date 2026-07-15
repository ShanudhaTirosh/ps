# Shanufx Community - Project Status & Documentation

## Current Status
We are in the planning phase for integrating the **Telegram User API** for file storage and enhancing the community platform's UI/UX.

## Technology Stack
- **Framework**: Next.js 16.2.6 (App Router)
- **Library**: React 19.2.4
- **Database/Auth**: Firebase 12.13.0
- **Real-time/Streaming**: LiveKit (Client & Server SDK)
- **Styling**: Vanilla CSS / Custom Styles (Premium "Elite Dark Orange" theme mentioned in history)
- **Animations**: Framer Motion 12.38.0

## Directory Structure
- `app/`: Next.js App Router pages and API routes.
  - `admin/`: Admin dashboard and management.
  - `api/`: Backend API routes (including upcoming Telegram upload).
  - `channels/`: Channel-specific views.
  - `community/`: Main community feed and posts.
  - `dashboard/`: User dashboard.
  - `join/`: Onboarding or joining flow.
- `components/`: Shared UI components.
- `lib/`: Core utilities, hooks, and Firebase configuration.
  - `firebase/config.ts`: Firebase initialization.
- `public/`: Static assets.
- `styles/`: CSS styles.

## Development Commands
- `npm run dev`: Starts the development server on `localhost:3000`.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.

## Coding Standards & Rules
- **Next.js 16**: Be aware of breaking changes and deprecations in this version. Refer to `AGENTS.md` and `node_modules/next/dist/docs/` for specific guidance.
- **Design**: Maintain a premium aesthetic (glassmorphism, smooth gradients, micro-animations).
- **Files to Focus On**: Only modify files explicitly listed or relevant to the current task.

---
*Last Updated: 2026-05-18*
