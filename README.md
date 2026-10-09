# Kasmithan — Developer Portfolio

A responsive, single-page developer portfolio built with React and Vite.

## Features
- Responsive layout for mobile, tablet, and desktop
- About, skills, projects, and contact sections
- GitHub links and social/contact calls to action
- Basic SEO metadata and Open Graph tags
- Lightweight React app with Lucide icons

## Run locally
1. Install Node.js (LTS) from https://nodejs.org/
2. Open this folder in VS Code.
3. In the VS Code terminal, run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL shown in the terminal.

## Before publishing
Update `src/App.jsx`:
- Replace the LinkedIn feed link with your public profile URL when available.
- Replace project GitHub profile links with individual repository links when available.
- Confirm the listed skills accurately reflect your experience.

Update `index.html` with any preferred page title and description.

## Profile photo uploads
The portfolio supports changing the public profile photo at `/manage-photo`.
The current image is `public/profile-photo.png`.
Uploads accept JPEG, PNG, and WebP images up to 4 MB. To enable uploads on
Vercel:

1. Open the Vercel project, select **Storage**, create a **Blob** store, and
   connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`.
2. In **Settings → Environment Variables**, add `PROFILE_UPLOAD_PASSWORD` with
   a strong password of at least 16 characters and `PROFILE_SESSION_SECRET`
   with a random secret of at least 32 characters. Generate a session secret
   locally with `openssl rand -base64 32`.
   Keep both values private; never put them in Vite-prefixed variables or
   commit them to Git.
3. Redeploy the project after saving the environment variables.
4. Open `https://kasmithan.vercel.app/manage-photo`, sign in with the upload
   password, and choose the new image. The image is publicly readable as part
   of the portfolio; only uploads are password-protected.

The upload API runs as Vercel Functions and is not available through Vite's
`npm run dev` server.

## Build
```bash
npm run build
```

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. Sign in at https://vercel.com/ and choose **Add New → Project**.
3. Import the portfolio repository.
4. Keep the framework preset as **Vite**. Build command: `npm run build`; output directory: `dist`.
5. Click **Deploy**.
# kasmithan
