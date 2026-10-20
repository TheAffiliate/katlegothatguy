'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string | null;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isInView: boolean;
}

interface ProjectsSectionProps {
  projects?: Project[];
}

function ProjectCard({ project, index, isInView }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative ${project.featured ? 'md:col-span-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full rounded-3xl overflow-hidden bg-gray-900/60 border border-gray-800 hover:border-[#00F5D4]/30 transition-all duration-500">
        {/* Image Container */}
        <div className={`relative overflow-hidden ${project.featured ? 'aspect-2/1' : 'aspect-4/3'}`}>
          <motion.img
            src={project.image || 'https://via.placeholder.com/800x600?text=No+Image'}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/50 to-transparent"
            animate={{ opacity: isHovered ? 0.95 : 0.7 }}
            transition={{ duration: 0.3 }}
          />

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 rounded-full bg-[#00F5D4] text-black text-xs font-bold shadow-md">
                Featured
              </span>
            </div>
          )}

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#00F5D4] transition-colors">
              {project.title}
            </h3>

            <motion.p
              className="text-gray-400 text-sm md:text-base mb-4 line-clamp-2"
              animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
              {project.description}
            </motion.p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs bg-gray-800/80 text-gray-300 border border-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  <GithubIcon className="w-4 h-4" />
                  View Code
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F5D4] text-black hover:bg-[#00D9B5] transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showAll, setShowAll] = useState(false);

  // Hide section if no projects in database
  if (!projects || projects.length === 0) {
    return null;
  }

  const visibleProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <section id="projects" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-[#00F5D4] text-sm font-medium tracking-widest uppercase mb-4 block">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-500 text-lg max-w-xl">
              A collection of projects solving real-world problems — from healthcare to community platforms
            </p>
          </div>

          <a
            href="https://github.com/TheAffiliate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#00F5D4] hover:underline underline-offset-4 font-medium group"
          >
            View all on GitHub
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={`${project.title}-${index}`}
                project={project}
                index={index}
                isInView={isInView}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Show more button */}
        {!showAll && projects.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setShowAll(true)}
              className="border border-gray-700 hover:border-[#00F5D4] text-white hover:text-[#00F5D4] px-8 py-4 rounded-full transition-all duration-300 bg-transparent hover:bg-[#00F5D4]/5 font-medium cursor-pointer"
            >
              Show More Projects
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}