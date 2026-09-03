import { motion, useScroll, useSpring } from 'framer-motion';
import { Background3D } from './components/Background3D';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Certifications } from './components/Certifications';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-slate-300 select-none selection:bg-sky-500/25 selection:text-sky-200">
      {/* Custom Cursor follower */}
      <CustomCursor />

      {/* Scroll Progress Bar Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Colorful Mesh Gradients Background (Aesthetic Floating Orbs - Midnight Slate) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        {/* Electric Cyan Orb */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full animate-float-1"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(56, 189, 248, 0.03) 45%, transparent 70%)',
            transform: 'translate3d(0, 0, 0)',
          }}
        />
        
        {/* Soft Violet Orb */}
        <div
          className="absolute bottom-[15%] right-[-10%] w-[55vw] h-[55vw] rounded-full animate-float-2"
          style={{
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.11) 0%, rgba(129, 140, 248, 0.02) 45%, transparent 70%)',
            transform: 'translate3d(0, 0, 0)',
          }}
        />
        
        {/* Luminous Amethyst Orb */}
        <div
          className="absolute top-[25%] right-[10%] w-[45vw] h-[45vw] rounded-full animate-float-3"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.09) 0%, rgba(168, 85, 247, 0.02) 45%, transparent 70%)',
            transform: 'translate3d(0, 0, 0)',
          }}
        />
        
        {/* Indigo Orb */}
        <div
          className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full animate-float-1"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.11) 0%, rgba(99, 102, 241, 0.02) 45%, transparent 70%)',
            transform: 'translate3d(0, 0, 0)',
          }}
        />
      </div>

      {/* Grid Background Pattern */}
      <div className="fixed inset-0 grid-bg pointer-events-none -z-10" />

      {/* Tactile Noise/Grain Overlay */}
      <div className="fixed inset-0 noise-bg opacity-[0.015] pointer-events-none z-[90]" />

      {/* Global Fixed Holographic Mascot Background (Visible across entire portfolio) */}
      <div className="hidden lg:flex fixed right-8 top-[28%] w-[32vw] h-[32vw] items-center justify-center pointer-events-none -z-10 select-none">
        {/* Soft local backdrop glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.10) 0%, rgba(129, 140, 248, 0.05) 50%, transparent 75%)',
            transform: 'translate3d(0, 0, 0)',
          }}
        />
        
        {/* Orbit Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[105%] h-[105%] rounded-full border border-dashed border-sky-400/15"
        />

        {/* Mascot Image (Screen-blended for celestial watermark effect) */}
        <motion.img
          src="/developer_avatar.png"
          alt="Sahithi Reddy Holographic Watermark"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[85%] h-[85%] object-contain rounded-full opacity-[0.08] mix-blend-screen select-none pointer-events-none"
        />
      </div>

      {/* Three.js Interactive Particle Background */}
      <Background3D />

      {/* Navigation Header */}
      <Navbar />

      {/* Page Sections */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Resume />
        <Contact />
      </main>

      {/* Footer Area */}
      <Footer />
    </div>
  );
}

export default App;
