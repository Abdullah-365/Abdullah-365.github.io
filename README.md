# Cipher Core · abdullah.sec

My portfolio. It starts encrypted: visitors complete a TLS-style handshake, pick a clearance level, and the site decrypts around a 3D core made of ~4,000 hex glyphs.

**Live:** https://abdullah1.dev

## Features

- **3D cipher core:** a custom GLSL shader renders every particle as a hex glyph. Glyphs morph from a scattered ciphertext cloud into a sphere, bulge toward the cursor and glitch when you scroll fast. Built with React Three Fiber, with bloom post-processing.
- **Clearance levels:** Recruiter gets a 30-second brief, Engineer gets expanded technical details, and Visitor gets the default tour.
- **Sections that decrypt themselves:** each section shows a decrypt bar as it scrolls into view. Experience is a SIEM event log, education is a certificate chain, skills are an `nmap` scan.
- **Hidden CTF:** five flags are hidden across the site. Submit them in the terminal (bottom right, or press `` ` ``). Submissions are checked against SHA-256 hashes, so the bundle has no answer list.
- **Considerate:** honours `prefers-reduced-motion`, lighter scene on phones and slower GPUs, sound is off by default, no trackers, no cookies.
- **Locked down:** a Content Security Policy that only allows the site's own scripts, fonts bundled with the site (no third-party requests), validated browser storage, and Dependabot for dependency updates.

## Editing content

Everything the site says lives in [`src/data/content.js`](src/data/content.js): profile, projects, experience, education and skills.

## Running locally

```bash
npm install
npm run dev
```

## Deploying

Every push to `main` builds the site and publishes it to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). In the repo settings, **Pages → Source** must be set to **GitHub Actions**.

## Stack

React 19 · Three.js · React Three Fiber · drei · postprocessing · Vite
