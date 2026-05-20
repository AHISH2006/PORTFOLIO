import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import '../styles/Hero.css';

export default function Hero() {
  const sectionRef = useRef(null);

  // ── Scroll tracks ONLY the hero section exiting the viewport ──
  // scrollYProgress: 0 = hero fully visible, 1 = hero fully scrolled away
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Content rises slightly and fades as hero exits — stays FULLY visible until scroll starts
  const rawY     = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const rawOp    = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const rawBlur  = useTransform(scrollYProgress, [0, 1], [0, 6]);

  const y       = useSpring(rawY,     { stiffness: 55, damping: 18 });
  const scale   = useSpring(rawScale, { stiffness: 55, damping: 18 });
  const opacity = rawOp;
  const blurPx  = useTransform(rawBlur, (v) => `blur(${v}px)`);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section ref={sectionRef} id="home" className="hero-container" style={{ position: 'relative' }}>

      {/* Dot-grid overlay */}
      <div className="hero-grid-overlay" />

      {/* Scroll-parallax content wrapper */}
      <motion.div
        style={{ y, scale, opacity, filter: blurPx }}
        className="hero-parallax-wrapper"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hero-content"
        >
          {/* Status badge */}
          <motion.div variants={itemVariants} className="hero-badge-container">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Full-Stack Engineer · Open to Opportunities
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1 variants={itemVariants} className="hero-title">
            AHISH <span className="hero-title-accent">S M</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p variants={itemVariants} className="hero-description">
            Architecting high-performance full-stack digital experiences with the{' '}
            <span className="text-accent">MERN Stack</span> &amp;{' '}
            <span className="text-accent">AI</span>.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={itemVariants} className="hero-actions">
            <button onClick={() => scrollToSection('projects')} className="hero-btn-primary">
              <span>DISCOVER CLUSTERS</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button onClick={() => scrollToSection('contact')} className="hero-btn-secondary">
              INITIATE SIGNAL
            </button>
          </motion.div>

          {/* Tech stack pills */}
          <motion.div variants={itemVariants} className="hero-stack">
            {['MongoDB', 'Express', 'React', 'Node.js', 'AI/ML'].map((tech) => (
              <span key={tech} className="hero-stack-pill">{tech}</span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="hero-scroll-indicator"
      >
        <div className="hero-scroll-line" />
        <span>SCROLL</span>
      </motion.div>

      {/* Geo-meta info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="hero-meta"
      >
        <span>LAT: 11.0168° N</span>
        <span>LNG: 76.9558° E</span>
        <span>STATUS: SYNCHRONIZED</span>
      </motion.div>

    </section>
  );
}
