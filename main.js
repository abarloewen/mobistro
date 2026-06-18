/* ============================================================
   MOBISTRO — components, media, animation, interactions
   ============================================================ */

/* ---------- Inline brand mark ---------- */
const LOGO_MARK = `
<svg class="logo-mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="mb_bg" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
      <stop stop-color="#241E18"/><stop offset="1" stop-color="#15120F"/>
    </linearGradient>
    <radialGradient id="mb_gl" cx="0" cy="0" r="1" gradientTransform="translate(36 8) rotate(125) scale(40)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E0633C" stop-opacity="0.55"/><stop offset="1" stop-color="#E0633C" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="url(#mb_bg)" stroke="#3A322A"/>
  <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="url(#mb_gl)"/>
  <path d="M12 33.5 V16.5 L24 26.5 L36 16.5 V33.5" stroke="#F4EFE7" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11 37.5 H37" stroke="#E0633C" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const IC = {
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:13px;height:13px"><path d="M6 9l6 6 6-6"/></svg>`,
  arrow: `<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5"/></svg>`,
  brush: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 14.5L3 21M14 4l6 6-7.5 7.5a3 3 0 0 1-4.2 0l-1.8-1.8a3 3 0 0 1 0-4.2L14 4z"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M7 7H4v6h3c0 2-1 3-3 3v2c3.3 0 5-2.2 5-5V7zm10 0h-3v6h3c0 2-1 3-3 3v2c3.3 0 5-2.2 5-5V7z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.45 2.9h-2.35v7A10 10 0 0022 12z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M4.98 3.5a2.5 2.5 0 11-.01 5.01A2.5 2.5 0 014.98 3.5zM3.2 9h3.6v11.5H3.2zM9.3 9h3.45v1.57h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.3 2.4 4.3 5.5v6.28h-3.6v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.3z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16.5 3c.35 2.2 1.6 3.75 3.9 4.05v2.7c-1.35.05-2.6-.35-3.9-1.1v5.9a5.35 5.35 0 11-5.35-5.35c.3 0 .6.03.9.08v2.8a2.55 2.55 0 00-.9-.17 2.62 2.62 0 102.62 2.62V3z"/></svg>`
};

/* ---------- Placeholder line illustrations (image fallback) ---------- */
const ILLOS = {
  truck: `<svg viewBox="0 0 260 150" fill="none" stroke="#F4EFE7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="52" width="150" height="60" rx="6"/><path d="M164 64h40l28 22v26h-68z"/><path d="M204 64v22h28"/><rect x="30" y="66" width="92" height="30" rx="4" stroke="#E0633C"/><path d="M28 52h120l-6-16H34z" stroke="#E0633C"/><circle cx="60" cy="120" r="13"/><circle cx="190" cy="120" r="13"/><path d="M14 112h232"/></svg>`,
  trailer: `<svg viewBox="0 0 260 150" fill="none" stroke="#F4EFE7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="34" y="46" width="190" height="66" rx="6"/><rect x="52" y="62" width="120" height="34" rx="4" stroke="#E0633C"/><path d="M30 46h198l-8-16H38z" stroke="#E0633C"/><path d="M188 96h26"/><circle cx="92" cy="120" r="12"/><circle cx="170" cy="120" r="12"/><path d="M34 112h190M34 112l-22 8"/></svg>`,
  kiosk: `<svg viewBox="0 0 260 150" fill="none" stroke="#F4EFE7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="64" y="60" width="132" height="62" rx="5"/><rect x="82" y="74" width="96" height="20" rx="3" stroke="#E0633C"/><path d="M82 100h96"/><path d="M52 60h156l-14-26H66z" stroke="#E0633C"/><path d="M64 122h132"/><path d="M130 34V20M118 26h24"/></svg>`,
  cart: `<svg viewBox="0 0 260 150" fill="none" stroke="#F4EFE7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="78" y="70" width="104" height="42" rx="5"/><rect x="92" y="80" width="76" height="22" rx="3" stroke="#E0633C"/><path d="M70 70h120l-12-22H82z" stroke="#E0633C"/><path d="M130 48V22M104 36c0-14 52-14 52 0" stroke="#E0633C"/><circle cx="104" cy="124" r="11"/><circle cx="156" cy="124" r="11"/><path d="M182 92h16"/></svg>`,
  hero: `<svg viewBox="0 0 340 220" fill="none" stroke="#F4EFE7" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="70" width="196" height="86" rx="8"/><path d="M216 86h52l36 30v40h-88z"/><path d="M268 86v30h36"/><rect x="44" y="90" width="120" height="40" rx="5" stroke="#E0633C" stroke-width="3.4"/><path d="M18 70h156l-8-22H44z" stroke="#E0633C" stroke-width="3.4"/><path d="M44 48v22M74 48v22M104 48v22M134 48v22M164 48v22" stroke="#E0633C" stroke-width="2"/><circle cx="78" cy="168" r="17"/><circle cx="252" cy="168" r="17"/><path d="M20 156h288"/></svg>`
};

