import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/Contact.css';

/* ── Inline SVG icons (no Font Awesome dependency needed) ── */
const IconEmail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.37a16 16 0 0 0 5.54 5.54l1.21-1.21a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
  </svg>
);

const IconLocation = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const IconGitHub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

/* ── 3D Tilt Wrapper ── */
function TiltCard({ children, className }) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  
  const handleMouseMove = (e) => {
    // Disable tilt on mobile/touch screens to avoid weird jumping or touch issues
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (!supportsHover) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-10 to 10 degrees)
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02) translateZ(10px)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)');
  };

  return (
    <div 
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
    >
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  );
}

const CONTACT_INFO = [
  { icon: <IconEmail />,    title: 'Email',    value: 'anuahish249@gmail.com' },
  { icon: <IconPhone />,   title: 'Phone',    value: '+91 63747 66056'       },
  { icon: <IconLocation />, title: 'Location', value: 'Coimbatore, India'    },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending,   setIsSending]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="contact-container">
      <div className="contact-header reveal-child">
        <h2 className="contact-title">
          TRANSMIT <span style={{ color: '#06b6d4' }}>SIGNAL</span>
        </h2>
        <p className="contact-subtitle">
          Ready to sync orbits or initiate a collaboration? Send a transmission below.
        </p>
      </div>

      <div className="contact-grid">
        {/* Info Side */}
        <div className="contact-info-side">
          {CONTACT_INFO.map((info, i) => (
            <div key={info.title} className="reveal-child">
              <TiltCard className="contact-info-card">
                <div className="contact-info-icon-wrapper">
                  {info.icon}
                </div>
                <div>
                  <h4 className="contact-info-label">{info.title}</h4>
                  <p className="contact-info-value">{info.value}</p>
                </div>
              </TiltCard>
            </div>
          ))}

          <div className="contact-socials reveal-child">
            <div className="contact-social-list">
              <a
                href="https://linkedin.com/in/ahish-sm"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-btn"
              >
                <IconLinkedIn />
                LinkedIn
              </a>
              <a
                href="https://github.com/AHISH2006"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-btn"
              >
                <IconGitHub />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <form
          onSubmit={handleSubmit}
          className="contact-form reveal-child"
        >
          <div className="contact-form-group">
            <label className="contact-form-label">Identification</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="contact-form-input"
              placeholder="Your Name"
              required
            />
          </div>

          <div className="contact-form-group">
            <label className="contact-form-label">Communication Frequency</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="contact-form-input"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="contact-form-group">
            <label className="contact-form-label">Transmission Payload</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="contact-form-textarea"
              placeholder="Your Message..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="contact-submit-btn"
          >
            {isSending ? 'Initiating Transmission...' : 'Transmit Message'}
          </button>

          {isSubmitted && (
            <div className="contact-success-msg">
              SIGNAL RECEIVED. RESPONSE INBOUND.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
