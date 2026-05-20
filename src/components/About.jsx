import { motion } from 'framer-motion';
import React, { Suspense } from 'react';
import LanyardCard from './ui/LanyardCard';
import '../styles/About.css';

export default function About() {
  return (
    <section id="about" className="about-container">
      <div className="about-grid">

        {/* ── Lanyard Card (above text on mobile, right on desktop) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          viewport={{ once: true }}
          className="about-visual-content"
        >
          <div className="about-drag-hint">drag the card ↑</div>
          <Suspense fallback={
            <div className="about-card-fallback">
              <span>INITIALIZING 3D PHYSICS...</span>
            </div>
          }>
            <LanyardCard />
          </Suspense>
        </motion.div>

        {/* ── Text Content ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="about-text-content"
        >
          <div className="about-header">
            <span className="about-overline">Foundation &amp; Vision</span>
            <h2 className="about-title">
              ENGINEERING <br />
              THE <span className="about-title-accent">FUTURE</span>
            </h2>
          </div>

          <div className="about-body">
            <p>
              I am an AI &amp; Data Science student at the intersection of{' '}
              <span className="text-white">intelligent systems</span> and{' '}
              <span className="text-white">high-performance web architecture</span>.
            </p>
            <p>
              My focus is on building scalable MERN stack applications and mobile
              solutions that prioritize user experience and technical integrity.
            </p>
          </div>

          <div className="about-footer-grid">
            <div className="about-footer-item">
              <h4 className="about-footer-label">Core Disciplines</h4>
              <ul className="about-footer-list">
                <li>Full-Stack Development</li>
                <li>Artificial Intelligence</li>
                <li>Cross-Platform Apps</li>
              </ul>
            </div>
            <div className="about-footer-item">
              <h4 className="about-footer-label">Focus Areas</h4>
              <ul className="about-footer-list">
                <li>User Experience Design</li>
                <li>Cloud Integration</li>
                <li>Real-time Systems</li>
              </ul>
            </div>
          </div>
        </motion.div>

      </div>
      
    </section>
  );
}
