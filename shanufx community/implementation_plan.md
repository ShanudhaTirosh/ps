# Implementation Plan - Telegram File Storage & Community Enhancements

This plan outlines the integration of the Telegram User API for file storage and general enhancements for the Shanufx Community website, focusing on UI/UX improvements, bug fixes, and feature additions.

## User Review Required

> [!IMPORTANT]
> **Telegram User API Integration** requires sensitive credentials (`api_id`, `api_hash`, and a session string). These must be stored securely in `.env.local` and never committed to version control. Using the User API (MTProto) is more complex than the Bot API but allows for higher limits and account-level actions.

> [!WARNING]
> **Next.js 16 Breaking Changes**: This project uses Next.js 16.2.6. We must adhere to the rules in `AGENTS.md` and avoid deprecated APIs.

## Open Questions

- Do you already have the `api_id` and `api_hash` from `my.telegram.org`?
- Do you have a specific Telegram channel or chat ID where files should be stored?
- Are there specific UI bugs or logic issues you have noticed that I should prioritize?

## Proposed Changes

### 1. Telegram Integration (File Upload)

We will use the `gramjs` library to interact with the Telegram User API. This will allow us to upload files directly to a Telegram chat/channel acting as a storage backend.

#### [MODIFY] [package.json](file:///c:/Users/tiros/OneDrive/Documents/coding/shanufx-react/shanufx%20community/package.json)
- Add `gramjs` to dependencies.

#### [MODIFY] [.env.local.example](file:///c:/Users/tiros/OneDrive/Documents/coding/shanufx-react/shanufx%20community/.env.local.example)
- Add placeholders for `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`, and `TELEGRAM_SESSION`.

#### [NEW] `app/api/upload/telegram/route.ts`
- Create a Next.js API route to handle file uploads.
- Initialize `TelegramClient` with the session string.
- Upload the file to a specified chat/channel and return the message/file ID or a link.

### 2. UI/UX Enhancements & Bug Fixes

We will polish the "Elite Dark Orange" theme and improve the overall user experience.

#### [MODIFY] `app/page.tsx` (and other page files)
- Audit and improve layout, ensuring premium aesthetics (glassmorphism, smooth gradients).
- Add micro-animations using `framer-motion` (already in dependencies).
- Fix any visible UI bugs or layout shifts.

#### [MODIFY] `components/` (relevant UI components)
- Ensure components use standard utilities and adhere to the premium design system.
- Fix UI logic (e.g., loading states, error handling).

### 3. Full Build Community Features

Enhance the platform to feel like a complete community hub.

#### [MODIFY] `app/community/` or relevant routes
- Integrate the Telegram upload API into the post creation flow.
- Ensure real-time updates for posts and interactions (voting, comments) using Firebase.

## Verification Plan

### Automated Tests
- We can create a script in the `scratch/` directory to test the Telegram upload functionality independently before integrating it into the API route.

### Manual Verification
- Verify file uploads by checking the target Telegram channel.
- Visual inspection of the UI changes to ensure they meet the "WOW" factor criteria.
