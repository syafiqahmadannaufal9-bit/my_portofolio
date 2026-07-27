# SOFTWARE REQUIREMENTS SPECIFICATION
=====================================
**Project**     : Website Portofolio Pribadi
**Version**     : 1.0
**Prepared by** : SRS-Architect AI
**Date**        : 26 Juli 2026
**Stack**       : Vite + React 18 (JavaScript) + Tailwind CSS + styled-components
=====================================

## Revision History

| Name | Date | Reason for Change | Version |
|------|------|-------------------|---------|
| SRS-Architect AI | 26 Juli 2026 | Draft Awal | 1.0 |

---

## 1. Introduction

### 1.1 Purpose
Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional untuk pembangunan **Website Portofolio Pribadi** berbasis **Vite + React (JavaScript)**. Dokumen ini ditujukan untuk pemilik situs (sebagai product owner sekaligus developer) dan pihak lain yang mungkin membantu pengembangan (developer freelance, kolaborator). Situs ini dirancang khusus untuk mendukung dua tujuan utama: **melamar pekerjaan** dan **menarik klien freelance**.

### 1.2 Document Conventions
- **SHALL** = kebutuhan wajib (mandatory)
- **SHOULD** = direkomendasikan (recommended)
- **MAY** = opsional / kandidat pengembangan masa depan
- Format ID kebutuhan: `REQ-[MODULE]-[NNN]`

### 1.3 Intended Audience and Reading Suggestions
| Peran | Fokus Bacaan |
|---|---|
| Pemilik Situs / Product Owner | Bagian 1, 2, 6 |
| Frontend Developer | Bagian 3, 4, 5, Bonus Section |
| UI/UX Designer | Bagian 2.2–2.3, 4.1, Appendix B |
| QA / Reviewer | Bagian 3 (functional req), 5 (NFR) |

### 1.4 Project Scope
Situs ini adalah **single-page application (SPA) statis** yang menampilkan profil profesional pemilik: hero/perkenalan, tentang saya, keahlian, pengalaman kerja, portofolio proyek, dan kontak. Situs **tidak mencakup**: sistem login/admin dashboard, backend/API kustom, database, form kontak fungsional (pengiriman pesan), maupun fitur e-commerce/pembayaran. Konten dikelola langsung oleh pemilik melalui file **Markdown** di dalam repository dan diperbarui melalui proses build & redeploy.

### 1.5 References
- Dokumentasi resmi Vite: https://vite.dev
- Dokumentasi resmi React: https://react.dev
- Dokumentasi Tailwind CSS: https://tailwindcss.com
- Dokumentasi styled-components: https://styled-components.com
- Dokumentasi GSAP: https://gsap.com
- Dokumentasi Framer Motion: https://motion.dev

---

## 2. Overall Description

### 2.1 Product Perspective
Situs ini berdiri sendiri (**standalone**), tidak menggantikan atau terintegrasi dengan sistem lain. Arsitektur bersifat **JAMstack**: seluruh konten di-*build* menjadi berkas statis (HTML/CSS/JS) dan disajikan langsung dari CDN Vercel, tanpa server backend yang berjalan terus-menerus.

### 2.2 Product Features (Summary)
1. Navigasi Single-Page dengan Smooth Scroll
2. Hero / Landing Section
3. About Me
4. Skills Showcase
5. Experience Timeline
6. Portfolio / Project Gallery
7. Contact & Footer (gabungan)
8. Animasi & Micro-interaction (GSAP/Framer Motion)
9. Manajemen Konten berbasis Markdown

### 2.3 User Classes and Characteristics
| Kelas Pengguna | Proficiency | Frekuensi | Tugas Utama |
|---|---|---|---|
| Recruiter / HR | Umum (non-teknis s/d teknis) | Sekali kunjungan (saat proses rekrutmen) | Menilai kualifikasi & portofolio kandidat |
| Klien Freelance Potensial | Umum | Sekali–beberapa kali kunjungan | Menilai kredibilitas & hasil kerja sebelumnya |
| Pengunjung Umum (developer lain, dsb.) | Teknis | Jarang | Melihat proyek, terinspirasi, networking |
| Pemilik Situs | Teknis (developer) | Berkala (saat update konten) | Mengedit file markdown, build, dan deploy ulang |

