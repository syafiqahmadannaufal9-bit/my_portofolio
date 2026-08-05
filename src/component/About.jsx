import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { loadSingleMarkdown } from '../utils/markdown';
import aboutRaw from '../content/about.md?raw';
import { Download, GraduationCap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

const About = memo(function About() {
  const { language } = useLanguage();
  const { frontmatter } = loadSingleMarkdown(aboutRaw);

  const t = (key) => getTranslation(language, `about.${key}`);
  const educationList = getTranslation(language, 'about.education');
  const markdownContent = getTranslation(language, 'about.markdownContent');

  return (
    <section
      id="about"
      className="min-h-[100vh] py-24 pr-8 pl-6 md:pr-16 md:pl-12 lg:pr-24 lg:pl-20 md:w-1/2 md:ml-auto flex flex-col justify-center z-10 text-black"
    >
      <div className="w-full text-left max-w-xl mx-auto md:mx-0">
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-widest font-bold mb-2 opacity-60">
            {t('subtitle')}
          </h2>
          <h3 className="text-4xl sm:text-5xl font-black text-black">{t('title')}</h3>
          <div className="w-16 h-1 mt-4 rounded-full bg-black" />
        </div>

        <div className="flex flex-col justify-center">
          <h4 className="text-xl sm:text-2xl font-bold mb-4 text-black">{frontmatter.title}</h4>

          <div className="prose max-w-none text-base leading-relaxed mb-8 text-gray-800">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>

          {/* Latar Belakang Pendidikan */}
          <div className="mb-8 border-t border-black/10 pt-6">
            <h5 className="text-xs uppercase tracking-widest font-bold mb-4 opacity-60 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-black" />
              {t('eduHeader')}
            </h5>
            <div className="space-y-4">
              {Array.isArray(educationList) && educationList.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-black/15 bg-white/80 backdrop-blur-md transition-all hover:border-black shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h6 className="font-bold text-sm sm:text-base text-black">{edu.degree}</h6>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 border border-black/10 text-gray-700">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">{edu.institution}</p>
                  <p className="text-xs text-gray-700 leading-relaxed opacity-90">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <a
              href="/assets/Syafiq Ahmad Annaufal CV.pdf"
              download="Syafiq Ahmad Annaufal CV.pdf"
              className="inline-flex items-center justify-center w-full sm:w-auto gap-3 px-6 py-4 rounded-xl font-bold transition-all bg-black hover:bg-gray-800 text-white shadow-lg"
            >
              <Download className="w-4 h-4" />
              {t('downloadCv')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

export default About;
