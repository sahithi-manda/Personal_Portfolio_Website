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
    <div className="relative min-h-screen bg-darkBg text-textMuted select-none selection:bg-accentBlue/25 selection:text-white">
      {/* Custom Cursor follower */}
      <CustomCursor />

      {/* Scroll Progress Bar Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accentBlue to-accentPurple origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Colorful Mesh Gradients Background (Aesthetic Floating Orbs) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        {/* Cyan Orb */}
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-cyan-500/12 blur-[130px] animate-float-1" />
        
        {/* Violet/Purple Orb */}
        <div className="absolute bottom-[15%] right-[-10%] w-[65vw] h-[65vw] rounded-full bg-violet-600/12 blur-[150px] animate-float-2" />
        
        {/* Magenta/Deep Pink Orb */}
        <div className="absolute top-[25%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-pink-500/8 blur-[130px] animate-float-3" />
        
        {/* Indigo Orb */}
        <div className="absolute bottom-[-10%] left-[20%] w-[58vw] h-[58vw] rounded-full bg-indigo-500/12 blur-[130px] animate-float-1" />
      </div>

      {/* Grid Background Pattern */}
      <div className="fixed inset-0 grid-bg pointer-events-none -z-10" />

      {/* Tactile Noise/Grain Overlay */}
      <div className="fixed inset-0 noise-bg opacity-[0.015] pointer-events-none z-[90]" />

      {/* Global Fixed Holographic Mascot Background (Visible across entire portfolio) */}
      <div className="hidden lg:flex fixed right-8 top-[28%] w-[32vw] h-[32vw] items-center justify-center pointer-events-none -z-10 select-none">
        {/* Soft local backdrop glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accentBlue/10 to-accentPurple/10 blur-[90px]" />
        
        {/* Orbit Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[105%] h-[105%] rounded-full border border-dashed border-accentBlue/8"
        />

        {/* Mascot Image (Screen-blended and low opacity for watermark effect) */}
        <motion.img
          src="/developer_avatar.png"
          alt="Sahithi Reddy Holographic Watermark"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[85%] h-[85%] object-contain rounded-full opacity-[0.06] mix-blend-screen select-none pointer-events-none"
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
        <Contact />
      </main>

      {/* Footer Area */}
      <Footer />
    </div>
  );
}

export default App;
