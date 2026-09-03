import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiFileText, FiDownload } from 'react-icons/fi';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Monitor scroll height to apply border/bg adjustments without layout thrashing
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled(prev => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Efficient IntersectionObserver for active section spying (zero layout reflows during scroll)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-30% 0px -50% 0px' }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth',
      });
      setMobileMenuOpen(false);
      setActiveSection(href);
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-panel py-3.5 shadow-md border-b border-slate-700/60 bg-[#0F172A]/85 backdrop-blur-md'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveSection('');
          }}
          className="text-2xl font-bold tracking-tight text-white flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent font-extrabold">SR</span>
        </a>

        {/* Desktop Links & Quick Resume CTA */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className={`relative text-sm transition-colors duration-200 py-1 ${
                    isActive ? 'text-sky-400 font-semibold' : 'text-slate-300 hover:text-white font-medium'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Quick Resume Download Action */}
          <a
            href="/Sahithi_Reddy_resume.pdf"
            download="Sahithi_Reddy_resume.pdf"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-sky-300 bg-sky-950/70 hover:bg-sky-900/80 border border-sky-500/40 hover:border-sky-400 transition-all flex items-center gap-1.5 shadow-xs select-none active:scale-95"
            title="Download Resume PDF"
          >
            <FiFileText size={13} />
            <span>CV</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-200 hover:text-sky-400 transition-colors p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-panel border-b border-slate-700/80 w-full left-0 py-6 px-6 bg-[#0F172A]/95 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className={`text-base font-semibold py-2 border-b border-slate-800 transition-colors ${
                      isActive ? 'text-sky-400 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}

              {/* Mobile Direct Download Button */}
              <a
                href="/Sahithi_Reddy_resume.pdf"
                download="Sahithi_Reddy_resume.pdf"
                className="mt-2 w-full py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
              >
                <FiDownload size={14} />
                <span>Download Resume (PDF)</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
