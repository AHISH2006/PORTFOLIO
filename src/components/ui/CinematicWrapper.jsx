import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicWrapper({ children }) {
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    /* ── Lenis smooth scroll — enabled on ALL devices for consistent UX ── */
    const lenis = new Lenis({
      /* Mobile: shorter duration for responsiveness */
      duration: isMobile ? 0.85 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      /* Mobile: higher multiplier so scrolling doesn't feel sluggish */
      wheelMultiplier: isMobile ? 1.2 : 0.9,
      touchMultiplier: isMobile ? 2.2 : 1.8,
      infinite: false,
      /* lerp: momentum interpolation — keep low for crisp GSAP scrub */
      lerp: isMobile ? 0.15 : 0.1,
    });

    /* Expose globally so modals / carousel can stop/start Lenis */
    window.lenis = lenis;

    /* Sync Lenis RAF with GSAP ScrollTrigger */
    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);

    /* Disable lag smoothing — prevents GSAP + Lenis drift */
    gsap.ticker.lagSmoothing(0);

    /* Handle resize — reinitialise if crossing mobile/desktop boundary */
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        /* Only destroy if orientation changes significantly */
        const nowMobile = window.innerWidth <= 768;
        if (nowMobile !== isMobile) {
          lenis.destroy();
          window.lenis = undefined;
          gsap.ticker.remove(tickerFn);
        }
      }, 300);
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
