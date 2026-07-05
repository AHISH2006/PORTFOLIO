import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  animate,
  AnimatePresence,
} from 'framer-motion';
import React, { useRef, useEffect, useState } from 'react';
import ahishAvatar from '../assets/ME1.png';
import '../styles/About.css';
import { 
  ReactIcon, TypeScriptRealIcon, NodeIcon, ExpressIcon, 
  MongoRealIcon, PythonIcon, GitIcon 
} from './ui/Icons';

/* ═══════════════════════════════════════════
   WORD-BY-WORD TEXT REVEAL
═══════════════════════════════════════════ */
function WordReveal({ text, className = '', delay = 0 }) {
  const words = text.split(' ');
  return (
    <span className={className} style={{ display: 'inline' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════
   LETTER-BY-LETTER HEADING REVEAL
═══════════════════════════════════════════ */
function LetterReveal({ text, className = '', delay = 0 }) {
  const letters = text.split('');
  return (
    <span className={className} aria-label={text}>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════ */
function AnimatedCounter({ target, suffix = '' }) {
  const ref = useRef(null);
  const mv = useMotionValue(0);
  const [val, setVal] = useState(0);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(mv, target, { duration: 2, ease: 'easeOut' });
    const unsub = mv.on('change', v => setVal(Math.floor(v)));
    return () => { ctrl.stop(); unsub(); };
  }, [inView, mv, target]);

  return <span ref={ref}>{val}{suffix}</span>;
}



/* ═══════════════════════════════════════════
   FLOATING 3D PHONE — Profile showcase inside a phone mockup
═══════════════════════════════════════════ */
function FloatingPhone() {
  const containerRef = useRef(null);
  
  // Motion values for rotation (start at 330 for a 360-deg entrance spin)
  const rotateXVal = useMotionValue(15);
  const rotateYVal = useMotionValue(330);
  
  // Smooth spring configuration for interactive mouse tilt
  const springConfig = { damping: 22, stiffness: 100, mass: 0.6 };
  const rX = useSpring(rotateXVal, springConfig);
  const rY = useSpring(rotateYVal, springConfig);

  const inView = useInView(containerRef, { once: true, margin: "-150px 0px" });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (inView) {
      animate(rotateYVal, -30, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
    }
  }, [inView, rotateYVal]);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Map mouse position to tilt angles. Max tilt offset ±18deg
    const newRotateY = -30 + ((x - centerX) / centerX) * 18;
    const newRotateX = 15 + ((centerY - y) / centerY) * 18;

    rotateXVal.set(newRotateX);
    rotateYVal.set(newRotateY);
  };

  const handleMouseLeave = () => {
    rotateXVal.set(15);
    rotateYVal.set(-30);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="fp-perspective-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="fp-phone-container"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: rX,
          rotateY: rY,
        }}
      >
        {/* Colored shadow behind phone */}
        <div className="fp-phone-shadow" />

        {/* Volumetric phone body with stacked rim layers */}
        <motion.div
          className="fp-phone-body-3d"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ y: 0 }}
          animate={{ y: -12 }}
          transition={{
            repeat: Infinity,
            repeatType: 'mirror',
            duration: 3,
            ease: 'easeInOut',
          }}
        >
          {/* Back Chassis */}
          <div className="fp-phone-back" style={{ transform: 'translateZ(-12px)' }}>
            <div className="fp-phone-back-glass" />
          </div>

          {/* Stacking rim layers to create visual depth (thickness) */}
          <div className="fp-phone-rim" style={{ transform: 'translateZ(-10px)' }} />
          <div className="fp-phone-rim" style={{ transform: 'translateZ(-8px)' }} />
          <div className="fp-phone-rim" style={{ transform: 'translateZ(-6px)' }} />
          <div className="fp-phone-rim" style={{ transform: 'translateZ(-4px)' }} />
          <div className="fp-phone-rim" style={{ transform: 'translateZ(-2px)' }} />
          <div className="fp-phone-rim" style={{ transform: 'translateZ(0px)' }} />
          <div className="fp-phone-rim" style={{ transform: 'translateZ(2px)' }} />
          <div className="fp-phone-rim" style={{ transform: 'translateZ(4px)' }} />
          <div className="fp-phone-rim" style={{ transform: 'translateZ(6px)' }} />
          <div className="fp-phone-rim" style={{ transform: 'translateZ(8px)' }} />
          <div className="fp-phone-rim" style={{ transform: 'translateZ(10px)' }} />

          {/* Front Screen plate */}
          <div className="fp-phone-front" style={{ transform: 'translateZ(12px)', transformStyle: 'preserve-3d' }}>
            {/* Screen border bezel */}
            <div className="fp-phone-bezel" />

            {/* Notch */}
            <div className="fp-notch" />

            {/* Status bar icons */}
            <div className="fp-status-bar">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="fp-status-icon">
                <path d="M5 12.55a11 11 0 0 1 14 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill="currentColor" />
              </svg>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="fp-status-icon">
                <rect x="1" y="6" width="18" height="12" rx="2" ry="2" /><line x1="23" y1="13" x2="23" y2="11" />
              </svg>
            </div>

            {/* Screen */}
            <div className="fp-screen">
              {/* Full-screen background image */}
              <img
                src={ahishAvatar}
                alt="Ahish S M"
                className="fp-bg-img"
                draggable={false}
              />

              {/* Dark overlay for text legibility */}
              <div className="fp-screen-overlay" />

              {/* Glass shine reflection overlay */}
              <div className="fp-glass-shine" />

              {/* Screen Content wrapper */}
              <div className="fp-screen-content">
                <div className="fp-content-top">
                  {/* Name */}
                  <h3 className="fp-name">Ahish S M</h3>
                  <p className="fp-role">AI & Data Science Student</p>
                </div>

                {/* Contact button */}
                <button className="fp-contact-btn" onClick={scrollToContact}>
                  Contact Me
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}



