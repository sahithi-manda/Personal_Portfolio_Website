import { motion } from 'framer-motion';
import { useMousePosition } from '../hooks/useMousePosition';
import { CardTilt3D } from './CardTilt3D';

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard = ({ number, label }: StatCardProps) => {
  const { containerRef, handleMouseMove } = useMousePosition();

  return (
    <CardTilt3D className="w-full h-40">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="glow-card glass-panel glass-panel-hover p-6 rounded-xl text-center relative overflow-hidden flex flex-col justify-center items-center h-full"
      >
        <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text mb-1.5 select-none">
          {number}
        </div>
        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          {label}
        </div>
      </div>
    </CardTilt3D>
  );
};

export const About = () => {
  return (
    <section id="about" className="py-24 px-6 max-w-6xl mx-auto">
      {/* Grid structure layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Large Typography Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <span className="h-[1.5px] w-8 bg-sky-400" />
            <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">About Me</span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-2xl md:text-3xl font-normal leading-relaxed text-slate-100 tracking-wide"
          >
            B.Tech CSE (Artificial Intelligence and Machine Learning) student at{' '}
            <span className="text-transparent bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text font-bold">
              Sreyas Institute of Engineering and Technology
            </span>{' '}
            with hands-on experience in machine learning, computer vision, data analysis, and AI application development through internships and practical projects.
          </motion.h3>
        </div>

        {/* Stats Grid Right Column */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <StatCard number="2" label="Internships" />
            <StatCard number="15+" label="Projects" />
            <StatCard number="AIML" label="Student" />
            <StatCard number="Hyderabad" label="Location" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
