'use client';

import React from 'react';
import { Mail, ArrowDown } from 'lucide-react';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
  resumeUrl?: string;
}

const STACK = ['Next.js', 'TypeScript', 'Appwrite', 'Java', 'C#', 'SQL'];

export default function HeroSection({ scrollToSection, resumeUrl }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="min-h-screen relative flex items-center justify-center px-6 pt-24 pb-20 bg-black text-white"
    >
      <div className="max-w-4xl mx-auto text-center z-10">
        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F5D4]/30 bg-[#00F5D4]/10 mb-8">
          <span className="h-2 w-2 rounded-full bg-[#00F5D4]" />
          <span className="text-xs md:text-sm font-medium text-[#00F5D4]">
            Open to junior roles and internships · Johannesburg
          </span>
        </div>

        {/* Name label (span, so the intro paragraph below is the first <p> on the page) */}
        <span className="block text-sm md:text-base font-semibold tracking-widest uppercase text-gray-400 mb-4">
          Katlego Sebona · Junior Full-Stack Developer
        </span>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
          I build <span className="text-[#00F5D4]">web and Android apps</span> for healthcare and
          community organisations.
        </h1>

        {/* Answer capsule */}
        <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
          I&apos;m Katlego Sebona, a junior full-stack developer in Johannesburg. I build web
          and Android apps for healthcare and community organisations with Next.js,
          TypeScript, Appwrite and Java, and I&apos;m open to junior roles and internships.
        </p>

        {/* Stack */}
        <ul className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {STACK.map((tech) => (
            <li
              key={tech}
              className="px-3 py-1 rounded-full text-xs sm:text-sm text-gray-300 bg-gray-900/70 border border-gray-800"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => scrollToSection('projects')}
            className="px-8 py-3.5 rounded-full bg-[#00F5D4] text-black font-semibold hover:bg-[#00D9B5] transition-colors cursor-pointer text-base"
          >
            See live projects
          </button>

          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full border border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-white font-medium transition-colors text-base"
            >
              Download CV
            </a>
          ) : (
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3.5 rounded-full border border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-white font-medium transition-colors cursor-pointer text-base"
            >
              Get in touch
            </button>
          )}
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-4 text-gray-400">
          <a
            href="https://github.com/TheAffiliate"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-full bg-gray-900/80 border border-gray-800 hover:border-[#00F5D4]/40 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/katlegothatguy"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-full bg-gray-900/80 border border-gray-800 hover:border-[#00F5D4]/40 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon />
          </a>
          <button
            onClick={() => scrollToSection('contact')}
            className="p-3.5 rounded-full bg-gray-900/80 border border-gray-800 hover:border-[#00F5D4]/40 hover:text-white transition-colors cursor-pointer"
            aria-label="Contact me by email"
          >
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection('projects')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs tracking-widest text-gray-500 hover:text-white transition-colors cursor-pointer"
        aria-label="Scroll to projects"
      >
        <span>SCROLL</span>
        <ArrowDown className="w-4 h-4" />
      </button>
    </section>
  );
}