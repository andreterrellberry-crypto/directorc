/* =========================================================
   1 PURPLE KOW — SITE CONTENT
   Edit everything here. No other file needs touching.

   MEDIA: put files in /assets and reference them like "assets/reel.mp4".
   - video: short muted loop (mp4, ~5–10s, 1280px wide is plenty). Autoplays like neelscastillon.com.
   - image: poster/still (jpg/webp).
   - embed: full YouTube or Vimeo link — opens in the player when clicked.
   Anything left blank shows an animated purple "film" placeholder.
   ========================================================= */
window.SITE = {
  name: "1 Purple Kow",
  role: "Director Cricket",

  /* Password: purplekow
     To change it run:  printf 'newpassword' | sha256sum   and paste the hash here. */
  passwordHash: "e58a32383f166023350515f032c8172e7084244872148c13281a0d7d62280ea7",

  email: "hello@1purplekow.com",
  enquiryLine: "All enquiries and projects, please write to",
  about: [
    "1 Purple Kow is the creative home of Director Cricket — music videos, short films, brand work and everything in between.",
    "Every project is built around one idea: make the frame feel like a memory you didn't know you had."
  ],
  representation: [
    /* { name: "Agency Name", url: "https://…", region: "US & UK" } */
  ],

  /* icon: instagram | youtube | tiktok | vimeo | x | email */
  socials: [
    { label: "Instagram", url: "https://instagram.com/", icon: "instagram" },
    { label: "YouTube",   url: "https://youtube.com/",   icon: "youtube" },
    { label: "TikTok",    url: "https://tiktok.com/",    icon: "tiktok" },
    { label: "Vimeo",     url: "https://vimeo.com/",     icon: "vimeo" }
  ],

  /* Scrolling line under the 4 boxes */
  ticker: [
    "Now booking — music videos, commercials, short film",
    "Directed by Cricket",
    "1 Purple Kow"
  ],

  /* The 4 main boxes. scene = placeholder animation (beam | bokeh | flare | haze) */
  tiles: [
    { id: "releases", title: "Releases",          subtitle: "Films & music videos",  location: "Out now",     scene: "beam",  video: "", image: "" },
    { id: "bts",      title: "BTS",               subtitle: "Behind the scenes",     location: "On set",      scene: "bokeh", video: "", image: "" },
    { id: "upcoming", title: "Upcoming",          subtitle: "In development",        location: "Coming soon", scene: "flare", video: "", image: "" },
    { id: "contact",  title: "Contact & Socials", subtitle: "Work with me",          location: "Worldwide",   scene: "haze",  video: "", image: "" }
  ],

  releases: [
    { title: "Project One",   subtitle: "Music video",  location: "Atlanta, GA",     year: "2026", video: "", image: "", embed: "" },
    { title: "Project Two",   subtitle: "Short film",   location: "Los Angeles, CA", year: "2026", video: "", image: "", embed: "" },
    { title: "Project Three", subtitle: "Brand film",   location: "New York, NY",    year: "2025", video: "", image: "", embed: "" },
    { title: "Project Four",  subtitle: "Music video",  location: "Houston, TX",     year: "2025", video: "", image: "", embed: "" }
  ],

  bts: [
    { caption: "Project One — day 1",   video: "", image: "", embed: "" },
    { caption: "Lighting the set",      video: "", image: "", embed: "" },
    { caption: "Monitor village",       video: "", image: "", embed: "" },
    { caption: "Location scout",        video: "", image: "", embed: "" },
    { caption: "Golden hour",           video: "", image: "", embed: "" },
    { caption: "Wrap night",            video: "", image: "", embed: "" }
  ],

  /* status shows as a tag: Writing | Pre-production | Shooting | Post-production */
  upcoming: [
    { title: "Untitled Project", type: "Music video", date: "Winter 2026", status: "Post-production", note: "Final grade and sound." },
    { title: "Short Film",       type: "Narrative",   date: "Spring 2027", status: "Pre-production",  note: "Casting now." },
    { title: "Brand Film",       type: "Commercial",  date: "2027",        status: "Writing",         note: "" }
  ]
};
