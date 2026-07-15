# Community, Real-time Communication & WhatsApp Bot Orchestration

This plan outlines the implementation of a full-scale community platform and a production-grade WhatsApp management bot within the ShanuFx portfolio.

## User Review Required

> [!IMPORTANT]
> **Firebase Project Access**: I will need the configuration details for your **second** Firebase project for Auth.
> **AWS VPS Access**: We will deploy two Docker containers: one for the **LiveKit** signaling server (Voice/Video) and one for the **WhatsApp Bot Core** (Node.js/Baileys).
> **End-to-End Encryption (E2EE)**: Images in Firestore will be encrypted client-side.
> **WhatsApp Pairing**: You will need to provide a pairing code from your WhatsApp account once the bot is initialized on the VPS.

## Proposed Architecture

### 1. Multi-Firebase Auth Configuration
Initialize a secondary Firebase app to handle authentication from your separate project.

#### [NEW] [firebase-auth.ts](file:///c:/Users/tiros/OneDrive/Documents/coding/shanufx-react/shanufx-next/lib/firebase-auth.ts)
*   Configures and exports the secondary Firebase instance.
*   Implements Google, GitHub, and Email/Password flows.

### 2. Community Core (Reddit Style)
*   **Realtime DB**: Used for active "online" status, live typing indicators, and immediate notification counts.
*   **Firestore**: Used for Posts, Comments, Sub-communities, and User Profiles (Persistence).

#### [NEW] [CommunityFeed.tsx](file:///c:/Users/tiros/OneDrive/Documents/coding/shanufx-react/shanufx-next/components/community/CommunityFeed.tsx)
*   Infinite scroll feed for posts.
*   Voting system (Upvote/Downvote).

#### [NEW] [ImageHandler.ts](file:///c:/Users/tiros/OneDrive/Documents/coding/shanufx-react/shanufx-next/lib/utils/ImageHandler.ts)
*   Uses `browser-image-compression` to shrink images.
*   **Encryption**: Implements AES-GCM client-side encryption using the Web Crypto API.
*   Converts to Base64 for Firestore storage.

### 3. Voice & Screen Share (Discord Style)
*   **Signaling**: We will use Firebase Realtime DB to exchange WebRTC "handshakes" (Offers/Answers/ICE Candidates).
*   **Backend (VPS)**: I will provide a Docker/Node.js script to run a **LiveKit** or **Simple-Peer** signaling helper on your AWS server to ensure connections work across all networks (STUN/TURN).

#### [NEW] [VoiceRoom.tsx](file:///c:/Users/tiros/OneDrive/Documents/coding/shanufx-react/shanufx-next/components/community/VoiceRoom.tsx)
*   Discord-style voice channel UI.
*   Toggles for Microphone, Camera, and **Screen Share**.
*   Active speaker highlighting.

### 4. Invite & Guest System
*   **Admin links**: Generate unique URL tokens (e.g., `/community/join?token=xyz`).
*   **Bypass Auth**: If a token is valid, show a "Pick a Username" prompt instead of a login screen. Store this temporary session in firebase 

### 5. WhatsApp Bot Orchestration (Node.js + Baileys)
A production-grade automation bot running on the AWS VPS, synced with the website via Firebase.

#### Features & Logic:
- **Connection**: Pairing code method for seamless link to your WhatsApp account.
- **Hierarchical Menus**: Interactive "Reply with Number" navigation.
- **AI Integration**: Custom AI model (Gemini/OpenAI) used to answer user queries and **manage community chats** (Auto-moderation/responses).
- **Community Management**: Bot can generate **Instant Invite Links** for the website via WhatsApp commands (e.g., `.invite`).
- **Security**: All sensitive credentials (API keys, Firebase Service Account) will be stored in a `.env` file on the VPS.
- **Firebase Admin**: Bot uses a Firebase Service Account for full administrative access to Firestore and Realtime DB.
- **Settings Sync**: Real-time configuration via the Admin Dashboard.
- **Logging**: All bot events and logs forwarded to a dedicated WhatsApp Channel.

#### [NEW] [BotAdminPanel.tsx](file:///c:/Users/tiros/OneDrive/Documents/coding/shanufx-react/shanufx-next/components/admin/BotAdminPanel.tsx)
- Real-time toggles for bot automations.
- View live bot logs and owner management.

### 6. Dashboards
- **Admin Dashboard**: Manage community rules, bot settings, and generate instant invite links.
- **User Dashboard**: View personal profile, joined communities, and linked WhatsApp status.

---

## Proposed Changes

### Configuration Layer

#### [MODIFY] [firebase.ts](file:///c:/Users/tiros/OneDrive/Documents/coding/shanufx-react/shanufx-next/lib/firebase.ts)
Update to support multiple app initializations.

### Component Layer

#### [NEW] [CommunityLayout.tsx](file:///c:/Users/tiros/OneDrive/Documents/coding/shanufx-react/shanufx-next/components/community/CommunityLayout.tsx)
The main container for the community, including a sidebar for channels (Discord style) and a main area for feeds/voice.

#### [NEW] [ChatWindow.tsx](file:///c:/Users/tiros/OneDrive/Documents/coding/shanufx-react/shanufx-next/components/community/ChatWindow.tsx)
Real-time messaging component using Firebase Realtime Database for sub-millisecond latency.

---

## Verification Plan

### Automated Tests
-   Verify Multi-Project Auth initializes without conflict.
-   Test Image Compression: Upload 5MB image -> Verify Firestore doc size < 1MB.

### Manual Verification
-   **Voice/Video Test**: Join room from two different devices -> Verify stream stability.
-   **WhatsApp Bot Connectivity**: Verify pairing code generation and successful connection to VPS.
-   **AI Response**: Verify bot replies using the AI model based on context data.
-   **Menu Navigation**: Test numerical reply navigation (1, 2, 3...) works across all bot categories.
-   **Admin Control**: Toggle bot settings from the website dashboard -> Verify immediate update in WhatsApp.

## Open Questions
(All currently resolved by user feedback).

## Layout & UX Strategy
- **Separate Tabs**: The community will feature a primary navigation toggle to switch between the **Forum (Reddit-style)** and **Real-time Channels (Discord-style)**.
- **Privacy First**: All images are encrypted at the source (client-side) so that even if Firestore is compromised, the image data remains unreadable.
