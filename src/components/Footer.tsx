import { FiArrowUp } from 'react-icons/fi';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <p className="text-sm font-semibold text-white/90">
            Designed & Developed by Sahithi Reddy
          </p>
          <p className="text-xs text-textMuted mt-1.5 font-mono">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Scroll back to top */}
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-accentBlue/30 text-textMuted hover:text-white hover:bg-accentBlue/5 transition-all select-none group"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};
