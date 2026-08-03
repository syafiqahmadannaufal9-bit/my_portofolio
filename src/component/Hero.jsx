import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, FolderGit2, Mail } from 'lucide-react';
import RotatingText from './RotatingText';

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
  }),
};

export default function Hero() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animProps = prefersReduced
    ? {}
    : { initial: 'hidden', animate: 'visible', variants: fadeUp };

  return (
    <section
      id="home"
      className="relative min-h-[100vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden md:w-1/2 z-10 pl-8 pr-6 md:pl-16 md:pr-12 lg:pl-24 lg:pr-20"
    >
      <div className="w-full text-left max-w-xl mx-auto md:mx-0">
        <motion.h1
          {...animProps}
          custom={1}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6 text-black"
        >
          Ingin Membuat <br className="hidden sm:block" />
          <span className="text-[#5227FF] font-serif italic font-light">
            Web 3D & Modern?
          </span>
        </motion.h1>

        <motion.p
          {...animProps}
          custom={2}
          className="text-lg sm:text-xl font-normal leading-relaxed mb-6 text-gray-800"
        >
          Halo, saya <span className="font-serif italic font-bold text-[#5227FF]">Syafiq Ahmad</span>.{' '}
          Fokus membangun aplikasi web interaktif kelas dunia menggunakan React, Three.js, GSAP, dan Tailwind CSS.
        </motion.p>

        <motion.div
          {...animProps}
          custom={3}
          className="flex flex-col sm:flex-row items-start gap-4"
        >
          <a
            href="#portfolio"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1 bg-black hover:bg-gray-900 text-white shadow-lg"
          >
            <FolderGit2 className="w-5 h-5" />
            Lihat Portofolio
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 border backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 border-black bg-white/80 hover:bg-black hover:text-white text-black"
          >
            <Mail className="w-5 h-5" />
            Hubungi Saya
          </a>
        </motion.div>
      </div>

      <motion.div
        {...animProps}
        custom={4}
        className="absolute bottom-8 left-6 md:left-12 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <ArrowDownRight className="w-5 h-5 animate-bounce" />
        <span className="text-xs uppercase tracking-widest font-semibold">Scroll Untuk Lanjut</span>
      </motion.div>
    </section>
  );
}
