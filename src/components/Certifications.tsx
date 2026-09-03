import { motion } from 'framer-motion';
import { FiAward, FiCheckSquare } from 'react-icons/fi';
import { useMousePosition } from '../hooks/useMousePosition';
import { CardTilt3D } from './CardTilt3D';

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  credentialUrl?: string;
}

const certificatesData: Certificate[] = [
  {
    title: 'Python Essentials 1',
    issuer: 'Cisco Networking Academy',
    date: 'Credentialed',
    skills: ['Python Fundamentals', 'Control Flow', 'Data Collections', 'Logic & Functions'],
  },
  {
    title: 'GenAI Powered Data Analytics Job Simulation',
    issuer: 'Tata (Forage)',
    date: 'Credentialed',
    skills: ['Generative AI', 'Exploratory Data Analysis', 'Business Analytics', 'Data Insights'],
  },
  {
    title: 'Claude 101',
    issuer: 'Anthropic',
    date: 'Credentialed',
    skills: ['Large Language Models (LLMs)', 'Prompt Engineering', 'AI System Interaction'],
  },
  {
    title: 'Microsoft SQL Certification Training',
    issuer: 'Intellipaat',
    date: 'Credentialed',
    skills: ['Database Management', 'Complex SQL Queries', 'Relational Schema', 'SQLite & DBMS'],
  },
  {
    title: 'Introduction to Modern AI',
    issuer: 'Cisco Networking Academy',
    date: 'Credentialed',
    skills: ['Modern AI Principles', 'Machine Learning Basics', 'AI Ethics & Applications'],
  },
  {
    title: 'AI/ML Intern Accomplishment',
    issuer: 'Labmentix',
    date: 'February 2026',
    skills: ['Exploratory Data Analysis (EDA)', 'Data Visualization', 'Insight Engineering'],
  },
  {
    title: 'Machine Learning Internship Certificate',
    issuer: 'DecodeLabs',
    date: 'July 2024',
    skills: ['Python Data Analysis', 'Machine Learning Models', 'Predictive Analysis'],
  },
];

interface CertCardProps {
  cert: Certificate;
  index: number;
}

const CertCard: React.FC<CertCardProps> = ({ cert, index }) => {
  const { containerRef, handleMouseMove } = useMousePosition();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="w-full h-full"
    >
      <CardTilt3D className="h-full">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="glow-card glass-panel glass-panel-hover p-6 md:p-8 rounded-xl relative overflow-hidden flex flex-col justify-between h-full"
        >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="p-3 bg-sky-950/70 text-sky-400 rounded-xl border border-sky-500/30">
              <FiAward size={24} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-mono bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full font-medium">
              <FiCheckSquare size={12} />
              <span>Verified Certificate</span>
            </div>
          </div>

          {/* Title & Issuer */}
          <h4 className="text-xl font-bold text-white mb-1 tracking-tight">
            {cert.title}
          </h4>
          <p className="text-sm font-semibold text-violet-400 tracking-wide uppercase mb-4">
            {cert.issuer}
          </p>

          <p className="text-xs text-slate-400 font-mono mb-6 flex items-center gap-1">
            <span>Issued:</span>
            <span className="text-slate-200 font-semibold">{cert.date}</span>
          </p>
        </div>

        {/* Skills Covered */}
        <div className="border-t border-slate-700/80 pt-4">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3">Key Focus Areas</p>
          <div className="flex flex-wrap gap-2">
            {cert.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        </div>
      </CardTilt3D>
    </motion.div>
  );
};

export const Certifications = () => {
  return (
    <section id="certifications" className="py-24 px-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="h-[1.5px] w-6 bg-sky-400" />
          <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">Credentials</span>
          <span className="h-[1.5px] w-6 bg-sky-400" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight metallic-text uppercase"
        >
          Certifications & Internships
        </motion.h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificatesData.map((cert, idx) => (
          <CertCard key={cert.title} cert={cert} index={idx} />
        ))}
      </div>
    </section>
  );
};