/* ---------- Free Unsplash imagery (hotlinked CDN; graceful fallback to ILLOS) ---------- */
const IMG_BASE = {
  hero:             "https://images.unsplash.com/photo-1735845517926-17fcb36ae90f",
  food_truck:       "https://images.unsplash.com/photo-1652066144163-7dc1c9b28fed",
  food_trailer:     "https://images.unsplash.com/photo-1716746708590-d2166f654d3c",
  food_kiosk:       "https://images.unsplash.com/photo-1759736859407-a676ed566968",
  coffee_cart:      "https://images.unsplash.com/photo-1776604198818-7b6a90e40a81",
  street_food:      "https://images.unsplash.com/photo-1565731152987-977b0c939e0a",
  vehicle_wrap:     "https://images.unsplash.com/photo-1759693229362-4900c9eef452",
  kitchen_interior: "https://images.unsplash.com/photo-1761095596618-081ea3f043a5",
  festival:         "https://images.unsplash.com/photo-1638132704849-9370475ed2de",
  team_workshop:    "https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5"
};
function imgURL(theme, w) {
  const base = IMG_BASE[theme];
  return base ? `${base}?auto=format&fit=crop&w=${w || 1200}&q=72` : "";
}

/* ---------- Components ---------- */
function buildHeader() {
  const current = document.body.getAttribute("data-page") || "home";
  const links = [
    ["home", "index.html", "nav.home"],
    ["solutions", "solutions.html", "nav.solutions"],
    ["process", "process.html", "nav.process"],
    ["pricing", "pricing.html", "nav.pricing"],
    ["partnership", "partnership.html", "nav.partnership"],
    ["contact", "contact.html", "nav.contact"]
  ];
  const navItems = links.map(([p, href, key]) =>
    `<li><a href="${href}" data-page="${p}" class="${p === current ? "active" : ""}" data-i18n="${key}"></a></li>`
  ).join("");
  const langOpts = (typeof LANGS !== "undefined" ? LANGS : []).map(l =>
    `<button data-lang-opt="${l.code}"><span>${l.label}</span><span class="native">${l.native}</span></button>`
  ).join("");

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container">
      <nav class="nav">
        <a class="brand" href="index.html" aria-label="Mobistro">${LOGO_MARK}<span class="logo-word">Mobi<b>stro</b></span></a>
        <ul class="nav-links" id="navLinks">${navItems}</ul>
        <div class="nav-actions">
          <a class="btn btn--primary cta-quote" href="contact.html" data-i18n="cta.quote"></a>
          <div class="lang" id="langWrap">
            <button class="lang-btn" id="langBtn" aria-haspopup="true" aria-expanded="false">${IC.globe}<span data-lang-current>DE</span>${IC.chevron}</button>
            <div class="lang-menu" role="menu">${langOpts}</div>
          </div>
          <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><span></span></button>
        </div>
      </nav>
    </div>`;
  document.body.prepend(header);

  const bar = document.createElement("div");
  bar.className = "scroll-progress"; bar.id = "scrollProgress";
  document.body.prepend(bar);
}

function buildFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="brand" href="index.html" aria-label="Mobistro">${LOGO_MARK}<span class="logo-word">Mobi<b>stro</b></span></a>
          <p data-i18n="footer.blurb"></p>
          <div class="footer-powered" data-i18n-html="footer.powered"></div>
          <div class="social">
            <a href="https://instagram.com/mobistro" target="_blank" rel="noopener" aria-label="Instagram" data-ic="instagram"></a>
            <a href="https://facebook.com/mobistro" target="_blank" rel="noopener" aria-label="Facebook" data-ic="facebook"></a>
            <a href="https://linkedin.com/company/mobistro" target="_blank" rel="noopener" aria-label="LinkedIn" data-ic="linkedin"></a>
            <a href="https://tiktok.com/@mobistro" target="_blank" rel="noopener" aria-label="TikTok" data-ic="tiktok"></a>
          </div>
        </div>
        <div class="footer-col">
          <h5 data-i18n="footer.explore"></h5>
          <a href="solutions.html" data-i18n="nav.solutions"></a>
          <a href="process.html" data-i18n="nav.process"></a>
          <a href="pricing.html" data-i18n="nav.pricing"></a>
          <a href="partnership.html" data-i18n="nav.partnership"></a>
        </div>
        <div class="footer-col">
          <h5 data-i18n="footer.company"></h5>
          <a href="partnership.html" data-i18n="about.eyebrow"></a>
          <a href="#" data-i18n="footer.imprint"></a>
          <a href="#" data-i18n="footer.privacy"></a>
          <a href="#" data-i18n="footer.terms"></a>
        </div>
        <div class="footer-col">
          <h5 data-i18n="footer.contact"></h5>
          <a href="mailto:hello@mobistro.de">hello@mobistro.de</a>
          <a href="tel:+49000000000">+49 (0) 000 000 00</a>
          <a href="contact.html" data-i18n="cta.quote"></a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span id="yr"></span> Mobistro · <span data-i18n="footer.rights"></span></span>
        <span class="footer-legal"><a href="#" data-i18n="footer.imprint"></a> · <a href="#" data-i18n="footer.privacy"></a> · <a href="#" data-i18n="footer.terms"></a></span>
      </div>
    </div>`;
  document.body.appendChild(footer);
}

