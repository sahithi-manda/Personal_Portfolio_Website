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
    title: 'Machine Learning Internship Certificate',
    issuer: 'DecodeLabs',
    date: 'July 2024',
    skills: ['Python Data Analysis', 'Machine Learning Models', 'Predictive Analysis'],
  },
  {
    title: 'AI/ML Intern Accomplishment',
    issuer: 'Labmentix',
    date: 'February 2026',
    skills: ['Exploratory Data Analysis (EDA)', 'Data Visualization', 'Insight Engineering'],
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
            <div className="p-3 bg-accentBlue/10 text-accentBlue rounded-xl border border-accentBlue/20">
              <FiAward size={24} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <FiCheckSquare size={12} />
              <span>Verified Certificate</span>
            </div>
          </div>

          {/* Title & Issuer */}
          <h4 className="text-xl font-bold text-white mb-1 tracking-tight">
            {cert.title}
          </h4>
          <p className="text-sm font-semibold text-accentPurple/90 tracking-wide uppercase mb-4">
            {cert.issuer}
          </p>

          <p className="text-xs text-textMuted font-mono mb-6 flex items-center gap-1">
            <span>Issued:</span>
            <span className="text-white">{cert.date}</span>
          </p>
        </div>

        {/* Skills Covered */}
        <div className="border-t border-white/5 pt-4">
          <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-3">Key Focus Areas</p>
          <div className="flex flex-wrap gap-2">
            {cert.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-textMuted"
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
    <section id="certifications" className="py-24 px-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="h-[1px] w-6 bg-accentBlue" />
          <span className="text-xs uppercase tracking-widest text-accentBlue font-bold">Credentials</span>
          <span className="h-[1px] w-6 bg-accentBlue" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificatesData.map((cert, idx) => (
          <CertCard key={cert.title} cert={cert} index={idx} />
        ))}
      </div>
    </section>
  );
};