### 2.4 Operating Environment
- Node.js **18.x LTS atau lebih baru** (untuk proses build)
- Vite **5.x** atau lebih baru
- React **18.x**
- Tidak ada database, tidak ada server backend (situs statis penuh)
- Browser: 2 versi terakhir dari Chrome, Firefox, Safari, Edge
- Responsive minimum lebar **320px** (mobile kecil) hingga desktop besar

### 2.5 Design and Implementation Constraints
- Styling: **Tailwind CSS** untuk utility/layout umum + **styled-components** untuk komponen dinamis/kompleks (mis. kartu proyek dengan style bergantung pada props)
- Animasi: **GSAP** (dengan plugin ScrollTrigger) dan/atau **Framer Motion**
- Konten (About, Skills, Experience, Portfolio) bersumber dari file **Markdown**, bukan dari CMS atau database
- Tidak ada autentikasi/login karena tidak ada panel admin
- Tidak ada form kontak fungsional — sesuai keputusan proyek, bagian kontak hanya berisi tautan langsung (email, LinkedIn, GitHub, dll.)
- Navigasi: single-page dengan scroll (anchor-based), bukan multi-route

### 2.6 User Documentation
- `README.md` di repository: instruksi instalasi, menjalankan dev server, build, dan deploy
- Panduan singkat cara menambah/mengedit konten (project baru, pengalaman baru) melalui file markdown

### 2.7 Assumptions and Dependencies
Karena beberapa hal belum ditentukan secara eksplisit oleh pemilik situs, asumsi berikut digunakan dalam dokumen ini (lihat juga Appendix C — Issues List):
- Situs menggunakan **satu bahasa utama** (dapat berupa Bahasa Indonesia atau Inggris); dukungan dwi-bahasa **tidak** termasuk dalam scope v1.0 kecuali dikonfirmasi kemudian.
- Bagian Contact hanya menampilkan informasi kontak & tautan eksternal (mailto, profil sosial/profesional), **bukan** form pengiriman pesan.
- Tidak ada rencana integrasi analytics pada v1.0 (dicatat sebagai open issue).
- Skema warna, tipografi, dan identitas visual (branding) akan ditentukan pada tahap desain UI, di luar cakupan dokumen ini.
- Gambar proyek & foto profil disiapkan sendiri oleh pemilik situs (bukan bagian dari scope pengembangan).

---

## 3. System Features

### 3.1 Navigasi (NAV)

#### 3.1.1 Description and Priority
Navbar sticky yang memungkinkan pengunjung berpindah antar-section dengan smooth scroll, serta menyorot section yang sedang aktif.
**Priority**: High

#### 3.1.2 Stimulus/Response Sequences
1. Pengunjung membuka situs → Navbar tampil sticky di bagian atas.
2. Pengunjung klik salah satu item menu → halaman melakukan smooth scroll ke section terkait.
3. Saat pengunjung scroll manual, sistem menyorot menu sesuai section yang sedang terlihat di viewport.
4. Pada layar mobile, navbar berubah menjadi hamburger menu yang dapat dibuka/tutup.

#### 3.1.3 Functional Requirements
```
REQ-NAV-001: The system SHALL provide a sticky navigation bar with links to all main sections (Home, About, Skills, Experience, Portfolio, Contact).
  - Validation: Setiap link mengarah ke id section yang valid dan tersedia di DOM.
  - Error handling: Jika elemen target belum ter-render, scroll ditunda hingga elemen tersedia.
  - Edge cases: Resize viewport dari mobile ke desktop saat menu terbuka.

REQ-NAV-002: The system SHALL smoothly scroll to the target section when a navigation link is clicked, without full page reload.

REQ-NAV-003: The system SHOULD highlight the navigation item corresponding to the section currently in viewport (scroll-spy behavior).

REQ-NAV-004: The system SHALL collapse the navigation bar into a hamburger menu on viewport width ≤ 768px.
  - Edge case: Menu otomatis tertutup setelah pengunjung memilih salah satu link pada tampilan mobile.
```

---

### 3.2 Hero / Landing (HERO)

#### 3.2.1 Description and Priority
Kesan pertama situs: nama, tagline profesional, pernyataan singkat, dan call-to-action menuju Portfolio atau Contact.
**Priority**: High

#### 3.2.2 Stimulus/Response Sequences
1. Pengunjung membuka situs → Hero section tampil dengan animasi masuk (entrance animation).
2. Pengunjung klik tombol CTA → sistem scroll ke section Portfolio atau Contact.

