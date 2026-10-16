# Deploying Next.js Frontend to Vercel

### 1. Import Project into Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub / GitLab repository.
3. If your repository contains both `frontend` and `backend`, set:
   * **Root Directory**: `frontend`
   * **Framework Preset**: `Next.js`

### 2. Configure Environment Variables
In the **Environment Variables** section during project creation (or under **Project Settings** > **Environment Variables**), add:

| Key | Value | Description |
|---|---|---|
| `NEXT_PUBLIC_STRAPI_API_URL` | `https://your-strapi-service.onrender.com` | **Required**: URL of your deployed Strapi backend on Render (no trailing slash). |
| `NEXT_PUBLIC_STRAPI_API_TOKEN` | *(Optional)* | Optional Read-Only API token if you generated one in Strapi. |

### 3. Deploy
Click **Deploy**. Vercel will build and launch your frontend with automatic CDN caching and SSL.
