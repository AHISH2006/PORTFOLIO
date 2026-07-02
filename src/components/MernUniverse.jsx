import { useEffect, useRef } from 'react';
import '../styles/MernUniverse.css';

/* ═══════════════════════════════════════════════════════════════
   MERN UNIVERSE — ENHANCED 3D FLYTHROUGH CAMERA
   
   Camera moves along Z-axis as user scrolls.
   Spiral camera motion + gentle barrel roll.
   Elements zoom in as they approach (perspective projection).
   Warp streaks appear during fast scrolling.
   Tunnel ring gates fly past for depth cues.
   MERN-branded icons fill the tunnel.
   ═══════════════════════════════════════════════════════════════ */

/* ── MERN Brand Colours ── */
const MC = {
  mongo:   { r: 71,  g: 162, b: 72  },
  express: { r: 160, g: 160, b: 160 },
  react:   { r: 97,  g: 218, b: 251 },
  node:    { r: 104, g: 160, b: 99  },
};

/* ── Section Colours ── */
const SEC = {
  home:       MC.react,
  about:      { r: 99,  g: 102, b: 241 },
  skills:     { r: 168, g: 85,  b: 247 },
  projects:   MC.express,
  experience: MC.node,
  contact:    { r: 20,  g: 184, b: 166 },
};

/* ── World constants ── */
const FL      = 420;   // focal length (perspective strength)
const MAX_Z   = 4000;  // total tunnel depth (world units)
const SPREAD_X = 560;  // star X spread
const SPREAD_Y = 400;  // star Y spread
const ICON_X  = 230;   // MERN icon X spread (tighter than stars)
const ICON_Y  = 160;   // MERN icon Y spread

/* ── Star factory ── */
function mkStar(camZ) {
  return {
    x:    (Math.random() * 2 - 1) * SPREAD_X,
    y:    (Math.random() * 2 - 1) * SPREAD_Y,
    z:    camZ + 80 + Math.random() * MAX_Z,
    size: Math.random() * 1.4 + 0.3,
    col:  Math.random() < 0.66 ? 0     // white
          : Math.random() < 0.55 ? 1   // blue
          :                        2,  // gold
    tw:   Math.random() * Math.PI * 2,
    ts:   Math.random() * 0.02 + 0.005,
  };
}

/* ── MERN icon factory ── */
const ICON_TYPES = ['react','react','mongo','mongo','node','express','express','code'];
const CODE_WORDS = ['const','=> {}','async','await','.find()','useState','app.use()','require','schema','npm run','JSON','export'];

function mkIcon(camZ, idx) {
  return {
    type:    ICON_TYPES[idx % ICON_TYPES.length],
    x:       (Math.random() * 2 - 1) * ICON_X,
    y:       (Math.random() * 2 - 1) * ICON_Y,
    z:       camZ + 200 + Math.random() * MAX_Z * 0.9,
    size:    18 + Math.random() * 24,   // world units (base size)
    rotY:    Math.random() * Math.PI * 2,
    vRotY:   (Math.random() - 0.5) * 0.018,
    phase:   Math.random() * Math.PI * 2,
    text:    CODE_WORDS[Math.floor(Math.random() * CODE_WORDS.length)],
  };
}

function mkComet(camZ) {
  return {
    x: (Math.random() * 2 - 1) * SPREAD_X * 0.7,
    y: (Math.random() * 2 - 1) * SPREAD_Y * 0.7,
    z: camZ + MAX_Z * 0.95 + Math.random() * MAX_Z * 0.05,
    speed: 75 + Math.random() * 55,
    size: 2.4 + Math.random() * 1.6,
    color: Math.random() < 0.5 ? MC.react : MC.mongo,
  };
}

/* ── Tunnel ring factory ── */
function mkRing(camZ) {
  return {
    z:       camZ + MAX_Z * 0.5 + Math.random() * MAX_Z * 0.5,
    radius:  120 + Math.random() * 80,
    rotZ:    Math.random() * Math.PI,
    color:   Math.random() < 0.5 ? MC.react : MC.mongo,
  };
}

/* ── Projection helper (with camera spiral offset) ── */
function project(wx, wy, wz, camZ, camSwayX, camSwayY, W, H) {
  const relZ = wz - camZ;
  if (relZ < 2) return null;
  const scale = FL / relZ;
  return {
    x:     (wx - camSwayX) * scale + W * 0.5,
    y:     (wy - camSwayY) * scale + H * 0.5,
    scale,
    relZ,
  };
}

