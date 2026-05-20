import { motion } from 'framer-motion';
import '../styles/Skills.css';

export default function Skills() {
  const skillCategories = [
    {
      title: "Core Programming",
      skills: ["Python (AI Focus)", "JavaScript (ES6+)", "SQL & NoSQL"],
    },
    {
      title: "Frontend Engineering",
      skills: ["React.js Architecture", "React Native / Expo", "Tailwind & Headless UI"],
    },
    {
      title: "Backend & Systems",
      skills: ["Node.js / Express", "RESTful API Design", "System Integration"],
    }
  ];

  return (
    <section id="skills" className="skills-container">
       <motion.div
        className="skills-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <span className="skills-overline">Technical Stack</span>
        <h2 className="skills-title">
          CAPABILITY <br /> <span className="text-green-500">INDEX</span>
        </h2>
      </motion.div>

      <div className="skills-grid">
         {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="skills-category"
            >
               <h3 className="skills-category-title">
                  {cat.title}
               </h3>
               <ul className="skills-list">
                  {cat.skills.map(skill => (
                     <li key={skill} className="skills-item group">
                        <span className="skills-item-name">
                           {skill}
                        </span>
                        <div className="skills-item-line" />
                        <span className="skills-item-badge">Mastered</span>
                     </li>
                  ))}
               </ul>
            </motion.div>
         ))}
      </div>
    </section>
  );
}
