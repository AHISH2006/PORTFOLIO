import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react'
import {
  ExternalLink, X, Code2, Layers, Zap, Cpu,
  GitBranch, User, Trophy, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Projects.css'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────────────────────
   Context
───────────────────────────────────────────────────────────── */
const ModalCtx = createContext(null)
const useModal = () => useContext(ModalCtx)

function ModalProvider({ children }) {
  const [selectedProject, setSelectedProject] = useState(null)
  return (
    <ModalCtx.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ModalCtx.Provider>
  )
}

/* ─────────────────────────────────────────────────────────────
   Projects Data
───────────────────────────────────────────────────────────── */
import pro1 from '../assets/pro1.png'
import pro2 from '../assets/pro2.png'
import pro3 from '../assets/pro3.png'
import pro4 from '../assets/pro4.png'
import pro5 from '../assets/pro5.png'
import pro6 from '../assets/pro6.png'
import pro7 from '../assets/pro7.png'
import pro8 from '../assets/pro8.png'

const PROJECTS = [
  {
    id: '1', title: 'MindCare AI', category: 'AI / Healthcare',
    stack: 'React + Vite / Node.js / MongoDB',
    desc: 'A mental healthcare chatbot application designed to provide AI-powered conversational support for mental health.',
    overview: 'MindCare AI is a mental healthcare chatbot providing AI-powered conversational support. It features crisis detection middleware, mood tracking, real-time chat, and OpenAI API integration for intelligent, empathetic responses.',
    keyFeatures: ['Crisis detection middleware','Mood tracking and selection','Real-time chat interface','Message history management','OpenAI integration ready'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Backend', items: 'Node.js, Express' },{ name: 'Database', items: 'MongoDB (Atlas)' },{ name: 'AI', items: 'OpenAI API' }],
    architecture: 'MERN Stack with separated client/server structure.',
    role: 'Full-Stack Developer',
    achievements: ['Built end-to-end MERN application','Integrated crisis detection safety layer','Connected OpenAI API'],
    link: 'https://github.com/AHISH2006/AI_Chatbot', github: 'https://github.com/AHISH2006/AI_Chatbot',
    imageUrl: pro1, color: '#22c55e', icon: '🧠',
  },
  {
    id: '2', title: 'Assignment Portal', category: 'Education',
    stack: 'React + Vite / JSON Server',
    desc: 'Educational platform for managing and tracking assignments with mock data integration.',
    overview: 'Assignment Portal is an educational platform for managing and tracking assignments. Uses React frontend with JSON Server backend mockup for efficient assignment management.',
    keyFeatures: ['Assignment management system','Student tracking dashboard','Mock data integration','CRUD operations'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Backend', items: 'JSON Server' },{ name: 'Language', items: 'JavaScript' }],
    architecture: 'React SPA with mock REST API for rapid prototyping.',
    role: 'Frontend Developer',
    achievements: ['Built complete assignment management flow','Implemented mock API integration','Created responsive dashboard'],
    link: 'https://github.com/AHISH2006/Assignment-portal', github: 'https://github.com/AHISH2006/Assignment-portal',
    imageUrl: pro2, color: '#3b82f6', icon: '📚',
  },
  {
    id: '3', title: 'Escape Code', category: 'Dev Platform',
    stack: 'React + Vite / Express / bcryptjs',
    desc: 'Web application with client-server architecture featuring user authentication and secure password hashing.',
    overview: 'Escape Code is a full client-server web app. React frontend, Express backend, user authentication powered by bcryptjs for secure password hashing.',
    keyFeatures: ['React frontend with modern UI','Express backend API','User authentication system','Secure password hashing with bcryptjs'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Backend', items: 'Node.js, Express' },{ name: 'Security', items: 'bcryptjs' }],
    architecture: 'Monorepo with client/server dirs. Express serves REST API.',
    role: 'Full-Stack Developer',
    achievements: ['Built secure authentication flow','Implemented monorepo structure','Deployed full-stack'],
    link: 'https://escape-code.vercel.app', github: 'https://github.com/AHISH2006/escape-code',
    imageUrl: pro3, color: '#a855f7', icon: '⚡',
  },
  {
    id: '4', title: 'GAME-X', category: 'E-Commerce',
    stack: 'MERN Stack',
    desc: 'Game marketplace with catalog browsing, shopping functionality, and user authentication on the MERN stack.',
    overview: 'GAME-X is a full-stack game marketplace. Features game listing, catalog browsing, shopping cart, user authentication, and detailed game management — all on MERN.',
    keyFeatures: ['Game listing & catalog browsing','Shopping cart functionality','User authentication & profiles','Game details management','Responsive marketplace UI'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Backend', items: 'Node.js, Express' },{ name: 'Database', items: 'MongoDB' }],
    architecture: 'Full-stack MERN with RESTful API, React Router, and MongoDB.',
    role: 'Full-Stack Developer',
    achievements: ['Deployed live on Vercel','Built complete e-commerce flow','Implemented auth system'],
    link: 'https://game-x-store.vercel.app/', github: 'https://github.com/AHISH2006/GAME-X',
    imageUrl: pro4, color: '#f59e0b', icon: '🎮',
  },
  {
    id: '5', title: 'Omni-Tech', category: 'Tech Platform',
    stack: 'React + Vite',
    desc: 'Modern technology platform with component-driven development and contemporary tooling.',
    overview: 'Omni-Tech is a modern technology platform with React-based interface and component-driven development. Uses Vite for fast, responsive SPA delivery.',
    keyFeatures: ['React-based modern interface','Component-driven development','Modern build tooling with Vite','Responsive SPA design'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Language', items: 'JavaScript' },{ name: 'Tooling', items: 'ESLint, Modern Build Tools' }],
    architecture: 'Modern React SPA with Vite optimised builds.',
    role: 'Frontend Developer',
    achievements: ['Built performant SPA','Implemented component architecture','Deployed on Vercel'],
    link: 'https://omni-tech-tau.vercel.app', github: 'https://github.com/AHISH2006/omni-tech',
    imageUrl: pro6, color: '#06b6d4', icon: '🚀',
  },
  {
    id: '6', title: 'REBRAND', category: 'AI / Branding',
    stack: 'TypeScript / v0.app',
    desc: 'AI-powered branding platform for the automotive industry with AI-driven design generation.',
    overview: 'REBRAND is an AI-powered branding platform for the automotive industry (BMW). Leverages AI design generation, brand customisation, and interactive interface — built with TypeScript and v0.app.',
    keyFeatures: ['AI-driven design generation','Brand customisation tools','Interactive branding interface','Automotive industry focus'],
    techStack: [{ name: 'Language', items: 'TypeScript' },{ name: 'Platform', items: 'v0.app Framework' },{ name: 'Frontend', items: 'React Components' }],
    architecture: 'Component-based AI platform with v0.app and TypeScript on Vercel.',
    role: 'Full-Stack TypeScript Developer',
    achievements: ['Deployed on Vercel','Built with v0.app AI tooling','Created AI branding pipeline for BMW'],
    link: 'https://vercel.com/ahish2006s-projects/v0-ai-branding-for-bmw', github: 'https://github.com/AHISH2006/REBRAND',
    imageUrl: pro7, color: '#6366f1', icon: '🎨',
  },
  {
    id: '7', title: 'Vibex', category: 'Web App',
    stack: 'React + Vite',
    desc: 'Modern web application platform with React-based interface and contemporary component architecture.',
    overview: 'Vibex is a modern web app featuring React component architecture built with Vite for fast development and optimised performance.',
    keyFeatures: ['React-based modern interface','Modern component architecture','Fast development with Vite','Responsive design'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Language', items: 'JavaScript' },{ name: 'Tooling', items: 'Modern Build Tools' }],
    architecture: 'SPA with modern tooling and optimised build pipeline.',
    role: 'Frontend Developer',
    achievements: ['Built modern SPA with React + Vite','Implemented responsive component design'],
    link: 'https://github.com/AHISH2006/Vibex', github: 'https://github.com/AHISH2006/Vibex',
    imageUrl: pro8, color: '#f97316', icon: '✨',
  },
  {
    id: '8', title: 'AGRONIX', category: 'AgriTech',
    stack: 'React + Vite',
    desc: 'Agricultural technology platform with fast refresh, React Compiler optimisation, and modern development practices.',
    overview: 'AGRONIX is an agricultural tech platform with Vite HMR, React Compiler optimisation, ESLint configuration, and modern build tooling for production-ready performance.',
    keyFeatures: ['Fast refresh with Vite HMR','React Compiler optimisation','ESLint for code quality','Modern build tooling','Agricultural tech focus'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Plugins', items: '@vitejs/plugin-react, SWC' },{ name: 'Tooling', items: 'ESLint, HMR' }],
    architecture: 'React + Vite SPA with Hot Module Replacement and modern practices.',
    role: 'Frontend Developer',
    achievements: ['Deployed live on Vercel','Implemented modern Vite + React stack','Optimised with React Compiler'],
    link: 'https://zenzora-2k26.vercel.app/', github: 'https://github.com/AHISH2006',
    imageUrl: pro1, color: '#10b981', icon: '🌱',
  },
]

/* ─────────────────────────────────────────────────────────────
   CARD MODAL — Bottom-sheet on mobile, centered on desktop
───────────────────────────────────────────────────────────── */
function CardModal() {
  const { selectedProject, setSelectedProject } = useModal()
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const check = () => setIsMobileView(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
      if (window.lenis) window.lenis.stop()
    }
    const onKey = (e) => e.key === 'Escape' && setSelectedProject(null)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (window.lenis) window.lenis.start()
    }
  }, [selectedProject, setSelectedProject])

  if (!selectedProject) return null
  const c = selectedProject

  const boxVariants = isMobileView
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { y: 50, scale: 0.92, opacity: 0 }, animate: { y: 0, scale: 1, opacity: 1 }, exit: { y: 50, scale: 0.92, opacity: 0 } }

  return (
    <AnimatePresence>
      <motion.div
        key="modal-bg"
        className="prj-modal-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}
      >
        <motion.div
          className="prj-modal-box"
          {...boxVariants}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {isMobileView && <div className="prj-modal-handle" />}
          <button className="prj-modal-close" onClick={() => setSelectedProject(null)} aria-label="Close">
            <X size={18} />
          </button>

          <div className="prj-modal-scroll" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
            <div className="prj-modal-banner">
              <img src={c.imageUrl} alt={c.title} className="prj-modal-banner-img" />
              <div className="prj-modal-banner-overlay" />
              <span className="prj-modal-tag" style={{ color: c.color, background: `${c.color}22`, borderColor: `${c.color}55` }}>
                {c.icon} {c.category}
              </span>
            </div>

            <div className="prj-modal-header">
              <h2 className="prj-modal-title">{c.title}</h2>
              <p className="prj-modal-stack" style={{ color: c.color }}>{c.stack}</p>
            </div>

            {[
              { Icon: Layers,    label: 'Overview',     content: <p className="prj-modal-text">{c.overview}</p> },
              { Icon: Zap,       label: 'Key Features', content: (
                <ul className="prj-modal-features">
                  {c.keyFeatures.map((f, i) => <li key={i}><span className="prj-feature-dot" style={{ background: c.color }} />{f}</li>)}
                </ul>
              )},
              { Icon: Cpu,       label: 'Tech Stack', content: (
                <div className="prj-modal-tech-grid">
                  {c.techStack.map((t, i) => (
                    <div key={i} className="prj-modal-tech-item">
                      <span className="prj-tech-label" style={{ color: c.color }}>{t.name}</span>
                      <span className="prj-tech-items">{t.items}</span>
                    </div>
                  ))}
                </div>
              )},
              { Icon: GitBranch, label: 'Architecture', content: <p className="prj-modal-text">{c.architecture}</p> },
              { Icon: User,      label: 'My Role',      content: <p className="prj-modal-text">{c.role}</p> },
              { Icon: Trophy,    label: 'Achievements', content: (
                <div className="prj-modal-achievements">
                  {c.achievements.map((a, i) => (
                    <div key={i} className="prj-ach-item" style={{ borderColor: `${c.color}33` }}>
                      <span style={{ color: c.color }}>✦</span><span>{a}</span>
                    </div>
                  ))}
                </div>
              )},
            ].map(({ Icon, label, content }) => (
              <div key={label} className="prj-modal-section">
                <div className="prj-modal-section-label">
                  <Icon size={13} style={{ color: c.color }} />
                  <span>{label}</span>
                </div>
                {content}
              </div>
            ))}

            <div className="prj-modal-actions">
              <a href={c.link} target="_blank" rel="noopener noreferrer"
                className="prj-modal-btn prj-modal-btn-primary" style={{ backgroundColor: c.color }}>
                <ExternalLink size={14} /> Live Demo
              </a>
              <a href={c.github} target="_blank" rel="noopener noreferrer"
                className="prj-modal-btn prj-modal-btn-secondary">
                <Code2 size={14} /> GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────
   3D PROJECT CARD — Shared between tablet grid, mobile carousel
───────────────────────────────────────────────────────────── */
function ProjectCard3D({ project, onOpen }) {
  const cardRef = useRef(null)
  const glowRef = useRef(null)
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  const handleMouseMove = useCallback((e) => {
    if (isTouchDevice) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -20
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(24px) scale(1.02)`
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, ${project.color}30, transparent 60%)`
      glowRef.current.style.opacity = '1'
    }
  }, [project.color, isTouchDevice])

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = ''
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }, [])

  return (
    <div
      ref={cardRef}
      className="mc-card"
      style={{ '--cc': project.color }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
    >
      <div ref={glowRef} className="mc-glow" />

      <div className="mc-img-wrap">
        <img src={project.imageUrl} alt={project.title} className="mc-img" loading="lazy" draggable={false} />
        <div className="mc-img-overlay" />
        <span className="mc-badge">{project.icon} {project.category}</span>
      </div>

      <div className="mc-body">
        <h3 className="mc-title">{project.title}</h3>
        <p className="mc-desc">{project.overview}</p>
        <div className="mc-tech-chips">
          {project.techStack.map((t, i) => (
            <span key={i} className="mc-chip">{t.items.split(',')[0].trim()}</span>
          ))}
        </div>
        <div className="mc-actions">
          <a href={project.link} target="_blank" rel="noopener noreferrer"
            className="mc-btn primary" onClick={(e) => e.stopPropagation()}
            style={{ background: project.color }}>
            <ExternalLink size={13} /> Live
          </a>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="mc-btn secondary" onClick={(e) => e.stopPropagation()}>
            <Code2 size={13} /> Code
          </a>
          <button className="mc-btn detail" onClick={(e) => { e.stopPropagation(); onOpen(project) }}>
            Details
          </button>
        </div>
      </div>

      <div className="mc-corner mc-tl" />
      <div className="mc-corner mc-br" />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MOBILE 3D HORIZONTAL SCROLL CAROUSEL
   GSAP ScrollTrigger pins the section and drives horizontal scroll
   with perspective-based left/right 3D card transitions
───────────────────────────────────────────────────────────── */
function Mobile3DCarousel({ onOpen }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const tlRef = useRef(null)
  const total = PROJECTS.length

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const slides = Array.from(track.querySelectorAll('.prj-mob-slide'))
    if (!slides.length) return

    /* Set initial 3D state for all slides */
    gsap.set(slides, {
      opacity: (i) => i === 0 ? 1 : 0.3,
      rotateY: (i) => i === 0 ? 0 : 35,
      scale: (i) => i === 0 ? 1 : 0.85,
      transformOrigin: 'center center',
      transformPerspective: 1200,
      z: (i) => i === 0 ? 0 : -60,
    })

    /* Calculate total horizontal scroll distance */
    const slideWidth = slides[0].offsetWidth
    const gap = 20
    const totalScrollWidth = (slideWidth + gap) * (total - 1)

    /* Pin + horizontal drive timeline */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${total * 100}vh`,
        pin: true,
        pinSpacing: true,
        scrub: 1.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(total - 1, Math.round(self.progress * (total - 1)))
          setActiveSlide(idx)
        },
      },
    })

    tlRef.current = tl

    /* Drive horizontal translation of track */
    tl.to(track, {
      x: -totalScrollWidth,
      ease: 'none',
      duration: total,
    }, 0)

    /* 3D transformation for each slide based on its position relative to center */
    slides.forEach((slide, i) => {
      tl.to(slide, {
        opacity: 1,
        rotateY: 0,
        scale: 1,
        z: 0,
        ease: 'power2.out',
        duration: 1,
      }, i)

      if (i > 0) {
        tl.fromTo(slide,
          { opacity: 0.3, rotateY: 35, scale: 0.85, z: -60 },
          { opacity: 1, rotateY: 0, scale: 1, z: 0, ease: 'power2.out', duration: 1 },
          i - 1
        )
      }

      if (i < total - 1) {
        tl.to(slide, {
          opacity: 0.3,
          rotateY: -35,
          scale: 0.85,
          z: -60,
          ease: 'power2.in',
          duration: 1,
        }, i)
      }
    })

    setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      if (tlRef.current?.scrollTrigger) tlRef.current.scrollTrigger.kill()
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null }
    }
  }, [total])

  const scrollToSlide = useCallback((idx) => {
    const st = tlRef.current?.scrollTrigger
    if (!st) return
    const target = st.start + (idx / (total - 1)) * (st.end - st.start)
    if (window.lenis) {
      window.lenis.scrollTo(target, { duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }, [total])

  return (
    <div ref={sectionRef} className="prj-mob-carousel-section">
      {/* Background 3D depth grid */}
      <div className="prj-mob-bg-grid" />

      {/* Ambient color that changes with active project */}
      <div
        className="prj-mob-ambient"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${PROJECTS[activeSlide].color}18, transparent 70%)` }}
      />

      {/* Header */}
      <div className="prj-mob-header">
        <span className="prj-mob-overline">Case Studies</span>
        <h2 className="prj-mob-title">PROJECT <span style={{ color: PROJECTS[activeSlide].color, transition: 'color 0.5s ease' }}>CLUSTERS</span></h2>
        <p className="prj-mob-sub">Scroll to explore</p>
      </div>

      {/* Counter */}
      <div className="prj-mob-counter">
        <span style={{ color: PROJECTS[activeSlide].color }}>{String(activeSlide + 1).padStart(2, '0')}</span>
        <span className="prj-mob-counter-sep">/</span>
        <span>{String(total).padStart(2, '0')}</span>
      </div>

      {/* Perspective viewport */}
      <div className="prj-mob-viewport">
        <div ref={trackRef} className="prj-mob-track">
          {PROJECTS.map((p, idx) => (
            <div key={p.id} className="prj-mob-slide">
              <ProjectCard3D project={p} onOpen={onOpen} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot navigation */}
      <div className="prj-mob-dots">
        {PROJECTS.map((p, idx) => (
          <button
            key={p.id}
            className={`prj-mob-dot ${idx === activeSlide ? 'is-active' : ''}`}
            style={{ '--dot-color': p.color }}
            onClick={() => scrollToSlide(idx)}
            aria-label={`Go to ${p.title}`}
          />
        ))}
      </div>

      {/* Nav arrows */}
      <div className="prj-mob-nav">
        <button
          className="prj-mob-arrow"
          onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
          disabled={activeSlide === 0}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="prj-mob-nav-label" style={{ color: PROJECTS[activeSlide].color }}>
          {PROJECTS[activeSlide].title}
        </span>
        <button
          className="prj-mob-arrow"
          onClick={() => scrollToSlide(Math.min(total - 1, activeSlide + 1))}
          disabled={activeSlide === total - 1}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Scroll hint */}
      <div className="prj-mob-scroll-hint">
        <ChevronDown size={14} />
        <span>Scroll down to browse</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   DESKTOP SHOWCASE CARD — Stacked 3D during pin
───────────────────────────────────────────────────────────── */
function ProjectShowcaseCard({ project, index, isActive, total }) {
  const { setSelectedProject } = useModal()

  return (
    <div
      className={`prj-showcase-card ${isActive ? 'is-active' : ''}`}
      style={{ '--cc': project.color }}
    >
      <div className="prj-showcase-glow" />
      <div className="prj-showcase-number">
        <span className="prj-showcase-num-big">0{index + 1}</span>
        <span className="prj-showcase-num-sep">/</span>
        <span className="prj-showcase-num-total">0{total}</span>
      </div>
      <div className="prj-showcase-img-wrap">
        <img src={project.imageUrl} alt={project.title} className="prj-showcase-img"
          loading={index === 0 ? 'eager' : 'lazy'} draggable={false} />
        <div className="prj-showcase-img-overlay" />
        <span className="prj-showcase-badge">{project.icon} {project.category}</span>
      </div>
      <div className="prj-showcase-content">
        <h3 className="prj-showcase-title">{project.title}</h3>
        <p className="prj-showcase-desc">{project.overview}</p>
        <div className="prj-showcase-stack-list">
          {project.techStack.map((t, i) => (
            <span key={i} className="prj-showcase-chip">{t.items}</span>
          ))}
        </div>
        <div className="prj-showcase-actions">
          <a href={project.link} target="_blank" rel="noopener noreferrer"
            className="prj-showcase-btn prj-showcase-btn-primary" style={{ background: project.color }}>
            <ExternalLink size={14} strokeWidth={2.5} /> Live Demo
          </a>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="prj-showcase-btn prj-showcase-btn-secondary">
            <Code2 size={14} /> GitHub
          </a>
          <button className="prj-showcase-btn prj-showcase-btn-detail"
            onClick={() => setSelectedProject(project)}>
            Full Details
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN PROJECTS CONTENT
───────────────────────────────────────────────────────────── */
function ProjectsContent() {
  const sectionRef = useRef(null)
  const pinContainerRef = useRef(null)
  const cardsContainerRef = useRef(null)
  const tabletGridRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const { setSelectedProject } = useModal()
  const tlRef = useRef(null)

  /* ── Desktop: GSAP pin + stacked card transitions ── */
  useEffect(() => {
    if (window.innerWidth < 1025) return
    const rafId = requestAnimationFrame(() => {
      const section = sectionRef.current
      const pinContainer = pinContainerRef.current
      const cardsContainer = cardsContainerRef.current
      if (!section || !pinContainer || !cardsContainer) return

      const cards = cardsContainer.querySelectorAll('.prj-showcase-card')
      const totalCards = cards.length
      if (!totalCards) return

      gsap.set(cards, {
        opacity: (i) => i === 0 ? 1 : Math.max(0, 0.75 - (i * 0.15)),
        y: (i) => i * 55,
        z: (i) => -i * 280,
        scale: (i) => 1 - (i * 0.04),
        rotateX: (i) => -i * 4,
        transformPerspective: 1800,
        transformOrigin: '50% 50%',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalCards * 100}vh`,
          pin: pinContainer,
          pinSpacing: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(totalCards - 1, Math.floor(self.progress * totalCards))
            setActiveIdx(idx)
          },
          onRefresh: () => {
            ScrollTrigger.getAll().forEach(st => { if (st !== tl.scrollTrigger) st.refresh() })
          },
        },
      })
      tlRef.current = tl

      for (let i = 0; i < totalCards - 1; i++) {
        tl.to(cards[i], { y: -140, z: 200, rotateX: 15, opacity: 0, scale: 1.08, duration: 1, ease: 'power2.inOut' }, i)
        for (let j = i + 1; j < totalCards; j++) {
          const r = j - (i + 1)
          tl.to(cards[j], {
            y: r * 55, z: -r * 280, scale: 1 - (r * 0.04), rotateX: -r * 4,
            opacity: r === 0 ? 1 : Math.max(0, 0.75 - (r * 0.15)), duration: 1, ease: 'power2.inOut',
          }, i)
        }
      }
      setTimeout(() => ScrollTrigger.refresh(), 350)
    })

    return () => {
      cancelAnimationFrame(rafId)
      if (tlRef.current?.scrollTrigger) tlRef.current.scrollTrigger.kill()
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null }
    }
  }, [])

  /* ── Tablet grid: IntersectionObserver 3D entrance ── */
  useEffect(() => {
    if (window.innerWidth < 769 || window.innerWidth >= 1025) return
    const grid = tabletGridRef.current
    if (!grid) return
    const cards = grid.querySelectorAll('.mc-card')
    if (!cards.length) return

    gsap.set(cards, { opacity: 0, y: 50, scale: 0.88, rotateX: 12, transformPerspective: 1000 })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(cards).indexOf(entry.target)
          gsap.to(entry.target, {
            opacity: 1, y: 0, scale: 1, rotateX: 0,
            duration: 0.7, delay: (idx % 2) * 0.12, ease: 'power3.out',
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

    cards.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  const scrollToCard = useCallback((idx) => {
    const st = tlRef.current?.scrollTrigger
    if (!st) return
    const target = st.start + (idx / PROJECTS.length) * (st.end - st.start)
    if (window.lenis) {
      window.lenis.scrollTo(target, { duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }, [])

  const active = PROJECTS[activeIdx]

  return (
    <div ref={sectionRef} className="prj-root">

      {/* ═══ DESKTOP: Pinned sidebar + stacked cards ═══ */}
      <div ref={pinContainerRef} className="prj-desktop-layout">
        <aside className="prj-sidebar" aria-label="Project navigation">
          <div className="prj-sidebar-header">
            <span className="prj-overline">Case Studies</span>
            <h2 className="prj-sidebar-title">PROJECT <span className="prj-accent">CLUSTERS</span></h2>
            <p className="prj-sidebar-subtitle">Scroll to explore</p>
          </div>
          <div className="prj-sidebar-nav">
            <p className="prj-sidebar-label">PROJECTS</p>
            {PROJECTS.map((p, idx) => (
              <button key={p.id} id={`prj-nav-${idx}`}
                className={`prj-sidebar-btn ${idx === activeIdx ? 'is-active' : ''}`}
                style={{ '--cc': p.color }}
                onClick={() => scrollToCard(idx)}
                aria-current={idx === activeIdx ? 'true' : undefined}
              >
                <span className="prj-sidebar-num">0{idx + 1}</span>
                <span className="prj-sidebar-name">{p.title}</span>
                <span className="prj-sidebar-dot" />
              </button>
            ))}
          </div>
          <div className="prj-sidebar-progress">
            <div className="prj-sidebar-progress-fill"
              style={{ height: `${((activeIdx + 1) / PROJECTS.length) * 100}%`, background: active.color }} />
          </div>
          <div className="prj-scroll-hint">
            <ChevronDown size={16} className="prj-scroll-hint-icon" />
            <span>Scroll to navigate</span>
          </div>
        </aside>

        <div ref={cardsContainerRef} className="prj-cards-stage">
          {PROJECTS.map((p, idx) => (
            <ProjectShowcaseCard key={p.id} project={p} index={idx}
              isActive={idx === activeIdx} total={PROJECTS.length} />
          ))}
        </div>
      </div>

      {/* ═══ TABLET: 2-col 3D grid ═══ */}
      <div className="prj-tablet-header">
        <span className="prj-overline">Case Studies</span>
        <h2 className="prj-title">PROJECT <span className="prj-accent">CLUSTERS</span></h2>
        <p className="prj-subtitle">Explore the work</p>
      </div>
      <div ref={tabletGridRef} className="prj-tablet-grid">
        {PROJECTS.map((p) => (
          <ProjectCard3D key={p.id} project={p} onOpen={setSelectedProject} />
        ))}
      </div>

      {/* ═══ MOBILE: GSAP 3D horizontal scroll ═══ */}
      <div className="prj-mobile-layout">
        <Mobile3DCarousel onOpen={setSelectedProject} />
      </div>

      <CardModal />
    </div>
  )
}

export default function Projects() {
  return (
    <ModalProvider>
      <ProjectsContent />
    </ModalProvider>
  )
}
