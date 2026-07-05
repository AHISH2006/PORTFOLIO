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

    /* ── Lenis smooth scroll — enabled on ALL devices ── */
    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,   // Lenis touch smoothing competes with snap-scroll
      wheelMultiplier: isMobile ? 1.0 : 1.0,
      touchMultiplier: isMobile ? 1.8 : 1.8,
      infinite: false,
      /* lerp: keep low so GSAP scrub feels accurate */
      lerp: isMobile ? 0.12 : 0.08,
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
