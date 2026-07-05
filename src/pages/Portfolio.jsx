import React, { useRef, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
const Projects = lazy(() => import("../components/Projects"));
import Experience from "../components/Experience";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import MernUniverse from "../components/MernUniverse";
import CinematicWrapper from "../components/ui/CinematicWrapper";

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    /* ═══════════════════════════════════════════════════════════
       DESKTOP (≥ 1025px)
       ─────────────────────────────────────────────────────────
       RULE: Content must NEVER be hidden while still in viewport.
       • Entry: section zooms in from below as it enters (scrub)
       • Exit:  section zooms out ONLY after it has almost left
         the viewport — start: "bottom 5%"  so it's nearly gone.
       • Zoom-in on scroll-up: because exit is scrubbed, reversing
         scroll reverses exit → content zooms back in identically.
       ═══════════════════════════════════════════════════════════ */
    mm.add("(min-width: 1025px)", () => {
      const sections = gsap.utils
        .toArray(".cinematic-section")
        .filter((el) => !el.hasAttribute("data-no-cinematic"));

      sections.forEach((section) => {
        const children = section.querySelectorAll(".reveal-child");

        /* ── Initial state — hidden below, slightly pushed back ── */
        gsap.set(section, {
          opacity: 0,
          y: 80,
          scale: 0.94,
          transformPerspective: 1600,
          transformOrigin: "50% 100%",
        });

        if (children.length > 0) {
          gsap.set(children, { opacity: 0, y: 40, scale: 0.96 });
        }

        /* ── ENTRY: as section scrolls into view ── */
        gsap.to(section, {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            /* Start animating when top of section hits bottom of viewport */
            start: "top 98%",
            /* Complete by the time top of section is 30% from top of viewport */
            end: "top 30%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        /* ── Children stagger ── */
        if (children.length > 0) {
          gsap.to(children, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: { amount: 0.4, ease: "power1.inOut" },
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "top 20%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        /* ── EXIT: ONLY starts when section bottom is 5% from top of viewport
           Skip exit on last section — nothing to scroll to after it. ── */
        const isLast = section === sections[sections.length - 1];
        if (!isLast) {
          gsap.to(section, {
            opacity: 0,
            y: -60,
            scale: 0.94,
            immediateRender: false,
            ease: "power2.in",
            scrollTrigger: {
              trigger: section,
              start: "bottom 8%",
              end: "bottom -5%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });

      /* ── Hero exit — pushes back as you scroll away ── */
      const heroP = document.querySelector(".hero-parallax-wrapper");
      if (heroP) {
        gsap.to(heroP, {
          y: -80,
          scale: 0.88,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
          scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      /* ── Background layer parallax — subtle depth ── */
      const bgLayer = document.querySelector(".background-layer");
      if (bgLayer) {
        gsap.to(bgLayer, {
          y: -200,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    /* ═══════════════════════════════════════════════════════════
       TABLET (769px – 1024px)
       Lighter 3D — no rotateX, just fade + slide.
       ═══════════════════════════════════════════════════════════ */
    mm.add("(min-width: 769px) and (max-width: 1024px)", () => {
      const sections = gsap.utils
        .toArray(".cinematic-section")
        .filter((el) => !el.hasAttribute("data-no-cinematic"));

      sections.forEach((section) => {
        const children = section.querySelectorAll(".reveal-child");

        gsap.set(section, { opacity: 0, y: 60, scale: 0.95 });
        if (children.length > 0) {
          gsap.set(children, { opacity: 0, y: 35 });
        }

        /* Entry */
        gsap.to(section, {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 98%",
            end: "top 30%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        if (children.length > 0) {
          gsap.to(children, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              end: "top 20%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        /* Exit — only when section is almost off the top */
        const isLast = section === sections[sections.length - 1];
        if (!isLast) {
          gsap.to(section, {
            opacity: 0,
            y: -50,
            scale: 0.95,
            immediateRender: false,
            ease: "power2.in",
            scrollTrigger: {
              trigger: section,
              start: "bottom 8%",
              end: "bottom -5%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    });

    /* ═══════════════════════════════════════════════════════════
       MOBILE (≤ 768px)
       Same cinematic zoom-in entry + zoom-out exit as desktop.
       Scrub = bidirectional — scroll up reverses the animation.
       ═══════════════════════════════════════════════════════════ */
    mm.add("(max-width: 768px)", () => {
      const sections = gsap.utils
        .toArray(".cinematic-section")
        .filter((el) => !el.hasAttribute("data-no-cinematic"));

      sections.forEach((section) => {
        const children = section.querySelectorAll(".reveal-child");

        /* Start invisible, slightly below + scaled down */
        gsap.set(section, {
          opacity: 0,
          y: 50,
          scale: 0.93,
          transformPerspective: 1200,
          transformOrigin: "50% 100%",
        });

        if (children.length > 0) {
          gsap.set(children, { opacity: 0, y: 30, scale: 0.96 });
        }

        /* ── ENTRY: zoom in + rise as section scrolls into view ── */
        gsap.to(section, {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 98%",
            end: "top 35%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        if (children.length > 0) {
          gsap.to(children, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: { amount: 0.3, ease: "power1.inOut" },
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 92%",
              end: "top 25%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        /* ── EXIT: zoom out + fade when section is almost off the top ──
           Scrubbed so scrolling back UP reverses it (zooms back in). ── */
        gsap.to(section, {
          opacity: 0,
          y: -45,
          scale: 0.92,
          immediateRender: false,
          ease: "power2.in",
          scrollTrigger: {
            trigger: section,
            start: "bottom 10%",
            end: "bottom -5%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    /* ── ScrollTrigger refresh cascade ── */
    const scheduleRefresh = () => ScrollTrigger.refresh();
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(scheduleRefresh);
    }
    const t1 = setTimeout(scheduleRefresh, 500);
    const t2 = setTimeout(scheduleRefresh, 1500);
    const t3 = setTimeout(scheduleRefresh, 3000);
    const t4 = setTimeout(scheduleRefresh, 6000);

    /* ── Border glow colour shift on scroll ── */
    gsap.to(".scrolling-border-frame", {
      "--glow-color": "#06b6d4",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
      keyframes: {
        "0%":   { "--glow-color": "#22c55e" },
        "25%":  { "--glow-color": "#3b82f6" },
        "50%":  { "--glow-color": "#a855f7" },
        "75%":  { "--glow-color": "#f59e0b" },
        "100%": { "--glow-color": "#06b6d4" },
      }
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      mm.revert();
    };
  }, { scope: containerRef });

  return (
    <CinematicWrapper>
      <div ref={containerRef} className="portfolio-root">
        {/* Global animated border glow frame */}
        <div className="scrolling-border-frame" />

        <Navigation />

        {/* 3D background canvas */}
        <div className="background-layer">
          <MernUniverse />
        </div>

        {/* Animated background mesh grid */}
        <div className="bg-mesh" />

        {/* Animated floating orbs */}
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-orb bg-orb-4" />
        <div className="bg-orb bg-orb-5" />

        {/* Floating particles */}
        <div className="bg-particles">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="bg-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${8 + Math.random() * 16}s`,
                animationDelay: `${Math.random() * 12}s`,
                '--dx': `${(Math.random() - 0.5) * 100}px`,
              }}
            />
          ))}
        </div>

        {/* Film grain overlay */}
        <div className="noise-overlay" />

        <main className="main-content">

          {/* Hero — full viewport, no cinematic wrapper needed */}
          <section id="hero" className="hero-section">
            <Hero />
          </section>

          {/* About */}
          <section id="about" className="cinematic-section">
            <About />
          </section>

          {/* Skills */}
          <section id="skills" className="cinematic-section">
            <Skills />
          </section>

          {/* Projects — data-no-cinematic: manages its own GSAP pin internally.
              Keeps cinematic-section class so mobile fade-in still works. */}
          <section
            id="projects"
            className="cinematic-section"
            data-no-cinematic
          >
            <Suspense
              fallback={
                <div style={{
                  minHeight: "100vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#22c55e",
                  fontSize: "0.8rem",
                  letterSpacing: "0.2em",
                  fontWeight: 700,
                }}>
                  LOADING CLUSTERS...
                </div>
              }
            >
              <Projects />
            </Suspense>
          </section>

          {/* Experience */}
          <section id="experience" className="cinematic-section">
            <Experience />
          </section>

          {/* Contact + Footer */}
          <section id="contact" className="cinematic-section">
            <Contact />
            <Footer />
          </section>

        </main>
      </div>
    </CinematicWrapper>
  );
}