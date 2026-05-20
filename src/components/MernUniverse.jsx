import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import '../styles/MernUniverse.css';
import '../styles/Galaxy.css';

/* ─────────────────────────────────────────────────────────────
   GLSL — exact shader from reference, unchanged
   ───────────────────────────────────────────────────────────── */
const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;

      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

/* ─────────────────────────────────────────────────────────────
   Section themes — hue + density change per section
   hueShift values are sequential so transitions look smooth.
   density > 1 = more/smaller stars (zoom-out feel)
   ───────────────────────────────────────────────────────────── */
/*
 * Color Palette: Green (highlight/primary) + Red & Pink (light secondaries)
 * ─────────────────────────────────────────────────────────────────────────
 *  Home       → Pure bright green  (#22c55e / #00ED64) — DOMINANT
 *  About      → Soft pink (light secondary)
 *  Skills     → Pink-magenta (secondary)
 *  Projects   → Warm red (secondary)
 *  Experience → Deep rose-red (secondary)
 *  Contact    → Blush pink → fades back to green hint
 * ─────────────────────────────────────────────────────────────────────────
 *  hueShift 140 = green peak  |  hueShift 350/5 = red  |  hueShift 330 = pink
 *  density  : higher = more/smaller stars (zoom-out feel)
 */
const SECTION_THEMES = {
  // Hero: pure vivid green — the signature color
  home:       { hueShift: 140, density: 1.0,  speed: 1.0,  glowIntensity: 0.55, rotationSpeed: 0.05  },
  // About: soft blush pink — light, gentle secondary
  about:      { hueShift: 345, density: 1.15, speed: 1.05, glowIntensity: 0.32, rotationSpeed: 0.042 },
  // Skills: pink-magenta — vibrant secondary
  skills:     { hueShift: 330, density: 1.28, speed: 1.15, glowIntensity: 0.36, rotationSpeed: 0.055 },
  // Projects: warm red — energetic secondary
  projects:   { hueShift: 5,   density: 1.45, speed: 1.30, glowIntensity: 0.40, rotationSpeed: 0.068 },
  // Experience: deep rose-red — rich secondary
  experience: { hueShift: 358, density: 1.32, speed: 1.20, glowIntensity: 0.38, rotationSpeed: 0.058 },
  // Contact: soft rose/pink — light secondary, calm close
  contact:    { hueShift: 338, density: 1.18, speed: 1.05, glowIntensity: 0.33, rotationSpeed: 0.044 },
};

/* ─────────────────────────────────────────────────────────────
   Linear interpolation helper
   ───────────────────────────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;

/* ─────────────────────────────────────────────────────────────
   MernUniverse — OGL Galaxy Background
   ───────────────────────────────────────────────────────────── */
