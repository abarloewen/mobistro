/* ============================================================
   MOBISTRO — Build-Your-Own Configurator (3D)
   Three.js procedural vehicle + live pricing + uploads + save/share
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Data ---------- */
  const BASES = [
    { id: "cart",    name: "Cart & Wagen", price: 16900 },
    { id: "kiosk",   name: "Food Kiosk",   price: 21900 },
    { id: "trailer", name: "Food Trailer", price: 29900 },
    { id: "truck",   name: "Food Truck",   price: 59900 }
  ];
  const COLORS = [
    { id: "ember",    name: "Ember",            hex: "#E0633C" },
    { id: "espresso", name: "Espresso",         hex: "#26201A" },
    { id: "cream",    name: "Crème",            hex: "#EDE4D3" },
    { id: "forest",   name: "Waldgrün",         hex: "#2F4A3A" },
    { id: "navy",     name: "Mitternachtsblau", hex: "#243349" },
    { id: "burgundy", name: "Burgund",          hex: "#5A2330" },
    { id: "brass",    name: "Messing",          hex: "#B08A3E" },
    { id: "white",    name: "Reinweiß",         hex: "#F3F0E9" }
  ];
  const BRANDING = [
    { id: "essential", name: "Essential (Basis-Branding)", price: 0 },
    { id: "premium",   name: "Premium-Vollfolierung",      price: 4500 },
    { id: "signature", name: "Signature-Identität",        price: 9800 }
  ];
  const ADDONS = [
    { id: "awning",   name: "Markise",          price: 1800, visual: true,  info: "Ausziehbare Markise über dem Serviceschalter – Schatten und Auftritt." },
    { id: "lightbar", name: "Leuchtschriftzug", price: 1400, visual: true,  info: "Beleuchteter Schriftzug / LED-Lichtleiste am Dachrand." },
    { id: "solar",    name: "Solar + Batterie", price: 5400, visual: true,  info: "Solarpanel und Batteriespeicher für netzunabhängigen Betrieb." },
    { id: "oven",     name: "Steinofen",        price: 6500, visual: true,  info: "Stein-/Pizzaofen inkl. Abzug auf dem Dach." },
    { id: "espresso", name: "Espresso-Station", price: 3800, visual: false, info: "Profi-Siebträgermaschine und Barista-Setup am Schalter." },
    { id: "fridge",   name: "Kühl-Upgrade",     price: 2900, visual: false, info: "Zusätzliche Kühl- und Gefrierkapazität." },
    { id: "pos",      name: "Kasse & Zahlung",  price: 1200, visual: false, info: "Kassensystem inkl. Karten- und mobiler Zahlung." },
    { id: "halal",    name: "Halal-Ausbau",     price: 1900, visual: false, info: "Halal-konformer Ausbau und Zertifizierungs-Support." },
    { id: "warranty", name: "Garantie 3 Jahre", price: 2400, visual: false, info: "Garantieverlängerung auf 3 Jahre." },
    { id: "delivery", name: "Lieferung DACH",   price: 1500, visual: false, info: "Lieferung innerhalb Deutschland, Österreich und Schweiz." }
  ];
  const GALLERY = [
    { url: "https://images.unsplash.com/photo-1652066144163-7dc1c9b28fed", cap: "Food Truck" },
    { url: "https://images.unsplash.com/photo-1716746708590-d2166f654d3c", cap: "Food Trailer" },
    { url: "https://images.unsplash.com/photo-1776604198818-7b6a90e40a81", cap: "Coffee Cart" },
    { url: "https://images.unsplash.com/photo-1759736859407-a676ed566968", cap: "Food Kiosk" },
    { url: "https://images.unsplash.com/photo-1565731152987-977b0c939e0a", cap: "Street Food" },
    { url: "https://images.unsplash.com/photo-1759693229362-4900c9eef452", cap: "Branding & Wrap" },
    { url: "https://images.unsplash.com/photo-1638132704849-9370475ed2de", cap: "Festival" },
    { url: "https://images.unsplash.com/photo-1735845517926-17fcb36ae90f", cap: "Bei Nacht" }
  ];

  const state = { base: "trailer", color: "ember", branding: "essential", addons: new Set(), files: [] };

  /* ---------- Helpers ---------- */
  const $ = (s) => document.querySelector(s);
  function money(n) {
    try { return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n); }
    catch (e) { return "€" + n.toLocaleString("de-DE"); }
  }
  function basePrice() { return (BASES.find(b => b.id === state.base) || {}).price || 0; }
  function brandPrice() { return (BRANDING.find(b => b.id === state.branding) || {}).price || 0; }
  function addonsPrice() { let s = 0; ADDONS.forEach(a => { if (state.addons.has(a.id)) s += a.price; }); return s; }
  function total() { return basePrice() + brandPrice() + addonsPrice(); }
  function colorHex() { return (COLORS.find(c => c.id === state.color) || COLORS[0]).hex; }

  /* ============================================================
     3D SCENE
     ============================================================ */
  let renderer, scene, camera, controls, vehicle, bodyMat, accentMat, glassMat, darkMat, chromeMat, lightMat, ready = false;
  const addonMeshes = {};
  let autoRotate = true;

  function init3D() {
    const wrap = $("#kfgCanvasWrap");
    if (typeof THREE === "undefined" || !wrap) { fallback2D(); return; }
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch (e) { fallback2D(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (renderer.outputEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
    wrap.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(6.5, 4.2, 8.5);

    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.minDistance = 5; controls.maxDistance = 16;
      controls.maxPolarAngle = Math.PI / 2 - 0.05;
      controls.target.set(0, 1.3, 0);
      controls.autoRotate = true; controls.autoRotateSpeed = 1.1;
    }

    // lights
    scene.add(new THREE.HemisphereLight(0xfff1e0, 0x2a2018, 0.85));
    const key = new THREE.DirectionalLight(0xfff0e0, 1.15);
    key.position.set(6, 10, 6); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1; key.shadow.camera.far = 40;
    key.shadow.camera.left = -10; key.shadow.camera.right = 10;
    key.shadow.camera.top = 10; key.shadow.camera.bottom = -10;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xE0633C, 0.5); fill.position.set(-8, 4, -4); scene.add(fill);

    // ground shadow catcher
    const ground = new THREE.Mesh(new THREE.CircleGeometry(14, 48), new THREE.ShadowMaterial({ opacity: 0.28 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = 0; ground.receiveShadow = true;
    scene.add(ground);

    // materials (bodyMat shared so color updates everywhere)
    bodyMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex()), metalness: 0.15, roughness: 0.5 });
    accentMat = new THREE.MeshStandardMaterial({ color: 0xE0633C, metalness: 0.1, roughness: 0.5 });
    glassMat = new THREE.MeshStandardMaterial({ color: 0x14181c, metalness: 0.6, roughness: 0.12 });
    darkMat = new THREE.MeshStandardMaterial({ color: 0x1c1b1a, metalness: 0.3, roughness: 0.6 });
    chromeMat = new THREE.MeshStandardMaterial({ color: 0xcfd2d6, metalness: 0.9, roughness: 0.25 });
    lightMat = new THREE.MeshStandardMaterial({ color: 0xffe2b0, emissive: 0xE0633C, emissiveIntensity: 1.1, roughness: 0.4 });

    buildVehicle(state.base);
    window.addEventListener("resize", onResize);
    ready = true;
    const loading = $("#kfgLoading"); if (loading) { loading.style.opacity = "0"; setTimeout(() => loading.remove(), 500); }
    animate();
  }

  function M(geo, mat, x, y, z) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m; }
  function boxGeo(w, h, d) { return new THREE.BoxGeometry(w, h, d); }
  function wheel(mat, x, z) {
    const g = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 24), darkMat);
    tire.rotation.x = Math.PI / 2; tire.castShadow = true;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.34, 16), chromeMat);
    hub.rotation.x = Math.PI / 2;
    g.add(tire); g.add(hub); g.position.set(x, 0.42, z);
    return g;
  }

  function buildVehicle(type) {
    if (vehicle) { scene.remove(vehicle); }
    for (const k in addonMeshes) delete addonMeshes[k];
    vehicle = new THREE.Group();
    let anchor = {};

    if (type === "truck") {
      vehicle.add(M(boxGeo(4.8, 0.3, 2.0), darkMat, 0, 0.5, 0));            // chassis
      vehicle.add(M(boxGeo(3.0, 1.8, 1.96), bodyMat, -0.75, 1.6, 0));        // cargo
      vehicle.add(M(boxGeo(1.5, 1.3, 1.9), bodyMat, 1.7, 1.3, 0));           // cab
      vehicle.add(M(boxGeo(1.3, 0.62, 1.94), glassMat, 1.78, 1.62, 0));      // windshield
      vehicle.add(M(boxGeo(2.2, 1.05, 0.05), accentMat, -0.75, 1.7, 1.0));   // window frame
      vehicle.add(M(boxGeo(2.0, 0.85, 0.06), glassMat, -0.75, 1.7, 1.03));   // serving glass
      vehicle.add(M(boxGeo(2.3, 0.08, 0.42), chromeMat, -0.75, 1.2, 1.18));  // counter
      vehicle.add(wheel(darkMat, 1.7, 0.98)); vehicle.add(wheel(darkMat, 1.7, -0.98));
      vehicle.add(wheel(darkMat, -1.5, 0.98)); vehicle.add(wheel(darkMat, -1.5, -0.98));
      anchor = { cx: -0.75, roofY: 2.52, winY: 1.7, winZ: 1.0, bw: 3.0 };
    } else if (type === "trailer") {
      vehicle.add(M(boxGeo(3.8, 0.28, 2.0), darkMat, 0, 0.62, 0));
      vehicle.add(M(boxGeo(3.4, 1.85, 1.96), bodyMat, 0, 1.75, 0));
      vehicle.add(M(boxGeo(2.4, 1.05, 0.05), accentMat, 0, 1.85, 1.0));
      vehicle.add(M(boxGeo(2.2, 0.85, 0.06), glassMat, 0, 1.85, 1.03));
      vehicle.add(M(boxGeo(2.5, 0.08, 0.42), chromeMat, 0, 1.32, 1.18));
      const hitch = M(boxGeo(1.4, 0.12, 0.12), darkMat, 2.4, 0.55, 0); vehicle.add(hitch);
      vehicle.add(M(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 12), chromeMat, 3.0, 0.3, 0));
      vehicle.add(wheel(darkMat, 0.2, 1.0)); vehicle.add(wheel(darkMat, 0.2, -1.0));
      anchor = { cx: 0, roofY: 2.7, winY: 1.85, winZ: 1.0, bw: 3.4 };
    } else if (type === "kiosk") {
      vehicle.add(M(boxGeo(2.4, 0.25, 2.2), darkMat, 0, 0.13, 0));           // base
      vehicle.add(M(boxGeo(2.0, 2.0, 1.9), bodyMat, 0, 1.25, 0));            // booth
      vehicle.add(M(boxGeo(1.5, 0.85, 0.05), accentMat, 0, 1.45, 0.96));     // counter frame
      vehicle.add(M(boxGeo(1.3, 0.7, 0.06), glassMat, 0, 1.55, 0.99));       // window
      vehicle.add(M(boxGeo(1.6, 0.08, 0.42), chromeMat, 0, 1.05, 1.12));     // counter
      // pitched roof
      const roof = M(boxGeo(2.4, 0.18, 2.3), accentMat, 0, 2.32, 0); vehicle.add(roof);
      const roof2 = M(boxGeo(2.0, 0.5, 1.9), bodyMat, 0, 2.6, 0); roof2.rotation.z = 0; vehicle.add(roof2);
      anchor = { cx: 0, roofY: 2.45, winY: 1.55, winZ: 0.96, bw: 1.8 };
    } else { // cart
      vehicle.add(M(boxGeo(1.7, 0.95, 1.2), bodyMat, 0, 1.1, 0));
      vehicle.add(M(boxGeo(1.2, 0.5, 0.05), accentMat, 0, 1.2, 0.62));
      vehicle.add(M(boxGeo(1.0, 0.38, 0.06), glassMat, 0, 1.25, 0.64));
      vehicle.add(M(boxGeo(1.3, 0.07, 0.34), chromeMat, 0, 0.95, 0.78));
      // big spoked wheels
      const w1 = wheel(darkMat, 0.0, 0.66); w1.scale.set(1.4, 1.4, 1); w1.position.y = 0.55; vehicle.add(w1);
      const w2 = wheel(darkMat, 0.0, -0.66); w2.scale.set(1.4, 1.4, 1); w2.position.y = 0.55; vehicle.add(w2);
      // pole + parasol
      vehicle.add(M(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 10), chromeMat, 0.6, 2.0, 0));
      const para = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.5, 20), accentMat);
      para.position.set(0.6, 2.75, 0); para.castShadow = true; vehicle.add(para);
      anchor = { cx: 0, roofY: 1.62, winY: 1.25, winZ: 0.62, bw: 1.2 };
    }

    /* ---- visual add-ons (toggled by state) ---- */
    // Awning
    const awn = M(boxGeo(anchor.bw + 0.4, 0.05, 0.85), accentMat, anchor.cx, anchor.winY + 0.62, anchor.winZ + 0.35);
    awn.rotation.x = 0.32; addonMeshes.awning = awn; vehicle.add(awn);
    // Light bar (emissive along roof front edge)
    const lb = M(boxGeo(anchor.bw, 0.1, 0.1), lightMat, anchor.cx, anchor.roofY - 0.05, anchor.winZ - 0.02);
    addonMeshes.lightbar = lb; vehicle.add(lb);
    // Solar panel on roof
    const sol = new THREE.Mesh(boxGeo(anchor.bw * 0.7, 0.06, 1.2), new THREE.MeshStandardMaterial({ color: 0x1b2a44, metalness: 0.5, roughness: 0.35 }));
    sol.position.set(anchor.cx - 0.2, anchor.roofY + 0.05, -0.1); sol.castShadow = true; addonMeshes.solar = sol; vehicle.add(sol);
    // Oven chimney
    const chim = new THREE.Group();
    chim.add(M(new THREE.CylinderGeometry(0.13, 0.13, 0.7, 14), chromeMat, 0, 0.35, 0));
    chim.add(M(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 14), darkMat, 0, 0.72, 0));
    chim.position.set(anchor.cx - anchor.bw / 2 + 0.3, anchor.roofY, -0.5); addonMeshes.oven = chim; vehicle.add(chim);

    vehicle.position.y = 0;
    scene.add(vehicle);
    applyAddons();
  }

  function applyColor() { if (bodyMat) bodyMat.color.set(colorHex()); }
  function applyAddons() {
    ["awning", "lightbar", "solar", "oven"].forEach(id => { if (addonMeshes[id]) addonMeshes[id].visible = state.addons.has(id); });
  }
  function onResize() {
    const wrap = $("#kfgCanvasWrap"); if (!renderer || !wrap) return;
    camera.aspect = wrap.clientWidth / wrap.clientHeight; camera.updateProjectionMatrix();
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  }
  function animate() {
    requestAnimationFrame(animate);
    if (controls) { controls.autoRotate = autoRotate; controls.update(); }
    renderer.render(scene, camera);
  }
  function resetView() { if (camera) { camera.position.set(6.5, 4.2, 8.5); if (controls) controls.target.set(0, 1.3, 0); } }
  function snapshot() {
    if (!renderer) return;
    renderer.render(scene, camera);
    const a = document.createElement("a");
    a.href = renderer.domElement.toDataURL("image/png");
    a.download = "mobistro-build.png"; a.click();
  }

  /* fallback if no WebGL */
  function fallback2D() {
    const wrap = $("#kfgCanvasWrap"); const loading = $("#kfgLoading");
    if (loading) loading.remove();
    if (wrap) wrap.innerHTML = '<div id="fbVeh" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"></div>';
    renderFallback();
  }
  function renderFallback() {
    const el = document.getElementById("fbVeh"); if (!el) return;
    const c = colorHex();
    el.innerHTML = '<svg width="80%" viewBox="0 0 340 200" fill="none" stroke="#F4EFE7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="70" width="200" height="86" rx="8" fill="' + c + '"/><path d="M220 86h52l36 30v40h-88z" fill="' + c + '"/><rect x="44" y="92" width="120" height="40" rx="5" fill="#14181c" stroke="#E0633C"/><path d="M18 70h156l-8-22H44z" stroke="#E0633C"/><circle cx="78" cy="168" r="17" fill="#1c1b1a"/><circle cx="252" cy="168" r="17" fill="#1c1b1a"/><path d="M20 156h288"/></svg>';
  }

  /* ============================================================
     UI
     ============================================================ */
  const baseIcon = {
    truck: '<svg viewBox="0 0 80 40" fill="none" stroke="#E0633C" stroke-width="2.5"><rect x="4" y="12" width="44" height="20" rx="2"/><path d="M48 16h12l10 8v8H48z"/><circle cx="18" cy="34" r="4"/><circle cx="58" cy="34" r="4"/></svg>',
    trailer: '<svg viewBox="0 0 80 40" fill="none" stroke="#E0633C" stroke-width="2.5"><rect x="10" y="10" width="56" height="22" rx="2"/><circle cx="28" cy="34" r="4"/><circle cx="50" cy="34" r="4"/><path d="M66 22h8"/></svg>',
    kiosk: '<svg viewBox="0 0 80 40" fill="none" stroke="#E0633C" stroke-width="2.5"><rect x="22" y="14" width="36" height="20" rx="2"/><path d="M18 14h44l-8-8H26z"/></svg>',
    cart: '<svg viewBox="0 0 80 40" fill="none" stroke="#E0633C" stroke-width="2.5"><rect x="26" y="14" width="28" height="14" rx="2"/><path d="M40 14V6M28 10c0-6 24-6 24 0"/><circle cx="32" cy="32" r="4"/><circle cx="48" cy="32" r="4"/></svg>'
  };

  function buildUI() {
    // bases
    $("#kfgBases").innerHTML = BASES.map(b =>
      '<button class="kfg-base" data-base="' + b.id + '">' + (baseIcon[b.id] || "") +
      '<div class="nm">' + b.name + '</div><div class="pr">ab ' + money(b.price) + '</div></button>'
    ).join("");
    // swatches
    $("#kfgSwatches").innerHTML = COLORS.map(c =>
      '<span class="kfg-sw" data-color="' + c.id + '" title="' + c.name + '" style="background:' + c.hex + '"></span>'
    ).join("");
    // branding
    $("#kfgBrand").innerHTML = BRANDING.map(b =>
      '<div class="kfg-opt" data-brand="' + b.id + '"><span class="dot"></span><span class="nm">' + b.name + '</span>' +
      '<span class="pr ' + (b.price ? "" : "free") + '">' + (b.price ? "+ " + money(b.price) : "inkl.") + '</span></div>'
    ).join("");
    // addons
    $("#kfgAddons").innerHTML = ADDONS.map(a =>
      '<div class="kfg-chip" data-addon="' + a.id + '" title="' + a.info + '"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg></span>' +
      '<div class="top"><span class="nm">' + a.name + '</span><span class="info">i</span></div>' +
      '<span class="pr">+ ' + money(a.price) + '</span></div>'
    ).join("");
    // gallery
    $("#kfgGallery").innerHTML = GALLERY.map(g =>
      '<div class="kfg-gimg" data-img="' + g.url + '?auto=format&fit=crop&w=1400&q=80"><img loading="lazy" src="' + g.url + '?auto=format&fit=crop&w=600&q=70" alt="' + g.cap + '"><span class="cap">' + g.cap + '</span></div>'
    ).join("");
    syncUI();
  }

  function syncUI() {
    document.querySelectorAll("[data-base]").forEach(el => el.classList.toggle("sel", el.dataset.base === state.base));
    document.querySelectorAll("[data-color]").forEach(el => el.classList.toggle("sel", el.dataset.color === state.color));
    document.querySelectorAll("[data-brand]").forEach(el => el.classList.toggle("sel", el.dataset.brand === state.branding));
    document.querySelectorAll("[data-addon]").forEach(el => el.classList.toggle("sel", state.addons.has(el.dataset.addon)));
    renderSummary();
    renderPrice();
  }

  function renderPrice() {
    const t = money(total());
    const p = $("#kfgPrice"); if (p) { p.textContent = t; p.classList.remove("pulse"); void p.offsetWidth; p.classList.add("pulse"); }
    const tt = $("#kfgTotal"); if (tt) tt.textContent = t;
  }

  function renderSummary() {
    const base = BASES.find(b => b.id === state.base);
    const brand = BRANDING.find(b => b.id === state.branding);
    const color = COLORS.find(c => c.id === state.color);
    let rows = '<div class="kfg-sum-row"><span class="k">Basis</span><span class="v">' + base.name + ' · ' + money(base.price) + '</span></div>';
    rows += '<div class="kfg-sum-row"><span class="k">Lackierung</span><span class="v">' + color.name + '</span></div>';
    rows += '<div class="kfg-sum-row"><span class="k">Branding</span><span class="v">' + brand.name.split(" (")[0] + (brand.price ? ' · ' + money(brand.price) : '') + '</span></div>';
    ADDONS.forEach(a => { if (state.addons.has(a.id)) rows += '<div class="kfg-sum-row"><span class="k">' + a.name + '</span><span class="v">+ ' + money(a.price) + '</span></div>'; });
    if (state.files.length) rows += '<div class="kfg-sum-row"><span class="k">Dateien</span><span class="v">' + state.files.length + ' angehängt</span></div>';
    $("#kfgSummary").innerHTML = rows;
    const ms = $("#kfgModalSummary");
    if (ms) ms.innerHTML = rows + '<div class="kfg-total" style="margin-top:8px;padding-top:8px;"><span class="t">Gesamt</span><span class="a" style="font-size:1.2rem;">' + money(total()) + '</span></div>';
  }

  /* ---------- Files ---------- */
  function addFiles(list) {
    [].forEach.call(list, f => {
      if (state.files.length >= 8) return;
      const item = { name: f.name, type: f.type, url: null };
      if (f.type.indexOf("image") === 0) item.url = URL.createObjectURL(f);
      state.files.push(item);
    });
    renderFiles(); syncUI();
  }
  function renderFiles() {
    $("#kfgFiles").innerHTML = state.files.map((f, i) => {
      const thumb = f.url ? '<img src="' + f.url + '" alt="">' : '<span class="fi">' + (f.name.split(".").pop() || "FILE").toUpperCase().slice(0, 4) + '</span>';
      return '<span class="kfg-file">' + thumb + '<span class="nm">' + f.name + '</span><span class="x" data-rmfile="' + i + '">✕</span></span>';
    }).join("");
  }

  /* ---------- Persist / share ---------- */
  function encodeState() {
    return "b=" + state.base + "&c=" + state.color + "&br=" + state.branding + "&a=" + Array.from(state.addons).join(",");
  }
  function decodeState(str) {
    const p = new URLSearchParams(str);
    if (p.get("b") && BASES.some(b => b.id === p.get("b"))) state.base = p.get("b");
    if (p.get("c") && COLORS.some(c => c.id === p.get("c"))) state.color = p.get("c");
    if (p.get("br") && BRANDING.some(b => b.id === p.get("br"))) state.branding = p.get("br");
    if (p.get("a")) p.get("a").split(",").forEach(id => { if (ADDONS.some(a => a.id === id)) state.addons.add(id); });
  }
  function saveLocal() {
    try { localStorage.setItem("mobistro_build", encodeState()); flash("✓ Konfiguration gespeichert"); } catch (e) { flash("Speichern nicht möglich"); }
  }
  function shareLink() {
    const url = location.origin + location.pathname + "#" + encodeState();
    const done = () => flash("✓ Link kopiert");
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => { location.hash = encodeState(); flash("✓ Link in Adresszeile"); });
    else { location.hash = encodeState(); flash("✓ Link in Adresszeile"); }
  }
  let flashT;
  function flash(msg) { const el = $("#kfgSaved"); if (!el) return; el.textContent = msg; clearTimeout(flashT); flashT = setTimeout(() => el.textContent = "", 2600); }

  /* ---------- Modal ---------- */
  function openModal(id) { const m = document.getElementById(id); if (m) m.classList.add("open"); }
  function closeModals() { document.querySelectorAll(".kfg-modal").forEach(m => m.classList.remove("open")); }

  /* ============================================================
     WIRE
     ============================================================ */
  function wire() {
    $("#kfgBases").addEventListener("click", e => { const b = e.target.closest("[data-base]"); if (!b) return; state.base = b.dataset.base; if (ready) buildVehicle(state.base); syncUI(); });
    $("#kfgSwatches").addEventListener("click", e => { const s = e.target.closest("[data-color]"); if (!s) return; state.color = s.dataset.color; applyColor(); if (!ready) renderFallback(); syncUI(); });
    $("#kfgBrand").addEventListener("click", e => { const o = e.target.closest("[data-brand]"); if (!o) return; state.branding = o.dataset.brand; syncUI(); });
    $("#kfgAddons").addEventListener("click", e => {
      const c = e.target.closest("[data-addon]"); if (!c) return;
      const id = c.dataset.addon;
      if (state.addons.has(id)) state.addons.delete(id); else state.addons.add(id);
      applyAddons(); syncUI();
    });

    // tools
    $("#kfgRotate").addEventListener("click", function () { autoRotate = !autoRotate; this.classList.toggle("on", autoRotate); });
    $("#kfgReset").addEventListener("click", resetView);
    $("#kfgShot").addEventListener("click", snapshot);

    // upload
    const drop = $("#kfgDrop"), input = $("#kfgFileInput");
    drop.addEventListener("click", () => input.click());
    input.addEventListener("change", e => addFiles(e.target.files));
    ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("drag"); }));
    ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("drag"); }));
    drop.addEventListener("drop", e => { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
    $("#kfgFiles").addEventListener("click", e => { const x = e.target.closest("[data-rmfile]"); if (!x) return; state.files.splice(+x.dataset.rmfile, 1); renderFiles(); syncUI(); });

    // actions
    $("#kfgSave").addEventListener("click", saveLocal);
    $("#kfgShare").addEventListener("click", shareLink);
    $("#kfgRequest").addEventListener("click", () => { renderSummary(); saveLocalSilent(); openModal("kfgModal"); });

    // gallery lightbox
    $("#kfgGallery").addEventListener("click", e => { const g = e.target.closest("[data-img]"); if (!g) return; $("#kfgLbImg").src = g.dataset.img; openModal("kfgLightbox"); });

    // modal close + form
    document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModals));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModals(); });
    const form = $("#kfgForm");
    if (form) form.addEventListener("submit", e => { e.preventDefault(); saveLocalSilent(); $("#kfgFormWrap").style.display = "none"; $("#kfgOk").classList.add("show"); });
  }
  function saveLocalSilent() { try { localStorage.setItem("mobistro_build", encodeState()); } catch (e) {} }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    // restore from URL hash or localStorage
    if (location.hash.length > 3) decodeState(location.hash.slice(1));
    else { try { const s = localStorage.getItem("mobistro_build"); if (s) decodeState(s); } catch (e) {} }
    buildUI();
    wire();
    init3D();
  });
})();
