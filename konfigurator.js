/* ============================================================
   MOBISTRO — Build-Your-Own Configurator (3D · Jewel edition)
   Three.js: env-map reflections, studio lighting, detailed vehicle,
   camera intro, logo-on-truck preview, live pricing, uploads, save/share
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
    { id: "espresso", name: "Espresso",         hex: "#2A2018" },
    { id: "cream",    name: "Crème",            hex: "#E9DEC9" },
    { id: "forest",   name: "Waldgrün",         hex: "#2F4A3A" },
    { id: "navy",     name: "Mitternachtsblau", hex: "#223349" },
    { id: "burgundy", name: "Burgund",          hex: "#5A2330" },
    { id: "brass",    name: "Messing",          hex: "#B08A3E" },
    { id: "white",    name: "Reinweiß",         hex: "#EDEAE3" }
  ];
  const BRANDING = [
    { id: "essential", name: "Essential (Basis-Branding)", price: 0 },
    { id: "premium",   name: "Premium-Vollfolierung",      price: 4500 },
    { id: "signature", name: "Signature-Identität",        price: 9800 }
  ];
  const ADDONS = [
    { id: "awning",   name: "Markise",          price: 1800, visual: true,  info: "Ausziehbare Markise über dem Serviceschalter." },
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

  const state = { base: "trailer", color: "ember", branding: "essential", addons: new Set(), files: [], logoIdx: null };

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
     3D SCENE — Jewel edition
     ============================================================ */
  let renderer, scene, camera, controls, vehicle;
  let bodyMat, trimMat, glassMat, darkMat, chromeMat, lightMat, logoMat, logoPlane;
  const addonMeshes = {};
  let autoRotate = true, ready = false, introStart = null, texLoader;

  function init3D() {
    const wrap = $("#kfgCanvasWrap");
    if (typeof THREE === "undefined" || !wrap) { fallback2D(); return; }
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); }
    catch (e) { fallback2D(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (renderer.outputEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
    if (renderer.physicallyCorrectLights !== undefined) renderer.physicallyCorrectLights = true;
    wrap.appendChild(renderer.domElement);
    texLoader = new THREE.TextureLoader();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(11, 7, 13);

    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.minDistance = 5; controls.maxDistance = 16;
      controls.maxPolarAngle = Math.PI / 2 - 0.04;
      controls.target.set(0, 1.25, 0);
      controls.autoRotate = true; controls.autoRotateSpeed = 1.0;
    }

    /* ---- environment map (procedural studio gradient) for reflections ---- */
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const cv = document.createElement("canvas"); cv.width = 32; cv.height = 256;
      const g = cv.getContext("2d");
      const grd = g.createLinearGradient(0, 0, 0, 256);
      grd.addColorStop(0.0, "#fcf6ea"); grd.addColorStop(0.42, "#cdbfa9");
      grd.addColorStop(0.62, "#6f6357"); grd.addColorStop(1.0, "#171411");
      g.fillStyle = grd; g.fillRect(0, 0, 32, 256);
      // warm highlight band
      g.fillStyle = "rgba(224,99,60,0.5)"; g.fillRect(0, 28, 32, 26);
      const tex = new THREE.CanvasTexture(cv); tex.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = pmrem.fromEquirectangular(tex).texture;
      tex.dispose(); pmrem.dispose();
    } catch (e) {}

    /* ---- lighting ---- */
    scene.add(new THREE.HemisphereLight(0xfff3e2, 0x241c15, 0.7));
    const key = new THREE.DirectionalLight(0xfff1df, 2.0);
    key.position.set(7, 11, 6); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1; key.shadow.camera.far = 45;
    key.shadow.camera.left = -11; key.shadow.camera.right = 11;
    key.shadow.camera.top = 11; key.shadow.camera.bottom = -11;
    key.shadow.bias = -0.0004; key.shadow.radius = 4;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xE0633C, 1.4); rim.position.set(-9, 5, -7); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xbcd0ff, 0.5); fill.position.set(-4, 3, 8); scene.add(fill);

    /* ---- studio floor: glossy pedestal disc + soft contact shadow ---- */
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(7.5, 7.5, 0.3, 64),
      new THREE.MeshStandardMaterial({ color: 0x1a1714, metalness: 0.4, roughness: 0.35 })
    );
    disc.position.y = -0.15; disc.receiveShadow = true; scene.add(disc);
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(7.4, 56), new THREE.ShadowMaterial({ opacity: 0.4 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; shadow.receiveShadow = true; scene.add(shadow);

    /* ---- materials ---- */
    const MP = THREE.MeshPhysicalMaterial ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
    bodyMat = new MP({ color: new THREE.Color(colorHex()), metalness: 0.25, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.28, envMapIntensity: 1.0 });
    trimMat = new THREE.MeshStandardMaterial({ color: 0xE0633C, metalness: 0.3, roughness: 0.45, envMapIntensity: 1.0 });
    glassMat = new THREE.MeshStandardMaterial({ color: 0x0c0f13, metalness: 0.7, roughness: 0.08, envMapIntensity: 1.4 });
    darkMat = new THREE.MeshStandardMaterial({ color: 0x161514, metalness: 0.35, roughness: 0.55, envMapIntensity: 0.8 });
    chromeMat = new THREE.MeshStandardMaterial({ color: 0xd2d5da, metalness: 1.0, roughness: 0.18, envMapIntensity: 1.5 });
    lightMat = new THREE.MeshStandardMaterial({ color: 0xffe6bf, emissive: 0xE0633C, emissiveIntensity: 1.3, roughness: 0.4 });
    logoMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1, depthWrite: false });

    buildVehicle(state.base);
    window.addEventListener("resize", onResize);
    ready = true;
    const loading = $("#kfgLoading"); if (loading) { loading.style.opacity = "0"; setTimeout(() => loading.remove(), 500); }
    requestAnimationFrame(animate);
  }

  function M(geo, mat, x, y, z) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m; }
  function B(w, h, d) { return new THREE.BoxGeometry(w, h, d); }
  function wheel(x, z, scale) {
    const g = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 28), darkMat);
    tire.rotation.x = Math.PI / 2; tire.castShadow = true;
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.32, 20), chromeMat);
    rim.rotation.x = Math.PI / 2;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.34, 10), darkMat);
    hub.rotation.x = Math.PI / 2;
    g.add(tire); g.add(rim); g.add(hub);
    g.position.set(x, 0.42, z); if (scale) g.scale.set(scale, scale, 1);
    return g;
  }
  function headlight(x, z) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), lightMat); m.position.set(x, 1.0, z); return m; }

  function buildVehicle(type) {
    if (vehicle) scene.remove(vehicle);
    for (const k in addonMeshes) delete addonMeshes[k];
    logoPlane = null;
    vehicle = new THREE.Group();
    let a = {};

    if (type === "truck") {
      vehicle.add(M(B(5.0, 0.34, 2.06), darkMat, 0, 0.5, 0));
      vehicle.add(M(B(3.0, 1.8, 1.98), bodyMat, -0.75, 1.62, 0));
      vehicle.add(M(B(2.86, 0.12, 1.99), trimMat, -0.75, 0.78, 0));        // lower trim
      vehicle.add(M(B(3.02, 0.1, 2.0), darkMat, -0.75, 2.52, 0));          // roof edge
      vehicle.add(M(B(1.55, 1.3, 1.92), bodyMat, 1.78, 1.28, 0));          // cab
      vehicle.add(M(B(1.3, 0.6, 1.96), glassMat, 1.86, 1.62, 0));          // windshield
      vehicle.add(M(B(0.5, 1.25, 1.96), glassMat, 1.1, 1.28, 0));          // cab side
      vehicle.add(M(B(0.22, 0.5, 2.0), chromeMat, 2.58, 0.95, 0));         // grille/bumper
      vehicle.add(headlight(2.55, 0.8)); vehicle.add(headlight(2.55, -0.8));
      vehicle.add(M(B(2.22, 1.08, 0.06), trimMat, -0.75, 1.72, 1.0));      // window frame
      vehicle.add(M(B(2.0, 0.86, 0.06), glassMat, -0.75, 1.72, 1.04));     // serving glass
      vehicle.add(M(B(2.3, 0.09, 0.44), chromeMat, -0.75, 1.2, 1.2));      // counter
      vehicle.add(M(B(2.96, 0.04, 1.94), bodyMat, -0.75, 2.45, 0));        // roof top (slight inset)
      vehicle.add(wheel(1.75, 0.99)); vehicle.add(wheel(1.75, -0.99));
      vehicle.add(wheel(-1.55, 0.99)); vehicle.add(wheel(-1.55, -0.99));
      a = { cx: -0.75, roofY: 2.55, winY: 1.72, winZ: 1.0, bw: 3.0 };
    } else if (type === "trailer") {
      vehicle.add(M(B(3.9, 0.3, 2.04), darkMat, 0, 0.62, 0));
      vehicle.add(M(B(3.4, 1.9, 1.98), bodyMat, 0, 1.78, 0));
      vehicle.add(M(B(3.26, 0.12, 1.99), trimMat, 0, 0.92, 0));
      vehicle.add(M(B(3.44, 0.1, 2.02), darkMat, 0, 2.72, 0));
      vehicle.add(M(B(2.42, 1.08, 0.06), trimMat, 0, 1.88, 1.0));
      vehicle.add(M(B(2.2, 0.86, 0.06), glassMat, 0, 1.88, 1.04));
      vehicle.add(M(B(2.5, 0.09, 0.44), chromeMat, 0, 1.34, 1.2));
      vehicle.add(M(B(3.36, 0.04, 1.94), bodyMat, 0, 2.66, 0));
      vehicle.add(M(B(1.5, 0.13, 0.13), darkMat, 2.45, 0.55, 0));          // hitch
      vehicle.add(M(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12), chromeMat, 3.05, 0.3, 0));
      vehicle.add(wheel(0.2, 1.02)); vehicle.add(wheel(0.2, -1.02));
      a = { cx: 0, roofY: 2.72, winY: 1.88, winZ: 1.0, bw: 3.4 };
    } else if (type === "kiosk") {
      vehicle.add(M(B(2.5, 0.28, 2.3), darkMat, 0, 0.14, 0));
      vehicle.add(M(B(2.0, 2.0, 1.9), bodyMat, 0, 1.28, 0));
      vehicle.add(M(B(1.5, 0.86, 0.06), trimMat, 0, 1.5, 0.96));
      vehicle.add(M(B(1.3, 0.7, 0.06), glassMat, 0, 1.58, 0.99));
      vehicle.add(M(B(1.7, 0.09, 0.44), chromeMat, 0, 1.08, 1.12));
      vehicle.add(M(B(2.5, 0.16, 2.4), trimMat, 0, 2.38, 0));              // roof slab
      vehicle.add(M(B(2.06, 0.5, 1.96), bodyMat, 0, 2.62, 0));             // roof box
      a = { cx: 0, roofY: 2.46, winY: 1.58, winZ: 0.96, bw: 1.8 };
    } else { // cart
      vehicle.add(M(B(1.7, 1.0, 1.2), bodyMat, 0, 1.12, 0));
      vehicle.add(M(B(1.64, 0.1, 1.21), trimMat, 0, 0.66, 0));
      vehicle.add(M(B(1.2, 0.5, 0.06), trimMat, 0, 1.22, 0.62));
      vehicle.add(M(B(1.0, 0.38, 0.06), glassMat, 0, 1.26, 0.65));
      vehicle.add(M(B(1.3, 0.08, 0.36), chromeMat, 0, 0.96, 0.8));
      vehicle.add(wheel(0.0, 0.66, 1.45)); vehicle.add(wheel(0.0, -0.66, 1.45));
      vehicle.add(M(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 10), chromeMat, 0.62, 2.05, 0));
      const para = new THREE.Mesh(new THREE.ConeGeometry(1.35, 0.55, 22), trimMat);
      para.position.set(0.62, 2.8, 0); para.castShadow = true; vehicle.add(para);
      a = { cx: 0, roofY: 1.64, winY: 1.26, winZ: 0.62, bw: 1.2 };
    }

    /* visual add-ons */
    const awn = M(B(a.bw + 0.4, 0.05, 0.9), trimMat, a.cx, a.winY + 0.64, a.winZ + 0.38); awn.rotation.x = 0.32; addonMeshes.awning = awn; vehicle.add(awn);
    const lb = M(B(a.bw, 0.1, 0.1), lightMat, a.cx, a.roofY - 0.02, a.winZ - 0.02); addonMeshes.lightbar = lb; vehicle.add(lb);
    const sol = new THREE.Mesh(B(a.bw * 0.72, 0.06, 1.2), new THREE.MeshStandardMaterial({ color: 0x16243c, metalness: 0.6, roughness: 0.3, envMapIntensity: 1.1 }));
    sol.position.set(a.cx - 0.2, a.roofY + 0.07, -0.1); sol.castShadow = true; addonMeshes.solar = sol; vehicle.add(sol);
    const chim = new THREE.Group();
    chim.add(M(new THREE.CylinderGeometry(0.13, 0.13, 0.72, 16), chromeMat, 0, 0.36, 0));
    chim.add(M(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16), darkMat, 0, 0.74, 0));
    chim.position.set(a.cx - a.bw / 2 + 0.32, a.roofY, -0.5); addonMeshes.oven = chim; vehicle.add(chim);

    /* logo decal plane (hidden until a logo is set) */
    logoPlane = new THREE.Mesh(B(Math.min(a.bw * 0.55, 1.5), 0.55, 0.02), logoMat);
    logoPlane.position.set(a.cx, a.winY + 0.62, a.winZ + 0.03);
    logoPlane.visible = false; vehicle.add(logoPlane);

    scene.add(vehicle);
    applyAddons();
    applyLogo();
  }

  function applyColor() { if (bodyMat) bodyMat.color.set(colorHex()); }
  function applyAddons() { ["awning", "lightbar", "solar", "oven"].forEach(id => { if (addonMeshes[id]) addonMeshes[id].visible = state.addons.has(id); }); }
  function applyLogo() {
    if (!logoPlane || !texLoader) return;
    const f = (state.logoIdx != null) ? state.files[state.logoIdx] : null;
    if (f && f.url) {
      texLoader.load(f.url, (t) => {
        if (t.encoding !== undefined) t.encoding = THREE.sRGBEncoding;
        logoMat.map = t; logoMat.needsUpdate = true; logoPlane.visible = true;
      });
    } else { logoMat.map = null; logoMat.needsUpdate = true; logoPlane.visible = false; }
  }
  function onResize() { const wrap = $("#kfgCanvasWrap"); if (!renderer || !wrap) return; camera.aspect = wrap.clientWidth / wrap.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(wrap.clientWidth, wrap.clientHeight); }
  function animate(t) {
    requestAnimationFrame(animate);
    if (introStart === null) introStart = t;
    const e = Math.min((t - introStart) / 1500, 1);
    if (e < 1) {
      const k = 1 - Math.pow(1 - e, 3);
      camera.position.set(11 - (11 - 6.8) * k, 7 - (7 - 4.3) * k, 13 - (13 - 8.8) * k);
      camera.lookAt(0, 1.25, 0);
    } else if (controls) { controls.autoRotate = autoRotate; controls.update(); }
    renderer.render(scene, camera);
  }
  function resetView() { introStart = null; if (controls) controls.target.set(0, 1.25, 0); }
  function snapshot() { if (!renderer) return; renderer.render(scene, camera); const a = document.createElement("a"); a.href = renderer.domElement.toDataURL("image/png"); a.download = "mobistro-build.png"; a.click(); }

  function fallback2D() {
    const wrap = $("#kfgCanvasWrap"), loading = $("#kfgLoading");
    if (loading) loading.remove();
    if (wrap) wrap.innerHTML = '<div id="fbVeh" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"></div>';
    renderFallback();
  }
  function renderFallback() {
    const el = document.getElementById("fbVeh"); if (!el) return; const c = colorHex();
    el.innerHTML = '<svg width="80%" viewBox="0 0 340 200" fill="none" stroke="#F4EFE7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="70" width="200" height="86" rx="8" fill="' + c + '"/><path d="M220 86h52l36 30v40h-88z" fill="' + c + '"/><rect x="44" y="92" width="120" height="40" rx="5" fill="#0c0f13" stroke="#E0633C"/><path d="M18 70h156l-8-22H44z" stroke="#E0633C"/><circle cx="78" cy="168" r="17" fill="#161514"/><circle cx="252" cy="168" r="17" fill="#161514"/><path d="M20 156h288"/></svg>';
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
    $("#kfgBases").innerHTML = BASES.map(b => '<button class="kfg-base" data-base="' + b.id + '">' + (baseIcon[b.id] || "") + '<div class="nm">' + b.name + '</div><div class="pr">ab ' + money(b.price) + '</div></button>').join("");
    $("#kfgSwatches").innerHTML = COLORS.map(c => '<span class="kfg-sw" data-color="' + c.id + '" title="' + c.name + '" style="background:' + c.hex + '"></span>').join("");
    $("#kfgBrand").innerHTML = BRANDING.map(b => '<div class="kfg-opt" data-brand="' + b.id + '"><span class="dot"></span><span class="nm">' + b.name + '</span><span class="pr ' + (b.price ? "" : "free") + '">' + (b.price ? "+ " + money(b.price) : "inkl.") + '</span></div>').join("");
    $("#kfgAddons").innerHTML = ADDONS.map(a => '<div class="kfg-chip" data-addon="' + a.id + '" title="' + a.info + '"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg></span><div class="top"><span class="nm">' + a.name + '</span><span class="info">i</span></div><span class="pr">+ ' + money(a.price) + '</span></div>').join("");
    $("#kfgGallery").innerHTML = GALLERY.map(g => '<div class="kfg-gimg" data-img="' + g.url + '?auto=format&fit=crop&w=1400&q=80"><img loading="lazy" src="' + g.url + '?auto=format&fit=crop&w=600&q=70" alt="' + g.cap + '"><span class="cap">' + g.cap + '</span></div>').join("");
    syncUI();
  }

  function syncUI() {
    document.querySelectorAll("[data-base]").forEach(el => el.classList.toggle("sel", el.dataset.base === state.base));
    document.querySelectorAll("[data-color]").forEach(el => el.classList.toggle("sel", el.dataset.color === state.color));
    document.querySelectorAll("[data-brand]").forEach(el => el.classList.toggle("sel", el.dataset.brand === state.branding));
    document.querySelectorAll("[data-addon]").forEach(el => el.classList.toggle("sel", state.addons.has(el.dataset.addon)));
    renderSummary(); renderPrice();
  }
  function renderPrice() {
    const t = money(total());
    const p = $("#kfgPrice"); if (p) { p.textContent = t; p.classList.remove("pulse"); void p.offsetWidth; p.classList.add("pulse"); }
    const tt = $("#kfgTotal"); if (tt) tt.textContent = t;
  }
  function renderSummary() {
    const base = BASES.find(b => b.id === state.base), brand = BRANDING.find(b => b.id === state.branding), color = COLORS.find(c => c.id === state.color);
    let rows = '<div class="kfg-sum-row"><span class="k">Basis</span><span class="v">' + base.name + ' · ' + money(base.price) + '</span></div>';
    rows += '<div class="kfg-sum-row"><span class="k">Lackierung</span><span class="v">' + color.name + '</span></div>';
    rows += '<div class="kfg-sum-row"><span class="k">Branding</span><span class="v">' + brand.name.split(" (")[0] + (brand.price ? ' · ' + money(brand.price) : '') + '</span></div>';
    ADDONS.forEach(a => { if (state.addons.has(a.id)) rows += '<div class="kfg-sum-row"><span class="k">' + a.name + '</span><span class="v">+ ' + money(a.price) + '</span></div>'; });
    if (state.logoIdx != null) rows += '<div class="kfg-sum-row"><span class="k">Logo</span><span class="v">auf Fahrzeug</span></div>';
    if (state.files.length) rows += '<div class="kfg-sum-row"><span class="k">Dateien</span><span class="v">' + state.files.length + ' angehängt</span></div>';
    $("#kfgSummary").innerHTML = rows;
    const ms = $("#kfgModalSummary");
    if (ms) ms.innerHTML = rows + '<div class="kfg-total" style="margin-top:8px;padding-top:8px;"><span class="t">Gesamt</span><span class="a" style="font-size:1.2rem;">' + money(total()) + '</span></div>';
  }

  /* ---------- Files + logo ---------- */
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
      const logoBtn = f.url ? '<span class="logo-btn ' + (state.logoIdx === i ? "on" : "") + '" data-logo="' + i + '" title="Logo auf Fahrzeug">🚚</span>' : '';
      return '<span class="kfg-file">' + thumb + '<span class="nm">' + f.name + '</span>' + logoBtn + '<span class="x" data-rmfile="' + i + '">✕</span></span>';
    }).join("");
  }

  /* ---------- Persist / share ---------- */
  function encodeState() { return "b=" + state.base + "&c=" + state.color + "&br=" + state.branding + "&a=" + Array.from(state.addons).join(","); }
  function decodeState(str) {
    const p = new URLSearchParams(str);
    if (p.get("b") && BASES.some(b => b.id === p.get("b"))) state.base = p.get("b");
    if (p.get("c") && COLORS.some(c => c.id === p.get("c"))) state.color = p.get("c");
    if (p.get("br") && BRANDING.some(b => b.id === p.get("br"))) state.branding = p.get("br");
    if (p.get("a")) p.get("a").split(",").forEach(id => { if (ADDONS.some(a => a.id === id)) state.addons.add(id); });
  }
  function saveLocalSilent() { try { localStorage.setItem("mobistro_build", encodeState()); } catch (e) {} }
  function saveLocal() { saveLocalSilent(); flash("✓ Konfiguration gespeichert"); }
  function shareLink() {
    const url = location.origin + location.pathname + "#" + encodeState();
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => flash("✓ Link kopiert"), () => { location.hash = encodeState(); flash("✓ Link in Adresszeile"); });
    else { location.hash = encodeState(); flash("✓ Link in Adresszeile"); }
  }
  let flashT;
  function flash(msg) { const el = $("#kfgSaved"); if (!el) return; el.textContent = msg; clearTimeout(flashT); flashT = setTimeout(() => el.textContent = "", 2600); }

  function openModal(id) { const m = document.getElementById(id); if (m) m.classList.add("open"); }
  function closeModals() { document.querySelectorAll(".kfg-modal").forEach(m => m.classList.remove("open")); }

  /* ============================================================
     WIRE
     ============================================================ */
  function wire() {
    $("#kfgBases").addEventListener("click", e => { const b = e.target.closest("[data-base]"); if (!b) return; state.base = b.dataset.base; if (ready) buildVehicle(state.base); else renderFallback(); syncUI(); });
    $("#kfgSwatches").addEventListener("click", e => { const s = e.target.closest("[data-color]"); if (!s) return; state.color = s.dataset.color; applyColor(); if (!ready) renderFallback(); syncUI(); });
    $("#kfgBrand").addEventListener("click", e => { const o = e.target.closest("[data-brand]"); if (!o) return; state.branding = o.dataset.brand; syncUI(); });
    $("#kfgAddons").addEventListener("click", e => { const c = e.target.closest("[data-addon]"); if (!c) return; const id = c.dataset.addon; if (state.addons.has(id)) state.addons.delete(id); else state.addons.add(id); applyAddons(); syncUI(); });

    $("#kfgRotate").addEventListener("click", function () { autoRotate = !autoRotate; this.classList.toggle("on", autoRotate); });
    $("#kfgReset").addEventListener("click", resetView);
    $("#kfgShot").addEventListener("click", snapshot);

    const drop = $("#kfgDrop"), input = $("#kfgFileInput");
    drop.addEventListener("click", () => input.click());
    input.addEventListener("change", e => addFiles(e.target.files));
    ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("drag"); }));
    ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("drag"); }));
    drop.addEventListener("drop", e => { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
    $("#kfgFiles").addEventListener("click", e => {
      const lg = e.target.closest("[data-logo]");
      if (lg) { const i = +lg.dataset.logo; state.logoIdx = (state.logoIdx === i) ? null : i; applyLogo(); renderFiles(); syncUI(); return; }
      const x = e.target.closest("[data-rmfile]"); if (!x) return;
      const idx = +x.dataset.rmfile; state.files.splice(idx, 1);
      if (state.logoIdx === idx) state.logoIdx = null; else if (state.logoIdx > idx) state.logoIdx--;
      applyLogo(); renderFiles(); syncUI();
    });

    $("#kfgSave").addEventListener("click", saveLocal);
    $("#kfgShare").addEventListener("click", shareLink);
    $("#kfgRequest").addEventListener("click", () => { renderSummary(); saveLocalSilent(); openModal("kfgModal"); });

    $("#kfgGallery").addEventListener("click", e => { const g = e.target.closest("[data-img]"); if (!g) return; $("#kfgLbImg").src = g.dataset.img; openModal("kfgLightbox"); });

    document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModals));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModals(); });
    const form = $("#kfgForm");
    if (form) form.addEventListener("submit", e => { e.preventDefault(); saveLocalSilent(); $("#kfgFormWrap").style.display = "none"; $("#kfgOk").classList.add("show"); });
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    if (location.hash.length > 3) decodeState(location.hash.slice(1));
    else { try { const s = localStorage.getItem("mobistro_build"); if (s) decodeState(s); } catch (e) {} }
    buildUI(); wire(); init3D();
  });
})();