export default function MernUniverse() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const ctn = wrapperRef.current;
    if (!ctn) return;

    /* ── OGL renderer ──────────────────────────────────────── */
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,           // not needed for pixel-shader
      powerPreference: 'high-performance',
    });
    const gl = renderer.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    /* ── Shader program ─────────────────────────────────────── */
    let program;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setSize(ctn.offsetWidth * dpr, ctn.offsetHeight * dpr);
      gl.canvas.style.width  = '100%';
      gl.canvas.style.height = '100%';
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        );
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const geometry = new Triangle(gl);

    program = new Program(gl, {
      vertex:   vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:                { value: 0 },
        uResolution:          { value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uFocal:               { value: new Float32Array([0.5, 0.5]) },
        uRotation:            { value: new Float32Array([1.0, 0.0]) },
        uStarSpeed:           { value: 0 },
        uDensity:             { value: SECTION_THEMES.home.density },
        uHueShift:            { value: 140 },   // start pure green immediately — no lerp delay
        uSpeed:               { value: SECTION_THEMES.home.speed },
        uMouse:               { value: new Float32Array([0.5, 0.5]) },
        uGlowIntensity:       { value: SECTION_THEMES.home.glowIntensity },
        uSaturation:          { value: 4.0 },   // vivid: hero green pops strong, red/pink are lighter
        uMouseRepulsion:      { value: true },
        uTwinkleIntensity:    { value: 0.45 },
        uRotationSpeed:       { value: SECTION_THEMES.home.rotationSpeed },
        uRepulsionStrength:   { value: 2.5 },
        uMouseActiveFactor:   { value: 0.0 },
        uAutoCenterRepulsion: { value: 0 },
        uTransparent:         { value: true },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    /* ── Mouse tracking ─────────────────────────────────────── */
    const targetMouse = { x: 0.5, y: 0.5, active: 0 };
    const smoothMouse = { x: 0.5, y: 0.5, active: 0 };

    const onMouseMove = (e) => {
      const rect = ctn.getBoundingClientRect();
      targetMouse.x      = (e.clientX - rect.left) / rect.width;
      targetMouse.y      = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse.active = 1.0;
    };
    const onMouseLeave = () => { targetMouse.active = 0.0; };

    // Attach to window so mouse works even on content layers above canvas
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    /* ── Touch support (mobile parallax) ───────────────────── */
    const onTouch = (e) => {
      if (!e.touches.length) return;
      const rect = ctn.getBoundingClientRect();
      targetMouse.x      = (e.touches[0].clientX - rect.left) / rect.width;
      targetMouse.y      = 1.0 - (e.touches[0].clientY - rect.top) / rect.height;
      targetMouse.active = 0.6;
    };
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onMouseLeave, { passive: true });

    /* ── Section theme tracking ─────────────────────────────── */
    const sectionIds = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];

    // current (smoothed) and target theme values
    const cur = { ...SECTION_THEMES.home };
    const tgt = { ...SECTION_THEMES.home };

    // IntersectionObserver to detect active section
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (SECTION_THEMES[id]) Object.assign(tgt, SECTION_THEMES[id]);
          }
        });
      },
      { threshold: 0.35 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    /* ── Scroll velocity for zoom-burst effect ──────────────── */
    let lastScrollY    = window.scrollY;
    let scrollVelocity = 0;

    const onScroll = () => {
      scrollVelocity = Math.abs(window.scrollY - lastScrollY);
      lastScrollY    = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Animation loop ─────────────────────────────────────── */
    let raf;
    const LT = 0.035; // lerp factor for theme transitions

    const animate = (t) => {
      raf = requestAnimationFrame(animate);
      const time = t * 0.001;

      /* Smooth mouse */
      smoothMouse.x      += (targetMouse.x - smoothMouse.x)           * 0.06;
      smoothMouse.y      += (targetMouse.y - smoothMouse.y)           * 0.06;
      smoothMouse.active += (targetMouse.active - smoothMouse.active) * 0.06;

      /* Smooth section theme */
      cur.hueShift      = lerp(cur.hueShift,      tgt.hueShift,      LT);
      cur.density       = lerp(cur.density,        tgt.density,       LT);
      cur.speed         = lerp(cur.speed,          tgt.speed,         LT);
      cur.glowIntensity = lerp(cur.glowIntensity,  tgt.glowIntensity, LT);
      cur.rotationSpeed = lerp(cur.rotationSpeed,  tgt.rotationSpeed, LT);

      /* Scroll zoom-burst: fast scroll = more stars (higher density) */
      const scrollBoost = Math.min(scrollVelocity * 0.012, 0.8);
      scrollVelocity   *= 0.88; // decay

      /* Write uniforms */
      program.uniforms.uTime.value          = time;
      program.uniforms.uStarSpeed.value     = (time * 0.5) / 10.0;
      program.uniforms.uHueShift.value      = cur.hueShift;
      program.uniforms.uDensity.value       = cur.density + scrollBoost;
      program.uniforms.uSpeed.value         = cur.speed;
      program.uniforms.uGlowIntensity.value = cur.glowIntensity;
      program.uniforms.uRotationSpeed.value = cur.rotationSpeed;

      program.uniforms.uMouse.value[0]           = smoothMouse.x;
      program.uniforms.uMouse.value[1]           = smoothMouse.y;
      program.uniforms.uMouseActiveFactor.value  = smoothMouse.active;

      renderer.render({ scene: mesh });
    };

    raf = requestAnimationFrame(animate);

    /* ── Cleanup ────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div className="mern-universe-wrapper">
      {/* Nebula aurora CSS blobs — always rendered behind the WebGL canvas */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />
      <div className="nebula nebula-4" />

      {/* OGL canvas host */}
      <div ref={wrapperRef} className="mern-universe-container galaxy-container" />
    </div>
  );
}
