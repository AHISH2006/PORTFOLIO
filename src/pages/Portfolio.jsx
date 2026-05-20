import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
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
    const sections = gsap.utils.toArray(".cinematic-section");

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 60,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",

          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play none none reverse",

            invalidateOnRefresh: true,
          },
        }
      );
    });

    ScrollTrigger.refresh();
  }, { scope: containerRef });

  return (
    <CinematicWrapper>
      <div
        ref={containerRef}
        className="portfolio-root"
      >
        <Navigation />

        {/* Background 3D */}
        <div className="background-layer">
          <MernUniverse />
        </div>

        {/* Noise Overlay */}
        <div className="noise-overlay" />

        <main className="main-content">
          {/* HERO */}
          <section
            id="hero"
            className="hero-section"
          >
            <Hero />
          </section>

          {/* ABOUT */}
          <section
            id="about"
            className="cinematic-section"
          >
            <About />
          </section>

          {/* SKILLS */}
          <section
            id="skills"
            className="cinematic-section"
          >
            <Skills />
          </section>

          {/* PROJECTS */}
          <section
            id="projects"
            className="cinematic-section"
          >
            <Projects />
          </section>

          {/* EXPERIENCE */}
          <section
            id="experience"
            className="cinematic-section"
          >
            <Experience />
          </section>

          {/* CONTACT */}
          <section
            id="contact"
            className="cinematic-section"
          >
            <Contact />
            <Footer />
          </section>
        </main>
      </div>
    </CinematicWrapper>
  );
}