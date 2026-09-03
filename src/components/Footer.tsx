import { FiArrowUp } from 'react-icons/fi';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="border-t border-slate-800 bg-[#0B1120] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <p className="text-sm font-semibold text-slate-200">
            Designed & Developed by Sahithi Reddy
          </p>
          <p className="text-xs text-slate-400 mt-1.5 font-mono">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Scroll back to top */}
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-slate-800 border border-slate-700 hover:border-sky-400 text-slate-400 hover:text-sky-300 hover:bg-sky-500/10 transition-all select-none group shadow-xs"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};
