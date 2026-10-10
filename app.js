window.addEventListener("error", (e) => {
  const el = document.getElementById("gate-error");
  if (el) el.textContent = "Error: " + e.message;
});
(function () {
  "use strict";
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= ICONS ================= */
  const ICONS = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7.2a3 3 0 0 0-2.1-2.1C18 4.6 12 4.6 12 4.6s-6 0-7.9.5A3 3 0 0 0 2 7.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 16.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-4.8 31 31 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1L10 15.1Z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3h-3.2v12.2a2.8 2.8 0 1 1-2.8-2.8c.3 0 .6 0 .8.1V9.2a6 6 0 1 0 5.2 6V9.1a7.5 7.5 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-4.3-4.3Z"/></svg>',
    vimeo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7.4c-.1 2-1.5 4.6-4.1 8-2.7 3.5-5 5.2-6.9 5.2-1.2 0-2.2-1.1-3-3.3L6.4 11.4c-.6-2.2-1.2-3.3-1.9-3.3-.1 0-.6.3-1.5.9L2 7.9l2.8-2.5C6 4.3 7 3.8 7.6 3.7c1.5-.1 2.4.9 2.8 3.1.4 2.4.6 3.8.8 4.4.4 1.9.9 2.8 1.4 2.8.4 0 1-.6 1.8-1.9.8-1.3 1.3-2.3 1.3-2.9.1-1.1-.3-1.7-1.3-1.7-.5 0-.9.1-1.4.3.9-3 2.7-4.5 5.3-4.4 1.9.1 2.8 1.3 2.7 3.6Z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="5" width="19" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></svg>'
  };
  const socialIcons = () =>
    S.socials.map((s) => `<a class="icon-link" href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}">${ICONS[s.icon] || ""}</a>`).join("") +
    `<a class="icon-link" href="mailto:${esc(S.email)}" aria-label="Email">${ICONS.email}</a>`;

  /* ================= FILM PLACEHOLDER ENGINE =================
     Low-res canvases that render slow cinematic loops (projector beam,
     set-light bokeh, anamorphic flare, haze) until real footage is added. */
  const PALETTE = [[155, 92, 255], [201, 168, 255], [255, 92, 180], [110, 60, 255], [255, 190, 120]];
  function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
  const live = new Set();

  function setupCanvas(c) {
    if (c._pk) return;
    const r = rng(Number(c.dataset.seed || 1));
    const parts = Array.from({ length: 60 }, () => ({ x: r(), y: r(), z: r(), s: r(), c: PALETTE[Math.floor(r() * PALETTE.length)], p: r() * 6.28 }));
    c._pk = { scene: c.dataset.scene || "haze", parts, r, off: r() * 100 };
    size(c);
    live.add(c);
    draw(c, reduced ? 12 : 0);
  }
  function size(c) {
    const rect = c.getBoundingClientRect();
    const scale = c.classList.contains("gate-canvas") ? 0.35 : 0.5;
    c.width = Math.max(160, Math.min(720, Math.round(rect.width * scale)));
    c.height = Math.max(90, Math.round(c.width * (rect.height / Math.max(rect.width, 1)) || c.width * 0.5625));
  }

  function draw(c, time) {
    const g = c.getContext("2d"), w = c.width, h = c.height, st = c._pk, t = time + st.off;
    g.globalCompositeOperation = "source-over";
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#0d0817"); bg.addColorStop(1, "#05030a");
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = "lighter";
    const flick = 0.92 + Math.sin(t * 13) * 0.03 + Math.sin(t * 31) * 0.02;

    if (st.scene === "beam") {
      const ox = w * 0.08, oy = -h * 0.1, sway = Math.sin(t * 0.25) * w * 0.06;
      const grad = g.createLinearGradient(ox, oy, w * 0.75 + sway, h);
      grad.addColorStop(0, `rgba(220,190,255,${0.55 * flick})`); grad.addColorStop(0.5, "rgba(155,92,255,.18)"); grad.addColorStop(1, "rgba(110,60,255,0)");
      g.fillStyle = grad; g.beginPath(); g.moveTo(ox, oy);
      g.lineTo(w * 0.55 + sway, h * 1.1); g.lineTo(w * 1.05 + sway, h * 0.75); g.closePath(); g.fill();
      st.parts.forEach((p) => {
        const x = ((p.x + t * 0.004 * (p.z + 0.2)) % 1) * w, y = ((p.y + t * 0.006 * p.s) % 1) * h;
        const a = 0.25 + 0.6 * Math.max(0, Math.sin(t * (0.6 + p.s) + p.p));
        g.fillStyle = `rgba(235,220,255,${a * 0.6})`; g.fillRect(x, y, 1 + p.z * 1.2, 1 + p.z * 1.2);
      });
      glow(g, ox + w * 0.02, 0, w * 0.22, [230, 210, 255], 0.5 * flick);
    } else if (st.scene === "bokeh") {
      st.parts.slice(0, 22).forEach((p) => {
        const x = ((p.x + Math.sin(t * 0.08 + p.p) * 0.05 + t * 0.006 * (p.z - 0.5)) % 1 + 1) % 1 * w;
        const y = (p.y + Math.cos(t * 0.1 + p.p) * 0.05) * h;
        const r = (0.03 + p.s * 0.1) * w, a = 0.12 + 0.16 * (0.5 + 0.5 * Math.sin(t * 0.7 + p.p));
        const gr = g.createRadialGradient(x, y, r * 0.6, x, y, r);
        gr.addColorStop(0, `rgba(${p.c},${a * 0.5})`); gr.addColorStop(0.8, `rgba(${p.c},${a})`); gr.addColorStop(1, `rgba(${p.c},0)`);
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.29); g.fill();
      });
    } else if (st.scene === "flare") {
      const hy = h * 0.62, sx = w * (0.5 + Math.sin(t * 0.18) * 0.32);
      const hz = g.createLinearGradient(0, hy - h * 0.3, 0, hy + h * 0.1);
      hz.addColorStop(0, "rgba(42,15,82,0)"); hz.addColorStop(0.8, "rgba(155,92,255,.35)"); hz.addColorStop(1, "rgba(255,120,190,.1)");
      g.fillStyle = hz; g.fillRect(0, 0, w, hy + h * 0.1);
      g.fillStyle = "rgba(0,0,0,.55)"; g.globalCompositeOperation = "source-over"; g.fillRect(0, hy, w, h - hy); g.globalCompositeOperation = "lighter";
      glow(g, sx, hy, w * 0.28, [255, 170, 230], 0.55 * flick);
      glow(g, sx, hy, w * 0.06, [255, 245, 255], 0.9 * flick);
      g.save(); g.translate(sx, hy); g.scale(1, 0.018);
      glow(g, 0, 0, w * 0.9, [190, 150, 255], 0.75 * flick); g.restore();
      [-0.6, -0.3, 0.35, 0.8].forEach((k, i) => {
        const gx = w / 2 + (w / 2 - sx) * k, gy = h / 2 + (h / 2 - hy) * k;
        g.strokeStyle = `rgba(${PALETTE[i % 5]},.22)`; g.lineWidth = 1.2; g.beginPath(); g.arc(gx, gy, w * (0.02 + i * 0.012), 0, 6.29); g.stroke();
      });
    } else {
      st.parts.slice(0, 7).forEach((p, i) => {
        const x = (0.5 + Math.sin(t * 0.07 * (1 + p.s) + p.p) * 0.45) * w;
        const y = (0.5 + Math.cos(t * 0.05 * (1 + p.z) + p.p) * 0.4) * h;
        glow(g, x, y, (0.35 + p.s * 0.4) * w, i % 3 === 0 ? [200, 70, 160] : i % 2 ? [130, 70, 230] : [70, 35, 170], 0.2);
      });
    }
    g.globalCompositeOperation = "source-over";
    const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.6)");
    g.fillStyle = v; g.fillRect(0, 0, w, h);
  }
  function glow(g, x, y, r, c, a) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(1, `rgba(${c},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.29); g.fill();
  }
  let last = 0;
  function loop(now) {
    if (!document.hidden && now - last > 1000 / 30) {
      last = now;
      const vh = window.innerHeight;
      live.forEach((c) => {
        if (!c.isConnected) return live.delete(c);
        const r = c.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) draw(c, now / 1000);
      });
    }
    requestAnimationFrame(loop);
  }
  if (!reduced) requestAnimationFrame(loop);
  window.addEventListener("resize", () => $$("canvas[data-scene]").forEach((c) => { if (c._pk) { size(c); draw(c, performance.now() / 1000); } }));

  /* ================= MEDIA ================= */
  const ytId = (u) => (u || "").match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)?.[1];
  const vimeoId = (u) => (u || "").match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
  let seedN = 1;
  function media(item, scene) {
    const poster = item.image || (ytId(item.embed) ? `https://img.youtube.com/vi/${ytId(item.embed)}/maxresdefault.jpg` : "");
    if (item.video) return `<div class="tile-media"><video src="${esc(item.video)}" ${poster ? `poster="${esc(poster)}"` : ""} muted loop playsinline autoplay preload="metadata"></video></div>`;
    if (poster) return `<div class="tile-media"><img src="${esc(poster)}" alt="" loading="lazy"></div>`;
    return `<div class="tile-media"><canvas data-scene="${esc(scene)}" data-seed="${seedN++}"></canvas></div>`;
  }
  const SCENES = ["beam", "bokeh", "flare", "haze"];

  /* ================= LIGHTBOX ================= */
  function openPlayer(url) {
    let html;
    if (ytId(url)) html = `<iframe src="https://www.youtube.com/embed/${ytId(url)}?autoplay=1&rel=0&modestbranding=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Video"></iframe>`;
    else if (vimeoId(url)) html = `<iframe src="https://player.vimeo.com/video/${vimeoId(url)}?autoplay=1&dnt=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Video"></iframe>`;
    else html = `<video src="${esc(url)}" controls autoplay playsinline></video>`;
    $("#lightbox-frame").innerHTML = html;
    $("#lightbox").classList.add("open"); $("#lightbox").setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }
  function closePlayer() {
    $("#lightbox").classList.remove("open"); $("#lightbox").setAttribute("aria-hidden", "true");
    $("#lightbox-frame").innerHTML = ""; document.body.classList.remove("lightbox-open");
  }
  $(".lightbox-close").addEventListener("click", closePlayer);
  $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closePlayer(); });

  /* ================= VIEWS ================= */
  const pad = (n) => String(n).padStart(2, "0");
  const counts = { releases: S.releases.length, bts: S.bts.length, upcoming: S.upcoming.length };

  const views = {
    home() {
      const tiles = S.tiles.map((t) => `
        <a class="tile reveal" href="#${esc(t.id)}">
          ${media(t, t.scene)}
          <span class="tile-cta">view &rarr;</span>
          ${counts[t.id] != null ? `<span class="tile-count">${pad(counts[t.id])}</span>` : ""}
          <div class="tile-info">
            <h2 class="tile-title">${esc(t.title)}</h2>
            <div class="tile-meta"><span>${esc(t.subtitle)}</span><span class="loc">${esc(t.location)}</span></div>
          </div>
        </a>`).join("");
      const words = S.ticker.map((w) => `<span>${esc(w)}</span>`).join("");
      return `<section class="home"><div class="home-grid">${tiles}</div>
        <div class="ticker" aria-hidden="true"><div class="ticker-track">${words}${words}${words}${words}</div></div></section>`;
    },

    releases() {
      const tiles = S.releases.map((r, i) => `
        <div class="tile reveal" ${r.embed ? `data-embed="${esc(r.embed)}" role="button" tabindex="0" aria-label="Play ${esc(r.title)}"` : ""}>
          ${media(r, SCENES[i % 4])}
          ${r.embed ? `<span class="play" aria-hidden="true"></span>` : ""}
          <span class="tile-count">${esc(r.year)}</span>
          <div class="tile-info">
            <h3 class="tile-title">${esc(r.title)}</h3>
            <div class="tile-meta"><span>${esc(r.subtitle)}</span><span class="loc">${esc(r.location)}</span></div>
          </div>
        </div>`).join("");
      return head("Releases", counts.releases, "Music videos, short films and brand work.") +
        (S.releases.length ? `<div class="film-grid">${tiles}</div>` : empty("First release coming soon."));
    },

    bts() {
      const tiles = S.bts.map((b, i) => `
        <div class="tile reveal" ${b.embed ? `data-embed="${esc(b.embed)}" role="button" tabindex="0" aria-label="Play ${esc(b.caption)}"` : ""}>
          ${media(b, SCENES[(i + 1) % 4])}
          ${b.embed ? `<span class="play" aria-hidden="true"></span>` : ""}
          <div class="tile-info"><h3 class="tile-title">${esc(b.caption)}</h3></div>
        </div>`).join("");
      return head("Behind the scenes", counts.bts, "Stills and moments from set.") +
        (S.bts.length ? `<div class="still-grid">${tiles}</div>` : empty("BTS coming soon."));
    },

    upcoming() {
      const rows = S.upcoming.map((u) => `
        <div class="slot reveal">
          <h3>${esc(u.title)}</h3>
          <span class="slot-date">${esc(u.date)}</span>
          <div class="slot-meta">
            ${u.status ? `<span class="status" data-s="${esc(u.status.toLowerCase())}">${esc(u.status)}</span>` : ""}
            <span>${esc(u.type)}</span>${u.note ? `<span>${esc(u.note)}</span>` : ""}
          </div>
        </div>`).join("");
      return head("Upcoming", counts.upcoming, "What's in development right now.") +
        (S.upcoming.length ? `<div class="schedule">${rows}</div>` : empty("Stay tuned."));
    },

    contact() {
      const rep = S.representation.length
        ? `<h2>Representation</h2>${S.representation.map((r) => `<p class="rep"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a> for ${esc(r.region)}</p>`).join("")}` : "";
      return `<section class="info">
        <p class="info-line reveal">${esc(S.enquiryLine)}</p>
        <a class="info-email reveal" href="mailto:${esc(S.email)}">${esc(S.email)}</a><br>
        <button class="copy reveal" id="copy-email" type="button">copy email</button>
        <div class="tile info-still reveal">${media({}, "haze")}
          <div class="tile-info"><h3 class="tile-title">${esc(S.name)}</h3><div class="tile-meta"><span>${esc(S.role)}</span><span class="loc">Worldwide</span></div></div>
        </div>
        <h2 class="reveal">About</h2>
        ${S.about.map((p) => `<p class="body reveal">${esc(p)}</p>`).join("")}
        ${rep}
        <h2 class="reveal">Socials</h2>
        <div class="socials-row reveal">${S.socials.map((s) => `<a class="social-pill" href="${esc(s.url)}" target="_blank" rel="noopener">${ICONS[s.icon] || ""}${esc(s.label)}</a>`).join("")}</div>
      </section>`;
    }
  };
  function head(title, n, note) {
    return `<div class="page-head"><h1 class="page-title">${esc(title)}<span class="page-count">${pad(n)}</span></h1><p class="page-note">${esc(note)}</p></div>`;
  }
  const empty = (msg) => `<p class="page-note" style="text-align:left;padding:0 var(--gutter)">${esc(msg)}</p>`;

  /* ================= ROUTER ================= */
  function route() {
    if (document.body.classList.contains("locked")) return;
    const id = location.hash.slice(1);
    const name = views[id] ? id : "home";
    const view = $("#view");
    seedN = 1;
    view.innerHTML = views[name]();
    view.classList.remove("view-enter"); void view.offsetWidth; view.classList.add("view-enter");
    $$(".nav > a, .mobile-menu > a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
    document.title = name === "home" ? `${S.name} — ${S.role}` : `${name === "bts" ? "BTS" : name[0].toUpperCase() + name.slice(1)} — ${S.name}`;
    $$("canvas[data-scene]", view).forEach(setupCanvas);
    $$(".reveal", view).forEach((el, i) => { el.style.animationDelay = `${0.15 + Math.min(i, 8) * 0.09}s`; });
    $$("video[autoplay]", view).forEach((v) => v.play().catch(() => {}));
    const copy = $("#copy-email");
    if (copy) copy.addEventListener("click", () => {
      const done = () => { copy.textContent = "copied"; setTimeout(() => (copy.textContent = "copy email"), 1800); };
      (navigator.clipboard ? navigator.clipboard.writeText(S.email) : Promise.reject()).then(done).catch(() => {
        const r = document.createRange(); r.selectNodeContents($(".info-email")); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      });
    });
    window.scrollTo(0, 0);
    setMenu(false);
  }

  $("#view").addEventListener("click", (e) => { const t = e.target.closest("[data-embed]"); if (t) openPlayer(t.dataset.embed); });
  $("#view").addEventListener("keydown", (e) => { if (e.key === "Enter") { const t = e.target.closest("[data-embed]"); if (t) openPlayer(t.dataset.embed); } });
  $$("[data-home]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); history.pushState("", "", location.pathname + location.search); route(); }));
  $$('.mobile-menu a[href="#"]').forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); history.pushState("", "", location.pathname + location.search); route(); }));
  window.addEventListener("hashchange", route);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closePlayer(); setMenu(false); } });

  function setMenu(open) { document.body.classList.toggle("menu-open", open); $("#burger").setAttribute("aria-expanded", String(open)); }
  $("#burger").addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));

  /* cursor-follow ambient light */
  if (!reduced) window.addEventListener("pointermove", (e) => {
    document.documentElement.style.setProperty("--mx", e.clientX + "px");
    document.documentElement.style.setProperty("--my", e.clientY + "px");
  }, { passive: true });

  /* ================= CHROME ================= */
  $("#brand-name").textContent = S.name;
  $("#brand-role").textContent = S.role;
  $("#nav-icons").innerHTML = socialIcons();
  $("#mobile-icons").innerHTML = socialIcons();
  $("#footer-icons").innerHTML = socialIcons();
  $$(".year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ================= PRIVATE SCREENING GATE ================= */
  const gate = $("#gate");
  setupCanvas($(".gate-canvas"));
  live.add($(".gate-canvas"));
  const t0 = performance.now();
  const tc = setInterval(() => {
    const f = Math.floor((performance.now() - t0) / (1000 / 24));
    $("#timecode").textContent = `${pad(Math.floor(f / 86400) % 24)}:${pad(Math.floor(f / 1440) % 60)}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
  }, 42);

  /* SHA-256: native when available, pure-JS fallback for sandboxed / non-https frames */
  function sha256js(str) {
    const K = [], H = [];
    let n = 2, c = 0;
    const frac = (x) => ((x - Math.floor(x)) * 4294967296) | 0;
    while (c < 64) { let p = true; for (let d = 2; d * d <= n; d++) if (n % d === 0) { p = false; break; }
      if (p) { if (c < 8) H[c] = frac(Math.pow(n, 1 / 2)); K[c++] = frac(Math.pow(n, 1 / 3)); } n++; }
    const bytes = [...new TextEncoder().encode(str)], l = bytes.length * 8;
    bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
    for (let i = 7; i >= 0; i--) bytes.push(i > 3 ? 0 : (l >>> (i * 8)) & 255);
    const rot = (x, r) => (x >>> r) | (x << (32 - r)), w = new Array(64);
    for (let o = 0; o < bytes.length; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = (bytes[o + i * 4] << 24) | (bytes[o + i * 4 + 1] << 16) | (bytes[o + i * 4 + 2] << 8) | bytes[o + i * 4 + 3];
      for (let i = 16; i < 64; i++) {
        const s0 = rot(w[i - 15], 7) ^ rot(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = rot(w[i - 2], 17) ^ rot(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      let [A, B, C, D, E, F, G, Hh] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (Hh + (rot(E, 6) ^ rot(E, 11) ^ rot(E, 25)) + ((E & F) ^ (~E & G)) + K[i] + w[i]) | 0;
        const t2 = ((rot(A, 2) ^ rot(A, 13) ^ rot(A, 22)) + ((A & B) ^ (A & C) ^ (B & C))) | 0;
        Hh = G; G = F; F = E; E = (D + t1) | 0; D = C; C = B; B = A; A = (t1 + t2) | 0;
      }
      H[0] = (H[0] + A) | 0; H[1] = (H[1] + B) | 0; H[2] = (H[2] + C) | 0; H[3] = (H[3] + D) | 0;
      H[4] = (H[4] + E) | 0; H[5] = (H[5] + F) | 0; H[6] = (H[6] + G) | 0; H[7] = (H[7] + Hh) | 0;
    }
    return H.map((h) => (h >>> 0).toString(16).padStart(8, "0")).join("");
  }
  async function sha256(text) {
    try {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) { return sha256js(text); }
  }
  function unlock(instant) {
    clearInterval(tc);
    document.body.classList.remove("locked");
    $("#site").hidden = false;
    const done = () => { live.delete($(".gate-canvas")); gate.remove(); };
    if (instant) done(); else { gate.classList.add("opening"); setTimeout(done, 2000); }
    route();
    setTimeout(() => $("#site").classList.add("in"), 30);
  }
  async function tryPassword() {
    const input = $("#gate-input");
    try {
      if ((await sha256(input.value.trim())) === S.passwordHash) return unlock(false);
    } catch (err) {
      $("#gate-error").textContent = "Something went wrong: " + err.message;
      return;
    }
    $("#gate-error").textContent = "That password isn't right. Try again.";
    const f = $("#gate-form"); f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake");
    input.value = ""; input.focus();
  }
  $("#gate-form").addEventListener("submit", (e) => { e.preventDefault(); tryPassword(); });
  $("#gate-btn").addEventListener("click", (e) => { e.preventDefault(); tryPassword(); });
  $("#gate-input").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); tryPassword(); } });
  /* clear any old "already unlocked" flag so the intro always plays */
  try { sessionStorage.removeItem("pk-unlocked"); } catch (e) {}
})();
