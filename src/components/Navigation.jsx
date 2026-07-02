import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Navigation.css';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);

  useEffect(() => {
    // Track navbar scroll state — simple scrollY check, no DOM queries
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
    
    const handleScroll = () => {
      const viewMid = window.scrollY + window.innerHeight * 0.45; // screen focal point
      let best = 'home';
      let bestDist = Infinity;
      
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        
        // Use static vertical position to avoid 3D transform coordinates distortion
        const rect = el.getBoundingClientRect();
        const elTop = rect.top + window.scrollY;
        const elMid = elTop + el.offsetHeight * 0.5;
        
        const dist = Math.abs(viewMid - elMid);
        if (dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      });
      setActiveSection(best);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on resize ≥ 768px
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when drawer open (sync with Lenis if active)
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (window.lenis) {
      if (menuOpen) {
        window.lenis.stop();
      } else {
        window.lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [menuOpen]);

  const navItems = [
    { id: 'home',       label: 'HOME'       },
    { id: 'about',      label: 'ABOUT ME'   },
    { id: 'skills',     label: 'SKILLS'     },
    { id: 'projects',   label: 'PROJECTS'   },
    { id: 'experience', label: 'EXPERIENCE' },
  ];

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (window.lenis) {
        window.lenis.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <>
      {/* ── Top Bar ─────────────────────────────── */}
      <nav className={`navbar-container ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner">

          {/* Logo */}
          <a href="#home" className="navbar-logo" onClick={(e) => { e.preventDefault(); scrollTo('home'); }}>
            AHISH<span className="navbar-logo-dot">.</span>
          </a>

          {/* Desktop pill nav */}
          <div className={`navbar-pill ${scrolled ? 'navbar-pill-active' : ''}`}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}
                className={`navbar-pill-item ${activeSection === item.id ? 'navbar-pill-item-active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}
            className="navbar-cta"
          >
            START CONVERSATION
          </a>

          {/* Mobile hamburger */}
          <button
            className={`navbar-hamburger ${menuOpen ? 'navbar-hamburger-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer (Remix-style left panel) ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              className="mobile-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Drawer header */}
              <div className="mobile-drawer-header">
                <span className="mobile-drawer-logo">
                  AHISH<span className="navbar-logo-dot">.</span>
                </span>
                <button
                  className="mobile-drawer-close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Nav items */}
              <nav className="mobile-drawer-nav">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}
                    className={`mobile-drawer-item ${activeSection === item.id ? 'mobile-drawer-item-active' : ''}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.055, duration: 0.3 }}
                  >
                    {/* Left accent bar */}
                    <span className="mobile-drawer-bar" />
                    <span className="mobile-drawer-label">{item.label}</span>
                  </motion.a>
                ))}
              </nav>

              {/* CTA at bottom — bold like "START BUILDING" in the image */}
              <motion.div
                className="mobile-drawer-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42, duration: 0.3 }}
              >
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}
                  className="mobile-drawer-cta"
                >
                  START CONVERSATION
                </a>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
