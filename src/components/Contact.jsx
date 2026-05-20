import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    { icon: "fas fa-envelope", title: "Email", value: "anuahish249@gmail.com" },
    { icon: "fas fa-phone", title: "Phone", value: "+91 63747 66056" },
    { icon: "fas fa-map-marker-alt", title: "Location", value: "Coimbatore, India" }
  ];

  return (
    <section id="contact" className="contact-container">
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="contact-title">TRANSMIT <span className="text-green-500">SIGNAL</span></h2>
        <p className="contact-subtitle">
          Ready to sync orbits or initiate a collaboration? Send a transmission below.
        </p>
      </motion.div>

      <div className="contact-grid">
        {/* Info Side */}
        <div className="contact-info-side">
          {contactInfo.map((info, i) => (
            <motion.div
              key={info.title}
              className="contact-info-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="contact-info-icon-wrapper">
                <i className={info.icon}></i>
              </div>
              <div>
                <h4 className="contact-info-label">{info.title}</h4>
                <p className="contact-info-value">{info.value}</p>
              </div>
            </motion.div>
          ))}
          
          <div className="contact-socials">
             <div className="contact-social-list">
                {['LinkedIn', 'GitHub'].map(social => (
                  <a key={social} href="#" className="contact-social-btn">
                    {social}
                  </a>
                ))}
             </div>
          </div>
        </div>

        {/* Form Side */}
        <motion.form
          onSubmit={handleSubmit}
          className="contact-form"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
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
        </motion.form>
      </div>
    </section>
  );
}
