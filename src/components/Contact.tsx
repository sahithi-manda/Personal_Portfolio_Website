import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaCopy, FaCheck } from 'react-icons/fa';
import { useMousePosition } from '../hooks/useMousePosition';

export const Contact = () => {
  const { containerRef, handleMouseMove } = useMousePosition();
  const [copied, setCopied] = useState<boolean>(false);
  const email = 'sahithi2703@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="h-[1px] w-6 bg-accentPurple" />
          <span className="text-xs uppercase tracking-widest text-accentPurple font-bold">Connect</span>
          <span className="h-[1px] w-6 bg-accentPurple" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight metallic-text uppercase"
        >
          Get In Touch
        </motion.h3>
      </div>

      {/* Contact Panel Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="glow-card glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden flex flex-col items-center text-center"
      >
        <p className="text-base md:text-lg text-textMuted max-w-xl leading-relaxed mb-8 font-medium">
          Interested in internship opportunities, project collaborations, or discussing AI/ML systems? Drop me an email or connect on social platforms!
        </p>

        {/* Email Copy Card */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3 pl-5 mb-10 w-full max-w-md justify-between">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-accentBlue" size={18} />
            <span className="text-white font-mono text-sm md:text-base select-all">{email}</span>
          </div>
          <button
            onClick={copyEmail}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center justify-center gap-2 select-none active:scale-95"
          >
            {copied ? (
              <>
                <FaCheck className="text-emerald-400" size={12} />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <FaCopy size={12} />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>

        {/* Social Network Links */}
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/sahithi-manda"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2"
          >
            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-textMuted group-hover:text-white group-hover:border-accentBlue group-hover:bg-accentBlue/10 transition-all duration-300">
              <FaGithub size={24} />
            </div>
            <span className="text-xs font-semibold text-textMuted group-hover:text-white transition-colors">GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/sahithi-reddy-manda-0a218732b"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2"
          >
            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-textMuted group-hover:text-white group-hover:border-accentPurple group-hover:bg-accentPurple/10 transition-all duration-300">
              <FaLinkedin size={24} />
            </div>
            <span className="text-xs font-semibold text-textMuted group-hover:text-white transition-colors">LinkedIn</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};
