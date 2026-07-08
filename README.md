# Sahithi Reddy - AI & Machine Learning Portfolio Website

A premium, recruiter-focused, single-page developer portfolio website built for **Sahithi Reddy**. Inspired by the sleek, minimalist design aesthetics of modern tech companies like Vercel, Stripe, Linear, and OpenAI.

This portfolio highlights projects, internship experiences, skillsets, and certifications in Artificial Intelligence, Machine Learning, and Computer Vision, featuring premium interactions, an interactive 3D particle background, and glassmorphic designs.

---

## 🛠️ Technology Stack

* **Core Framework**: React 19 + TypeScript (Vite)
* **Styling**: Tailwind CSS v4 (using native theme variables)
* **Animations**: Framer Motion (scroll reveals, staggered item animations, springs)
* **3D Background**: Three.js (WebGL rendering of custom gradient particle field with mouse tracking)
* **Icons**: React Icons (Lucide / FontAwesome / Feather)

---

## ✨ Features & Design Implementations

1. **Ambient 3D Particle Field**: A lightweight Three.js particle container that rotates gently and drifts in response to user cursor positioning without introducing high cpu overhead.
2. **Interactive Glassmorphic Cards**: Premium card items featuring translucent background filters (`backdrop-filter`) and border borders, along with local mouse hover glow tracking (adjusts CSS variables `--mouse-x` and `--mouse-y` dynamically).
3. **Typography and Colors**: Dark theme built using slate colors (`#0A0A0A` and `#111827`) highlighted with elegant blue and purple gradients (`#60A5FA` & `#A78BFA`).
4. **Scroll Progress Indicator**: A smooth spring-loaded bar at the top of the screen tracking page scroll progress.
5. **Timeline Journey**: A stylized vertical timeline for career internships featuring scroll reveals and glowing nodes.
6. **Smart Utilities**: An active navigation tracker highlighting current section focus, an email click-to-clipboard copier card, and responsive mobile navigation drawer.

---

## 📁 Folder Structure

```text
Portfolio/
├── public/                 # Static asset folders
├── src/
│   ├── assets/             # Brand logos
│   ├── components/         # Reusable presentation components
│   │   ├── Background3D.tsx# WebGL particles canvas
│   │   ├── Navbar.tsx      # Glassmorphic header
│   │   ├── Hero.tsx        # Title & typewriting hero
│   │   ├── About.tsx       # Bio & key statistics
│   │   ├── Experience.tsx  # Interactive journey timeline
│   │   ├── Projects.tsx    # Staggered project layout
│   │   ├── Skills.tsx      # Staggered technology chips
│   │   ├── Certifications.tsx# Credential validator blocks
│   │   ├── Contact.tsx     # Copy-email & social connects
│   │   └── Footer.tsx      # Design signature
│   ├── hooks/
│   │   └── useMousePosition.ts # Custom glow-coordinates hook
│   ├── App.tsx             # Layout aggregator
│   ├── index.css           # Global theme, font, scroll styles
│   └── main.tsx            # DOM mounting entry
├── index.html              # SEO metadata & page mounting
├── postcss.config.js       # PostCSS plugins config
└── package.json            # Scripts & project dependencies
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or newer)
* npm (v9 or newer)

### 1. Clone & Install Dependencies

```bash
# Navigate to project directory and install packages
npm install
```

### 2. Run Locally (Development Server)

```bash
npm run dev
```

Open the local address printed in the terminal (usually `http://localhost:5173`) in your browser.

### 3. Compile Production Bundle

```bash
npm run build
```

This compiles TypeScript and styles, outputting optimized, minified production assets into the `dist/` directory.

---

## ☁️ Vercel Deployment Instructions

Deploying this Vite React app to **Vercel** is extremely simple:

### Option A: Vercel Dashboard (Recommended)

1. Push your project code to a **GitHub**, **GitLab**, or **Bitbucket** repository.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select and import the repository containing this project.
4. Vercel will automatically detect **Vite** as the framework preset and pre-populate the build settings:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build` (or `vite build`)
   * **Output Directory**: `dist`
5. Click **Deploy**. Your portfolio will be live on a production-ready global CDN in under a minute!

### Option B: Vercel CLI (Command Line)

If you have the Vercel CLI installed globally:

```bash
# Log in to Vercel account
vercel login

# Initialize deployment configuration in the project folder
vercel
```

Follow the interactive setup prompts. Once successfully linked, build and deploy in production mode by running:

```bash
vercel --prod
```