/* ═══════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════ */
function StatCard({ value, suffix, label, delay }) {
  return (
    <motion.div
      className="abt-stat"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.06, y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="abt-stat-value"><AnimatedCounter target={value} suffix={suffix} /></div>
      <div className="abt-stat-label">{label}</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   SKILL CARD
═══════════════════════════════════════════ */
function SkillCard({ icon, label, color, delay }) {
  return (
    <motion.div
      className="abt-skill"
      style={{ '--skill-color': color }}
      initial={{ opacity: 0, y: 30, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.1, y: -6 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 180 }}
    >
      <span className="abt-skill-icon">{icon}</span>
      <span className="abt-skill-label">{label}</span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   HOLO TAG
═══════════════════════════════════════════ */
function HoloTag({ children, delay }) {
  return (
    <motion.span
      className="abt-holo-tag"
      initial={{ opacity: 0, scale: 0.75 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1, y: -3 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════
   MAIN ABOUT COMPONENT
═══════════════════════════════════════════ */
export default function About() {
  const sectionRef = useRef(null);
  const cardColRef = useRef(null);

  /* Scroll-driven parallax — applied to card column only */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /* Smooth spring wrappers */
  const rawY   = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rawRot = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.02, 0.88]);

  const pY   = useSpring(rawY,     { stiffness: 60, damping: 18 });
  const pRot = useSpring(rawRot,   { stiffness: 60, damping: 18 });
  const pScale = useSpring(rawScale,{ stiffness: 60, damping: 18 });

  const innerNodes = [
    { icon: '⚛️', label: 'React' },
    { icon: '🟢', label: 'Node.js' },
    { icon: '🍃', label: 'MongoDB' },
    { icon: '🐍', label: 'Python' },
  ];
  const outerNodes = [
    { icon: '🤖', label: 'AI/ML' },
    { icon: '💙', label: 'Flutter' },
    { icon: '☁️', label: 'Cloud' },
    { icon: '🔥', label: 'Firebase' },
    { icon: '📦', label: 'Docker' },
    { icon: '🎨', label: 'Design' },
  ];

  const skills = [
    { icon: <ReactIcon width="24" height="24" />, label: 'React', color: '#61DAFB', delay: 0.05 },
    { icon: <TypeScriptRealIcon width="24" height="24" />, label: 'TypeScript', color: '#3178C6', delay: 0.10 },
    { icon: <NodeIcon width="24" height="24" />, label: 'Node.js', color: '#22c55e', delay: 0.15 },
    { icon: <ExpressIcon width="24" height="24" />, label: 'Express.js', color: '#ffffff', delay: 0.20 },
    { icon: <MongoRealIcon width="24" height="24" />, label: 'MongoDB', color: '#47A248', delay: 0.25 },
    { icon: <PythonIcon width="24" height="24" />, label: 'Python', color: '#3776AB', delay: 0.30 },
    { icon: <ReactIcon width="24" height="24" />, label: 'React Native', color: '#54C5F8', delay: 0.35 },
    { icon: <GitIcon width="24" height="24" />, label: 'Git', color: '#F05032', delay: 0.40 },
  ];

  const disciplines = ['Full-Stack Web Development', 'MERN Stack Applications', 'Artificial Intelligence'];
  const focusAreas  = ['Scalable Architectures', 'Frontend User Experience', 'Cross-Platform Mobile Apps'];

  return (
    <section className="abt-section" ref={sectionRef}>

      {/* ── Background ── */}

      {/* Ambient orbs */}
      <motion.div className="abt-orb abt-orb--green"
        animate={{ x:[0,40,-30,0], y:[0,-30,20,0], scale:[1,1.2,0.9,1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="abt-orb abt-orb--purple"
        animate={{ x:[0,-25,20,0], y:[0,25,-15,0], scale:[1,0.85,1.15,1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />

      {/* ── Section Overline ── */}
      <motion.div className="abt-overline-row"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}>
        <span className="abt-overline">Foundation &amp; Vision</span>
        <div className="abt-overline-bar" />
      </motion.div>

      {/* ── Main 2-column grid ── */}
      <div className="abt-grid">

        {/* ════════════════════════════════
            LEFT — 3D CARD SCENE
        ════════════════════════════════ */}
        <motion.div
          ref={cardColRef}
          className="abt-card-col"
          style={{ y: pY, rotateX: pRot, scale: pScale }}
        >
          {/* Volumetric phone centered in the scene (surrounding orbits and badges removed for clean minimalist presentation) */}

          {/* Card + decorations */}
          <div className="abt-card-wrap">
            {/* Halo behind card */}
            <motion.div
              className="abt-card-halo"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Corner neon accents */}
            <div className="abt-corner abt-corner--tl" />
            <div className="abt-corner abt-corner--tr" />
            <div className="abt-corner abt-corner--bl" />
            <div className="abt-corner abt-corner--br" />

            {/* Scan-line sweep */}
            <motion.div
              className="abt-scanline"
              animate={{ top: ['-2%', '102%'], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1.5, repeatDelay: 2 }}
            />

            <FloatingPhone />
          </div>
        </motion.div>

        {/* ════════════════════════════════
            RIGHT — TEXT CONTENT
        ════════════════════════════════ */}
        <div className="abt-text-col">

          {/* Big title with letter reveal */}
          <div className="abt-title-block">
            <motion.div
              className="abt-title-line"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <LetterReveal text="ENGINEERING" className="abt-title-white" delay={0.1} />
            </motion.div>
            <motion.div
              className="abt-title-line"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="abt-title-green">
                <LetterReveal text="THE FUTURE" className="abt-shimmer-text" delay={0.55} />
              </span>
            </motion.div>
          </div>

          {/* Body — word-by-word reveal */}
          <div className="abt-body">
            <p>
              <WordReveal
                text="I am a final-year B.Tech student in Artificial Intelligence and Data Science with a strong interest in"
                delay={0.2}
              />
              {' '}
              <motion.span
                className="abt-highlight"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
              >
                Full Stack and Frontend Development
              </motion.span>
              <WordReveal text=". I enjoy building responsive, scalable, and user-friendly web applications using the" delay={1.0} />
              {' '}
              <motion.span
                className="abt-highlight"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1 }}
              >
                MERN stack
              </motion.span>
              {' '}
              <WordReveal text="while continuously exploring AI technologies." delay={1.2} />
            </p>
            <p>
              <WordReveal
                text="I have developed multiple web applications using React, Node.js, Express.js, and MongoDB, along with cross-platform mobile applications using React Native. I enjoy solving real-world problems through clean code, intuitive interfaces, and efficient backend systems."
                delay={0.35}
              />
            </p>
          </div>

          {/* Holo tags */}
          <div className="abt-tags">
            {['#FullStack','#MachineLearning','#ReactNative','#OpenToWork'].map((t,i) => (
              <HoloTag key={t} delay={0.1 + i * 0.1}>{t}</HoloTag>
            ))}
          </div>

          {/* Stats */}
          <div className="abt-stats">
            <StatCard value={15} suffix="+" label="Projects Built" delay={0.1} />
            <StatCard value={10} suffix="+" label="Technologies" delay={0.2} />
            <StatCard value={2}  suffix="+" label="Years Learning" delay={0.3} />
          </div>

          {/* Skills */}
          <div className="abt-skills">
            {skills.map(s => <SkillCard key={s.label} {...s} />)}
          </div>

          {/* Footer columns */}
          <div className="abt-footer">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h4 className="abt-footer-head">Core Disciplines</h4>
              <ul className="abt-footer-list">
                {disciplines.map((d, i) => (
                  <motion.li key={d}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}>
                    {d}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
              <h4 className="abt-footer-head">Focus Areas</h4>
              <ul className="abt-footer-list">
                {focusAreas.map((d, i) => (
                  <motion.li key={d}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08 }}>
                    {d}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
