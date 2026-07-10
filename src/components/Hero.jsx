import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, animate } from 'framer-motion';
import { FaReact, FaPython, FaHtml5, FaCss3Alt, FaNodeJs, FaGitAlt, FaGithub, FaFigma, FaAndroid, FaServer, FaBolt, FaDatabase } from 'react-icons/fa';
import { SiJavascript, SiExpress, SiExpo } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import '../styles/Hero.css';

/* ── Mouse-parallax ────────────────────────────────────────── */
/* Disabled entirely on mobile/tablet (< 1024px) to save battery and avoid
   unnecessary setState calls every animation frame on touch devices.     */
function useMouseParallax(strength = 1) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef    = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const isMobile  = typeof window !== 'undefined' && window.innerWidth < 1024;

  useEffect(() => {
    /* Return early on touch devices — no mouse to track */
    if (isMobile) return;

    const onMove = (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      targetRef.current = {
        x: ((e.clientX - cx) / cx) * strength,
        y: ((e.clientY - cy) / cy) * strength,
      };
    };
    const tick = () => {
      setPos(p => ({
        x: p.x + (targetRef.current.x - p.x) * 0.055,
        y: p.y + (targetRef.current.y - p.y) * 0.055,
      }));
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [strength, isMobile]);

  return pos;
}

/* ── Scramble-text hook ────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
function useScramble(target, delay = 800, speed = 35) {
  const [text, setText] = useState('');
  const frameRef = useRef(null);

  useEffect(() => {
    let iteration = 0;
    let timeoutId;

    const run = () => {
      frameRef.current = setInterval(() => {
        setText(
          target
            .split('')
            .map((char, idx) => {
              if (char === ' ') return ' ';
              if (idx < iteration) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );
        if (iteration >= target.length) {
          clearInterval(frameRef.current);
          setText(target);
        }
        iteration += 0.5;
      }, speed);
    };

    timeoutId = setTimeout(run, delay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(frameRef.current);
    };
  }, [target, delay, speed]);

  return text;
}

/* ── 3D Hero Scene ─────────────────────────────────────────── */
function HeroScene({ mousePos }) {
  return (
    <div className="hero-3d-scene" aria-hidden="true">

      {/* Far depth layer */}
      <div
        className="hero-depth-layer hero-depth-far"
        style={{ transform: `translate(${mousePos.x * -22}px, ${mousePos.y * -14}px)` }}
      >
        {/* Tilt grid floor */}
        <div className="hero-grid-floor" />

        {/* Large ring 1 */}
        <div className="hero-ring hero-ring-xl" />
        {/* Large ring 2 */}
        <div className="hero-ring hero-ring-lg" />

        {/* Star constellation */}
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="hero-star"
            style={{
              left:              `${8 + (i * 5.8) % 84}%`,
              top:               `${10 + (i * 9.7) % 80}%`,
              animationDelay:    `${i * 0.35}s`,
              animationDuration: `${2.5 + (i % 5) * 0.5}s`,
              width:             `${1 + (i % 3)}px`,
              height:            `${1 + (i % 3)}px`,
            }}
          />
        ))}
      </div>

      {/* Mid depth layer */}
      <div
        className="hero-depth-layer hero-depth-mid"
        style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -6}px)` }}
      >


        {/* Floating glass depth cards */}
        <div className="hero-dcard hero-dcard-1" />
        <div className="hero-dcard hero-dcard-2" />
        <div className="hero-dcard hero-dcard-3" />

        {/* Diagonal accent lines */}
        <div className="hero-line hero-line-1" />
        <div className="hero-line hero-line-2" />
        <div className="hero-line hero-line-3" />
      </div>

      {/* Near depth layer */}
      <div
        className="hero-depth-layer hero-depth-near"
        style={{ transform: `translate(${mousePos.x * -3}px, ${mousePos.y * -2}px)` }}
      >
        {/* Corner brackets */}
        <div className="hero-bracket hero-bracket-tl" />
        <div className="hero-bracket hero-bracket-tr" />
        <div className="hero-bracket hero-bracket-bl" />
        <div className="hero-bracket hero-bracket-br" />

        {/* Horizontal scan beam */}
        <div className="hero-scan-beam" />
      </div>

      {/* Scanline overlay */}
      <div className="hero-scanlines" />
    </div>
  );
}

/* ── Floating Tech Icons ───────────────────────────────────── */
// Scattered evenly across the entire section (not just edges)
const SCATTER_POSITIONS = [
  { top: '12%', left: '15%' }, { top: '25%', left: '42%' }, { top: '15%', left: '75%' },
  { top: '38%', left: '8%' },  { top: '45%', left: '82%' }, { top: '60%', left: '20%' },
  { top: '70%', left: '85%' }, { top: '85%', left: '12%' }, { top: '82%', left: '45%' },
  { top: '65%', left: '60%' }, { top: '20%', left: '58%' }, { top: '32%', left: '28%' },
  { top: '88%', left: '72%' }, { top: '52%', left: '50%' }, { top: '78%', left: '28%' },
  { top: '10%', left: '90%' }, { top: '40%', left: '65%' }
];

const TECH_ICONS = [
  { name: 'React', color: '#61DAFB', style: { width: '40px', height: '40px' }, svg: <FaReact size="100%" /> },
  { name: 'JavaScript', color: '#F7DF1E', style: { width: '35px', height: '35px' }, svg: <SiJavascript size="100%" /> },
  { name: 'Python', color: '#3776AB', style: { width: '38px', height: '38px' }, svg: <FaPython size="100%" /> },
  { name: 'HTML5', color: '#E34F26', style: { width: '35px', height: '35px' }, svg: <FaHtml5 size="100%" /> },
  { name: 'CSS3', color: '#1572B6', style: { width: '35px', height: '35px' }, svg: <FaCss3Alt size="100%" /> },
  { name: 'React Native', color: '#61DAFB', style: { width: '42px', height: '42px' }, svg: <FaReact size="100%" /> },
  { name: 'Node.js', color: '#339933', style: { width: '38px', height: '38px' }, svg: <FaNodeJs size="100%" /> },
  { name: 'Express.js', color: '#ffffff', style: { width: '35px', height: '35px' }, svg: <SiExpress size="100%" /> },
  { name: 'VS Code', color: '#007ACC', style: { width: '35px', height: '35px' }, svg: <VscVscode size="100%" /> },
  { name: 'Figma', color: '#F24E1E', style: { width: '30px', height: '30px' }, svg: <FaFigma size="100%" /> },
  { name: 'Git', color: '#F05032', style: { width: '38px', height: '38px' }, svg: <FaGitAlt size="100%" /> },
  { name: 'GitHub', color: '#ffffff', style: { width: '35px', height: '35px' }, svg: <FaGithub size="100%" /> },
  { name: 'Android Emulator', color: '#3DDC84', style: { width: '38px', height: '38px' }, svg: <FaAndroid size="100%" /> },
  { name: 'Expo CLI', color: '#ffffff', style: { width: '35px', height: '35px' }, svg: <SiExpo size="100%" /> },
  { name: 'SQL', color: '#336791', style: { width: '40px', height: '40px' }, svg: <FaDatabase size="100%" /> },
  { name: 'json-server', color: '#ffffff', style: { width: '35px', height: '35px' }, svg: <FaServer size="100%" /> },
  { name: 'Thunderclient', color: '#ffb224', style: { width: '35px', height: '35px' }, svg: <FaBolt size="100%" /> }

].map((item, index) => ({
  ...item,
  style: { ...item.style, ...SCATTER_POSITIONS[index] }
}));

/* Icon float animation — pure CSS (compositor thread, zero JS cost) */
const FLOAT_CLASSES = [
  'fi-float-a', 'fi-float-b', 'fi-float-c', 'fi-float-d',
  'fi-float-e', 'fi-float-f', 'fi-float-a', 'fi-float-b',
  'fi-float-c', 'fi-float-d', 'fi-float-e', 'fi-float-f',
  'fi-float-a', 'fi-float-b', 'fi-float-c', 'fi-float-d', 'fi-float-e',
];

function FloatingIcons({ mousePos }) {
  return (
    <div className="hero-floating-icons">
      {TECH_ICONS.map((tech, i) => {
        const depth = (i % 3) + 1.5;
        const dirX  = i % 2 === 0 ? 1 : -1;
        const dirY  = i % 3 === 0 ? 1 : -1;
        /* Mouse parallax only when mousePos is non-zero (desktop only) */
        const mx = mousePos.x !== 0 ? mousePos.x * 20 * depth * dirX : 0;
        const my = mousePos.y !== 0 ? mousePos.y * 20 * depth * dirY : 0;
        return (
          <div
            key={tech.name}
            className={`hero-floating-icon ${FLOAT_CLASSES[i]}`}
            style={{
              ...tech.style,
              color: tech.color,
              /* Parallax applied via CSS var so we only touch transform, not filter */
              '--mx': `${mx}px`,
              '--my': `${my}px`,
            }}
            title={tech.name}
          >
            {tech.svg}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Hero ─────────────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef(null);
  const mousePos   = useMouseParallax(1.5);
  const scrambled  = useScramble('AHISH S M', 600, 32);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /* Content parallax */
  const y          = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale      = useTransform(scrollYProgress, [0, 1], [1, 0.84]);
  const opacity    = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const rotateX    = useTransform(scrollYProgress, [0, 1], [0, 14]);

  /* Scene layer (faster parallax) */
  const sceneY   = useTransform(scrollYProgress, [0, 1], ['0%', '55%']);
  const sceneOpa = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const cVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
  };

  const iVariants = {
    hidden:  { opacity: 0, y: 45 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section ref={sectionRef} id="home" className="hero-container">

      {/* Background texture */}
      <div className="hero-grid-overlay" />

      {/* Cursor-tracking light halo */}
      <div
        className="hero-cursor-halo"
        style={{
          transform: `translate(
            calc(50vw + ${mousePos.x * 130}px - 350px),
            calc(50vh + ${mousePos.y * 90}px - 350px)
          )`,
        }}
      />

      {/* 3D Scene — deeper parallax */}
      <motion.div
        style={{ y: sceneY, opacity: sceneOpa }}
        className="hero-scene-wrapper"
      >
        <HeroScene mousePos={mousePos} />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y, scale, opacity, rotateX, perspective: 1400 }}
        className="hero-parallax-wrapper"
      >
        <motion.div
          variants={cVariants}
          initial="hidden"
          animate="visible"
          className="hero-content"
        >
          {/* Floating Icons Background */}
          <FloatingIcons mousePos={mousePos} />

          {/* Status badge */}
          <motion.div variants={iVariants} className="hero-badge-row">
            <span className="hero-badge" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.4)', color: '#22c55e' }}>
              <span className="hero-badge-dot" style={{ backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              Open to Work • Full Stack • MERN
              <span className="hero-badge-shimmer" />
            </span>
          </motion.div>

          {/* Title */}
          <motion.div variants={iVariants} className="hero-title-wrap">
            <h1
              className="hero-title"
              style={{
                transform: `translate(${mousePos.x * -5}px, ${mousePos.y * -3}px)`,
              }}
            >
              {scrambled.split(' ').map((word, wi) =>
                wi === 0
                  ? <span key={wi} className="hero-title-word">{word}</span>
                  : <span key={wi}> <span className="hero-title-accent">{word}</span></span>
              )}
            </h1>
            {/* Ghost/depth title */}
            <div className="hero-title-ghost" aria-hidden="true">AHISH S M</div>
          </motion.div>

          {/* Role line */}
          <motion.div variants={iVariants} className="hero-role-line">
            <span className="hero-role-dash" />
            <span className="hero-role-text">Full Stack MERN Developer</span>
            <span className="hero-role-dash" />
          </motion.div>

          {/* Description */}
          <motion.p variants={iVariants} className="hero-description">
            I build responsive, scalable, and user-friendly web applications using modern web technologies and enjoy transforming ideas into real-world digital experiences.
          </motion.p>

          {/* Education & Location Stats */}
          <motion.div variants={iVariants} className="hero-stats-row">
            <span className="hero-stat-badge">🎓 Final Year B.Tech AI & DS</span>
            <span className="hero-stat-badge">📍 Coimbatore, India</span>
            <span className="hero-stat-badge">💼 Frontend | Full Stack</span>
          </motion.div>

          {/* Tech Stats */}
          <motion.div variants={iVariants} className="hero-stats-row hero-stats-secondary">
            <span className="hero-stat-item"><strong>15+</strong> Projects</span>
            <span className="hero-stat-item"><strong>2</strong> Internships</span>
            <span className="hero-stat-item"><strong>10+</strong> Technologies</span>
            <span className="hero-stat-item"><strong>2+</strong> Years Learning</span>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={iVariants} className="hero-actions">
            <button onClick={() => scrollTo('projects')} className="hero-btn-primary">
              <span className="hero-btn-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Explore Projects
              </span>
              <span className="hero-btn-glow-sweep" />
            </button>
            <a href="/Ahish_resume_mern.pdf" download="AHISH_S_M_Resume.pdf" target="_blank" rel="noopener noreferrer" className="hero-btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <span>Download Resume</span>
            </a>
          </motion.div>


        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="hero-scroll-indicator"
      >
        <div className="hero-scroll-line" />
        <span style={{ textTransform: 'none', letterSpacing: '0.1em' }}>↓ Scroll to Explore</span>
      </motion.div>

      {/* Geo meta */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="hero-geo-meta"
      >
        <span>LAT 11.0168° N</span>
        <span>LNG 76.9558° E</span>
        <span>SYNC ●</span>
      </motion.div>

    </section>
  );
}
