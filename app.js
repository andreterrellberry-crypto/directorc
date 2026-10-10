(function () {
  const S = window.SITE;
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const UNLOCK_KEY = "pk-unlocked";

  /* ---------- PASSWORD GATE ---------- */
  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function unlock(instant) {
    try { sessionStorage.setItem(UNLOCK_KEY, "1"); } catch (e) {}
    document.body.classList.remove("locked");
    $("#site").hidden = false;
    if (instant) $("#gate").remove();
    else { $("#gate").classList.add("out"); setTimeout(() => $("#gate").remove(), 1000); }
    requestAnimationFrame(() => requestAnimationFrame(() => $("#site").classList.add("in")));
    route();
  }

  $("#gate-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("#gate-input");
    if ((await sha256(input.value.trim())) === S.passwordHash) return unlock(false);
    $("#gate-error").textContent = "Wrong password";
    const form = $("#gate-form");
    form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
    input.value = "";
  });

  let remembered = false;
  try { remembered = sessionStorage.getItem(UNLOCK_KEY) === "1"; } catch (e) {}
  if (remembered) unlock(true);

  /* ---------- HOME TILES ---------- */
  $("#tiles").innerHTML = S.tiles.map((t, i) => `
    <a class="tile" href="#${esc(t.id)}">
      <div class="tile-media ${t.image || t.video ? "" : "placeholder"}">
        ${t.image ? `<img src="${esc(t.image)}" alt="" loading="lazy">` : ""}
        ${t.video ? `<video src="${esc(t.video)}" muted loop playsinline preload="metadata"></video>` : ""}
      </div>
      <span class="tile-num">0${i + 1}</span>
      <span class="tile-arrow">&nearr;</span>
      <div class="tile-info">
        <h2 class="tile-title">${esc(t.title)}</h2>
        <div class="tile-meta"><span>${esc(t.tagline)}</span><span class="loc">${esc(t.location)}</span></div>
      </div>
    </a>`).join("");

  document.querySelectorAll(".tile").forEach((tile) => {
    const v = tile.querySelector("video");
    if (!v) return;
    tile.addEventListener("mouseenter", () => v.play().catch(() => {}));
    tile.addEventListener("mouseleave", () => { v.pause(); v.currentTime = 0; });
  });

  /* ---------- EMBEDS ---------- */
  function embedUrl(url) {
    if (!url) return "";
    let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return `https://player.vimeo.com/video/${m[1]}?autoplay=1`;
    return url;
  }
  function thumb(item) {
    if (item.image) return item.image;
    const m = (item.embed || "").match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : "";
  }
  function openVideo(url) {
    $("#lightbox-iframe").src = embedUrl(url);
    $("#lightbox").classList.add("open");
    $("#lightbox").setAttribute("aria-hidden", "false");
  }
  function closeVideo() {
    $("#lightbox").classList.remove("open");
    $("#lightbox").setAttribute("aria-hidden", "true");
    $("#lightbox-iframe").src = "";
  }
  $(".lightbox-close").addEventListener("click", closeVideo);
  $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeVideo(); });

  /* ---------- SECTIONS ---------- */
  const card = (item, meta) => {
    const img = thumb(item);
    return `
      <div class="card" ${item.embed ? `data-video="${esc(item.embed)}"` : ""}>
        <div class="card-media">
          ${img ? `<img src="${esc(img)}" alt="${esc(item.title)}" loading="lazy">` : ""}
          ${item.embed ? `<span class="card-play">&#9654;</span>` : ""}
        </div>
        <h3>${esc(item.title)}</h3>
        ${meta}
      </div>`;
  };

  const socialsHtml = () => S.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");

  const sections = {
    releases: () => S.releases.length
      ? `<div class="grid">${S.releases.map((r) => card(r, `<p>${esc(r.type)} · ${esc(r.year)}</p><p class="loc">${esc(r.location)}</p>`)).join("")}</div>`
      : `<p class="empty">Nothing released yet.</p>`,
    bts: () => S.bts.length
      ? `<div class="grid bts-grid">${S.bts.map((b) => card(b, "")).join("")}</div>`
      : `<p class="empty">BTS coming soon.</p>`,
    upcoming: () => S.upcoming.length
      ? `<div class="list">${S.upcoming.map((u) => `
          <div class="list-row">
            <h3>${esc(u.title)}</h3><span class="date">${esc(u.date)}</span>
            <p>${esc(u.type)}${u.note ? " — " + esc(u.note) : ""}</p>
          </div>`).join("")}</div>`
      : `<p class="empty">Stay tuned.</p>`,
    contact: () => `
      <a class="contact-email" href="mailto:${esc(S.email)}">${esc(S.email)}</a>
      <p class="contact-bio">${esc(S.bio)}</p>
      <div class="socials">${socialsHtml()}</div>`
  };

  function route() {
    if (document.body.classList.contains("locked")) return;
    const id = location.hash.slice(1);
    const tile = S.tiles.find((t) => t.id === id);
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
    const panel = $("#panel");
    if (!tile || !sections[id]) {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
      document.body.classList.remove("panel-open");
      return;
    }
    $("#panel-kicker").textContent = String(S.tiles.indexOf(tile) + 1).padStart(2, "0") + " — " + tile.tagline;
    $("#panel-title").textContent = tile.title;
    $("#panel-body").innerHTML = sections[id]();
    panel.scrollTop = 0;
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("panel-open");
  }

  $("#panel-body").addEventListener("click", (e) => {
    const c = e.target.closest("[data-video]");
    if (c) openVideo(c.dataset.video);
  });
  document.querySelectorAll("[data-home]").forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState("", document.title, location.pathname + location.search);
    route();
  }));
  window.addEventListener("hashchange", route);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if ($("#lightbox").classList.contains("open")) closeVideo();
    else if (location.hash) $(".panel-close").click();
  });

  /* ---------- FOOTER ---------- */
  $("#footer-email").textContent = S.email;
  $("#footer-email").href = "mailto:" + S.email;
  $("#footer-bio").textContent = S.bio;
  $("#footer-socials").innerHTML = socialsHtml();
  $("#year").textContent = new Date().getFullYear();
})();
