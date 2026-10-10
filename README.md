# 1 Purple Kow — Director Cricket

Static portfolio site. Password-protected intro → 4 boxes: **Releases, BTS, Upcoming, Contact & Socials**.

- **Edit content:** `content.js` (projects, BTS, upcoming, email, socials, tile images/videos)
- **Media:** drop images/mp4s in `assets/` and reference them like `assets/my-video.mp4`
- **Password:** default `purplekow`. Change it: `printf 'newpass' | sha256sum` → paste into `passwordHash` in `content.js`
- **Run locally:** `python3 -m http.server` → http://localhost:8000
- **Deploy:** any static host (Vercel, Netlify, GitHub Pages) — no build step.

> Note: the gate is client-side; it keeps casual visitors out but isn't real security for private files.
