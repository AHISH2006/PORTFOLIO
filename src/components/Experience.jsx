import { motion } from 'framer-motion';
import '../styles/Experience.css';

export default function Experience() {
  const experiences = [
    {
      role: "Frontend Developer (Intern)",
      company: "Future Interns Program",
      period: "AUG 2024 – AUG 2025",
      desc: "Architecting responsive systems and cross-platform mobile solutions."
    },
    {
      role: "MERN Stack Developer",
      company: "Symposium Tech",
      period: "AUG 2025 – SEPT 2025",
      desc: "Full-stack orchestration of event platforms and real-time management systems."
    }
  ];

  return (
    <section id="experience" className="experience-container">
       <motion.div
        className="experience-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <span className="experience-overline">Professional Log</span>
        <h2 className="experience-title">
          JOURNEY <br /> <span className="text-green-500">TIMELINE</span>
        </h2>
      </motion.div>

      <div className="experience-list">
         {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="experience-item group"
            >
               <div className="experience-content">
                  <span className="experience-period">{exp.period}</span>
                  <h3 className="experience-role">
                     {exp.role}
                  </h3>
                  <p className="experience-desc">{exp.desc}</p>
               </div>
               
               <div className="experience-meta">
                  <span className="experience-meta-label">Company</span>
                  <span className="experience-company">
                     {exp.company}
                  </span>
               </div>
            </motion.div>
         ))}
      </div>
    </section>
  );
}