#### 3.2.3 Functional Requirements
```
REQ-HERO-001: The system SHALL display the owner's name, professional title/tagline, and a short introductory statement in the hero section.

REQ-HERO-002: The system SHALL provide at least one call-to-action button in the hero section that navigates to the Portfolio or Contact section.

REQ-HERO-003: The system SHOULD play an entrance animation (fade-in / slide-in) on initial page load using GSAP or Framer Motion.
  - Edge case: Animasi SHALL disederhanakan atau dinonaktifkan jika pengunjung mengaktifkan preferensi sistem "prefers-reduced-motion".
```

---

### 3.3 About Me (ABOUT)

#### 3.3.1 Description and Priority
Menampilkan biografi singkat, ringkasan karier, dan foto profil, bersumber dari file markdown.
**Priority**: High

#### 3.3.2 Stimulus/Response Sequences
1. Sistem memuat file `about.md` saat build.
2. Konten (teks, foto, ringkasan) dirender ke dalam section About.

#### 3.3.3 Functional Requirements
```
REQ-ABOUT-001: The system SHALL render the About section content (biography, career summary, profile photo) from a Markdown source file.
  - Validation: File markdown harus memiliki frontmatter minimal (judul, path foto).
  - Error handling: Jika file gagal di-parse saat build, proses build SHALL gagal dengan pesan error yang jelas (bukan menampilkan halaman rusak di production).

REQ-ABOUT-002: The system SHOULD provide a downloadable CV/resume link (PDF) within the About section.
```

---

### 3.4 Skills (SKILL)

#### 3.4.1 Description and Priority
Menampilkan daftar keahlian teknis, dikelompokkan per kategori, dengan indikasi visual level penguasaan.
**Priority**: High

#### 3.4.2 Stimulus/Response Sequences
1. Sistem memuat data skill dari markdown/data file terstruktur.
2. Saat section terlihat di viewport, item skill animasi masuk (staggered reveal).

#### 3.4.3 Functional Requirements
```
REQ-SKILL-001: The system SHALL display a list of skills grouped by category (e.g., Frontend, Backend, Tools/Others), sourced from a Markdown or structured content file.

REQ-SKILL-002: The system SHOULD visually indicate proficiency level per skill (e.g., progress bar atau badge level) dengan animasi reveal saat section masuk viewport.

REQ-SKILL-003: The system MAY display a technology icon for each skill entry.
```

---

### 3.5 Experience (EXP)

#### 3.5.1 Description and Priority
Timeline kronologis pengalaman kerja/freelance, penting untuk kredibilitas di mata recruiter.
**Priority**: High

#### 3.5.2 Stimulus/Response Sequences
1. Sistem memuat entri pengalaman dari kumpulan file markdown.
2. Entri diurutkan berdasarkan tanggal, terbaru di atas.
3. Saat pengunjung scroll, setiap entri timeline animasi masuk satu per satu.

#### 3.5.3 Functional Requirements
```
REQ-EXP-001: The system SHALL display a chronological timeline of work/freelance experience, each entry sourced from a Markdown file containing role, company/client, period, and description.

REQ-EXP-002: The system SHALL sort experience entries by date in descending order (terbaru terlebih dahulu).
  - Edge case: Entri tanpa tanggal akhir (masih berjalan) SHALL ditampilkan dengan label "Sekarang" / "Present".

REQ-EXP-003: The system SHOULD animate each timeline entry into view as the user scrolls, menggunakan GSAP ScrollTrigger atau Framer Motion.
```

---

### 3.6 Portfolio / Project Gallery (PORT)

#### 3.6.1 Description and Priority
Fitur inti situs — galeri proyek yang menjadi bukti kemampuan nyata bagi recruiter dan klien freelance.
**Priority**: High

#### 3.6.2 Stimulus/Response Sequences
1. Sistem memuat daftar proyek dari kumpulan file markdown (satu file per proyek).
2. Proyek ditampilkan dalam grid/gallery dengan thumbnail.
3. Pengunjung klik salah satu kartu proyek → sistem menampilkan detail proyek (modal atau expand inline): deskripsi lengkap, tech stack, galeri gambar, tautan demo/repo.

