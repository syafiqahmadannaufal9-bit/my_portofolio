import React from 'react';
import ReactMarkdown from 'react-markdown';
import { X, ExternalLink, Layers, Calendar } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  const { title, summary, category, techStack, thumbnail, gallery, demoUrl, githubUrl, date } = project.frontmatter;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />

      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border overflow-y-auto shadow-2xl z-10 bg-white border-black text-black">
        <button
          onClick={onClose}
          aria-label="Tutup Modal"
          className="absolute top-4 right-4 p-2.5 rounded-full border z-20 transition-all hover:rotate-90 bg-white border-black text-black hover:bg-black hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <span className="absolute bottom-4 left-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black text-white">
            {category}
          </span>
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">{title}</h3>
            {date && (
              <span className="flex items-center gap-1.5 text-xs font-semibold opacity-75">
                <Calendar className="w-4 h-4" />
                {date}
              </span>
            )}
          </div>

          <p className="text-base font-medium mb-6 text-gray-700">{summary}</p>

          {techStack && techStack.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs uppercase tracking-widest font-bold mb-3 opacity-60 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Teknologi Digunakan
              </h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg text-xs font-bold border bg-gray-100 border-black/20 text-black">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="prose max-w-none text-sm sm:text-base leading-relaxed mb-8 border-t pt-6 border-gray-200 text-gray-700">
            <ReactMarkdown>{project.content}</ReactMarkdown>
          </div>

          {gallery && gallery.length > 1 && (
            <div className="mb-8">
              <h4 className="text-xs uppercase tracking-widest font-bold mb-3 opacity-60">Galeri Tampilan</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gallery.map((img, gIdx) => (
                  <img key={gIdx} src={img} alt={`${title} screenshot ${gIdx + 1}`} className="w-full h-44 object-cover rounded-xl border border-current/10" />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6">
            {demoUrl && (
              <a href={demoUrl} target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all bg-black hover:bg-gray-900 text-white"
              >
                <ExternalLink className="w-4 h-4" />
                Lihat Live Demo
              </a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 border transition-all border-black bg-white hover:bg-black hover:text-white text-black"
              >
                <GithubIcon className="w-4 h-4" />
                Repository GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
