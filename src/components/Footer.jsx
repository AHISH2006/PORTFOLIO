import { motion } from 'framer-motion';
import "../styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-logo">AHISH S M</h3>
            <p className="footer-tagline">Architecting the MERN Omniverse.</p>
          </div>
          
          <div className="footer-links">
             <div className="footer-link-group">
                <h4 className="footer-link-title">Navigation</h4>
                <ul className="footer-link-list">
                   <li><a href="#home">Home</a></li>
                   <li><a href="#about">About</a></li>
                   <li><a href="#projects">Projects</a></li>
                </ul>
             </div>
             <div className="footer-link-group">
                <h4 className="footer-link-title">Connect</h4>
                <ul className="footer-link-list">
                   <li><a href="#">LinkedIn</a></li>
                   <li><a href="#">GitHub</a></li>
                   <li><a href="#">Twitter</a></li>
                </ul>
             </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} AHISH S M. ALL RIGHTS RESERVED.
          </p>

        </div>
      </div>
    </footer>
  );
}