#### 3.6.3 Functional Requirements
```
REQ-PORT-001: The system SHALL display a grid/gallery of projects, each sourced from an individual Markdown file containing title, description, tech stack, thumbnail image, and links (live demo / GitHub repository).

REQ-PORT-002: The system SHOULD allow visitors to filter projects by category or technology tag.

REQ-PORT-003: The system SHALL show full project detail (title, description, tech stack, image gallery, external links) via modal or inline expansion when a project card is clicked.
  - Error handling: Jika link demo atau repo kosong/tidak valid, tombol terkait SHALL disembunyikan, bukan ditampilkan sebagai link rusak.

REQ-PORT-004: The system SHOULD animate project cards with hover and/or scroll-triggered effects using GSAP or Framer Motion.
```

---

### 3.7 Contact & Footer (CONTACT)

#### 3.7.1 Description and Priority
Bagian kontak sekaligus footer situs, berisi cara menghubungi pemilik secara langsung tanpa form.
**Priority**: Medium

#### 3.7.2 Stimulus/Response Sequences
1. Pengunjung scroll/klik menu Contact → section kontak & footer tampil.
2. Pengunjung klik ikon/tautan (email, LinkedIn, GitHub, dsb.) → tautan terbuka sesuai konteks (mailto: membuka aplikasi email, tautan sosial membuka tab baru).

#### 3.7.3 Functional Requirements
```
REQ-CONTACT-001: The system SHALL display contact information (email address and/or professional/social links such as LinkedIn, GitHub, WhatsApp) within a combined Contact & Footer section.
  - Note: Tidak ada form pengiriman pesan pada v1.0, sesuai keputusan proyek.

REQ-CONTACT-002: The system SHALL open the email link using a "mailto:" scheme, and open social/professional links in a new browser tab.

REQ-CONTACT-003: The system MAY display a dynamically generated copyright notice with the current year in the footer.
```

---

### 3.8 Animasi & Interaksi (ANIM)

#### 3.8.1 Description and Priority
Lapisan animasi lintas-section menggunakan GSAP/Framer Motion untuk memperkuat kesan profesional dan modern.
**Priority**: Medium

#### 3.8.2 Stimulus/Response Sequences
1. Pengunjung scroll ke section tertentu → elemen di dalamnya animasi masuk (fade/slide/stagger).
2. Pengunjung hover pada elemen interaktif (kartu proyek, tombol) → efek transisi halus muncul.

#### 3.8.3 Functional Requirements
```
REQ-ANIM-001: The system SHALL implement scroll-triggered entrance animations for each major section using GSAP (ScrollTrigger) and/or Framer Motion.

REQ-ANIM-002: The system SHOULD respect the visitor's OS-level "prefers-reduced-motion" setting by disabling or simplifying non-essential animations.

REQ-ANIM-003: The system SHOULD ensure animation libraries do not block or delay perceived initial page load (misalnya via lazy-loading/inisialisasi animasi setelah konten kritikal tampil).
```

---

### 3.9 Manajemen Konten via Markdown (CONTENT)

#### 3.9.1 Description and Priority
Fondasi teknis yang memungkinkan pemilik situs memperbarui konten tanpa menyentuh kode komponen.
**Priority**: High

#### 3.9.2 Stimulus/Response Sequences
1. Pemilik situs menambah/mengedit file markdown di folder `content/`.
2. Pemilik situs menjalankan proses build (`npm run build`) dan deploy ulang ke Vercel.
3. Sistem mem-parsing seluruh file markdown terkait saat build dan merender kontennya ke komponen React yang sesuai.