/* ══════════════════════════════════════════════════════════════
   ICON DRAW FUNCTIONS
   ══════════════════════════════════════════════════════════════ */

function drawReact(ctx, cx, cy, sz, time, phase, alpha) {
  if (alpha < 0.02 || sz < 4) return;
  const c = MC.react;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = `rgb(${c.r},${c.g},${c.b})`;
  ctx.fillStyle   = `rgb(${c.r},${c.g},${c.b})`;
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(i * (Math.PI / 3));
    ctx.lineWidth = Math.max(0.5, sz * 0.025);
    ctx.beginPath();
    ctx.ellipse(0, 0, sz, sz * 0.32, 0, 0, Math.PI * 2);
    ctx.stroke();
    const ea = (time + phase) * 2.5 + i * 2.094;
    ctx.beginPath();
    ctx.arc(Math.cos(ea) * sz, Math.sin(ea) * sz * 0.32, Math.max(1, sz * 0.06), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(1.5, sz * 0.1), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function hexPath(ctx, cx, cy, sz, scX) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    const x = cx + Math.cos(a) * sz * scX;
    const y = cy + Math.sin(a) * sz;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawMongo(ctx, cx, cy, sz, rotY, alpha) {
  if (alpha < 0.02 || sz < 4) return;
  const c = MC.mongo;
  const scX = Math.cos(rotY);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = `rgb(${c.r},${c.g},${c.b})`;
  ctx.lineWidth   = Math.max(0.5, sz * 0.04);
  hexPath(ctx, cx, cy, sz, scX); ctx.stroke();
  ctx.lineWidth = Math.max(0.3, sz * 0.02);
  hexPath(ctx, cx, cy, sz * 0.55, scX); ctx.stroke();
  ctx.restore();
}

function drawNode(ctx, cx, cy, sz, rotY, alpha) {
  if (alpha < 0.02 || sz < 4) return;
  const c  = MC.node;
  const scX = Math.abs(Math.cos(rotY));
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = `rgb(${c.r},${c.g},${c.b})`;
  ctx.lineWidth   = Math.max(0.5, sz * 0.038);
  hexPath(ctx, cx, cy, sz, scX); ctx.stroke();
  if (scX > 0.2) {
    const lw = sz * 0.28 * scX, lh = sz * 0.42;
    ctx.lineWidth = Math.max(0.4, sz * 0.024);
    ctx.lineJoin  = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - lw, cy + lh);
    ctx.lineTo(cx - lw, cy - lh);
    ctx.lineTo(cx + lw, cy + lh);
    ctx.lineTo(cx + lw, cy - lh);
    ctx.stroke();
  }
  ctx.restore();
}

function drawExpress(ctx, cx, cy, sz, alpha) {
  if (alpha < 0.02 || sz < 4) return;
  const c = MC.express;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = `rgb(${c.r},${c.g},${c.b})`;
  ctx.lineWidth   = Math.max(0.5, sz * 0.04);
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';
  const h = sz * 0.85, w = sz * 0.38, b = sz * 0.22;
  // Left brace
  ctx.beginPath();
  ctx.moveTo(cx - w - b, cy - h);
  ctx.lineTo(cx - b, cy - h);
  ctx.quadraticCurveTo(cx - b * 0.3, cy - h * 0.55, cx - b * 1.5, cy);
  ctx.quadraticCurveTo(cx - b * 0.3, cy + h * 0.55, cx - b, cy + h);
  ctx.lineTo(cx - w - b, cy + h);
  ctx.stroke();
  // Right brace
  ctx.beginPath();
  ctx.moveTo(cx + w + b, cy - h);
  ctx.lineTo(cx + b, cy - h);
  ctx.quadraticCurveTo(cx + b * 0.3, cy - h * 0.55, cx + b * 1.5, cy);
  ctx.quadraticCurveTo(cx + b * 0.3, cy + h * 0.55, cx + b, cy + h);
  ctx.lineTo(cx + w + b, cy + h);
  ctx.stroke();
  ctx.restore();
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function MernUniverse() {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();

    const N_STARS = window.innerWidth < 768 ? 220 : 420;
    const N_ICONS = window.innerWidth < 768 ? 16  : 28;
    const N_RINGS = window.innerWidth < 768 ? 4   : 8;

    /* ── Initial state ── */
    stateRef.current = {
      stars:    Array.from({ length: N_STARS }, () => mkStar(0)),
      icons:    Array.from({ length: N_ICONS },  (_, i) => mkIcon(0, i)),
      rings:    Array.from({ length: N_RINGS }, () => mkRing(0)),
      comets:   [],
      cometTimer: 0,
      // Camera (world-space)
      cam:      { z: 0, targetZ: 0, swayX: 0, swayY: 0, roll: 0 },
      prevCamZ: 0,
      velocity: 0,
      smoothVelocity: 0,
      // Colour
      theme:    { ...SEC.home },
      target:   { ...SEC.home },
      scroll:   0,
      time:     0,
    };
    const st = stateRef.current;

    /* ── Section detection ── */
    const IDS = ['home','about','skills','projects','experience','contact'];
    const onScroll = () => {
      st.scroll = window.scrollY;
      const mid = st.scroll + H * 0.42;
      let best = 'home', bd = Infinity;
      IDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + st.scroll;
        const d   = Math.abs(mid - (top + el.offsetHeight * 0.5));
        if (d < bd) { bd = d; best = id; }
      });
      if (SEC[best]) st.target = { ...SEC[best] };
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── Draw loop ── */
    const lerp = (a, b, t) => a + (b - a) * t;
    let lastF  = 0;
    const FPS  = 1000 / 48; // slightly higher for smoother feel

    const draw = (now) => {
      rafRef.current = requestAnimationFrame(draw);
      if (now - lastF < FPS) return;
      const dt = Math.min(now - lastF, 80) / 16.67;
      lastF = now;
      st.time += 0.012 * dt;

      /* ── Camera: Z moves forward as user scrolls ── */
      const maxScroll = Math.max(1, document.body.scrollHeight - H);
      const scrollPct = Math.min(1, st.scroll / maxScroll);
      st.cam.targetZ  = scrollPct * MAX_Z * 1.45;

      st.prevCamZ    = st.cam.z;
      st.cam.z       = lerp(st.cam.z, st.cam.targetZ, 0.055 * dt);
      st.velocity    = (st.cam.z - st.prevCamZ) / dt;
      st.smoothVelocity = lerp(st.smoothVelocity, st.velocity, 0.08 * dt);

      /* ── Camera spiral sway (more dramatic) ── */
      const spiralAmp = 22 + Math.abs(st.smoothVelocity) * 1.5;
      st.cam.swayX = Math.sin(st.time * 0.32) * spiralAmp;
      st.cam.swayY = Math.cos(st.time * 0.27) * spiralAmp * 0.6;
      
      /* ── Camera barrel roll (subtle) ── */
      st.cam.roll = Math.sin(st.time * 0.14) * 0.012 + st.smoothVelocity * 0.0004;

      /* ── Colour lerp ── */
      const L = 0.018 * dt;
      st.theme.r = lerp(st.theme.r, st.target.r, L);
      st.theme.g = lerp(st.theme.g, st.target.g, L);
      st.theme.b = lerp(st.theme.b, st.target.b, L);
      const { r, g, b } = st.theme;

      /* ── 1. Deep space base ── */
      ctx.fillStyle = '#010913';
      ctx.fillRect(0, 0, W, H);

      /* ── Apply camera roll ── */
      ctx.save();
      ctx.translate(W * 0.5, H * 0.5);
      ctx.rotate(st.cam.roll);
      ctx.translate(-W * 0.5, -H * 0.5);

      /* ── 2. Nebula (screen-space 2D overlay, always visible) ── */
      const CX = W * 0.5, CY = H * 0.46;
      const nebs = [
        { x: 0.12, y: 0.22, rad: 0.52, c: MC.react,   a: 0.11, ph: 0.0 },
        { x: 0.88, y: 0.25, rad: 0.48, c: MC.mongo,   a: 0.10, ph: 1.4 },
        { x: 0.50, y: 0.58, rad: 0.60, c: { r, g, b },a: 0.08, ph: 2.8 },
        { x: 0.14, y: 0.80, rad: 0.42, c: MC.node,    a: 0.10, ph: 4.2 },
        { x: 0.86, y: 0.78, rad: 0.44, c: MC.express, a: 0.07, ph: 1.0 },
        { x: 0.50, y: 0.08, rad: 0.36, c: MC.react,   a: 0.07, ph: 2.2 },
      ];
      nebs.forEach((n, ni) => {
        const bth = 0.72 + 0.28 * Math.sin(st.time * 0.38 + n.ph);
        const nx  = n.x * W + Math.sin(st.time * 0.11 + ni) * 22;
        const ny  = n.y * H + Math.cos(st.time * 0.09 + ni) * 16;
        const gn  = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.rad * Math.min(W, H));
        gn.addColorStop(0,   `rgba(${n.c.r},${n.c.g},${n.c.b},${(n.a * bth).toFixed(3)})`);
        gn.addColorStop(0.5, `rgba(${n.c.r},${n.c.g},${n.c.b},${(n.a * 0.3 * bth).toFixed(3)})`);
        gn.addColorStop(1,   'transparent');
        ctx.fillStyle = gn;
        ctx.fillRect(0, 0, W, H);
      });

      /* ── 3. Central galaxy glow (breathing) ── */
      const breathe = 0.85 + 0.15 * Math.sin(st.time * 0.55);
      const gc = ctx.createRadialGradient(CX, CY, 0, CX, CY, W * 0.5);
      gc.addColorStop(0,   `rgba(${r},${g},${b},${(0.12 * breathe).toFixed(3)})`);
      gc.addColorStop(0.4, `rgba(${r},${g},${b},${(0.05 * breathe).toFixed(3)})`);
      gc.addColorStop(1,   'transparent');
      ctx.fillStyle = gc;
      ctx.fillRect(0, 0, W, H);

      /* ── 3b. Tunnel ring gates ── */
      st.rings.forEach(ring => {
        // Recycle behind camera
        if (ring.z - st.cam.z < 10) {
          ring.z = st.cam.z + MAX_Z * 0.6 + Math.random() * MAX_Z * 0.4;
          ring.radius = 120 + Math.random() * 80;
          ring.rotZ = Math.random() * Math.PI;
          ring.color = Math.random() < 0.5 ? MC.react : MC.mongo;
        }

        const relZ = ring.z - st.cam.z;
        if (relZ < 5) return;
        const scale = FL / relZ;
        const cx = (0 - st.cam.swayX) * scale + CX;
        const cy = (0 - st.cam.swayY) * scale + CY;
        const screenR = ring.radius * scale;

        if (screenR < 3 || screenR > Math.max(W, H) * 1.5) return;

        let alpha = 0.18;
        if (relZ > 1500) alpha *= Math.max(0, 1 - (relZ - 1500) / 1500);
        if (relZ < 100)  alpha *= relZ / 100;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `rgb(${ring.color.r},${ring.color.g},${ring.color.b})`;
        ctx.lineWidth = Math.max(0.3, scale * 1.5);
        ctx.translate(cx, cy);
        ctx.rotate(ring.rotZ + st.time * 0.05);
        
        // Draw dashed ring
        ctx.setLineDash([screenR * 0.15, screenR * 0.1]);
        ctx.beginPath();
        ctx.arc(0, 0, screenR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.restore();
      });

      /* ── 4. Stars — 3D perspective + warp streaks ── */
      const warpFactor = Math.min(1, Math.abs(st.smoothVelocity) / 10);

      // Recycle stars that are behind camera or very close
      st.stars.forEach(s => {
        if (s.z - st.cam.z < 5) {
          s.x = (Math.random() * 2 - 1) * SPREAD_X;
          s.y = (Math.random() * 2 - 1) * SPREAD_Y;
          s.z = st.cam.z + MAX_Z * 0.8 + Math.random() * MAX_Z * 0.2;
        }
      });

      // Batch white stars
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      st.stars.forEach(s => {
        if (s.col !== 0) return;
        s.tw += s.ts * dt;
        const p = project(s.x, s.y, s.z, st.cam.z, st.cam.swayX, st.cam.swayY, W, H);
        if (!p) return;
        if (p.x < -4 || p.x > W + 4 || p.y < -4 || p.y > H + 4) return;
        const tw = 0.6 + 0.4 * Math.sin(s.tw);
        const sz = Math.max(0.2, s.size * p.scale * tw);
        ctx.moveTo(p.x + sz, p.y);
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
      });
      ctx.fill();

      // Batch blue stars
      ctx.fillStyle = 'rgba(140,200,255,0.85)';
      ctx.beginPath();
      st.stars.forEach(s => {
        if (s.col !== 1) return;
        const p = project(s.x, s.y, s.z, st.cam.z, st.cam.swayX, st.cam.swayY, W, H);
        if (!p) return;
        if (p.x < -4 || p.x > W + 4 || p.y < -4 || p.y > H + 4) return;
        const sz = Math.max(0.2, s.size * p.scale);
        ctx.moveTo(p.x + sz, p.y);
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
      });
      ctx.fill();

      // Batch gold stars
      ctx.fillStyle = 'rgba(255,230,130,0.80)';
      ctx.beginPath();
      st.stars.forEach(s => {
        if (s.col !== 2) return;
        const p = project(s.x, s.y, s.z, st.cam.z, st.cam.swayX, st.cam.swayY, W, H);
        if (!p) return;
        if (p.x < -4 || p.x > W + 4 || p.y < -4 || p.y > H + 4) return;
        const sz = Math.max(0.2, s.size * p.scale);
        ctx.moveTo(p.x + sz, p.y);
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
      });
      ctx.fill();

      /* Warp streaks — drawn when scrolling fast */
      if (warpFactor > 0.06) {
        const warpAlpha = warpFactor * 0.6;
        const warpLen   = warpFactor * 75;
        st.stars.forEach(s => {
          const p = project(s.x, s.y, s.z, st.cam.z, st.cam.swayX, st.cam.swayY, W, H);
          if (!p) return;
          if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) return;

          const dx = p.x - CX, dy = p.y - CY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = dx / dist, ny = dy / dist;

          // Streak points toward center
          const tailX = p.x - nx * warpLen;
          const tailY = p.y - ny * warpLen;

          const sz = Math.max(0.2, s.size * p.scale);
          const streakG = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
          const col = s.col === 0 ? '255,255,255'
                    : s.col === 1 ? '140,200,255'
                    :               '255,230,130';
          streakG.addColorStop(0, `rgba(${col},0)`);
          streakG.addColorStop(1, `rgba(${col},${warpAlpha})`);
          ctx.strokeStyle = streakG;
          ctx.lineWidth   = sz * 1.3;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        });
      }

      /* ── 4b. Comets / Shooting Stars ── */
      st.cometTimer += dt;
      const baseSpawn = 160;
      const spawnThresh = Math.max(12, baseSpawn / (1 + warpFactor * 12));
      if (st.cometTimer >= spawnThresh) {
        st.cometTimer = 0;
        if (st.comets.length < 8) {
          st.comets.push(mkComet(st.cam.z));
        }
      }

      st.comets = st.comets.filter(c => {
        c.z -= c.speed * dt;
        const relZ = c.z - st.cam.z;
        if (relZ < 10) return false;

        const p = project(c.x, c.y, c.z, st.cam.z, st.cam.swayX, st.cam.swayY, W, H);
        if (!p) return false;
        if (p.x < -80 || p.x > W + 80 || p.y < -80 || p.y > H + 80) return true;

        const sz = c.size * p.scale;
        const tailLen = (c.speed * 0.5) * p.scale;

        const dx = p.x - CX, dy = p.y - CY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = dx / dist, ny = dy / dist;

        const tailX = p.x - nx * tailLen;
        const tailY = p.y - ny * tailLen;

        const cg = ctx.createLinearGradient(p.x, p.y, tailX, tailY);
        cg.addColorStop(0, `rgba(${c.color.r},${c.color.g},${c.color.b},0.85)`);
        cg.addColorStop(0.35, `rgba(${c.color.r},${c.color.g},${c.color.b},0.35)`);
        cg.addColorStop(1, 'transparent');

        ctx.strokeStyle = cg;
        ctx.lineWidth = sz;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // White nucleus core with glow
        const coreGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 2);
        coreGlow.addColorStop(0, `rgba(255,255,255,0.9)`);
        coreGlow.addColorStop(0.4, `rgba(${c.color.r},${c.color.g},${c.color.b},0.3)`);
        coreGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz * 2, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      /* ── 5. MERN 3D Icons — perspective projected ── */
      st.icons.forEach(ic => {
        ic.rotY += ic.vRotY * dt;

        // Recycle behind camera
        if (ic.z - st.cam.z < 15) {
          ic.x    = (Math.random() * 2 - 1) * ICON_X;
          ic.y    = (Math.random() * 2 - 1) * ICON_Y;
          ic.z    = st.cam.z + MAX_Z * 0.6 + Math.random() * MAX_Z * 0.4;
          ic.type = ICON_TYPES[Math.floor(Math.random() * ICON_TYPES.length)];
          ic.text = CODE_WORDS[Math.floor(Math.random() * CODE_WORDS.length)];
          return;
        }

        const p = project(ic.x, ic.y, ic.z, st.cam.z, st.cam.swayX, st.cam.swayY, W, H);
        if (!p) return;
        if (p.x < -120 || p.x > W + 120 || p.y < -120 || p.y > H + 120) return;

        const screenSz = ic.size * p.scale;
        if (screenSz < 3 || screenSz > Math.max(W, H) * 0.45) return;

        const relZ  = p.relZ;
        let alpha   = 1;
        if (relZ > 650)  alpha = Math.max(0, 1 - (relZ - 650) / 600);
        if (relZ < 60)   alpha = relZ / 60;
        alpha = Math.min(0.72, alpha * 0.72);

        switch (ic.type) {
          case 'react':
            drawReact(ctx, p.x, p.y, screenSz, st.time, ic.phase, alpha);
            break;
          case 'mongo':
            drawMongo(ctx, p.x, p.y, screenSz, ic.rotY, alpha);
            break;
          case 'node':
            drawNode(ctx, p.x, p.y, screenSz, ic.rotY, alpha);
            break;
          case 'express':
            drawExpress(ctx, p.x, p.y, screenSz, alpha);
            break;
          case 'code':
            if (screenSz < 8) break;
            ctx.save();
            ctx.globalAlpha = alpha * 0.85;
            ctx.fillStyle   = `rgba(${r},${g},${b},1)`;
            ctx.font        = `${Math.min(24, screenSz * 0.6)}px 'Courier New', monospace`;
            ctx.textAlign   = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(ic.text, p.x, p.y);
            ctx.restore();
            break;
        }
      });

      /* ── 6. Scan-line grid ── */
      ctx.strokeStyle = `rgba(${r},${g},${b},0.012)`;
      ctx.lineWidth   = 0.5;
      const gs = 90;
      ctx.beginPath();
      for (let gx = 0; gx < W; gx += gs) { ctx.moveTo(gx, 0); ctx.lineTo(gx, H); }
      for (let gy = 0; gy < H; gy += gs) { ctx.moveTo(0, gy); ctx.lineTo(W, gy); }
      ctx.stroke();

      /* ── Roll restore ── */
      ctx.restore();

      /* ── 7. Vignette (outside roll so it doesn't rotate) ── */
      const vg = ctx.createRadialGradient(CX, CY, H * 0.10, CX, CY, Math.max(W, H) * 0.97);
      vg.addColorStop(0,    'transparent');
      vg.addColorStop(0.50, 'rgba(1,9,19,0.18)');
      vg.addColorStop(0.78, 'rgba(1,9,19,0.55)');
      vg.addColorStop(1,    'rgba(1,9,19,0.92)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      /* ── 8. Speed indicator flash at screen edges when warping ── */
      if (warpFactor > 0.25) {
        const flashAlpha = (warpFactor - 0.25) * 0.4;
        // Top edge
        const tg = ctx.createLinearGradient(0, 0, 0, H * 0.15);
        tg.addColorStop(0, `rgba(${r},${g},${b},${flashAlpha.toFixed(3)})`);
        tg.addColorStop(1, 'transparent');
        ctx.fillStyle = tg;
        ctx.fillRect(0, 0, W, H * 0.15);
        // Bottom edge
        const bg2 = ctx.createLinearGradient(0, H, 0, H * 0.85);
        bg2.addColorStop(0, `rgba(${r},${g},${b},${flashAlpha.toFixed(3)})`);
        bg2.addColorStop(1, 'transparent');
        ctx.fillStyle = bg2;
        ctx.fillRect(0, H * 0.85, W, H * 0.15);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current);
      else { lastF = 0; rafRef.current = requestAnimationFrame(draw); }
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="galaxy-bg-wrapper">
      <canvas ref={canvasRef} className="galaxy-canvas" />
    </div>
  );
}
