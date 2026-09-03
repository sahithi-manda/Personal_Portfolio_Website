import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';
import { useMousePosition } from '../hooks/useMousePosition';

interface TimelineItemProps {
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
}

const TimelineItem = ({
  company,
  role,
  duration,
  responsibilities,
}: TimelineItemProps) => {
  const { containerRef, handleMouseMove } = useMousePosition();

  return (
    <div className="relative pl-8 md:pl-12 pb-12 last:pb-0 group">
      {/* Timeline Node & Glow */}
      <div className="absolute left-0 top-1.5 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-sky-400 bg-[#0F172A] z-10 transition-all duration-300 group-hover:scale-125 group-hover:bg-sky-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.8)]" />
        <div className="absolute w-5 h-5 rounded-full bg-sky-400/20 blur-[6px] group-hover:opacity-100 opacity-50 transition-opacity" />
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="glow-card glass-panel glass-panel-hover p-6 md:p-8 rounded-xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-xl font-bold text-white tracking-tight">{company}</h4>
            <p className="text-sm font-semibold text-sky-400 uppercase tracking-wider mt-0.5">{role}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-full w-fit">
            <FiCalendar size={12} className="text-violet-400" />
            <span>{duration}</span>
          </div>
        </div>

        <ul className="space-y-3.5">
          {responsibilities.map((resp, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export const Experience = () => {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="h-[1.5px] w-6 bg-violet-400" />
            <span className="text-xs uppercase tracking-widest text-violet-400 font-bold">Career Journey</span>
            <span className="h-[1.5px] w-6 bg-violet-400" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase"
          >
            Work Experience
          </motion.h3>
        </div>

        {/* Timeline Line Container */}
        <div className="relative border-l border-slate-700/80 ml-[9px] md:ml-[9px]">
          <TimelineItem
            company="Labmentix"
            role="AI/ML Intern"
            duration="Aug 2025 - Feb 2026"
            responsibilities={[
              'Investigated extensive datasets to uncover actionable insights, trends, and patterns.',
              'Constructed and designed interactive data visualizations to communicate analytical findings effectively.',
            ]}
          />
          <TimelineItem
            company="DecodeLabs"
            role="ML Intern"
            duration="Jun 2024 - Jul 2024"
            responsibilities={[
              'Completed intensive, hands-on training in Artificial Intelligence and Machine Learning paradigms.',
              'Worked with Python, Pandas, and Scikit-Learn libraries for data analysis and core ML model building.',
            ]}
          />
        </div>
      </div>
    </section>
  );
};
