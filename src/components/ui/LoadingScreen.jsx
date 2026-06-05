import React, { useEffect, useRef, useState } from 'react';
import './LoadingScreen.css';

const TOTAL_MS = 4000;

const MERN_NODES = [
  { id: 'M', label: 'MongoDB',    sub: 'DATABASE',  color: '#47a248', glow: 'rgba(71,162,72,0.6)',  x: 18, y: 18,  delay: 0    },
  { id: 'E', label: 'Express',    sub: 'SERVER',     color: '#c0c0c0', glow: 'rgba(192,192,192,0.4)',x: 82, y: 18,  delay: 0.35 },
  { id: 'R', label: 'React',      sub: 'FRONTEND',   color: '#61dafb', glow: 'rgba(97,218,251,0.6)', x: 82, y: 82,  delay: 0.7  },
  { id: 'N', label: 'Node.js',    sub: 'RUNTIME',    color: '#68a063', glow: 'rgba(104,160,99,0.6)', x: 18, y: 82,  delay: 1.05 },
];

const TERMINAL_LINES = [
  { text: '$ npm install mongodb express react node',     delay: 200  },
  { text: 'added mongodb@7.0.0 ✓',                        delay: 700  },
  { text: 'added express@4.18.2 ✓',                       delay: 1150 },
  { text: 'added react@18.2.0 ✓',                         delay: 1600 },
  { text: 'added node@20.11.0 ✓',                         delay: 2050 },
  { text: '$ building production bundle…',                delay: 2450 },
  { text: '⚠  site under active development',             delay: 2900 },
  { text: '→  launching dev preview…',                    delay: 3300 },
];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress]       = useState(0);
  const [termLines, setTermLines]     = useState([]);
  const [visibleNodes, setVisible]    = useState([]);
  const [linesDrawn, setLinesDrawn]   = useState(false);
  const [exiting, setExiting]         = useState(false);
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const termRef  = useRef(null);

  /* ── Progress ── */
  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startRef.current) / TOTAL_MS, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => { setExiting(true); setTimeout(() => onComplete?.(), 850); }, 250);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── Nodes appear one by one ── */
  useEffect(() => {
    MERN_NODES.forEach((n, i) => {
      setTimeout(() => setVisible(v => [...v, n.id]), n.delay * 1000 + 300);
    });
    setTimeout(() => setLinesDrawn(true), 1500);
  }, []);

  /* ── Terminal lines ── */
  useEffect(() => {
    const timers = TERMINAL_LINES.map(({ text, delay }) =>
      setTimeout(() => setTermLines(l => [...l, text]), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  /* ── Auto-scroll terminal ── */
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [termLines]);

  const pct = Math.floor(progress * 100);

  return (
    <div className={`ls4-overlay${exiting ? ' ls4-exit' : ''}`}>

      {/* Floating code bg */}
      <div className="ls4-code-bg" aria-hidden>
        {['{ }', '</>', '()', '=>', '[]', '&&', '||', '::'].map((sym, i) => (
          <span key={i} className="ls4-code-sym" style={{
            '--x': `${(i * 13 + 5) % 95}%`,
            '--delay': `${i * 0.7}s`,
            '--dur': `${8 + i * 1.3}s`,
          }}>{sym}</span>
        ))}
      </div>

      {/* ── HEADER ── */}
      <div className="ls4-header">
        <div className="ls4-under-dev-badge">
          <span className="ls4-cone">🚧</span>
          <span>UNDER DEVELOPMENT</span>
          <span className="ls4-cone">🚧</span>
        </div>
        <p className="ls4-header-sub">MERN STACK PORTFOLIO · BUILDING IN PROGRESS</p>
      </div>

      {/* ── Network diagram ── */}
      <div className="ls4-network">

        {/* SVG connection lines */}
        <svg className="ls4-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="line-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Lines from each node to center (50,50) */}
          {MERN_NODES.map(n => (
            <line
              key={n.id}
              x1={`${n.x + 9}%`} y1={`${n.y + 9}%`}
              x2="50%" y2="50%"
              stroke={n.color}
              strokeWidth="0.6"
              strokeOpacity={linesDrawn && visibleNodes.includes(n.id) ? 0.45 : 0}
              strokeDasharray="3 2"
              filter="url(#line-glow)"
              style={{ transition: 'stroke-opacity 0.6s ease' }}
            />
          ))}
          {/* Corner-to-corner lines */}
          {linesDrawn && (
            <>
              <line x1="27%" y1="27%" x2="73%" y2="27%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" strokeDasharray="2 3"/>
              <line x1="27%" y1="73%" x2="73%" y2="73%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" strokeDasharray="2 3"/>
              <line x1="27%" y1="27%" x2="27%" y2="73%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" strokeDasharray="2 3"/>
              <line x1="73%" y1="27%" x2="73%" y2="73%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" strokeDasharray="2 3"/>
            </>
          )}
        </svg>

        {/* MERN nodes */}
        {MERN_NODES.map(n => (
          <div
            key={n.id}
            className={`ls4-node${visibleNodes.includes(n.id) ? ' ls4-node--visible' : ''}`}
            style={{
              left: `${n.x}%`, top: `${n.y}%`,
              '--node-color': n.color,
              '--node-glow': n.glow,
            }}
          >
            <div className="ls4-node-icon">{n.id}</div>
            <div className="ls4-node-label">{n.label}</div>
            <div className="ls4-node-sub">{n.sub}</div>
          </div>
        ))}

        {/* Center — React atom */}
        <div className="ls4-atom-wrap">
          <div className="ls4-atom-pulse" />
          <svg className="ls4-atom-svg" viewBox="0 0 100 100" fill="none">
            <ellipse cx="50" cy="50" rx="46" ry="17"
              stroke="#61dafb" strokeWidth="2.5" opacity="0.75"/>
            <ellipse cx="50" cy="50" rx="46" ry="17"
              stroke="#61dafb" strokeWidth="2.5" opacity="0.75"
              transform="rotate(60 50 50)"/>
            <ellipse cx="50" cy="50" rx="46" ry="17"
              stroke="#61dafb" strokeWidth="2.5" opacity="0.75"
              transform="rotate(120 50 50)"/>
            <circle cx="50" cy="50" r="7" fill="#61dafb"/>
          </svg>
        </div>
      </div>

      {/* ── Terminal ── */}
      <div className="ls4-terminal">
        <div className="ls4-term-titlebar">
          <span className="ls4-dot ls4-dot--r" />
          <span className="ls4-dot ls4-dot--y" />
          <span className="ls4-dot ls4-dot--g" />
          <span className="ls4-term-title">mern-stack — build</span>
        </div>
        <div className="ls4-term-body" ref={termRef}>
          {termLines.map((line, i) => (
            <div
              key={i}
              className={`ls4-term-line${line.startsWith('⚠') ? ' ls4-term-warn' : line.startsWith('→') ? ' ls4-term-info' : ''}`}
            >
              {line}
              {i === termLines.length - 1 && <span className="ls4-cursor">▌</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="ls4-progress-area">
        <div className="ls4-progress-labels">
          <span>BUILDING STACK</span>
          <span>{String(pct).padStart(3, '0')}%</span>
        </div>
        <div className="ls4-bar-track">
          <div className="ls4-bar-fill" style={{ width: `${pct}%` }}>
            <div className="ls4-bar-shimmer" />
          </div>
          {/* Segment markers */}
          {[25, 50, 75].map(s => (
            <div key={s} className="ls4-bar-seg" style={{ left: `${s}%` }} />
          ))}
        </div>
        <div className="ls4-stack-labels">
          <span style={{ color: '#47a248' }}>MongoDB</span>
          <span style={{ color: '#c0c0c0' }}>Express</span>
          <span style={{ color: '#61dafb' }}>React</span>
          <span style={{ color: '#68a063' }}>Node</span>
        </div>
      </div>

      {/* ── Corner brackets ── */}
      <span className="ls4-corner ls4-c-tl" />
      <span className="ls4-corner ls4-c-tr" />
      <span className="ls4-corner ls4-c-bl" />
      <span className="ls4-corner ls4-c-br" />

      {/* ── Bottom ── */}
      <div className="ls4-meta">
        <span>© 2025 · ALL RIGHTS RESERVED</span>
        <span className="ls4-sep">·</span>
        <span>MERN / AI / FULL-STACK</span>
        <span className="ls4-sep">·</span>
        <span>LAUNCHING SOON</span>
      </div>
    </div>
  );
}
