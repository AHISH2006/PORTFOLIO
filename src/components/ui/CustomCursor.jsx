import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/CustomCursor.css';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [activeSection, setActiveSection] = useState('hero');
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if (window.innerWidth <= 768 || 'ontouchstart' in window) {
      setIsMobile(true);
      return;
    }

    // Add a class to body to hide default cursor
    document.body.classList.add('custom-cursor-active');

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    // Observer to detect active section for cursor styling
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(entry.target.id || 'hero');
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  if (isMobile) return null;

  // Determine cursor styles based on section
  let cursorColor = '#22c55e'; // default green (hero)
  if (activeSection === 'about') cursorColor = '#3b82f6';
  else if (activeSection === 'skills') cursorColor = '#a855f7';
  else if (activeSection === 'projects') cursorColor = '#f59e0b';
  else if (activeSection === 'experience') cursorColor = '#06b6d4';
  else if (activeSection === 'contact') cursorColor = '#ef4444';

  return (
    <>
      {/* Outer trailing ring */}
      <motion.div
        className="custom-cursor-ring"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.8 : 1,
          borderColor: isHovering ? 'transparent' : cursorColor,
          backgroundColor: isHovering ? `${cursorColor}22` : 'transparent',
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.5
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="custom-cursor-dot"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          backgroundColor: cursorColor,
          scale: isHovering ? 0 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 30,
          mass: 0.1
        }}
      />
    </>
  );
}
