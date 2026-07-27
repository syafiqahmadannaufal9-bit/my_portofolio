import React from 'react';
import { Mail, MessageSquare, ArrowUp, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export default function ContactFooter() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Email', href: 'mailto:contact@sukiman.dev', icon: Mail, isMail: true },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: LinkedinIcon },
    { name: 'GitHub', href: 'https://github.com', icon: GithubIcon },
    { name: 'WhatsApp', href: 'https://wa.me/6281234567890', icon: MessageSquare },
  ];

  return (
    <footer
      id="contact"
      className="relative pt-24 pb-12 px-6 border-t z-10 backdrop-blur-md bg-white/80 border-black/20 text-black"
    >
      <div className="max-w-5xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl border text-center relative overflow-hidden mb-16 shadow-2xl backdrop-blur-xl bg-black/90 text-white border-black">
          <h2 className="text-xs uppercase tracking-widest font-bold mb-3 opacity-75">Mari Bekerja Sama</h2>
          <h3 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight">
            Tertarik Membangun Proyek Impian Anda?
          </h3>
          <p className="max-w-xl mx-auto text-sm sm:text-base opacity-80 mb-8 leading-relaxed">
            Apakah Anda mencari developer untuk melamar pekerjaan full-time atau membutuhkan jasa freelance web 3D interaktif, saya siap membantu!
          </p>
          <a
            href="mailto:contact@sukiman.dev"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-extrabold text-base transition-all transform hover:scale-105 bg-white hover:bg-gray-100 text-black"
          >
            <Send className="w-5 h-5" />
            Kirim Pesan Email
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mb-16 relative z-20">
          {socialLinks.map((link, idx) => {
            const IconComp = link.icon;
            return (
              <a
                key={idx}
                href={link.href}
                target={link.isMail ? '_self' : '_blank'}
                rel={link.isMail ? undefined : 'noopener noreferrer'}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold text-sm transition-all hover:-translate-y-1 bg-gray-50/90 border-black/20 text-black hover:border-black"
              >
                <IconComp className="w-4 h-4" />
                {link.name}
              </a>
            );
          })}
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold opacity-75 relative z-20">
          <p>© {currentYear} SukiMAn. All Rights Reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black/20 text-black transition-all hover:opacity-100"
          >
            Kembali ke Atas
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
