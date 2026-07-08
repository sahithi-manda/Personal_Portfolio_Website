import { motion } from 'framer-motion';
import { useMousePosition } from '../hooks/useMousePosition';
import { SkillsSphere3D } from './SkillsSphere3D';

interface SkillGroup {
  category: string;
  skills: string[];
}

const skillsData: SkillGroup[] = [
  {
    category: 'Languages',
    skills: ['Python', 'Java'],
  },
  {
    category: 'AI & ML Core',
    skills: ['Machine Learning', 'Data Analysis', 'Computer Vision', 'NLP'],
  },
  {
    category: 'Tools & Libraries',
    skills: ['Git', 'GitHub', 'Streamlit', 'Google Colab', 'Pandas', 'NumPy', 'OpenCV', 'TensorFlow'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 20,
    },
  },
};

interface SkillCategoryCardProps {
  group: SkillGroup;
}

const SkillCategoryCard = ({ group }: SkillCategoryCardProps) => {
  const { containerRef, handleMouseMove } = useMousePosition();

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="glow-card glass-panel p-6 md:p-8 rounded-xl relative overflow-hidden"
    >
      <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-6 border-b border-white/5 pb-3">
        {group.category}
      </h4>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="flex flex-wrap gap-3"
      >
        {group.skills.map((skill) => (
          <motion.div
            key={skill}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-full hover:border-accentBlue/50 hover:bg-accentBlue/5 transition-all select-none duration-200 cursor-default"
          >
            {skill}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export const Skills = () => {
  return (
    <section id="skills" className="py-24 px-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="h-[1px] w-6 bg-accentPurple" />
          <span className="text-xs uppercase tracking-widest text-accentPurple font-bold">Tech Stack</span>
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase"
        >
          Skills & Technologies
        </motion.h3>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Skills Categorized Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 order-2 lg:order-1">
          {skillsData.map((group) => (
            <SkillCategoryCard key={group.category} group={group} />
          ))}
        </div>

        {/* Right Side: Interactive 3D Spinning Tag Cloud */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 bg-white/[0.01] border border-white/5 rounded-2xl p-6 hologram-panel accent-glow-purple">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-accentBlue mb-2">Interactive Orbit</h4>
          <p className="text-xs text-textMuted/70 mb-2 text-center">Move cursor to shift spin direction & hover tags</p>
          <SkillsSphere3D />
        </div>
      </div>
    </section>
  );
};