/* ---------- Media: photos with SVG fallback ---------- */
function buildMedia() {
  document.querySelectorAll("[data-img]").forEach(el => {
    const theme = el.getAttribute("data-img");
    const illo = el.getAttribute("data-illo");
    const w = el.getAttribute("data-imgw") || "1100";
    const url = imgURL(theme, w);
    if (!url) { if (illo && ILLOS[illo]) el.insertAdjacentHTML("afterbegin", ILLOS[illo]); return; }
    const img = document.createElement("img");
    img.className = "media-img";
    img.alt = ""; img.loading = "lazy"; img.decoding = "async";
    img.src = url;
    img.addEventListener("error", () => {
      img.remove();
      el.classList.add("media-illo");
      if (illo && ILLOS[illo]) el.insertAdjacentHTML("afterbegin", ILLOS[illo]);
    });
    img.addEventListener("load", () => el.classList.add("media-ready"));
    el.insertBefore(img, el.firstChild);
  });

  // page-head background images
  document.querySelectorAll("[data-bg]").forEach(el => {
    const url = imgURL(el.getAttribute("data-bg"), 1600);
    if (url) {
      el.style.backgroundImage = `linear-gradient(rgba(18,15,12,.80), rgba(18,15,12,.90)), url("${url}")`;
      el.classList.add("has-bg");
    }
  });
}

function fillIllos() {
  document.querySelectorAll("[data-illo]").forEach(el => {
    if (el.hasAttribute("data-img")) return;            // photo handles it
    const key = el.getAttribute("data-illo");
    if (ILLOS[key]) el.insertAdjacentHTML("afterbegin", ILLOS[key]);
  });
  document.querySelectorAll("[data-ic]").forEach(el => {
    const key = el.getAttribute("data-ic");
    if (IC[key]) el.innerHTML = IC[key];
  });
}

