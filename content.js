/* =========================================================
   1 PURPLE KOW — SITE CONTENT
   Edit everything here. No other file needs touching.
   ========================================================= */
window.SITE = {
  /* Password gate.
     Default password: purplekow
     To change it, run:  printf 'yournewpassword' | sha256sum
     and paste the hash below. */
  passwordHash: "e58a32383f166023350515f032c8172e7084244872148c13281a0d7d62280ea7",

  email: "hello@1purplekow.com",
  bio: "1 Purple Kow is the creative home of Director Cricket — music videos, short films, brand work and everything in between.",

  socials: [
    { label: "Instagram", url: "https://instagram.com/" },
    { label: "YouTube",   url: "https://youtube.com/" },
    { label: "TikTok",    url: "https://tiktok.com/" },
    { label: "Vimeo",     url: "https://vimeo.com/" }
  ],

  /* The 4 main boxes on the home page.
     image: optional poster (put files in /assets)
     video: optional muted loop that plays on hover (mp4 in /assets) */
  tiles: [
    { id: "releases", title: "Releases",            tagline: "Films & music videos", location: "Out now",       image: "", video: "" },
    { id: "bts",      title: "BTS",                 tagline: "Behind the scenes",    location: "On set",        image: "", video: "" },
    { id: "upcoming", title: "Upcoming",            tagline: "In the works",         location: "Coming soon",   image: "", video: "" },
    { id: "contact",  title: "Contact & Socials",   tagline: "Work with me",         location: "Worldwide",     image: "", video: "" }
  ],

  /* RELEASES — embed: paste a YouTube or Vimeo link (thumbnail auto-pulls from YouTube) */
  releases: [
    { title: "Project One",   type: "Music Video", year: "2026", location: "Atlanta, GA", image: "", embed: "" },
    { title: "Project Two",   type: "Short Film",  year: "2026", location: "Los Angeles, CA", image: "", embed: "" },
    { title: "Project Three", type: "Brand Spot",  year: "2025", location: "New York, NY", image: "", embed: "" }
  ],

  /* BTS — photos (image) or clips (embed) */
  bts: [
    { title: "Day 1 — Project One", image: "", embed: "" },
    { title: "Lighting setup",      image: "", embed: "" },
    { title: "Wrap night",          image: "", embed: "" },
    { title: "Location scout",      image: "", embed: "" }
  ],

  /* UPCOMING */
  upcoming: [
    { title: "Untitled Project", type: "Music Video", date: "Winter 2026", note: "In post-production." },
    { title: "Short Film",       type: "Narrative",   date: "Spring 2027", note: "Pre-production." }
  ]
};
