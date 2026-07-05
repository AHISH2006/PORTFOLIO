import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import '../styles/Contact.css';

/* ── Typing Effect Hook ── */
function useTypingEffect(text, speed = 40, start = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return { displayed, done };
}

/* ── Blink Cursor ── */
function Cursor({ visible = true }) {
  return <span className="terminal-cursor" style={{ opacity: visible ? 1 : 0 }}>▌</span>;
}

/* ── Terminal Line ── */
function TermLine({ prompt = '>', text, color, dimmed, delay = 0, onDone }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const { displayed, done } = useTypingEffect(text, 28, active);
  useEffect(() => { if (done && onDone) onDone(); }, [done]);
  return (
    <div className={`term-line ${dimmed ? 'term-dimmed' : ''}`} style={{ color }}>
      {prompt && <span className="term-prompt">{prompt}&nbsp;</span>}
      <span>{displayed}</span>
      {active && !done && <Cursor />}
    </div>
  );
}

/* ── Main Contact Component ── */
export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [step, setStep] = useState(0);           // controls reveal steps
  const [activeField, setActiveField] = useState(null);
  const [outputLines, setOutputLines] = useState([]);
  const termRef = useRef(null);
  const sectionRef = useRef(null);

  // Intersection observer — triggers boot when terminal is fully in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Use threshold 0.9 so it must be fully scrolled down to trigger
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStep(s => Math.max(s, 1)); },
      { threshold: 0.9, rootMargin: '0px 0px 0px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setOutputLines([]);

    // 1. Initial terminal output
    const initialLines = [
      { text: `> Initiating transmission...`, color: '#22d3ee' },
      { text: `> Routing to destination: anuahish249@gmail.com`, color: '#94a3b8' },
      { text: `> Payload: "${formData.message.slice(0, 32)}${formData.message.length > 32 ? '...' : ''}"`, color: '#94a3b8' },
      { text: `> Encryption: AES-256`, color: '#94a3b8' }
    ];

    for (let i = 0; i < initialLines.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setOutputLines(prev => [...prev, initialLines[i]]);
    }

    // 2. Call backend API
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: 'Message from Portfolio Contact Form',
          message: formData.message
        })
      });

      if (!response.ok) throw new Error('Failed to send');

      setOutputLines(prev => [...prev, { text: `> Status: SIGNAL_RECEIVED ✓`, color: '#22c55e' }]);
    } catch (error) {
      setOutputLines(prev => [...prev, { text: `> Error: TRANSMISSION_FAILED ✗`, color: '#ef4444' }]);
      console.error(error);
    }

    await new Promise(r => setTimeout(r, 500));
    setIsSubmitted(true);
    setIsSending(false);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => { setIsSubmitted(false); setOutputLines([]); }, 7000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section ref={sectionRef} className="contact-container" id="contact">

      {/* ── Section Heading ── */}
      <motion.div
        className="contact-section-header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="contact-overline">Get In Touch</span>
        <h2 className="contact-heading">
          <span className="contact-heading-static">OPEN</span>{' '}
          <span className="contact-heading-accent">CHANNEL</span>
        </h2>
        <p className="contact-heading-sub">
          Send a transmission — I respond within 24 hours.
        </p>
      </motion.div>

      {/* ── Terminal Window ── */}
      <motion.div
        className="terminal-window"
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {/* Title Bar */}
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="tdot tdot-red" />
            <span className="tdot tdot-yellow" />
            <span className="tdot tdot-green" />
          </div>
          <span className="terminal-title-text">ahish_sm@portfolio:~/contact</span>
          <span className="terminal-pill">SECURE CHANNEL</span>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body" ref={termRef}>

          {/* Boot lines */}
          {step >= 1 && (
            <div className="term-boot-block">
              <TermLine prompt="$" text="ssh contact@ahish.dev --protocol=MERN" color="#22d3ee" delay={0} onDone={() => setStep(s => Math.max(s, 2))} />
            </div>
          )}
          {step >= 2 && (
            <div className="term-boot-block">
              <TermLine prompt="" text="Connected to ahish.dev. Welcome." color="#22c55e" delay={100} />
              <TermLine prompt="" text="Transmission relay online. All fields required." color="#64748b" delay={600} onDone={() => setStep(s => Math.max(s, 3))} />
            </div>
          )}

          {/* Info Cards */}
          {step >= 3 && (
            <motion.div className="terminal-info-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              {[
                { label: 'EMAIL', value: 'anuahish249@gmail.com', icon: '✉' },
                { label: 'PHONE', value: '+91 63747 66056', icon: '☎' },
                { label: 'LOCATION', value: 'Coimbatore, India', icon: '◉' },
              ].map((info, i) => (
                <div key={info.label} className="terminal-info-card" style={{ animationDelay: `${i * 120}ms` }}>
                  <span className="terminal-info-icon">{info.icon}</span>
                  <div>
                    <div className="terminal-info-label">{info.label}</div>
                    <div className="terminal-info-value">{info.value}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Divider */}
          {step >= 3 && <div className="terminal-hr" />}

          {/* Form section */}
          {step >= 3 && (
            <motion.form
              onSubmit={handleSubmit}
              className="terminal-form"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="term-prompt-line">
                <span className="term-prompt-sym">~/contact $</span>
                <span className="term-prompt-cmd"> init_transmission</span>
              </div>

              {/* Name */}
              <div className={`terminal-field-group ${activeField === 'name' ? 'is-active' : ''}`}>
                <label className="terminal-field-label">
                  <span className="tfl-sym">[ARG_1]</span> SENDER_IDENTIFICATION
                </label>
                <div className="terminal-input-wrap">
                  <span className="terminal-input-arrow">→</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setActiveField('name')}
                    onBlur={() => setActiveField(null)}
                    className="terminal-input"
                    placeholder="enter_your_name"
                    required
                    autoComplete="off"
                  />
                  {activeField === 'name' && <Cursor />}
                </div>
              </div>

              {/* Email */}
              <div className={`terminal-field-group ${activeField === 'email' ? 'is-active' : ''}`}>
                <label className="terminal-field-label">
                  <span className="tfl-sym">[ARG_2]</span> COMMUNICATION_FREQ
                </label>
                <div className="terminal-input-wrap">
                  <span className="terminal-input-arrow">→</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    className="terminal-input"
                    placeholder="your@email.address"
                    required
                    autoComplete="off"
                  />
                  {activeField === 'email' && <Cursor />}
                </div>
              </div>

              {/* Message */}
              <div className={`terminal-field-group ${activeField === 'message' ? 'is-active' : ''}`}>
                <label className="terminal-field-label">
                  <span className="tfl-sym">[ARG_3]</span> PAYLOAD_CONTENT
                </label>
                <div className="terminal-input-wrap terminal-textarea-wrap">
                  <span className="terminal-input-arrow">→</span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setActiveField('message')}
                    onBlur={() => setActiveField(null)}
                    className="terminal-input terminal-textarea"
                    placeholder="type_your_message_here..."
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSending} className="terminal-submit">
                <span className="terminal-submit-prefix">$</span>
                <span>{isSending ? 'transmit --status=sending...' : 'transmit --send'}</span>
                <span className="terminal-submit-blink">█</span>
              </button>

              {/* Output lines */}
              <AnimatePresence>
                {outputLines.length > 0 && (
                  <motion.div className="terminal-output"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }}>
                    {outputLines.map((line, i) => (
                      <div key={i} className="terminal-output-line" style={{ color: line.color, animationDelay: `${i * 0.1}s` }}>
                        {line.text}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div className="terminal-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}>
                    <span className="terminal-success-icon">✓</span>
                    SIGNAL_RECEIVED :: RESPONSE_INBOUND
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          )}

          {/* Social links */}
          {step >= 3 && (
            <motion.div className="terminal-socials"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <span className="term-prompt-sym">~/contact $</span>
              <span className="term-prompt-cmd"> ls ./networks</span>
              <div className="terminal-social-links">
                <a href="https://linkedin.com/in/ahishsm" target="_blank" rel="noopener noreferrer" className="terminal-social-link">
                  <span className="tsl-bullet">▶</span> linkedin.com/in/ahishsm
                </a>
                <a href="https://github.com/AHISH2006" target="_blank" rel="noopener noreferrer" className="terminal-social-link">
                  <span className="tsl-bullet">▶</span> github.com/AHISH2006
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
