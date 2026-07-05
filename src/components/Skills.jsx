import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code, Target, Database, Wrench } from 'lucide-react';
import {
  PythonIcon, JavaScriptIcon, TypeScriptRealIcon, SQLIcon,
  ReactIcon, HtmlIcon, FramerMotionIcon, NodeIcon, ExpressIcon,
  MongoRealIcon, GitHubIcon, VsCodeIcon, FigmaIcon, VercelIcon, ExpoIcon,
  GenericCodeIcon
} from './ui/Icons';
import '../styles/Skills.css';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const SKILL_CATEGORIES = [
  {
    id: 'lang',
    title: 'Programming Languages',
    subtitle: 'The Building Blocks',
    percentage: 75,
    color: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.4)',
    icon: Code,
    desc: 'Core languages for building robust, high-performance systems and dynamic interfaces.',
    skills: [
      { name: 'Python', level: 75, icon: <PythonIcon width="20" height="20" /> },
      { name: 'JavaScript', level: 72, icon: <JavaScriptIcon width="20" height="20" /> },
      { name: 'TypeScript', level: 68, icon: <TypeScriptRealIcon width="20" height="20" /> },
      { name: 'SQL', level: 65, icon: <SQLIcon width="20" height="20" /> },
    ],
    radarPoints: [75, 72, 68, 65, 70, 60],
    tags: ['OOP', 'Functional', 'Async', 'Type Safety'],
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    subtitle: 'Visual Engineering',
    percentage: 72,
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.4)',
    icon: Target,
    desc: 'Creating immersive, responsive, and cinematic user interfaces with modern tech.',
    skills: [
      { name: 'React', level: 75, icon: <ReactIcon width="20" height="20" /> },
      { name: 'HTML5 / CSS3', level: 70, icon: <HtmlIcon width="20" height="20" /> },
      { name: 'React Native', level: 65, icon: <ReactIcon width="20" height="20" /> },
      { name: 'Framer Motion', level: 68, icon: <FramerMotionIcon width="20" height="20" /> },
    ],
    radarPoints: [65, 75, 70, 65, 68, 72],
    tags: ['Animations', 'Responsive', 'Accessibility', 'PWA'],
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    subtitle: 'Server Architecture',
    percentage: 68,
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)',
    icon: Database,
    desc: 'Architecting secure, scalable server-side applications and efficient RESTful APIs.',
    skills: [
      { name: 'Node.js', level: 68, icon: <NodeIcon width="20" height="20" /> },
      { name: 'Express.js', level: 65, icon: <ExpressIcon width="20" height="20" /> },
      { name: 'REST API', level: 70, icon: <GenericCodeIcon width="20" height="20" /> },
      { name: 'MongoDB', level: 62, icon: <MongoRealIcon width="20" height="20" /> },
    ],
    radarPoints: [60, 65, 68, 70, 65, 62],
    tags: ['REST', 'Auth', 'NoSQL', 'Middleware'],
  },
  {
    id: 'tools',
    title: 'Tools & Platforms',
    subtitle: 'Dev Ecosystem',
    percentage: 74,
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.4)',
    icon: Wrench,
    desc: 'Leveraging modern development workflows, CI/CD pipelines, and design tooling.',
    skills: [
      { name: 'Git / GitHub', level: 72, icon: <GitHubIcon width="20" height="20" /> },
      { name: 'VS Code', level: 78, icon: <VsCodeIcon width="20" height="20" /> },
      { name: 'Figma', level: 65, icon: <FigmaIcon width="20" height="20" /> },
      { name: 'Vercel / Expo', level: 68, icon: <VercelIcon width="20" height="20" /> },
    ],
    radarPoints: [70, 68, 65, 72, 75, 65],
    tags: ['CI/CD', 'Docker', 'Design', 'Cloud'],
  },
];

/* ─────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────── */
function AnimCounter({ target, color }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          let start = 0;
          const duration = 1200;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setVal(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} style={{ color }}>
      {val}%
    </span>
  );
}

