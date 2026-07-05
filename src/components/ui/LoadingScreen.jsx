import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './LoadingScreen.css';

// Import all heavy assets to preload
import logo from '../../assets/logo.png';
import ME1 from '../../assets/ME1.png';
import pro1 from '../../assets/pro1.png';
import pro2 from '../../assets/pro2.png';
import pro3 from '../../assets/pro3.png';
import pro4 from '../../assets/pro4.png';
import pro5 from '../../assets/pro5.png';
import pro6 from '../../assets/pro6.png';
import pro7 from '../../assets/pro7.png';
import pro8 from '../../assets/pro8.png';

const ASSETS_TO_PRELOAD = [logo, ME1, pro1, pro2, pro3, pro4, pro5, pro6, pro7, pro8];

export default function LoadingScreen({ onComplete }) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = ASSETS_TO_PRELOAD.length;

    if (totalAssets === 0) {
      setProgress(1);
      finishLoading();
      return;
    }

    const handleLoad = () => {
      loadedCount++;
      // We calculate percentage. We use requestAnimationFrame for smooth visual updates.
      setProgress(loadedCount / totalAssets);
      if (loadedCount === totalAssets) {
        finishLoading();
      }
    };

    // Preload each image
    ASSETS_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
      img.onerror = handleLoad; // If an image fails, we still want to progress so the app doesn't hang forever
    });

    function finishLoading() {
      // Add a tiny delay at 100% so the user sees the bar fill completely
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => onComplete?.(), 800); // Matches the CSS exit animation duration
      }, 500);
    }
  }, [onComplete]);

  return (
    <div className={`loader-overlay ${exiting ? 'loader-exit' : ''}`}>
      
      {/* ── 3D Grid Background ── */}
      <div className="loader-bg-grid" />
      
      {/* ── 3D Loading Wheel & Cube ── */}
      <div className="loader-3d-container">
        
        {/* Glowing Core */}
        <div className="loader-core" />

        {/* 3D Wireframe Cube around the core */}
        <motion.div 
          className="loader-cube"
          animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="cube-face cube-front" />
          <div className="cube-face cube-back" />
          <div className="cube-face cube-right" />
          <div className="cube-face cube-left" />
          <div className="cube-face cube-top" />
          <div className="cube-face cube-bottom" />
        </motion.div>

        {/* Orbiting Rings */}
        <motion.div 
          className="loader-ring ring-1"
          animate={{ rotateX: [0, 360], rotateY: [0, 180], rotateZ: [0, 90] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="loader-ring ring-2"
          animate={{ rotateY: [0, 360], rotateZ: [0, -360], rotateX: [0, 180] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="loader-ring ring-3"
          animate={{ rotateZ: [0, -360], rotateX: [0, -180], rotateY: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating Holographic Data Blocks */}
        {[...Array(8)].map((_, i) => (
          <motion.div 
            key={i}
            className="loader-holo-block"
            animate={{
              rotateX: [0, 360],
              rotateY: [0, -360],
              x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200],
              y: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200],
              z: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* ── Progress Indicators ── */}
      <div className="loader-text-wrap">
        <motion.div 
          className="loader-title"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          PRELOADING ASSETS
        </motion.div>
        
        <div className="loader-progress-bar">
          <div className="loader-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        
        <div className="loader-percentage">
          {Math.floor(progress * 100)}%
        </div>
        <p className="loader-subtitle">Optimizing render pipeline for zero lag...</p>
      </div>
      
    </div>
  );
}
