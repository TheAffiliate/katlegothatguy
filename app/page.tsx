'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AnimatedBackground from '@/components/resume/AnimatedBackground';
import FloatingNav from '@/components/resume/FloatingNav';
import HeroSection from '@/components/resume/HeroSection';
import AboutSection from '@/components/resume/AboutSection';
import ExperienceSection from '@/components/resume/ExperienceSection';
import SkillsSection from '@/components/resume/SkillsSection';
import ProjectsSection from '@/components/resume/ProjectsSection';
import ContactSection from '@/components/resume/ContactSection';
import Footer from '@/components/resume/Footer';
import { supabase } from '@/lib/supabaseClient';

export interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
  featured: boolean;
}

export interface SkillCategory {
  id?: string;
  category: string;
  items: string[];
}

export interface PortfolioSettings {
  resume_url: string;
  job_available: boolean;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        const [
          { data: expData },
          { data: projData },
          { data: skillData },
          { data: settsData },
        ] = await Promise.all([
          supabase.from('experiences').select('*').order('sort_order', { ascending: true }),
          supabase.from('projects').select('*').order('sort_order', { ascending: true }),
          supabase.from('skills').select('*').order('sort_order', { ascending: true }),
          supabase.from('portfolio_settings').select('*').eq('id', 1).single(),
        ]);

        if (expData && expData.length > 0) setExperiences(expData);
        if (projData && projData.length > 0) setProjects(projData);
        if (skillData && skillData.length > 0) setSkills(skillData);
        if (settsData) setSettings(settsData);
      } catch (error) {
        console.error('Error fetching live data from Supabase:', error);
      }
    }

    fetchPortfolioData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030306] text-white overflow-x-hidden">
      <AnimatedBackground />
      <FloatingNav activeSection={activeSection} scrollToSection={scrollToSection} />

      <main>
        <HeroSection scrollToSection={scrollToSection} />
        <AboutSection jobAvailable={settings?.job_available} resumeUrl={settings?.resume_url} />
        <ExperienceSection experiences={experiences} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ContactSection jobAvailable={settings?.job_available} />
      </main>

      <Footer scrollToSection={scrollToSection} resumeUrl={settings?.resume_url} />
    </div>
  );
}