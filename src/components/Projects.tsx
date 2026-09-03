import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { FiArrowUpRight, FiExternalLink, FiStar, FiGitBranch, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { useMousePosition } from '../hooks/useMousePosition';
import { CardTilt3D } from './CardTilt3D';
import { useGitHubProjects } from '../hooks/useGitHubProjects';
import type { PortfolioProject } from '../types/project';

interface ProjectCardProps {
  project: PortfolioProject;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { containerRef, handleMouseMove } = useMousePosition();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.4), ease: 'easeOut' }}
      className={`${project.gridClass} group h-full`}
    >
      <CardTilt3D className="h-full">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="glow-card glass-panel glass-panel-hover p-6 md:p-8 rounded-xl h-full flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            {/* Header: Title & Badges */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                {project.featured && (
                  <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-sky-400 bg-sky-950/70 border border-sky-500/30 px-2 py-0.5 rounded mb-2">
                    Featured
                  </span>
                )}
                <h4 className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors duration-200">
                  {project.title}
                </h4>
              </div>

              {/* Header Action / GitHub Icon */}
              <div className="flex items-center gap-2 shrink-0">
                {project.stars > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-amber-300/90 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-md">
                    <FiStar size={11} className="fill-amber-400 text-amber-400" />
                    <span>{project.stars}</span>
                  </span>
                )}
                {project.forks > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-800/80 border border-slate-700/80 px-2 py-1 rounded-md">
                    <FiGitBranch size={11} />
                    <span>{project.forks}</span>
                  </span>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-all shadow-xs"
                  aria-label="GitHub Repository"
                >
                  <FiArrowUpRight size={16} />
                </a>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              {project.description}
            </p>
          </div>

          {/* Footer Tech Badges & Actions */}
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2.5 py-1 rounded-md bg-sky-950/60 border border-sky-800/50 text-sky-300 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Links */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-700/40">
              {/* GitHub Link */}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 group-hover:text-sky-400 transition-colors border-b border-slate-700 group-hover:border-sky-400 pb-1"
              >
                <FaGithub size={13} />
                <span>View Source Code</span>
              </a>

              {/* Live Demo Link (Only shown when liveUrl is available) */}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors border-b border-sky-400/60 hover:border-sky-300 pb-1 ml-auto"
                >
                  <FiExternalLink size={13} />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardTilt3D>
    </motion.div>
  );
};

/**
 * Skeleton Loader matching Midnight Slate aesthetic
 */
const ProjectSkeleton = ({ gridClass }: { gridClass: string }) => (
  <div className={`${gridClass} h-[320px] rounded-xl glass-panel p-6 md:p-8 flex flex-col justify-between animate-pulse border border-slate-700/40`}>
    <div>
      <div className="h-6 bg-slate-700/60 rounded w-3/4 mb-4" />
      <div className="space-y-2.5 mb-6">
        <div className="h-3.5 bg-slate-700/40 rounded w-full" />
        <div className="h-3.5 bg-slate-700/40 rounded w-5/6" />
        <div className="h-3.5 bg-slate-700/40 rounded w-4/6" />
      </div>
    </div>
    <div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-slate-700/50 rounded w-16" />
        <div className="h-6 bg-slate-700/50 rounded w-20" />
        <div className="h-6 bg-slate-700/50 rounded w-14" />
      </div>
      <div className="h-4 bg-slate-700/30 rounded w-28" />
    </div>
  </div>
);

export const Projects = () => {
  const { projects, isLoading, isSyncing, refresh } = useGitHubProjects();

  return (
    <section id="projects" className="py-24 px-6 max-w-6xl mx-auto">
      {/* Title & GitHub Auto-Sync Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="h-[1.5px] w-6 bg-sky-400" />
            <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">Portfolios</span>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight metallic-text uppercase"
          >
            Featured AI & ML Projects
          </motion.h3>
        </div>

        {/* GitHub Auto-Sync Indicator & Manual Refresh Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 self-start md:self-auto"
        >
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/60 border border-slate-700/60 px-3 py-1.5 rounded-full">
            <FiCheckCircle className="text-sky-400" size={13} />
            <span>GitHub Auto-Sync</span>
          </div>

          <button
            onClick={() => refresh()}
            disabled={isSyncing}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-sky-300 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            title="Force refresh from GitHub"
            aria-label="Refresh projects from GitHub"
          >
            <FiRefreshCw size={14} className={isSyncing ? 'animate-spin text-sky-400' : ''} />
          </button>
        </motion.div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {isLoading ? (
          <>
            <ProjectSkeleton gridClass="md:col-span-3" />
            <ProjectSkeleton gridClass="md:col-span-3" />
            <ProjectSkeleton gridClass="md:col-span-2" />
            <ProjectSkeleton gridClass="md:col-span-2" />
            <ProjectSkeleton gridClass="md:col-span-2" />
          </>
        ) : (
          projects.map((project, idx) => (
            <ProjectCard key={project.id || project.title} project={project} index={idx} />
          ))
        )}
      </div>
    </section>
  );
};