/* ─────────────────────────────────────────
   3D TILT FLIP CARD COMPONENT
───────────────────────────────────────── */
function SkillFlipCard({ cat, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const IconComp = cat.icon;

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // 3D Tilt on hover — lightweight, no Three.js
  const handleMouseMove = useCallback((e) => {
    if (isMobile) return;
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle tilt (max ±8 degrees) — less aggressive than Projects since card also flips
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = ((centerY - y) / centerY) * 8;

    el.style.setProperty('--tilt-x', `${rotateX}deg`);
    el.style.setProperty('--tilt-y', `${rotateY}deg`);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
    setIsFlipped(false);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="sk-card-container"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)} /* For mobile tap to flip */
    >
      <div className={`sk-card-inner ${isFlipped ? 'flipped' : ''}`}>
        
        {/* FRONT FACE */}
        <div className="sk-card-face sk-card-front" style={{ '--cat-color': cat.color, '--cat-glow': cat.glow }}>
          <div className="sk-card-glow" style={{ background: cat.glow }} />
          
          <div className="sk-front-top">
            <div className="sk-icon-wrap" style={{ borderColor: cat.color + '55', background: cat.color + '15' }}>
              <IconComp size={32} color={cat.color} />
            </div>
            <div className="sk-pct-badge" style={{ borderColor: cat.color + '44', color: cat.color }}>
              <AnimCounter target={cat.percentage} color={cat.color} />
            </div>
          </div>

          <div className="sk-front-body">
            <p className="sk-subtitle" style={{ color: cat.color }}>{cat.subtitle}</p>
            <h3 className="sk-title">{cat.title}</h3>
            <p className="sk-desc">{cat.desc}</p>
          </div>

          <div className="sk-front-bottom">
            <div className="sk-flip-hint" style={{ color: cat.color }}>
              {isMobile ? 'Tap to expand' : 'Hover to expand'}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>

          {/* Corner accents */}
          <div className="sk-corner sk-corner-tl" style={{ borderColor: cat.color + '60' }} />
          <div className="sk-corner sk-corner-br" style={{ borderColor: cat.color + '60' }} />
        </div>

        {/* BACK FACE */}
        <div className="sk-card-face sk-card-back" style={{ '--cat-color': cat.color, '--cat-glow': cat.glow }}>
          <div className="sk-card-glow" style={{ background: cat.glow }} />

          <div className="sk-back-header">
            <h4 className="sk-back-title" style={{ color: cat.color }}>{cat.title}</h4>
          </div>

          <div className="sk-bars">
            {cat.skills.map((s, i) => (
              <div key={s.name} className="sk-bar-row">
                <div className="sk-bar-header">
                  <span className="sk-bar-emoji">{s.icon}</span>
                  <span className="sk-bar-name">{s.name}</span>
                  <span className="sk-bar-pct" style={{ color: cat.color }}>{s.level}%</span>
                </div>
                <div className="sk-bar-track">
                  <div
                    className="sk-bar-fill"
                    style={{
                      width: isFlipped ? `${s.level}%` : '0%',
                      background: `linear-gradient(90deg, ${cat.color}cc, ${cat.color})`,
                      boxShadow: `0 0 10px ${cat.glow}`,
                      transition: isFlipped ? `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1 + 0.2}s` : 'none',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="sk-tags">
            {cat.tags.map(t => (
              <span key={t} className="sk-tag" style={{ borderColor: cat.color + '44', color: cat.color }}>
                {t}
              </span>
            ))}
          </div>

          {/* Corner accents */}
          <div className="sk-corner sk-corner-tl" style={{ borderColor: cat.color + '60' }} />
          <div className="sk-corner sk-corner-br" style={{ borderColor: cat.color + '60' }} />
        </div>

      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Skills() {
  return (
    <section id="skills" className="sk-section cinematic-section parallax-depth-layer">
      <div className="sk-container">
        
        {/* Header */}
        <div className="sk-section-header">
          <motion.span
            className="sk-overline"
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Technical Mastery
          </motion.span>
          <motion.h2
            className="sk-section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            CAPABILITY <span className="sk-accent">INDEX</span>
          </motion.h2>
          <motion.p
            className="sk-section-sub"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hover or tap to reveal skill metrics
          </motion.p>
        </div>

        {/* 3D Flip Card Grid */}
        <div className="sk-grid">
          {SKILL_CATEGORIES.map((cat, i) => (
            <SkillFlipCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}