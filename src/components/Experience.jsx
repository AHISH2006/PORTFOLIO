import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import '../styles/Experience.css';

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
  {
    role: "Frontend Developer (Intern)",
    company: "Future Interns Program",
    period: "AUG 2024 – AUG 2025",
    year: "2024",
    desc: "Architecting responsive systems and cross-platform mobile solutions. Built production-ready React UIs with performance-first approach and GSAP animation layers.",
    tags: ["React", "GSAP", "Vite", "CSS3"],
    color: "#f59e0b",
    icon: "⚡",
    side: "left",
  },
  {
    role: "MERN Stack Developer",
    company: "Symposium Tech",
    period: "AUG 2025 – SEPT 2025",
    year: "2025",
    desc: "Full-stack orchestration of event platforms and real-time management systems. Engineered RESTful APIs, MongoDB schemas, and real-time Socket.io integrations.",
    tags: ["MongoDB", "Express", "React", "Node.js"],
    color: "#22c55e",
    icon: "🚀",
    side: "right",
  },
];

export default function Experience() {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  useGSAP(() => {
    const isMobile = window.innerWidth <= 768;

    /* ── Line draw animation ── */
    gsap.fromTo('.exp-line-fill',
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: '.exp-timeline',
          start: 'top 65%',
          end: 'bottom 35%',
          scrub: true,
        }
      }
    );

    /* ── Dots pulse in ── */
    gsap.utils.toArray('.exp-dot').forEach((dot) => {
      gsap.fromTo(dot,
        { scale: 0, opacity: 0, rotateZ: -180 },
        {
          scale: 1,
          opacity: 1,
          rotateZ: 0,
          ease: 'back.out(2.5)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    /* ── Cards: 3D fly-in from sides ── */
    gsap.utils.toArray('.exp-card-wrap').forEach((wrap, i) => {
      const isLeft = wrap.classList.contains('exp-card-wrap--left');
      const fromX = isMobile ? 0 : (isLeft ? -80 : 80);
      const fromY = isMobile ? 40 : 20;
      const rotY = isMobile ? 0 : (isLeft ? 14 : -14);

      gsap.fromTo(wrap,
        {
          opacity: 0,
          x: fromX,
          y: fromY,
          rotateY: rotY,
          rotateX: 8,
          scale: 0.88,
          transformPerspective: 1200,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 80%',
            end: 'top 45%',
            scrub: true,
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    /* ── Year badges zoom in ── */
    gsap.utils.toArray('.exp-year').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          ease: 'back.out(3)',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <section className="exp-section" ref={containerRef}>
      {/* Ambient glow */}
      <div className="exp-ambient exp-ambient--amber" />
      <div className="exp-ambient exp-ambient--green" />

      {/* Header */}
      <div className="exp-header reveal-child">
        <span className="exp-overline">Professional Log</span>
        <h2 className="exp-title">
          JOURNEY <span className="exp-title-accent">TIMELINE</span>
        </h2>
        <p className="exp-subtitle">Building products that matter</p>
      </div>

      {/* Timeline */}
      <div className="exp-timeline" ref={timelineRef}>

        {/* Central line */}
        <div className="exp-line">
          <div className="exp-line-fill" />
        </div>

        <div className="exp-list">
          {EXPERIENCES.map((exp, i) => (
            <div
              key={i}
              className={`exp-item ${exp.side === 'left' ? 'exp-item--left' : 'exp-item--right'}`}
            >
              {/* Year badge floating on line */}
              <div className="exp-year" style={{ '--exp-color': exp.color }}>
                {exp.year}
              </div>

              {/* Timeline dot */}
              <div className="exp-dot" style={{ '--exp-color': exp.color }}>
                <span className="exp-dot-icon">{exp.icon}</span>
                <div className="exp-dot-ring" />
              </div>

              {/* Card */}
              <div className={`exp-card-wrap ${exp.side === 'left' ? 'exp-card-wrap--left' : 'exp-card-wrap--right'}`}>
                <div className="exp-card" style={{ '--exp-color': exp.color }}>
                  {/* Connector arrow */}
                  <div className={`exp-connector ${exp.side === 'left' ? 'exp-connector--left' : 'exp-connector--right'}`} />

                  {/* Glow */}
                  <div className="exp-card-glow" />

                  {/* Period badge */}
                  <div className="exp-period-badge">
                    <span className="exp-period">{exp.period}</span>
                  </div>

                  {/* Role */}
                  <h3 className="exp-role">{exp.role}</h3>

                  {/* Desc */}
                  <p className="exp-desc">{exp.desc}</p>

                  {/* Tags */}
                  <div className="exp-tags">
                    {exp.tags.map((tag, j) => (
                      <span key={j} className="exp-tag" style={{ '--exp-color': exp.color }}>{tag}</span>
                    ))}
                  </div>

                  {/* Company */}
                  <div className="exp-company-row">
                    <span className="exp-company-label">Company</span>
                    <span className="exp-company" style={{ '--exp-color': exp.color }}>
                      {exp.company}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
