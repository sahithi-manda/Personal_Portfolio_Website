import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDownload,
  FiExternalLink,
  FiMaximize2,
  FiX,
  FiBookOpen,
  FiBriefcase,
  FiCode,
  FiFileText,
} from 'react-icons/fi';
import { useMousePosition } from '../hooks/useMousePosition';
import { CardTilt3D } from './CardTilt3D';

export const Resume = () => {
  const { containerRef, handleMouseMove } = useMousePosition();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const resumeUrl = '/Sahithi_Reddy_resume.pdf';

  return (
    <section id="resume" className="py-24 px-6 max-w-6xl mx-auto">
      {/* Title & Section Tag */}
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="h-[1.5px] w-6 bg-sky-400" />
          <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">Curriculum Vitae</span>
          <span className="h-[1.5px] w-6 bg-sky-400" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight metallic-text uppercase"
        >
          Resume & Qualifications
        </motion.h3>
        <p className="text-sm text-slate-400 max-w-xl mt-3">
          Overview of my academic foundation, internship experience, and machine learning skillsets. Preview online or download the complete CV.
        </p>
      </div>

      {/* Snapshot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Education Card */}
        <CardTilt3D>
          <div className="glow-card glass-panel glass-panel-hover p-6 rounded-xl h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-sky-950/70 text-sky-400 rounded-xl border border-sky-500/30">
                  <FiBookOpen size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Education</h4>
                  <span className="text-xs text-slate-400 font-mono">B.Tech 2024 - 2028</span>
                </div>
              </div>
              <p className="text-sm text-slate-200 font-semibold mb-1">
                CSE (Artificial Intelligence & Machine Learning)
              </p>
              <p className="text-xs text-slate-400">
                Sreyas Institute of Engineering and Technology, Hyderabad
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Focus Area</span>
              <span className="text-sky-300 font-mono">AI / ML, LLMs & DSA</span>
            </div>
          </div>
        </CardTilt3D>

        {/* Experience Snapshot */}
        <CardTilt3D>
          <div className="glow-card glass-panel glass-panel-hover p-6 rounded-xl h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-violet-950/70 text-violet-400 rounded-xl border border-violet-500/30">
                  <FiBriefcase size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Industry Experience</h4>
                  <span className="text-xs text-slate-400 font-mono">Active AI/ML Intern</span>
                </div>
              </div>
              <p className="text-sm text-slate-200 font-semibold mb-1">
                AI/ML Intern @ IStudio
              </p>
              <p className="text-xs text-slate-400">
                IStudio (Mar 2026 – Present) & Labmentix (Aug 2025 – Feb 2026)
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Key Focus</span>
              <span className="text-violet-300 font-mono">Agents, RAG & Vision</span>
            </div>
          </div>
        </CardTilt3D>

        {/* Core Stack Snapshot */}
        <CardTilt3D>
          <div className="glow-card glass-panel glass-panel-hover p-6 rounded-xl h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-950/70 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <FiCode size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Core Competencies</h4>
                  <span className="text-xs text-slate-400 font-mono">Languages & Frameworks</span>
                </div>
              </div>
              <p className="text-sm text-slate-200 font-semibold mb-1">
                Python, LLMs, RAG & Deep Learning
              </p>
              <p className="text-xs text-slate-400">
                Scikit-Learn, TensorFlow, OpenCV, Streamlit, NLP, ANN, PCA, SQLite
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Practical Work</span>
              <span className="text-emerald-300 font-mono">15+ AI/ML Projects</span>
            </div>
          </div>
        </CardTilt3D>
      </div>

      {/* Main Interactive Resume Preview Frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="glow-card glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80"
      >
        {/* Browser Mockup Top Bar */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-700 text-xs font-mono text-slate-300">
              <FiFileText size={14} className="text-sky-400" />
              <span>Sahithi_Reddy_resume.pdf</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                PDF
              </span>
            </div>
          </div>

          {/* Action Button Controls */}
          <div className="flex items-center gap-3">
            {/* Fullscreen Modal View */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Preview in fullscreen modal"
            >
              <FiMaximize2 size={13} />
              <span className="hidden sm:inline">Fullscreen</span>
            </button>

            {/* Open in New Tab */}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
              title="Open PDF in new browser tab"
            >
              <FiExternalLink size={13} />
              <span className="hidden sm:inline">Open Tab</span>
            </a>

            {/* Download PDF Button */}
            <a
              href={resumeUrl}
              download="Sahithi_Reddy_resume.pdf"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 shadow-md shadow-sky-500/20 transition-all active:scale-95"
              title="Download PDF to your computer"
            >
              <FiDownload size={13} />
              <span>Download CV</span>
            </a>
          </div>
        </div>

        {/* Embedded PDF Preview Window */}
        <div className="relative w-full h-[580px] bg-slate-950/60 flex items-center justify-center">
          <iframe
            src={`${resumeUrl}#view=FitH&toolbar=0`}
            className="w-full h-full border-none"
            title="Sahithi Reddy Resume Preview"
          />

          {/* Floating Mobile/Fallback Download Helper */}
          <div className="absolute bottom-4 right-4 sm:hidden">
            <a
              href={resumeUrl}
              download="Sahithi_Reddy_resume.pdf"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-sky-400 shadow-lg flex items-center gap-1.5"
            >
              <FiDownload size={14} />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Reading Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-slate-950/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl h-[90vh] bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-sm text-white">
                  <FiFileText className="text-sky-400" />
                  <span>Sahithi Reddy - Resume Preview</span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={resumeUrl}
                    download="Sahithi_Reddy_resume.pdf"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors"
                  >
                    <FiDownload size={13} />
                    <span>Download</span>
                  </a>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    aria-label="Close modal"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>

              {/* Modal PDF Iframe */}
              <div className="flex-1 w-full h-full bg-slate-950">
                <iframe
                  src={`${resumeUrl}#view=FitH`}
                  className="w-full h-full border-none"
                  title="Fullscreen Resume View"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
