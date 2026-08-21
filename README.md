# 🥗 NutriSnap AI - Food Calorie & Nutrient Estimator

NutriSnap AI is a mobile-first Single Page Application (SPA) that estimates food calories and macronutrients directly from photos using the **Google Gemini API** (`gemini-3.6-flash` model).

Built with React, Next.js (App Router), Tailwind CSS, and the official `@google/genai` SDK.

---

## ✨ Features

- 📸 **Dual Image Capture**: Snap photos directly via HTML5 camera stream or upload from your device gallery.
- ⚡ **Gemini 2.5 Flash Vision**: Uses the fast `gemini-2.5-flash` model with strict JSON response schema.
- 📊 **Nutritional Breakdown**: Real-time structured estimates for Total Calories, Protein, Carbs, Fat, Confidence Score, and AI Nutritionist Health Tips.
- 🗜️ **Client-Side Image Auto-Compression**: Automatically compresses photos larger than 4MB down to ~1MB high-quality JPEGs before base64 transmission to minimize payload size and API latency.
- 🔑 **Dual API Key Management**:
  - **Server Proxy**: Protects API keys in production via serverless route `/api/predict` (`GEMINI_API_KEY` in `.env.local`).
  - **User Testing Input**: Optional UI modal for users to input and store their own Google AI Studio API key in `localStorage`.
- 💾 **Local Scan History**: Save past meal scans locally in your browser to track nutrition over time.
- 📱 **Mobile-First & Glassmorphism UI**: Clean, modern dark mode dashboard designed specifically for touch devices and responsive desktops.

---

## 🔑 How to Get a Free Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API key"**.
4. Copy your generated API key string (starts with `AIzaSy...`).

---

## 🛠️ Local Setup & Development

### 1. Prerequisites
- Node.js 18.x or later installed.
- npm, pnpm, or yarn.

### 2. Clone & Install Dependencies

```bash
cd "ai based food calorie estimator"
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API Key:

```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (or open via your mobile browser on local Wi-Fi).

---

## 🌐 Deploying to Public Access

### Option A: Deploying to Vercel (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your project repository.
4. In the **Environment Variables** section, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSy...your_gemini_api_key_here`
5. Click **Deploy**. Vercel will build and host your Next.js App Router SPA with serverless `/api/predict` proxy endpoints.

### Option B: Deploying to Netlify

1. Push your repository to GitHub.
2. Go to [Netlify](https://netlify.com) and select **"Add new site" -> "Import an existing project"**.
3. Select your repository.
4. Set Build Command to `npm run build` and Publish Directory to `.next`.
5. Under **Environment Variables**, add `GEMINI_API_KEY` with your API key.
6. Click **Deploy Site**.

---

## 🧪 API Route Contract

### `POST /api/predict`

#### Request Headers:
- `Content-Type: application/json`
- `x-gemini-key` *(optional)*: Custom user Gemini API key overriding server default.

#### Request Body:
```json
{
  "image": "base64_encoded_jpeg_string...",
  "mimeType": "image/jpeg"
}
```

#### Response (Success 200):
```json
{
  "success": true,
  "data": {
    "food_name": "Grilled Chicken Caesar Salad",
    "total_calories": 420,
    "protein_g": 38,
    "carbs_g": 12,
    "fat_g": 24,
    "confidence_score": "High",
    "health_tip": "High in lean protein! To lower fat calories, request dressing on the side."
  },
  "isNonFood": false
}
```

---

## 🛠️ Project Structure

```
├── app/
│   ├── api/
│   │   └── predict/
│   │       └── route.ts         # Gemini 2.5 Flash API proxy route
│   ├── globals.css              # Tailwind CSS v4 & custom glassmorphism
│   ├── layout.tsx               # Root layout & viewport metadata
│   └── page.tsx                 # Main Single Page Application controller
├── components/
│   ├── ApiKeyModal.tsx          # Custom Gemini API Key config dialog
│   ├── Header.tsx               # Responsive header bar
│   ├── ImagePreviewModal.tsx    # Photo preview & compression metrics
│   ├── ImageUploader.tsx        # Camera snap & drag-and-drop file uploader
│   ├── LoadingSkeleton.tsx      # Laser scanner loading animation & facts
│   ├── NutritionalResultCard.tsx# Macro progress bars & calorie dashboard
│   └── ScanHistory.tsx          # LocalStorage saved meal log drawer
├── Design/
│   └── tasks.md                 # Milestone implementation checklist
├── types/
│   └── nutrition.ts             # TypeScript interface definitions
├── utils/
│   └── imageCompressor.ts       # Client-side canvas image auto-compressor
├── .env.example
├── next.config.mjs
├── package.json
├── README.md
└── tsconfig.json
```

---

## 📄 License

MIT License. Designed with ❤️ using Next.js & Google Gemini 2.5 Flash AI.
