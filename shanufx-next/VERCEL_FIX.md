# Vercel Deployment Fix

## Problem
Your git repository structure has the Next.js app in a subdirectory:
```
shanufx-react/          ← Git repository root
└── shanufx-next/       ← Next.js app is here
    ├── package.json
    ├── next.config.ts
    └── app/
```

Vercel is trying to build from the root (`shanufx-react`) but can't find Next.js there.

## Solution

### Option 1: Set Root Directory in Vercel Dashboard (EASIEST)

1. Go to: https://vercel.com/dashboard
2. Select your project (ps)
3. Click **Settings** → **General**
4. Scroll to **Root Directory**
5. Enter: `shanufx-next`
6. Click **Save**
7. Go to **Deployments** and click **Redeploy**

### Option 2: If Option 1 Doesn't Work

The vercel.json in this directory is already configured, but Vercel needs to know to look here first.

In your Vercel project settings:
- **Framework Preset**: Next.js
- **Root Directory**: `shanufx-next`
- **Build Command**: `next build` (or leave default)
- **Output Directory**: `.next` (or leave default)  
- **Install Command**: `npm ci` (or leave default)

### Verify Your Settings

After updating, your next deployment should show:
```
✓ Detected Next.js version 16.2.6
✓ Installing dependencies...
✓ Building application...
```

## Contact
If issues persist, contact: info@shanutechx.com
