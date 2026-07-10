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
    id: '1', title: 'Escape Code', category: 'Dev Platform',
    stack: 'React + Vite / Express / bcryptjs',
    desc: 'Web application with client-server architecture featuring user authentication and secure password hashing.',
    overview: 'Escape Code is a full client-server web app. React frontend, Express backend, user authentication powered by bcryptjs for secure password hashing.',
    keyFeatures: ['React frontend with modern UI','Express backend API','User authentication system','Secure password hashing with bcryptjs'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Backend', items: 'Node.js, Express' },{ name: 'Security', items: 'bcryptjs' }],
    architecture: 'Monorepo with client/server dirs. Express serves REST API.',
    role: 'Full-Stack Developer',
    achievements: ['Built secure authentication flow','Implemented monorepo structure','Deployed full-stack'],
    link: 'https://escape-code.vercel.app', github: 'https://github.com/AHISH2006/escape-code',
    imageUrl: pro5, color: '#a855f7', icon: '⚡',
  },
  {
    id: '2', title: 'GAME-X', category: 'E-Commerce',
    stack: 'MERN Stack',
    desc: 'Game marketplace with catalog browsing, shopping functionality, and user authentication on the MERN stack.',
    overview: 'GAME-X is a full-stack game marketplace. Features game listing, catalog browsing, shopping cart, user authentication, and detailed game management — all on MERN.',
    keyFeatures: ['Game listing & catalog browsing','Shopping cart functionality','User authentication & profiles','Game details management','Responsive marketplace UI'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Backend', items: 'Node.js, Express' },{ name: 'Database', items: 'MongoDB' }],
    architecture: 'Full-stack MERN with RESTful API, React Router, and MongoDB.',
    role: 'Full-Stack Developer',
    achievements: ['Deployed live on Vercel','Built complete e-commerce flow','Implemented auth system'],
    link: 'https://game-x-store.vercel.app/', github: 'https://github.com/AHISH2006/GAME-X',
    imageUrl: pro6, color: '#f59e0b', icon: '🎮',
  },
   {
    id: '3', title: 'Assignment Portal', category: 'Education',
    stack: 'React + Vite / JSON Server',
    desc: 'Educational platform for managing and tracking assignments with mock data integration.',
    overview: 'Assignment Portal is an educational platform for managing and tracking assignments. Uses React frontend with JSON Server backend mockup for efficient assignment management.',
    keyFeatures: ['Assignment management system','Student tracking dashboard','Mock data integration','CRUD operations'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Backend', items: 'JSON Server' },{ name: 'Language', items: 'JavaScript' }],
    architecture: 'React SPA with mock REST API for rapid prototyping.',
    role: 'Frontend Developer',
    achievements: ['Built complete assignment management flow','Implemented mock API integration','Created responsive dashboard'],
    link: 'https://ahish-task1.vercel.app/', github: 'https://github.com/AHISH2006/Assignment-portal',
    imageUrl: pro7, color: '#3b82f6', icon: '📚',
  },
  {
    id: '4', title: 'Omni-Tech', category: 'Tech Platform',
    stack: 'React + Vite',
    desc: 'Modern technology platform with component-driven development and contemporary tooling.',
    overview: 'Omni-Tech is a modern technology platform with React-based interface and component-driven development. Uses Vite for fast, responsive SPA delivery.',
    keyFeatures: ['React-based modern interface','Component-driven development','Modern build tooling with Vite','Responsive SPA design'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Language', items: 'JavaScript' },{ name: 'Tooling', items: 'ESLint, Modern Build Tools' }],
    architecture: 'Modern React SPA with Vite optimised builds.',
    role: 'Frontend Developer',
    achievements: ['Built performant SPA','Implemented component architecture','Deployed on Vercel'],
    link: 'https://omni-tech-tau.vercel.app', github: 'https://github.com/AHISH2006/omni-tech',
    imageUrl: pro4, color: '#06b6d4', icon: '🚀',
  },
  {
    id: '5', title: 'MindCare AI', category: 'AI / Healthcare',
    stack: 'React + Vite / Node.js / MongoDB',
    desc: 'A mental healthcare chatbot application designed to provide AI-powered conversational support for mental health.',
    overview: 'MindCare AI is a mental healthcare chatbot providing AI-powered conversational support. It features crisis detection middleware, mood tracking, real-time chat, and OpenAI API integration.',
    keyFeatures: ['Crisis detection middleware','Mood tracking and selection','Real-time chat interface','Message history management','OpenAI integration ready'],
    techStack: [{ name: 'Frontend', items: 'React, Vite' },{ name: 'Backend', items: 'Node.js, Express' },{ name: 'Database', items: 'MongoDB (Atlas)' },{ name: 'AI', items: 'OpenAI API' }],
    architecture: 'MERN Stack with separated client/server structure.',
    role: 'Full-Stack Developer',
    achievements: ['Built end-to-end MERN application','Integrated crisis detection safety layer','Connected OpenAI API'],
    link: 'https://health-support-chatbot.vercel.app/', github: 'https://github.com/AHISH2006/AI_Chatbot',
    imageUrl: pro3, color: '#22c55e', icon: '🧠',
  },
  {
    id: '6', title: 'REBRAND', category: 'AI / Branding',
    stack: 'TypeScript / v0.app',
    desc: 'AI-powered branding platform for the automotive industry with AI-driven design generation.',
    overview: 'REBRAND is an AI-powered branding platform for the automotive industry (BMW). Leverages AI design generation, brand customisation, and interactive interface.',
    keyFeatures: ['AI-driven design generation','Brand customisation tools','Interactive branding interface','Automotive industry focus'],
    techStack: [{ name: 'Language', items: 'TypeScript' },{ name: 'Platform', items: 'v0.app Framework' },{ name: 'Frontend', items: 'React Components' }],
    architecture: 'Component-based AI platform with v0.app and TypeScript on Vercel.',
    role: 'Full-Stack TypeScript Developer',
    achievements: ['Deployed on Vercel','Built with v0.app AI tooling','Created AI branding pipeline for BMW'],
    link: 'https://v0-ai-branding-for-bmw.vercel.app/', github: 'https://github.com/AHISH2006/REBRAND',
    imageUrl: pro8, color: '#6366f1', icon: '🎨',
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
    link: 'https://vibecx.vercel.app/', github: 'https://github.com/AHISH2006/Vibex',
    imageUrl: pro1, color: '#f97316', icon: '✨',
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
    imageUrl: pro2, color: '#10b981', icon: '🌱',
  },
]

/* ─────────────────────────────────────────────────────────────
   CARD MODAL
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
   DESKTOP HORIZONTAL SCROLL — Fixed heading + cards fly in
   GSAP ScrollTrigger pins the wrapper; translates the track
───────────────────────────────────────────────────────────── */
function DesktopHorizontalScroll({ onOpen }) {
  const wrapperRef  = useRef(null)   // pinned element
  const trackRef    = useRef(null)   // horizontally translated
  const bgRef       = useRef(null)   // 3D parallax background
  const accentRef   = useRef(null)   // animated accent heading word
  const tlRef       = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const prevIdxRef  = useRef(0)
  const total = PROJECTS.length

  useEffect(() => {
    const wrapper = wrapperRef.current
    const track   = trackRef.current
    const bg      = bgRef.current
    if (!wrapper || !track || !bg) return

    const cards = Array.from(track.querySelectorAll('.prj-hscroll-card'))
    if (!cards.length) return

    // Initial 3-D state — cards start far right, tilted
    gsap.set(cards, {
      x: (i) => i === 0 ? 0 : '100vw',
      rotateY: (i) => i === 0 ? 0 : 25,
      scale: (i) => i === 0 ? 1 : 0.85,
      opacity: (i) => i === 0 ? 1 : 0,
      transformPerspective: 1200,
      transformOrigin: 'left center',
      z: (i) => i === 0 ? 0 : -100,
    })

    const SCROLL_PER_CARD = 120   // vh per card transition
    const totalScroll     = SCROLL_PER_CARD * (total - 1)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${totalScroll}vh`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(total - 1, Math.round(self.progress * (total - 1)))
          setActiveIdx(idx)
          // Fire accent zoom animation on heading change
          if (idx !== prevIdxRef.current && accentRef.current) {
            prevIdxRef.current = idx
            accentRef.current.classList.remove('is-transitioning')
            void accentRef.current.offsetWidth // reflow
            accentRef.current.classList.add('is-transitioning')
          }
        },
      },
    })
    tlRef.current = tl

    // For each card transition: outgoing card flies left + back, incoming flies in from right
    for (let i = 0; i < total - 1; i++) {
      const seg = i   // which "step" of the animation this is

      // Exit current card to the left
      tl.to(cards[i], {
        x: '-110vw',
        rotateY: -30,
        scale: 0.8,
        opacity: 0,
        z: -200,
        ease: 'power2.inOut',
        duration: 1,
      }, seg)

      // Enter next card from right
      tl.fromTo(cards[i + 1],
        { x: '110vw', rotateY: 25, scale: 0.85, opacity: 0, z: -100 },
        { x: 0, rotateY: 0, scale: 1, opacity: 1, z: 0, ease: 'power2.inOut', duration: 1 },
        seg
      )
    }

    // Background parallax: rotate + shift as cards scroll
    tl.to(bg, {
      backgroundPositionX: '200%',
      ease: 'none',
      duration: total - 1,
    }, 0)

    // 3D grid plane tilt deepens on scroll
    const gridPlane = bg.querySelector('.prj-bg-grid-plane')
    if (gridPlane) {
      tl.to(gridPlane, {
        rotateX: 85,
        ease: 'none',
        duration: total - 1,
      }, 0)
    }

    setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      if (tlRef.current?.scrollTrigger) tlRef.current.scrollTrigger.kill()
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null }
    }
  }, [total])

  const scrollToCard = useCallback((idx) => {
    const st = tlRef.current?.scrollTrigger
    if (!st) return
    const fraction = idx / (total - 1)
    const target = st.start + fraction * (st.end - st.start)
    if (window.lenis) {
      window.lenis.scrollTo(target, { duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }, [total])

  const active = PROJECTS[activeIdx]

  return (
    <div ref={wrapperRef} className="prj-hscroll-wrapper">

      {/* ── 3D animated background ── */}
      <div ref={bgRef} className="prj-hscroll-bg">
        {/* Colour wash that shifts with active project */}
        <div
          className="prj-hscroll-bg-wash"
          style={{ background: `radial-gradient(ellipse 60% 70% at 60% 50%, ${active.color}14, transparent 70%)` }}
        />
        {/* 3D tilted grid plane */}
        <div className="prj-bg-grid-plane" />
        {/* Animated rings */}
        <div className="prj-bg-ring prj-bg-ring-1" style={{ borderColor: `${active.color}12` }} />
        <div className="prj-bg-ring prj-bg-ring-2" style={{ borderColor: `${active.color}08` }} />
        {/* Floating orbs */}
        <div className="prj-bg-orb prj-bg-orb-1" style={{ background: `radial-gradient(circle, ${active.color}15, transparent 70%)` }} />
        <div className="prj-bg-orb prj-bg-orb-2" />
        {/* Scanlines */}
        <div className="prj-bg-scanlines" />
      </div>

      {/* ── Fixed left panel (heading + nav) ── */}
      <div className="prj-hscroll-panel">
        <div className="prj-hscroll-panel-inner">
          <span className="prj-hscroll-overline">Case Studies</span>
          <h2 className="prj-hscroll-title">
            <span className="prj-hscroll-title-static">PROJECT</span>
            <span
              ref={accentRef}
              className="prj-hscroll-accent"
              style={{ color: active.color, textShadow: `0 0 35px ${active.color}55` }}
              data-text="CLUSTERS"
              onAnimationEnd={() => accentRef.current?.classList.remove('is-transitioning')}
            >
              CLUSTERS
            </span>
          </h2>
          <p className="prj-hscroll-subtitle">Scroll to explore</p>

          {/* Progress bar */}
          <div className="prj-hscroll-progress-track">
            <div
              className="prj-hscroll-progress-fill"
              style={{
                height: `${((activeIdx + 1) / total) * 100}%`,
                background: active.color,
              }}
            />
          </div>

          {/* Project nav dots */}
          <nav className="prj-hscroll-nav" aria-label="Project navigation">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                className={`prj-hscroll-nav-btn ${idx === activeIdx ? 'is-active' : ''}`}
                style={{ '--nc': p.color }}
                onClick={() => scrollToCard(idx)}
                aria-label={`Go to ${p.title}`}
              >
                <span className="prj-hscroll-nav-dot" />
                <span className="prj-hscroll-nav-label">{p.title}</span>
              </button>
            ))}
          </nav>

          {/* Counter */}
          <div className="prj-hscroll-counter">
            <span className="prj-hscroll-counter-current" style={{ color: active.color }}>
              {String(activeIdx + 1).padStart(2, '0')}
            </span>
            <span className="prj-hscroll-counter-sep">/</span>
            <span className="prj-hscroll-counter-total">{String(total).padStart(2, '0')}</span>
          </div>

          {/* Scroll hint */}
          <div className="prj-hscroll-hint">
            <ChevronDown size={14} className="prj-hscroll-hint-icon" />
            <span>Scroll to navigate</span>
          </div>
        </div>
      </div>

      {/* ── Card stage — perspective viewport ── */}
      <div className="prj-hscroll-stage">
        <div ref={trackRef} className="prj-hscroll-track">
          {PROJECTS.map((project, idx) => (
            <DesktopProjectCard
              key={project.id}
              project={project}
              index={idx}
              isActive={idx === activeIdx}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   DESKTOP PROJECT CARD — individual card in horizontal scroll
───────────────────────────────────────────────────────────── */
function DesktopProjectCard({ project, index, isActive, onOpen }) {
  const cardRef = useRef(null)
  const glowRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -14
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    el.style.setProperty('--card-rx', `${rx}deg`)
    el.style.setProperty('--card-ry', `${ry}deg`)
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, ${project.color}22, transparent 55%)`
      glowRef.current.style.opacity = '1'
    }
  }, [project.color])

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current
    if (el) { el.style.setProperty('--card-rx', '0deg'); el.style.setProperty('--card-ry', '0deg') }
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }, [])

  return (
    <div
      ref={cardRef}
      className={`prj-hscroll-card ${isActive ? 'is-active' : ''}`}
      style={{ '--cc': project.color }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
    >
      <div ref={glowRef} className="prj-hscroll-card-glow" />

      {/* Index number */}
      <div className="prj-hscroll-card-num">
        <span style={{ color: project.color }}>0{index + 1}</span>
        <span className="prj-hscroll-card-num-sep">/</span>
        <span>{String(PROJECTS.length).padStart(2, '0')}</span>
      </div>

      {/* Image */}
      <div className="prj-hscroll-img-wrap">
        <img src={project.imageUrl} alt={project.title} className="prj-hscroll-img" loading="lazy" draggable={false} />
        <div className="prj-hscroll-img-overlay" />
        <span
          className="prj-hscroll-badge"
          style={{ color: project.color, background: `${project.color}18`, borderColor: `${project.color}44` }}
        >
          {project.icon} {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="prj-hscroll-card-body">
        <h3 className="prj-hscroll-card-title">{project.title}</h3>
        <p className="prj-hscroll-card-desc">{project.overview}</p>

        <div className="prj-hscroll-chips">
          {project.techStack.map((t, i) => (
            <span key={i} className="prj-hscroll-chip">{t.items.split(',')[0].trim()}</span>
          ))}
        </div>

        <div className="prj-hscroll-card-actions">
          <a href={project.link} target="_blank" rel="noopener noreferrer"
            className="prj-hscroll-btn prj-hscroll-btn-primary"
            style={{ background: project.color }}
            onClick={(e) => e.stopPropagation()}>
            <ExternalLink size={14} /> Live Demo
          </a>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="prj-hscroll-btn prj-hscroll-btn-secondary"
            onClick={(e) => e.stopPropagation()}>
            <Code2 size={14} /> GitHub
          </a>
          <button
            className="prj-hscroll-btn prj-hscroll-btn-detail"
            onClick={(e) => { e.stopPropagation(); onOpen(project) }}>
            Full Details
          </button>
        </div>
      </div>

      {/* Corner accents */}
      <div className="prj-hscroll-corner prj-hscroll-corner-tl" />
      <div className="prj-hscroll-corner prj-hscroll-corner-br" />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   3D PROJECT CARD — shared tablet / mobile
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
   MOBILE 3D SNAP CAROUSEL
───────────────────────────────────────────────────────────── */
function Mobile3DCarousel({ onOpen }) {
  const viewportRef   = useRef(null)
  const mobAccentRef  = useRef(null)
  const slideRefs     = useRef([])
  const [activeSlide, setActiveSlide] = useState(0)
  const prevIdxRef    = useRef(0)
  const total         = PROJECTS.length

  /* ── 3D entry animation via IntersectionObserver ── */
  useEffect(() => {
    const slides = slideRefs.current.filter(Boolean)
    if (!slides.length) return

    // Initial state for all slides
    slides.forEach((slide, i) => {
      gsap.set(slide, {
        opacity: i === 0 ? 1 : 0.4,
        rotateY: i === 0 ? 0 : 25,
        scale:   i === 0 ? 1 : 0.88,
        z:       i === 0 ? 0 : -40,
        transformPerspective: 1200,
        transformOrigin: 'center center',
      })
    })

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const slide = entry.target
        if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
          // Bring to front with 3D zoom-in
          gsap.to(slide, { opacity: 1, rotateY: 0, scale: 1, z: 0, duration: 0.55, ease: 'power3.out' })
        } else {
          // Push back
          const idx   = slideRefs.current.indexOf(slide)
          const actIdx = prevIdxRef.current
          const side   = idx < actIdx ? 1 : -1
          gsap.to(slide, { opacity: 0.4, rotateY: side * 25, scale: 0.88, z: -40, duration: 0.45, ease: 'power2.in' })
        }
      })
    }, {
      root: viewportRef.current,
      threshold: [0.3, 0.6],
    })

    slides.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [total])

  /* ── Track active slide via scroll position ── */
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    let rafId
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const slides = slideRefs.current.filter(Boolean)
        if (!slides.length) return
        const vLeft  = viewport.getBoundingClientRect().left
        const vW     = viewport.offsetWidth
        let best = 0, bestDist = Infinity
        slides.forEach((slide, i) => {
          const r    = slide.getBoundingClientRect()
          const dist = Math.abs((r.left + r.width / 2) - (vLeft + vW / 2))
          if (dist < bestDist) { bestDist = dist; best = i }
        })
        if (best !== prevIdxRef.current) {
          prevIdxRef.current = best
          setActiveSlide(best)
          if (mobAccentRef.current) {
            mobAccentRef.current.classList.remove('is-transitioning')
            void mobAccentRef.current.offsetWidth
            mobAccentRef.current.classList.add('is-transitioning')
          }
        }
      })
    }

    viewport.addEventListener('scroll', onScroll, { passive: true })
    return () => { viewport.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId) }
  }, [total])

  /* ── Navigate to slide ── */
  const goTo = useCallback((idx) => {
    const viewport = viewportRef.current
    const slide    = slideRefs.current[idx]
    if (!viewport || !slide) return
    const offset = slide.offsetLeft - (viewport.offsetWidth - slide.offsetWidth) / 2
    viewport.scrollTo({ left: offset, behavior: 'smooth' })
  }, [])

  return (
    <div className="prj-mob-carousel-section">
      <div className="prj-mob-bg-grid" />
      <div className="prj-mob-ambient" style={{ background: `radial-gradient(ellipse at 50% 50%, ${PROJECTS[activeSlide].color}20, transparent 70%)`, transition: 'background 0.6s ease' }} />

      {/* Header */}
      <div className="prj-mob-header">
        <span className="prj-mob-overline">Case Studies</span>
        <h2 className="prj-mob-title">
          <span className="prj-mob-title-static">PROJECT</span>
          <span
            ref={mobAccentRef}
            className="prj-mob-title-accent"
            style={{ color: PROJECTS[activeSlide].color, textShadow: `0 0 30px ${PROJECTS[activeSlide].color}66` }}
            onAnimationEnd={() => mobAccentRef.current?.classList.remove('is-transitioning')}
          >
            CLUSTERS
          </span>
        </h2>
        <p className="prj-mob-sub">Swipe to explore</p>
      </div>

      {/* Counter */}
      <div className="prj-mob-counter">
        <span style={{ color: PROJECTS[activeSlide].color, transition: 'color 0.4s ease' }}>{String(activeSlide + 1).padStart(2, '0')}</span>
        <span className="prj-mob-counter-sep">/</span>
        <span>{String(total).padStart(2, '0')}</span>
      </div>

      {/* Snap Scroll Viewport */}
      <div ref={viewportRef} className="prj-mob-viewport prj-mob-snap-viewport">
        <div className="prj-mob-snap-track">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              ref={el => slideRefs.current[i] = el}
              className="prj-mob-slide prj-mob-snap-slide"
            >
              <ProjectCard3D project={p} onOpen={onOpen} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="prj-mob-dots">
        {PROJECTS.map((p, idx) => (
          <button
            key={p.id}
            className={`prj-mob-dot ${idx === activeSlide ? 'is-active' : ''}`}
            style={{ '--dot-color': p.color }}
            onClick={() => goTo(idx)}
            aria-label={`Go to ${p.title}`}
          />
        ))}
      </div>

      {/* Arrow navigation */}
      <div className="prj-mob-nav">
        <button
          className="prj-mob-arrow"
          onClick={() => goTo(Math.max(0, activeSlide - 1))}
          disabled={activeSlide === 0}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="prj-mob-nav-label" style={{ color: PROJECTS[activeSlide].color, transition: 'color 0.4s ease' }}>
          {PROJECTS[activeSlide].title}
        </span>
        <button
          className="prj-mob-arrow"
          onClick={() => goTo(Math.min(total - 1, activeSlide + 1))}
          disabled={activeSlide === total - 1}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   TABLET GRID (769-1024px)
───────────────────────────────────────────────────────────── */
function TabletGrid({ onOpen }) {
  const gridRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const cards = grid.querySelectorAll('.mc-card')
    if (!cards.length) return

    gsap.set(cards, { opacity: 0, y: 50, scale: 0.88, rotateX: 12, transformPerspective: 1000 })
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(cards).indexOf(entry.target)
          gsap.to(entry.target, { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.7, delay: (idx % 2) * 0.12, ease: 'power3.out' })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    cards.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="prj-tablet-wrap">
      <div className="prj-tablet-header">
        <span className="prj-overline">Case Studies</span>
        <h2 className="prj-title">
          <span className="prj-title-static">PROJECT</span>
          <span className="prj-accent">CLUSTERS</span>
        </h2>
        <p className="prj-subtitle">Explore the work</p>
      </div>
      <div ref={gridRef} className="prj-tablet-grid">
        {PROJECTS.map((p) => (
          <ProjectCard3D key={p.id} project={p} onOpen={onOpen} />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
function ProjectsContent() {
  const { setSelectedProject } = useModal()

  return (
    <div className="prj-root">
      {/* Desktop: fixed heading + horizontal scroll cards */}
      <div className="prj-desktop-only">
        <DesktopHorizontalScroll onOpen={setSelectedProject} />
      </div>

      {/* Tablet: 2-col grid */}
      <div className="prj-tablet-only">
        <TabletGrid onOpen={setSelectedProject} />
      </div>

      {/* Mobile: GSAP 3D carousel */}
      <div className="prj-mobile-only">
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
