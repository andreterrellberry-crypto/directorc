# 1 Purple Kow — Director Cricket

Static portfolio site modelled on neelscastillon.com, set in a dark purple theme.

- **Password intro:** a "private screening" screen with letterbox bars and a running timecode. Default password `purplekow`.
- **Home:** 4 film tiles (Releases, BTS, Upcoming, Contact & Socials) and a scrolling ticker.
- **Pages:** a releases grid with a video player, a 3-column BTS grid, an upcoming schedule with status tags, and a contact page laid out like the reference's info page.

## Edit
Everything lives in `content.js`: names, email, socials, projects, BTS, upcoming, ticker text.

- **Media:** put files in `assets/` and reference them like `assets/reel.mp4`.
  - `video`: a short muted loop. It autoplays like the reference site.
  - `image`: a poster or still.
  - `embed`: a YouTube or Vimeo link. Clicking the tile opens it in the player.
  - Leave all three blank and the tile shows an animated purple placeholder.
- **Password:** run `printf 'newpass' | sha256sum` and paste the result into `passwordHash`.
- **Font:** the reference uses Universal Sans, a paid font. The site falls back to Inter Tight, a close free match. If you buy a Universal Sans license, put `universal-sans-display-400.woff2` and `universal-sans-display-500.woff2` in `assets/fonts/` and the site uses them automatically.

## Run / deploy
`python3 -m http.server` then open http://localhost:8000. No build step, so any static host works (Vercel, Netlify, GitHub Pages).

> The password gate is client-side. It keeps casual visitors out, but it isn't real security.