#### 3.9.3 Functional Requirements
```
REQ-CONTENT-001: The system SHALL load and render structured content (About, Skills, Experience, Portfolio items) from Markdown files at build time using a markdown-processing library (e.g., gray-matter untuk frontmatter + remark/react-markdown untuk rendering).

REQ-CONTENT-002: The system SHALL organize markdown content files in a predictable directory structure (e.g., `/content/projects/*.md`, `/content/experience/*.md`) untuk memudahkan penambahan konten di masa depan.

REQ-CONTENT-003: The system SHOULD validate required frontmatter fields (mis. title, date) saat build, dan menggagalkan proses build dengan pesan error yang jelas apabila field wajib tidak ada.
```

---

## 4. External Interface Requirements

### 4.1 User Interfaces
- Styling utama: **Tailwind CSS** (layout, spacing, responsive utilities) dikombinasikan dengan **styled-components** untuk komponen yang membutuhkan style dinamis berbasis props/state
- Breakpoints responsif: mobile (≤768px), tablet (769–1024px), desktop (>1024px)
- Aksesibilitas: minimum **WCAG 2.1 AA** (kontras warna, alt text pada gambar, navigasi keyboard)
- Loading state (skeleton/placeholder) untuk gambar proyek yang belum termuat

### 4.2 Hardware Interfaces
Tidak ada. Situs adalah aplikasi web statis tanpa integrasi perangkat keras khusus.

### 4.3 Software Interfaces
| Kebutuhan | Library/Layanan yang Direkomendasikan |
|---|---|
| Markdown parsing (frontmatter) | `gray-matter` |
| Markdown rendering | `react-markdown` atau `remark` |
| Animasi scroll kompleks | `gsap` (+ plugin `ScrollTrigger`) |
| Animasi komponen React | `framer-motion` |
| CSS-in-JS untuk komponen dinamis | `styled-components` |
| Utility styling | `tailwindcss`, `postcss`, `autoprefixer` |
| Ikon skill/sosial media (opsional) | `react-icons` |
| Deployment & hosting | **Vercel** (CI/CD otomatis dari Git) |

### 4.4 Communications Interfaces
- Protokol: **HTTPS** (disediakan otomatis oleh Vercel)
- Tidak ada API backend kustom — seluruh data konten sudah tergabung (bundled) ke dalam berkas statis saat proses build

---

## 5. Nonfunctional Requirements

### 5.1 Performance Requirements
- Waktu muat halaman (Largest Contentful Paint) **≤ 2 detik** pada koneksi 4G standar
- Skor **Lighthouse Performance ≥ 90**
- Gambar proyek dioptimasi (format WebP/AVIF) dan menggunakan lazy loading
- Ukuran bundle diminimalkan melalui code-splitting bawaan Vite

### 5.2 Safety Requirements
- Source code dan konten markdown dikelola melalui version control (Git/GitHub) sebagai bentuk backup
- Situs SHALL tetap menampilkan konten inti (teks, gambar) secara terbaca meskipun animasi/JS tambahan gagal dimuat (graceful degradation)

### 5.3 Security Requirements
```
REQ-SEC-001: The system SHALL serve the entire site over HTTPS (enforced automatically by Vercel).

REQ-SEC-002: The system SHALL sanitize any HTML rendered from Markdown content to prevent XSS injection melalui file konten.

REQ-SEC-003: The system SHALL NOT expose sensitive credentials or API keys di dalam client-side bundle; tidak ada secret yang di-commit ke repository.

REQ-SEC-004: The system SHOULD set appropriate security headers (Content-Security-Policy, X-Content-Type-Options) melalui konfigurasi Vercel.

REQ-SEC-005: All external links (sosial media, profil) yang dibuka di tab baru SHALL menggunakan atribut `rel="noopener noreferrer"`.
```

### 5.4 Software Quality Attributes
- **Maintainability**: struktur komponen modular per section; konsistensi kode dijaga dengan ESLint + Prettier
- **Testability**: opsional — dapat ditambahkan React Testing Library untuk komponen kritikal (mis. filter Portfolio)
- **Portability**: dapat dijalankan di Node.js 18+/20+ pada Windows/macOS/Linux tanpa dependensi OS khusus
- **Reliability**: ketersediaan situs bergantung pada SLA hosting Vercel (>99.9%)

---

## 6. Other Requirements

- **SEO**: Setiap section/halaman detail proyek SHALL memiliki meta tag yang sesuai (title, description, Open Graph) agar mudah ditemukan recruiter/klien melalui pencarian dan preview media sosial.
- **Localization**: Bahasa utama situs perlu dikonfirmasi (lihat Appendix C — Issue #1); dukungan dwi-bahasa tidak termasuk scope v1.0.
- **Format Tanggal**: Tanggal pada Experience & Portfolio SHALL menggunakan format konsisten (mis. "Mmm YYYY", contoh: "Jan 2025").
- **Version Control**: Seluruh source code dan file konten markdown dikelola melalui Git (GitHub), dengan riwayat commit yang jelas per pembaruan konten.

---

## Appendix A — Glossary

| Istilah | Definisi |
|---|---|
| Pengunjung | Siapapun yang mengakses situs portofolio |
| Recruiter/HR | Pengunjung dengan tujuan mengevaluasi kandidat kerja |
| Klien Freelance | Pengunjung dengan tujuan mempertimbangkan jasa freelance |
| Frontmatter | Metadata terstruktur (format YAML) di awal file Markdown |
| SPA | Single Page Application |
| JAMstack | Arsitektur web berbasis JavaScript, API, dan Markup yang di-generate statis (tanpa server backend aktif) |
| Scroll-spy | Perilaku UI yang menyorot menu navigasi sesuai section aktif saat scroll |

---

## Appendix B — Analysis Models

Diagram berikut direkomendasikan untuk dibuat pada tahap desain (dapat dibuatkan oleh SRS-Architect atas permintaan):

1. **Content Structure Diagram** — pengganti ERD karena situs tidak memiliki database; menggambarkan relasi antara file markdown, komponen React, dan section.
2. **Use Case Diagram** — interaksi pengunjung (Recruiter, Klien, Pengunjung Umum) dengan fitur situs.
3. **User Flow Diagram** — alur pengunjung dari Hero → eksplorasi (About/Skills/Experience) → Portfolio → Contact/CTA.
4. **Sitemap / Wireframe** — urutan section pada single-page layout beserta breakpoint responsif.

---

## Appendix C — Issues List (TBD)

| # | Issue | Owner | Status |
|---|-------|-------|--------|
| 1 | Bahasa utama situs (Indonesia, Inggris, atau dwi-bahasa) belum dikonfirmasi | Pemilik Situs | Open |
| 2 | Kebutuhan analytics (mis. Google Analytics, Plausible, Vercel Analytics) belum ditentukan | Pemilik Situs | Open |
| 3 | Skema warna & identitas visual (brand color, tipografi) belum ditentukan | Pemilik Situs | Open |
| 4 | Domain kustom (custom domain) untuk deployment Vercel belum ditentukan | Pemilik Situs | Open |

---

## 💡 React + Vite Implementation Notes (Bonus Section)

### Suggested Component Structure
```
src/
├── components/
│   ├── Navbar/
│   ├── Hero/
│   ├── About/
│   ├── Skills/
│   ├── Experience/
│   ├── Portfolio/
│   │   ├── ProjectCard.jsx
│   │   └── ProjectModal.jsx
│   ├── Contact/
│   └── Footer/
├── content/                  ← sumber markdown
│   ├── about.md
│   ├── experience/
│   │   └── *.md
│   └── projects/
│       └── *.md
├── hooks/
│   └── useScrollSpy.js
├── utils/
│   └── markdown.js           ← helper parsing frontmatter/markdown
├── styles/
│   ├── tailwind.css
│   └── theme.js               ← theme untuk styled-components
└── assets/
    └── images/
```

### Recommended npm Packages
Hanya paket yang relevan dan aktif dipelihara (real, maintained packages):
- `framer-motion` — animasi deklaratif berbasis komponen React
- `gsap` — animasi scroll-triggered kompleks (plugin `ScrollTrigger`)
- `gray-matter` — parsing frontmatter dari file Markdown
- `react-markdown` — rendering konten Markdown ke JSX dengan aman
- `styled-components` — CSS-in-JS untuk komponen dinamis
- `tailwindcss`, `postcss`, `autoprefixer` — utility styling
- `react-icons` (opsional) — ikon skill & sosial media
- `react-scroll` (opsional) — alternatif smooth-scroll berbasis komponen, jika tidak memakai native `scrollIntoView`

### Vite Config Notes
- Gunakan plugin `@vitejs/plugin-react` (default template React + Vite)
- Import file markdown dapat memanfaatkan Vite's `import.meta.glob` untuk memuat seluruh file di folder `content/projects/*.md` maupun `content/experience/*.md` secara dinamis saat build

### Key Commands untuk Proyek Ini
```bash
npm create vite@latest nama-portofolio -- --template react
cd nama-portofolio
npm install
npm install framer-motion gsap gray-matter react-markdown styled-components
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

npm run dev        # development server
npm run build       # build production (output ke /dist)
npm run preview     # preview hasil build secara lokal

# Deploy ke Vercel (setelah repository terhubung di dashboard Vercel):
# Push ke branch utama → Vercel otomatis build & deploy
```

---

✅ **SRS selesai disusun.**

Apakah Anda ingin saya lanjutkan dengan:
- 📊 Content Structure Diagram (pengganti ERD, karena tanpa database)
- 📐 Use Case Diagram
- 🔄 User Flow Diagram untuk alur pengunjung (Hero → Portfolio → Contact)
- 📋 Project task breakdown / sprint planning
- 🗂️ Struktur folder React + Vite yang lebih detail (per komponen)
