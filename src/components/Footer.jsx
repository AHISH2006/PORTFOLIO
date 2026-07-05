import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import "../styles/footer.css";

/* ── 3D Canvas Background ── */
function Footer3DCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const footerEl = canvas.parentElement;
    const resize = () => {
      if (!footerEl) return;
      canvas.width  = footerEl.offsetWidth  || window.innerWidth;
      canvas.height = footerEl.offsetHeight || 400;
    };
    const ro = new ResizeObserver(resize);
    if (footerEl) {
      ro.observe(footerEl);
      resize(); // initial size
    }

    // Particles
    const PARTICLE_COUNT = 80;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '6,182,212' : '168,85,247',
    }));

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // 3D grid perspective
      const gridLines = 22;
      const horizon = H * 0.55;
      const vanishX  = W / 2;
      const gridW    = W * 1.8;
      ctx.save();
      for (let i = 0; i <= gridLines; i++) {
        const xStart = vanishX - gridW / 2 + (gridW / gridLines) * i;
        const prog   = (Math.sin(t * 0.3 + i * 0.15) * 0.015 + 1);
        ctx.beginPath();
        ctx.moveTo(vanishX, horizon);
        ctx.lineTo(xStart * prog, H + 20);
        const alpha = 0.06 - Math.abs(i - gridLines / 2) * 0.003;
        ctx.strokeStyle = `rgba(6,182,212,${Math.max(0, alpha)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      // horizontal grid lines
      for (let j = 1; j <= 10; j++) {
        const y = horizon + ((H - horizon) * j) / 10;
        const perspW = ((y - horizon) / (H - horizon));
        const x0 = vanishX - (gridW / 2) * perspW;
        const x1 = vanishX + (gridW / 2) * perspW;
        const alpha = 0.03 + perspW * 0.06;
        const offset = (t * 18) % ((H - horizon) / 10);
        const yDraw = y - offset + ((H - horizon) / 10);
        if (yDraw > horizon && yDraw < H + 20) {
          ctx.beginPath();
          ctx.moveTo(x0, yDraw);
          ctx.lineTo(x1, yDraw);
          ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      ctx.restore();

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });

      // Connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${0.07 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      t += 0.008;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="footer-canvas" />;
}

/* ── Social Icons ── */
const GHIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LIIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TWIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/AHISH2006', icon: <GHIcon /> },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ahishsm', icon: <LIIcon /> },

];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-root">
      {/* ── 3D Canvas ── */}
      <Footer3DCanvas />

      {/* ── Glow Orbs ── */}
      <div className="footer-orb footer-orb-cyan" />
      <div className="footer-orb footer-orb-purple" />

      {/* ── Top border glow ── */}
      <div className="footer-topline" />

      {/* ── Content ── */}
      <div className="footer-inner">

        {/* Brand */}
        <motion.div
          className="footer-brand"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="footer-logo-wrap">
            <h3 className="footer-logo">
              AHISH <span>S M</span>
            </h3>
            <div className="footer-logo-badge">MERN</div>
          </div>
          <p className="footer-tagline">
            Architecting full-stack experiences across the MERN Omniverse.
          </p>
          <div className="footer-social-row">
            {SOCIALS.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label={s.label}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                whileHover={{ y: -3, scale: 1.12 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Nav Links */}
        <motion.div
          className="footer-nav-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h4 className="footer-section-title">
            <span className="footer-section-title-dot" />
            Navigation
          </h4>
          <ul className="footer-nav-list">
            {NAV_LINKS.map((link, i) => (
              <motion.li key={link.label}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}>
                <a href={link.href} className="footer-nav-link">
                  <span className="footer-nav-arrow">›</span>
                  {link.label}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Status panel */}
        <motion.div
          className="footer-status-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h4 className="footer-section-title">
            <span className="footer-section-title-dot footer-section-title-dot--purple" />
            Status
          </h4>
          <div className="footer-status-card">
            <div className="footer-status-row">
              <span className="footer-status-indicator" />
              <span className="footer-status-text">Available for work</span>
            </div>
            <div className="footer-status-detail">Open to full-stack & MERN roles</div>
            <div className="footer-status-location">📍 Coimbatore, India</div>
          </div>
          <a href="mailto:anuahish249@gmail.com" className="footer-cta-btn">
            <span>Get In Touch</span>
            <span className="footer-cta-arrow">→</span>
          </a>
        </motion.div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            © {year} AHISH S M — ALL RIGHTS RESERVED
          </p>
          <div className="footer-bottom-tags">
            <span className="footer-tag">React</span>
            <span className="footer-tag">Node.js</span>
            <span className="footer-tag">MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
