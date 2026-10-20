'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2 } from 'lucide-react';

export interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
  current?: boolean;
}

interface TimelineItemProps {
  experience: Experience;
  index: number;
  isInView: boolean;
}

interface ExperienceSectionProps {
  experiences?: Experience[];
}

function TimelineItem({ experience, index, isInView }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative pl-8 md:pl-0"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 z-10">
        <div
          className={`w-4 h-4 rounded-full border-4 ${
            experience.current
              ? 'bg-[#00F5D4] border-[#00F5D4]/30 shadow-[0_0_20px_rgba(0,245,212,0.5)]'
              : 'bg-gray-800 border-gray-700'
          }`}
        />
      </div>

      {/* Content card */}
      <div
        className={`md:w-[calc(50%-40px)] ${
          index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
        }`}
      >
        <div className="group relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-linear-to-r from-[#00F5D4]/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-6 md:p-8 rounded-3xl bg-gray-900/60 border border-gray-800 hover:border-[#00F5D4]/30 transition-all duration-300 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                    experience.current
                      ? 'bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {experience.period}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {experience.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span>{experience.company}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm">{experience.location}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-6 leading-relaxed">
              {experience.description}
            </p>

            {/* Achievements */}
            <div className="space-y-2 mb-6">
              {experience.achievements.map((achievement, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] mt-2 shrink-0" />
                  <span className="text-sm text-gray-400">{achievement}</span>
                </div>
              ))}
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-xs bg-gray-800/80 text-gray-300 border border-gray-700 hover:border-[#00F5D4]/50 hover:text-[#00F5D4] transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection({ experiences = [] }: ExperienceSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-[#00F5D4] text-sm font-medium tracking-widest uppercase mb-4 block">
            Career Path
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Work Experience
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            My professional journey building impactful applications and growing as a developer
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-[#00F5D4]/50 via-gray-800 to-transparent" />

          {/* Experience items */}
          <div className="space-y-12 md:space-y-24">
            {experiences.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                No work experience added yet.
              </div>
            ) : (
              experiences.map((experience, index) => (
                <TimelineItem
                  key={`${experience.company}-${index}`}
                  experience={experience}
                  index={index}
                  isInView={isInView}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}