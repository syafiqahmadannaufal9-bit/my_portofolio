import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_SENTENCES = [

  "Hi! I'm Anam",
  "A Junior Web Designer",
  "Build with Dedication and Passion",
  "Welcome to My Website!"
  
];

export default function KineticIntro({ sentences = DEFAULT_SENTENCES }) {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const sentenceRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });

      sentenceRefs.current.forEach((ref) => {
        if (!ref) return;
        const words = ref.querySelectorAll('.word');

        // 1. Reveal sentence word by word
        tl.fromTo(
          words,
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.15, ease: 'power2.out', duration: 1 }
        )
        // 2. Fade out sentence word by word (all sentences fade out perkata)
        .to(
          words,
          { opacity: 0, y: -30, filter: 'blur(8px)', stagger: 0.1, ease: 'power2.in', duration: 0.8 },
          '+=0.2'
        );
      });

      // 3. Fade out the white background overlay to reveal home page
      tl.to(bgRef.current, {
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      }, '-=0.2');

      // Refresh ScrollTrigger so main-scroll-container triggers calculate accurate start offset
      setTimeout(() => ScrollTrigger.refresh(), 100);

    }, containerRef);

    return () => ctx.revert();
  }, [sentences]);

  return (
    <section ref={containerRef} className="w-full h-[500vh] bg-transparent pointer-events-none">
      <div 
        ref={bgRef} 
        className="fixed top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden bg-white px-6 pointer-events-auto z-[60]"
      >
        {sentences.map((sentence, sIdx) => {
          const words = sentence.split(' ');
          return (
            <div 
              key={sIdx}
              ref={el => sentenceRefs.current[sIdx] = el}
              className="absolute max-w-5xl text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic font-light tracking-wide text-gray-900 flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-2 leading-relaxed"
            >
              {words.map((word, wIdx) => (
                <span key={wIdx} className="word inline-block opacity-0 will-change-[opacity,filter,transform]">
                  {word}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
