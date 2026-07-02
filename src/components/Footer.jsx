import { motion } from 'framer-motion';
import "../styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      {/* Cyber Grid Backdrop */}
      <div className="footer-grid-bg" />

      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand reveal-child">
            <h3 className="footer-logo">AHISH <span>S M</span></h3>
            <p className="footer-tagline">Architecting the MERN Omniverse.</p>
          </div>
          
          <div className="footer-links">
             <div className="footer-link-group reveal-child">
                <h4 className="footer-link-title">Navigation</h4>
                <ul className="footer-link-list">
                   <li><a href="#hero">Home</a></li>
                   <li><a href="#about">About</a></li>
                   <li><a href="#projects">Projects</a></li>
                </ul>
             </div>
             <div className="footer-link-group reveal-child">
                <h4 className="footer-link-title">Connect</h4>
                <ul className="footer-link-list">
                   <li><a href="https://linkedin.com/in/ahish-sm" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                   <li><a href="https://github.com/AHISH2006" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                   <li><a href="https://x.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                </ul>
             </div>
          </div>
        </div>

        <div className="footer-bottom reveal-child">
          <p className="footer-copyright">
            © {currentYear} AHISH S M. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
