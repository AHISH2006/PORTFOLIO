import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, animate } from 'framer-motion';
import '../styles/Hero.css';

/* ── Mouse-parallax ────────────────────────────────────────── */
function useMouseParallax(strength = 1) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef    = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
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
  }, [strength]);

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
  { name: 'React', color: '#61DAFB', style: { width: '40px' }, svg: <svg viewBox="-11.5 -10.23 23 20.46"><circle cx="0" cy="0" r="2.05" fill="currentColor"/><g stroke="currentColor" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg> },
  { name: 'JavaScript', color: '#F7DF1E', style: { width: '35px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 3h18v18H3V3zm10.71 13.91c-.42-.31-.9-.55-1.45-.71V14.1c.36.13.68.32.96.56l1.24-1.63c-.6-.53-1.31-.93-2.11-1.18V5h-3.2v14h3.45c.87 0 1.65-.24 2.34-.73l-1.23-1.65zm-6.22-3.15h2.95v-1.6H7.44v1.6zm0-3.32h4.52V5.84H7.44v1.6zM15.42 19h3.45c.87 0 1.65-.24 2.34-.73l-1.23-1.65c-.42-.31-.9-.55-1.45-.71v-2.1c.36.13.68.32.96.56l1.24-1.63c-.6-.53-1.31-.93-2.11-1.18V5h-3.2v14z" fill="none"/><path d="M0 0h24v24H0z" fill="#F7DF1E"/><path d="M11.57 14.85c-.32-.23-.7-.41-1.13-.53l-.2-.05V12.1l.3.09c.36.12.67.31.91.56l1.45-1.92c-.68-.61-1.52-1.05-2.48-1.3V5H7.27v14h3.18v-2.31c.42.36.93.63 1.5.8l.22.06v-2.18l-.34-.11c-.34-.1-.64-.26-.88-.47l-1.42 1.89c.77.71 1.76 1.19 2.87 1.39l.3.05V19h3.18c.95 0 1.83-.24 2.62-.68l-1.47-1.93c-.34.25-.72.44-1.14.56l-.23.06V14.8l.34.1c.34.1.64.26.88.47l1.42-1.89c-.77-.71-1.76-1.19-2.87-1.39l-.3-.05V5h-3.18v14h3.18v-2.31c-.42-.36-.93-.63-1.5-.8l-.22-.06v2.18l.34.11z" fill="#000"/></svg> },
  { name: 'Python', color: '#3776AB', style: { width: '38px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-3.1 0-5.8.5-6.5.6-.9.2-1.2.6-1.3 1.3-.1.8-.1 1.7-.1 2.5 0 .6.3 1.2.9 1.4.6.2 1.4.3 2.1.3v3c0 1.4 1 2.5 2.5 2.5h3.5V13H8.3c-1.3 0-2.4.9-2.5 2.1 0 .7-.1 1.4-.1 2 0 1.2 1 2.1 2.3 2.1h3.3v-1.6c0-1.6 1.3-2.9 2.9-2.9h3.8c1.6 0 2.9-1.3 2.9-2.9V6.1c0-1.6-1.3-2.9-2.9-2.9H13V1.6c0-.9-1.1-1.6-1-1.6zM9.5 2C9.8 2 10 2.2 10 2.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm5 17c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z"/></svg> },
  { name: 'HTML5', color: '#E34F26', style: { width: '35px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 0h21l-1.9 21.5L12 24l-8.6-2.5L1.5 0zm9.6 15.6l-5.1-1.4-.4-4.2h12.5l.3-3.3H5.2L4.8 3h14.8l-1.3 14.2-6.3 1.8-6-1.7-.2-2.1h3.2l.1 1.2 3.1.9 3.2-.9.4-4.8H5.9l.2 2h9.6l-.3 3.3z"/></svg> },
  { name: 'CSS3', color: '#1572B6', style: { width: '35px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 0h21l-1.9 21.5L12 24l-8.6-2.5L1.5 0zm14.6 6.8l.2-2.7H5l.2 2.7h11.1zm-.2 2.7H5.4l.2 2.7h10.4l-.5 5.5-3.5 1-3.5-1-.2-2.8H5.5l.4 5.2 6.1 1.7 6.1-1.7.9-10z"/></svg> },
  { name: 'React Native', color: '#61DAFB', style: { width: '42px' }, svg: <svg viewBox="-11.5 -10.23 23 20.46"><circle cx="0" cy="0" r="2.05" fill="currentColor"/><g stroke="currentColor" strokeWidth="1.3" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg> },
  { name: 'Node.js', color: '#339933', style: { width: '38px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.875 0L1.766 5.833V17.5L11.875 23.333L21.984 17.5V5.833L11.875 0ZM10.59 18.067V10.297L6.442 12.687V17.502L5.05 16.697V11.884L10.59 8.685V18.067ZM18.96 16.697L13.42 19.896V10.514L17.568 8.124V3.309L18.96 4.114V16.697ZM17.568 17.502L11.875 20.785L6.182 17.502V14.184L11.875 17.468L17.568 14.184V17.502Z"/></svg> },
  { name: 'Express.js', color: '#fff', style: { width: '35px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.176 17h-2.45l-1.92-3.15H12.7V17h-2.43v-9.5h2.43v4h.1l1.83-4h2.4l-3 4.8 3.146 4.7z"/></svg> },
  { name: 'VS Code', color: '#007ACC', style: { width: '35px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 0l-12 5.5L1 3.5 0 4l6.5 6L0 16l1 1 4.5-2 12 5.5V0zm-11 11L15 2v20L6.5 11z"/></svg> },
  { name: 'Figma', color: '#F24E1E', style: { width: '30px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 12c-2.2 0-4-1.8-4-4s1.8-4 4-4h4v8H8z"/><path d="M16 4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V4h4z" fill="#1ABCFE"/><path d="M8 12h4v4H8c-2.2 0-4-1.8-4-4s1.8-4 4-4z" fill="#0ACF83"/><path d="M8 20c-2.2 0-4-1.8-4-4h4v4z" fill="#A259FF"/><path d="M12 12h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4v-8z" fill="#FF7262"/></svg> },
  { name: 'Git', color: '#F05032', style: { width: '38px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.55 0L0 11.55l11.55 11.55L23.1 11.55 11.55 0zm5.1 12.3c-.9 0-1.6-.7-1.6-1.6 0-.3.1-.6.2-.8l-2.6-2.6c-.3.1-.6.2-.9.2s-.6-.1-.9-.2l-1.3 1.3c.1.3.2.6.2.9 0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6c.3 0 .6.1.8.2L10.3 7c-.1-.3-.2-.6-.2-.9 0-.9.7-1.6 1.6-1.6s1.6.7 1.6 1.6c0 .3-.1.6-.2.9l2.6 2.6c.3-.1.6-.2.9-.2.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6z"/></svg> },
  { name: 'GitHub', color: '#ffffff', style: { width: '35px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg> },
  { name: 'Android Emulator', color: '#3DDC84', style: { width: '38px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 13.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm-11 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm11.2-6.5l1.9-3.3c.1-.2.1-.5-.1-.7-.2-.2-.5-.2-.7-.1L16.9 6c-1.5-.7-3.2-1-5-1s-3.5.3-5 1L5 2.9c-.2-.1-.5-.1-.7.1-.2.2-.2.5-.1.7l1.9 3.3C3.5 8.7 1.4 11.9 1 15.5h22c-.4-3.6-2.5-6.8-5.3-8.5z"/></svg> },
  { name: 'Expo CLI', color: '#000020', style: { width: '35px' }, svg: <svg viewBox="0 0 24 24" fill="#ffffff"><path d="M12 0l11 6.35v11.3L12 24 1 17.65V6.35L12 0zm0 2.3l-9 5.2v10.4l9 5.2 9-5.2V7.5l-9-5.2zM8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"/></svg> },
  { name: 'SQL', color: '#336791', style: { width: '40px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 18c-4.42 0-8-1.79-8-4v-1.42c2.14 1.52 5 2.42 8 2.42s5.86-.9 8-2.42V16c0 2.21-3.58 4-8 4zm8-6.19C17.93 15.19 15.15 16 12 16s-5.93-.81-8-2.19V11.5c2.08 1.43 4.93 2.5 8 2.5s5.92-1.07 8-2.5v2.31zM12 12C7.58 12 4 10.21 4 8s3.58-4 8-4 8 1.79 8 4-3.58 4-8 4z"/></svg> },
  { name: 'json-server', color: '#ffffff', style: { width: '35px' }, svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 8h6v2H9z"/><path d="M9 12h6v2H9z"/><path d="M9 16h4v2H9z"/></svg> },
  { name: 'Thunderclient', color: '#ffb224', style: { width: '35px' }, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> }
].map((item, index) => ({
  ...item,
  style: { ...item.style, ...SCATTER_POSITIONS[index] }
}));

function FloatingIcons({ mousePos }) {
  return (
    <div className="hero-floating-icons">
      {TECH_ICONS.map((tech, i) => {
        // Compute stronger mouse parallax based on index
        const depth = (i % 3) + 1.5; 
        const dirX = i % 2 === 0 ? 1 : -1;
        const dirY = i % 3 === 0 ? 1 : -1;
        
        return (
          <motion.div
            key={tech.name}
            className="hero-floating-icon"
            style={{
              ...tech.style,
              color: tech.color,
              transform: `translate(${mousePos.x * 25 * depth * dirX}px, ${mousePos.y * 25 * depth * dirY}px)`
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10 * dirX, 0],
              rotate: [0, 8 * dirX, -8 * dirX, 0],
            }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
            title={tech.name}
          >
            {tech.svg}
          </motion.div>
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
