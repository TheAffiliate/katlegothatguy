'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Play, KeyRound, ShieldAlert } from 'lucide-react';

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
  video_url?: string | null;
  demo_login?: string | null;
  health_demo?: boolean | null;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isInView: boolean;
  hidden: boolean;
}

interface ProjectsSectionProps {
  projects?: Project[];
}

const INITIAL_VISIBLE = 6;
const ACCENTS = ['#00F5D4', '#7C9CFF', '#FFB86B', '#FF7AB6', '#A3E635'];

function ProjectCard({ project, index, isInView, hidden }: ProjectCardProps) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.08 }}
      className={`${project.featured ? 'md:col-span-2' : ''} ${hidden ? 'hidden' : ''}`}
    >
      <article
        className="group h-full flex flex-col rounded-3xl overflow-hidden bg-gray-900/60 border border-gray-800 transition-colors duration-300 hover:border-(--accent)"
        style={{ '--accent': accent } as React.CSSProperties}
      >
        {/* Image */}
        <div
          className={`relative overflow-hidden bg-gray-900 ${
            project.featured ? 'aspect-video md:aspect-21/9' : 'aspect-video'
          }`}
        >
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-6xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${accent}33, #0b0b12)`,
                color: accent,
              }}
              aria-hidden="true"
            >
              {project.title.charAt(0)}
            </div>
          )}

          {project.featured && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#00F5D4] text-black text-xs font-bold shadow-md">
              Featured
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 transition-colors group-hover:text-(--accent)">
            {project.title}
          </h3>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4">
            {project.description}
          </p>

          {project.health_demo && (
            <div className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-300/10 border border-amber-300/20 rounded-xl px-3 py-2 mb-4">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Demo only. All data is fictional, so please don&apos;t enter real personal or
                health information.
              </span>
            </div>
          )}

          {project.demo_login && (
            <div className="flex items-start gap-2 text-xs text-gray-300 bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 mb-4">
              <KeyRound className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accent }} />
              <span>
                <span className="text-gray-500">Demo login: </span>
                <code className="font-mono">{project.demo_login}</code>
              </span>
            </div>
          )}

          {project.tags && project.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs text-gray-300 border"
                  style={{ borderColor: `${accent}40`, backgroundColor: `${accent}10` }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {/* Links: always visible */}
          <div className="mt-auto flex flex-wrap items-center gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live site (opens in a new tab)`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: accent }}
              >
                <ExternalLink className="w-4 h-4" />
                Live site
              </a>
            )}
            {project.video_url && (
              <a
                href={project.video_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch a demo of ${project.title} (opens in a new tab)`}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <Play className="w-4 h-4" />
                Watch demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source code on GitHub (opens in a new tab)`}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <GithubIcon className="w-4 h-4" />
                Code
              </a>
            )}
          </div>
        </div>
      </article>
    </motion.li>
  );
}

export default function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="projects" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
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
              Projects
            </h2>
            <p className="text-gray-500 text-lg max-w-xl">
              Open the live site, watch a short demo or read the code.
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

        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No projects added yet.</div>
        ) : (
          <ul className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id ?? `${project.title}-${index}`}
                project={project}
                index={index}
                isInView={isInView}
                hidden={!showAll && index >= INITIAL_VISIBLE}
              />
            ))}
          </ul>
        )}

        {!showAll && projects.length > INITIAL_VISIBLE && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="border border-gray-700 hover:border-[#00F5D4] text-white hover:text-[#00F5D4] px-8 py-4 rounded-full transition-all duration-300 bg-transparent hover:bg-[#00F5D4]/5 font-medium cursor-pointer"
            >
              Show more projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}