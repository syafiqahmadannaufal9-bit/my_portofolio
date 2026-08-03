import React, { useRef } from 'react';
import { StaggeredMenu } from './StaggeredMenu';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function Navbar() {
  const menuRef = useRef(null);

  // ponytail: onClick closes menu + smooth scrolls to section
  const menuItems = [
    { label: 'Home',      link: '#home',      ariaLabel: 'Ke halaman Home',      onClick: (e) => { e.preventDefault(); scrollTo('home'); } },
    { label: 'About',     link: '#about',     ariaLabel: 'Ke halaman About',     onClick: (e) => { e.preventDefault(); scrollTo('about'); } },
    { label: 'Skills',    link: '#skills',    ariaLabel: 'Ke halaman Skills',    onClick: (e) => { e.preventDefault(); scrollTo('skills'); } },
    { label: 'Portfolio', link: '#portfolio', ariaLabel: 'Ke halaman Portfolio', onClick: (e) => { e.preventDefault(); scrollTo('portfolio'); } },
    { label: 'Contact',   link: '#contact',   ariaLabel: 'Ke halaman Contact',   onClick: (e) => { e.preventDefault(); scrollTo('contact'); } },
  ];

  const socialItems = [
    { label: 'GitHub',    link: 'https://github.com/syafiqahmadannaufal9-bit' },
    { label: 'LinkedIn',  link: 'https://linkedin.com' },
    { label: 'WhatsApp',  link: 'https://wa.me/082121825192' },
    { label: 'Email',     link: 'mailto:syafiqahmadannuafal9@gmail.com' },
  ];

  return (
    <StaggeredMenu
      ref={menuRef}
      isFixed
      position="right"
      logoText={<><span style={{ color: '#5227FF' }}>Web</span> Dev</>}
      colors={['#c8c8c8', '#1a1a1a']}
      items={menuItems}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering
      menuButtonColor="#000"
      openMenuButtonColor="#000"
      accentColor="#5227FF"
      changeMenuColorOnOpen={false}
    />
  );
}
