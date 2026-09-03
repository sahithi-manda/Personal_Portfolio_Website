import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFileDownload } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { HeroCanvas3D } from './HeroCanvas3D';

const words = [
  'AI/ML Student',
  'Machine Learning Enthusiast',
  'Data Science Learner',
  'Computer Vision Explorer',
];

export const Hero = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleType = () => {
      const fullWord = words[currentWordIndex];
      if (!isDeleting) {
        // Typing
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(70);

        if (currentText === fullWord) {
          // Pause before deleting
          setTypingSpeed(2500);
          setIsDeleting(true);
        }
      } else {
        // Deleting
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(40);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(300);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed]);

  const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target instanceof HTMLElement) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
      {/* Floating Ambient Light Orbs - GPU Optimized */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.12) 0%, transparent 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full pt-12 lg:pt-0">
        {/* Left Column: Typography and Action Links */}
        <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
          {/* Intro Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-xs font-semibold text-sky-300 shadow-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>Available for Internships & Projects</span>
          </motion.div>

          {/* Large Name Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tight metallic-text mb-6 uppercase leading-none"
          >
            Sahithi Reddy
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl font-medium text-slate-300 mb-4 tracking-wide"
          >
            Building Intelligent Systems with AI & Machine Learning
          </motion.h2>

          {/* Typewriting Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-10 text-base md:text-lg font-mono text-sky-400 font-semibold flex items-center gap-1 mb-10"
          >
            <span>{currentText}</span>
            <span className="w-[3px] h-5 bg-violet-400 animate-pulse" />
          </motion.div>

          {/* Buttons / Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
          >
            {/* Primary View Projects */}
            <a
              href="#projects"
              onClick={scrollToProjects}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2"
            >
              View Projects
              <FiArrowRight size={16} />
            </a>

            {/* Secondary Download Resume */}
            <a
              href="/Sahithi_Reddy_resume.pdf"
              download="Sahithi_Reddy_resume.pdf"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <FaFileDownload size={15} />
              Download Resume
            </a>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <a
                href="https://github.com/sahithi-manda"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all shadow-sm"
                aria-label="GitHub Profile"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/sahithi-reddy-manda-0a218732b"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all shadow-sm"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Animated Holographic Interactive 3D Sphere */}
        <div className="lg:col-span-5 flex items-center justify-center w-full mt-10 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] flex items-center justify-center"
          >
            {/* Holographic Grid Panel backing glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accentBlue/10 to-accentPurple/10 blur-[60px]" />
            
            {/* The 3D Canvas */}
            <div className="absolute inset-0 z-20">
              <HeroCanvas3D />
            </div>

            {/* Glowing HUD/Border rings around Canvas */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[95%] h-[95%] rounded-full border border-dashed border-accentBlue/20 pointer-events-none"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[90%] h-[90%] rounded-full border border-double border-accentPurple/15 pointer-events-none"
            />
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-darkBg to-transparent pointer-events-none" />
    </section>
  );
};
