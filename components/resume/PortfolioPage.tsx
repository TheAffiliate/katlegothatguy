'use client';

import { useState, useEffect, useCallback } from 'react';
import AnimatedBackground from '@/components/resume/AnimatedBackground';
import FloatingNav from '@/components/resume/FloatingNav';
import HeroSection from '@/components/resume/HeroSection';
import AboutSection from '@/components/resume/AboutSection';
import ExperienceSection from '@/components/resume/ExperienceSection';
import SkillsSection from '@/components/resume/SkillsSection';
import ProjectsSection from '@/components/resume/ProjectsSection';
import ContactSection from '@/components/resume/ContactSection';
import Footer from '@/components/resume/Footer';
import type {
  Experience,
  Project,
  SkillCategory,
  PortfolioSettings,
} from '@/lib/types';

interface Props {
  experiences: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  settings: PortfolioSettings | null;
}

const SECTIONS = ['hero', 'projects', 'skills', 'about', 'experience', 'contact'];

export default function PortfolioPage({ experiences, projects, skills, settings }: Props) {
  const [activeSection, setActiveSection] = useState<string>('hero');

  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const section of SECTIONS) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030306] text-white overflow-x-hidden">
      <AnimatedBackground />
      <FloatingNav activeSection={activeSection} scrollToSection={scrollToSection} />

      <main>
        <HeroSection scrollToSection={scrollToSection} resumeUrl={settings?.resume_url} />
        <ProjectsSection projects={projects} />
        <SkillsSection skills={skills} />
        <AboutSection jobAvailable={settings?.job_available} resumeUrl={settings?.resume_url} />
        <ExperienceSection experiences={experiences} />
        <ContactSection jobAvailable={settings?.job_available} />
      </main>

      <Footer scrollToSection={scrollToSection} resumeUrl={settings?.resume_url} />
    </div>
  );
}