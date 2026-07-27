import React, { useEffect } from 'react';
import Navbar from './component/Navbar';
import Hero from './component/Hero';
import About from './component/About';
import Skills from './component/Skills';
import Portfolio from './component/Portfolio';
import ContactFooter from './component/ContactFooter';
import CarScene from './component/CarScene';
import KineticIntro from './component/KineticIntro';

// ponytail: Minimum viable smooth scroll to fix DOM vs Canvas desync.
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function App() {
  useEffect(() => {
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, []);

  return (
    <div className="min-h-screen font-sans relative bg-[#f8fafc] text-[#0f172a]">
      <CarScene />
      <Navbar />
      <KineticIntro />
      <main id="main-scroll-container" className="relative z-10 w-full overflow-hidden">
        <Hero />
        <About />
        <Skills />
        <Portfolio />
        <ContactFooter />
      </main>
    </div>
  );
}

export default App;