# Implementation Tasks - NutriSnap AI (Food Calorie Estimator)

## Milestone 1: Project Architecture & Environment Setup
- [x] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
- [x] Install dependencies: `@google/genai`, `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`.
- [x] Configure Tailwind CSS and modern dark/light design system.
- [x] Create `.env.example` with `GEMINI_API_KEY` placeholder.

## Milestone 2: Core Utilities & Type Definitions
- [x] Create `types/nutrition.ts` with Gemini API response schemas and app types.
- [x] Create `utils/imageCompressor.ts` for client-side image auto-compression (>4MB to ~1MB high quality JPEG base64).

## Milestone 3: Gemini Vision API Integration (Backend Proxy)
- [x] Create `/api/predict` serverless route (`app/api/predict/route.ts`).
- [x] Implement `@google/genai` SDK initialization (`gemini-2.5-flash`).
- [x] Configure JSON output schema mode matching exact spec:
  - `food_name` (string)
  - `total_calories` (number)
  - `protein_g` (number)
  - `carbs_g` (number)
  - `fat_g` (number)
  - `confidence_score` (string)
  - `health_tip` (string)
- [x] Add support for custom user API key in `x-gemini-key` header with fallback to server `GEMINI_API_KEY`.
- [x] Handle error scenarios: invalid key, non-food detection, payload too large, quota limits.

## Milestone 4: Mobile-First Frontend Components
- [x] Create `components/Header.tsx` with logo, active key status indicator, and API key settings modal button.
- [x] Create `components/ApiKeyModal.tsx` for custom Google AI Studio API key input and `localStorage` persistence.
- [x] Create `components/ImageUploader.tsx` supporting dual input:
  - "Take Photo" (HTML5 camera capture / file input)
  - "Upload File" (drag-and-drop zone)
- [x] Create `components/ImagePreviewModal.tsx` with image preview, dimensions, file size badge, and "Analyze Food" trigger.
- [x] Create `components/LoadingSkeleton.tsx` with scanning laser animation and rotating AI health facts while processing.
- [x] Create `components/NutritionalResultCard.tsx` with:
  - Calorie header with visual flame icon badge.
  - Progress bars with color coding and percentages for Protein, Carbs, Fat.
  - Confidence score badge (High / Medium / Low).
  - AI Health Tip container.
- [x] Create `components/ScanHistory.tsx` for viewing and managing past meal scans saved in `localStorage`.

## Milestone 5: Main Application Assembly & UX Polish
- [x] Assemble `app/page.tsx` with full SPA workflow (Upload -> Preview -> Loading -> Results -> History).
- [x] Add smooth Framer Motion transitions and toast/alert feedback for errors.
- [x] Ensure full mobile-first responsiveness and dark mode elegance.

## Milestone 6: Verification & Deployment Readiness
- [x] Verify TypeScript types (`npx tsc --noEmit`).
- [x] Create detailed `README.md` with setup, API key guide, local testing, and Vercel/Netlify deployment steps.
