import React, { useState, memo } from 'react';
import styled from 'styled-components';
import skillsData from '../content/skills.json';
import { Code2, FileCode, Palette, Layout, Box, Cpu, Sparkles, Zap, GitBranch, Layers, Globe } from 'lucide-react';
import { FigmaIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

const ICON_MAP = {
  Code2, FileCode, Palette, Layout, Box, Cpu, Sparkles, Zap, GitBranch, Layers, Globe, Figma: FigmaIcon
};

const StyledCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #000000;
  padding: 1.25rem;
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    border-color: #5227FF;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.75rem;

  & > div {
    height: 100%;
    width: ${props => props.$level}%;
    background: #5227FF;
    border-radius: 9999px;
    transition: width 1s ease-out;
  }
`;

const Skills = memo(function Skills() {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, `skills.${key}`);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...skillsData.map(c => c.category)];
  const filteredCategories = selectedCategory === 'All'
    ? skillsData
    : skillsData.filter(c => c.category === selectedCategory);

  return (
    <section
      id="skills"
      className="min-h-[100vh] py-24 pl-8 pr-6 md:pl-16 md:pr-12 lg:pl-24 lg:pr-20 md:w-1/2 flex flex-col justify-center z-10 text-black"
    >
      <div className="w-full text-left max-w-xl mx-auto md:mx-0">
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-widest font-bold mb-2 text-[#5227FF] opacity-90">{t('subtitle')}</h2>
          <h3 className="text-4xl sm:text-5xl font-black text-[#5227FF]">{t('title')}</h3>
          <p className="mt-3 text-base text-gray-800">
            {t('desc')}
          </p>
          <div className="w-16 h-1 mt-4 rounded-full bg-[#5227FF]" />
        </div>

        <div className="space-y-10">
          {filteredCategories.map((group, gIdx) => (
            <div key={gIdx}>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-black">
                <span className="w-2 h-2 rounded-full bg-[#5227FF]" />
                {group.category}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.skills.map((skill, sIdx) => {
                  const IconComp = ICON_MAP[skill.icon] || Code2;
                  return (
                    <StyledCard key={sIdx}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#5227FF]/10 text-[#5227FF]">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-sm">{skill.name}</span>
                        </div>
                        <span className="text-xs font-black opacity-80">{skill.level}%</span>
                      </div>
                      <ProgressBar $level={skill.level}><div /></ProgressBar>
                    </StyledCard>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Skills;