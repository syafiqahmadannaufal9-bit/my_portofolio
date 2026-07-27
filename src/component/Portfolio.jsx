import React, { useState } from 'react';
import { loadMarkdownCollection } from '../utils/markdown';
import ProjectModal from './ProjectModal';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const rawProjectModules = import.meta.glob('../content/projects/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  });

  const projects = loadMarkdownCollection(rawProjectModules);
  const categories = ['Semua', ...new Set(projects.map(p => p.frontmatter.category).filter(Boolean))];
  const filteredProjects = selectedCategory === 'Semua'
    ? projects
    : projects.filter(p => p.frontmatter.category === selectedCategory);

  return (
    <section
      id="portfolio"
      className="min-h-[100vh] py-24 px-6 z-10 text-black"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest font-bold mb-2 opacity-60">Karya & Hasil Kerja</h2>
          <h3 className="text-4xl sm:text-5xl font-black">Galeri Portofolio</h3>
          <p className="mt-3 max-w-xl mx-auto text-base text-gray-800">
            Koleksi proyek pilihan yang menunjukkan keahlian pengembangan 3D Web, React, dan integrasi UI/UX modern.
          </p>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-black" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border backdrop-blur-md ${
                selectedCategory === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-white/80 text-gray-700 border-black/20 hover:border-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
          {filteredProjects.map((project) => {
            const { title, summary, category, thumbnail, techStack } = project.frontmatter;
            return (
              <div
                key={project.id}
                onClick={() => setActiveModalProject(project)}
                className="group rounded-3xl border overflow-hidden cursor-pointer backdrop-blur-xl transition-all duration-300 transform hover:-translate-y-2 shadow-xl flex flex-col justify-between bg-white/70 border-black/20 hover:border-black"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-gray-200">
                    <img
                      src={thumbnail}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black text-white">
                        {category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-black">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2 group-hover:underline line-clamp-1">{title}</h4>
                    <p className="text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 text-gray-800">{summary}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  {techStack && (
                    <div className="flex flex-wrap gap-1.5">
                      {techStack.slice(0, 3).map((tech, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-800">
                          {tech}
                        </span>
                      ))}
                      {techStack.length > 3 && (
                        <span className="text-[11px] opacity-60 self-center font-bold">+{techStack.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ProjectModal project={activeModalProject} onClose={() => setActiveModalProject(null)} />
    </section>
  );
}