/* ---------- Money formatting ---------- */
const LOCALES = { de: "de-DE", en: "en-IE", ms: "ms-MY", ar: "ar", fr: "fr-FR", tr: "tr-TR" };
function formatMoney(n) {
  const lang = (window.Mobistro ? Mobistro.getLang() : "de");
  try { return new Intl.NumberFormat(LOCALES[lang] || "de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n); }
  catch (e) { return "€" + Number(n).toLocaleString(); }
}
function renderPrices() {
  document.querySelectorAll(".price[data-price]").forEach(el => { el.textContent = formatMoney(+el.getAttribute("data-price")); });
}

/* ---------- Quote builder ---------- */
function priceOfInput(input) {
  if (!input) return 0;
  const lab = input.closest("label");
  const p = lab ? lab.querySelector(".price") : null;
  return p ? +p.getAttribute("data-price") : 0;
}
function updateBuilder() {
  const form = document.getElementById("builder");
  if (!form) return;
  const base = priceOfInput(form.querySelector('input[name="base"]:checked'));
  const brand = priceOfInput(form.querySelector('input[name="brand"]:checked'));
  let addons = 0;
  form.querySelectorAll('input[name="addon"]:checked').forEach(i => addons += priceOfInput(i));
  const total = base + brand + addons;
  const out = document.getElementById("buildTotal");
  if (out) { out.textContent = formatMoney(total); out.classList.remove("pulse"); void out.offsetWidth; out.classList.add("pulse"); }
}

/* ---------- Testimonials carousel ---------- */
function initCarousel() {
  const root = document.getElementById("tstSlider");
  if (!root) return;
  const slides = [...root.querySelectorAll(".tst-slide")];
  const dotsWrap = document.getElementById("tstDots");
  let i = 0, timer = null;
  slides.forEach((_, idx) => {
    const d = document.createElement("button");
    d.className = "tst-dot"; d.setAttribute("aria-label", "Slide " + (idx + 1));
    d.addEventListener("click", () => { go(idx); restart(); });
    dotsWrap.appendChild(d);
  });
  const dots = [...dotsWrap.children];
  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  }
  function next() { go(i + 1); }
  function restart() { clearInterval(timer); timer = setInterval(next, 6000); }
  const prev = document.getElementById("tstPrev"), nxt = document.getElementById("tstNext");
  if (prev) prev.addEventListener("click", () => { go(i - 1); restart(); });
  if (nxt) nxt.addEventListener("click", () => { go(i + 1); restart(); });
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);
  go(0); restart();
}

/* ---------- Count-up stats ---------- */
function countUp(el) {
  if (el.dataset.counted) return;
  const node = el.firstChild;
  if (!node || node.nodeType !== 3) return;
  const target = parseInt(node.nodeValue, 10);
  if (isNaN(target)) return;
  el.dataset.counted = "1";
  const dur = 1100, start = performance.now();
  (function tick(t) {
    const p = Math.min((t - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    node.nodeValue = Math.round(e * target).toString();
    if (p < 1) requestAnimationFrame(tick); else node.nodeValue = target.toString();
  })(start);
}

/* ---------- Interactions ---------- */
function wire() {
  const wrap = document.getElementById("langWrap");
  const btn = document.getElementById("langBtn");
  if (wrap && btn) {
    btn.addEventListener("click", e => { e.stopPropagation(); const o = wrap.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
    wrap.querySelectorAll("[data-lang-opt]").forEach(opt => {
      opt.addEventListener("click", () => {
        Mobistro.setLang(opt.getAttribute("data-lang-opt"));
        renderPrices(); updateBuilder();
        wrap.classList.remove("open"); btn.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", e => { if (!wrap.contains(e.target)) { wrap.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
    document.addEventListener("keydown", e => { if (e.key === "Escape") wrap.classList.remove("open"); });
  }

  const toggle = document.getElementById("navToggle");
  if (toggle) {
    toggle.addEventListener("click", () => { const o = document.body.classList.toggle("nav-open"); toggle.setAttribute("aria-expanded", o); });
    document.querySelectorAll("#navLinks a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("nav-open")));
  }

  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  const form = document.getElementById("quoteForm");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = document.getElementById("formOk");
    if (ok) { ok.classList.add("show"); ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
    form.reset();
  });

  const builder = document.getElementById("builder");
  if (builder) builder.addEventListener("change", updateBuilder);

  // scroll progress + sticky header state
  const prog = document.getElementById("scrollProgress");
  const head = document.querySelector(".site-header");
  function onScroll() {
    const h = document.documentElement;
    const sc = h.scrollTop || document.body.scrollTop;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    if (prog) prog.style.width = (sc / max * 100) + "%";
    if (head) head.classList.toggle("scrolled", sc > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // reveal + count-up
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          en.target.querySelectorAll && en.target.querySelectorAll(".num").forEach(countUp);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el, idx) => { el.style.transitionDelay = (Math.min(idx % 4, 3) * 70) + "ms"; io.observe(el); });
  } else {
    items.forEach(el => el.classList.add("in"));
    document.querySelectorAll(".num").forEach(countUp);
  }
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  buildFooter();
  buildMedia();
  fillIllos();
  Mobistro.setLang(Mobistro.getLang());
  renderPrices();
  initCarousel();
  updateBuilder();
  wire();
});
