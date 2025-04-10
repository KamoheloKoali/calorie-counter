# Calorie Counter

A sleek and user-friendly calorie tracking app that lets users upload images of their meals and receive calorie estimates using AI. Built to simplify meal logging, the app uses image analysis to help users keep track of their daily intake—no manual entry needed.

Tech Stack:

    Framework: Next.js (App Router, TypeScript)

    Styling: Tailwind CSS

    Image Uploading: UploadThing

    AI Integration: Gemini API for food image analysis and calorie estimation

    Data Storage: No database (stateless, client-focused)

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/KamoheloKoali/calorie-counter.git
cd calorie-counter
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```env
UPLOADTHING_TOKEN='your_uploadthing_token'
GEMINI_API_KEY='your_gemini_api_key'
NEXT_PUBLIC_APP_URL='http://localhost:3000'
```

Replace `your_uploadthing_token` and `your_gemini_api_key` with your actual API keys.

### Running the Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Building for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Running in Production Mode

After building the project, you can start the production server:

```bash
npm run start
# or
yarn start
# or
pnpm start
```

### Hosting

You can host this project on Vercel or any other hosting service that supports Next.js.

#### Hosting on Vercel

1. Sign up for a Vercel account if you don't have one.
2. Install the Vercel CLI:

```bash
npm install -g vercel
```

3. Deploy the project:

```bash
vercel
```

Follow the prompts to link your project to your Vercel account and deploy it.

For more details, check out the [Vercel documentation](https://vercel.com/docs).

#### Hosting on Other Services

Refer to the documentation of your chosen hosting service for instructions on how to deploy a Next.js application.
