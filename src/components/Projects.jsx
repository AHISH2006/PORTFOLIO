import { motion } from 'framer-motion';
import '../styles/Projects.css';

export default function Projects() {
  const projects = [
    {
      id: "01",
      title: "Mini E-Commerce Web App",
      stack: "MERN Stack / Redux",
      desc: "Full-stack e-commerce platform with high-performance product indexing and real-time cart synchronization.",
      link: "https://game-x-store.vercel.app/"
    },
    {
      id: "02",
      title: "Escape Code Platform",
      stack: "MERN Stack / Socket.io",
      desc: "Interactive coding challenge engine with real-time feedback and dynamic state management.",
      link: "https://escape-code.vercel.app"
    },
    {
      id: "03",
      title: "Omni-Tech Symposium",
      stack: "ReactJS / Framer Motion",
      desc: "Cinematic event platform designed for SCE's AI symposium, featuring fluid transitions and responsive layouts.",
      link: "https://omni-tech-tau.vercel.app"
    },
    {
      id: "04",
      title: "AI Mental Health Chatbot",
      stack: "NLP / MERN / AI",
      desc: "Conversational AI platform utilizing natural language processing to deliver emotional assistance and support.",
      link: "https://health-support-chatbot.vercel.app"
    }
  ];

  return (
    <section id="projects" className="projects-container">
      <motion.div
        className="projects-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <span className="projects-overline">Case Studies</span>
        <h2 className="projects-title">
          PROJECT <br /> <span className="text-green-500">CLUSTERS</span>
        </h2>
      </motion.div>

      <div className="projects-grid">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.title}
            className="project-card group"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="project-card-header">
               <span className="project-id">
                  {proj.id}
               </span>
               <a 
                href={proj.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-link"
               >
                 <i className="fas fa-arrow-right project-link-icon"></i>
               </a>
            </div>

            <div className="project-card-body">
              <h3 className="project-card-title">
                {proj.title}
              </h3>
              <p className="project-card-desc">
                {proj.desc}
              </p>
              <div className="project-card-footer">
                 <span className="project-stack">{proj.stack}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
