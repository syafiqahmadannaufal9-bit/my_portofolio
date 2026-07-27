import React from 'react';
import ReactMarkdown from 'react-markdown';
import { loadSingleMarkdown } from '../utils/markdown';
import aboutRaw from '../content/about.md?raw';
import { Download, Award, Briefcase, Users } from 'lucide-react';

export default function About() {
  const { frontmatter, content } = loadSingleMarkdown(aboutRaw);

  const stats = [
    { label: 'Tahun Pengalaman', value: frontmatter.experienceYears || '5+', icon: Briefcase },
    { label: 'Proyek Selesai', value: frontmatter.completedProjects || '30+', icon: Award },
    { label: 'Klien Puas', value: frontmatter.satisfiedClients || '25+', icon: Users },
  ];

  return (
    <section
      id="about"
      className="min-h-[100vh] py-24 pr-8 pl-6 md:pr-16 md:pl-12 lg:pr-24 lg:pl-20 md:w-1/2 md:ml-auto flex flex-col justify-center z-10 text-black"
    >
      <div className="w-full text-left max-w-xl mx-auto md:mx-0">
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-widest font-bold mb-2 opacity-60">
            Profil & Latar Belakang
          </h2>
          <h3 className="text-4xl sm:text-5xl font-black text-black">Tentang Saya</h3>
          <div className="w-16 h-1 mt-4 rounded-full bg-black" />
        </div>

        <div className="flex flex-col justify-center">
          <h4 className="text-xl sm:text-2xl font-bold mb-4 text-black">{frontmatter.title}</h4>

          <div className="prose max-w-none text-base leading-relaxed mb-8 text-gray-800">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border text-center transition-transform hover:-translate-y-1 backdrop-blur-md bg-white/80 border-black/20 text-black"
                >
                  <IconComponent className="w-5 h-5 mx-auto mb-2 text-black" />
                  <p className="text-xl sm:text-2xl font-black">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs font-medium opacity-75 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div>
            <a
              href={frontmatter.resumeUrl}
              download
              className="inline-flex items-center justify-center w-full sm:w-auto gap-3 px-6 py-4 rounded-xl font-bold transition-all bg-black hover:bg-gray-800 text-white shadow-lg"
            >
              <Download className="w-4 h-4" />
              Unduh CV / Resume (PDF)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
