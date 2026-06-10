# Deployment Guide: AI Supplier Discovery MVP

This guide explains how to run this project locally, configure the OpenAI integration, and deploy it to Vercel.

## Local Development

### 1. Set Up Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Open `.env.local` and add your OpenAI API Key:
```env
OPENAI_API_KEY=sk-proj-...
```
*Note: If `OPENAI_API_KEY` is not present, the app will automatically fall back to an interactive mock supplier generator so you can test all UI pages and inquiry forms without paying for credits.*

### 2. Run the Development Server
Install dependencies (if not done) and run the dev server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Verification

To test the production build locally:
```bash
npm run build
npm run start
```
This runs TypeScript compiling, lint checks, and bundles the application for optimal production speed.

---

## Deploy to Vercel

Since this is a Next.js App Router application, it works out of the box on Vercel.

### Option A: Using the Vercel CLI
1. Install the Vercel CLI if you haven't:
   ```bash
   npm install -g vercel
   ```
2. Link your workspace and deploy:
   ```bash
   vercel
   ```
3. Set your production Environment Variables when prompted, or configure `OPENAI_API_KEY` in the Vercel Dashboard under **Project Settings > Environment Variables**.
4. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option B: GitHub Integration (Recommended)
1. Push this project code to a GitHub repository.
2. Visit [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your repository.
4. Under the **Environment Variables** section, add:
   - Key: `OPENAI_API_KEY`
   - Value: `[Your OpenAI API Key]`
5. Click **Deploy**. Vercel will automatically build and publish your app, providing a production domain.
