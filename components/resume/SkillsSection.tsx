'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Database, Cloud, Terminal, Layers, LucideIcon } from 'lucide-react';

export interface DBSkillCategory {
  id?: string;
  category: string;
  items: string[];
}

interface UISkillCategory {
  title: string;
  icon: LucideIcon;
  color: string;
  items: string[];
}

interface SkillCardProps {
  category: UISkillCategory;
  index: number;
  isInView: boolean;
}

interface SkillsSectionProps {
  skills?: DBSkillCategory[];
}

function SkillCard({ category, index, isInView }: SkillCardProps) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div
        className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${category.color}20, transparent)` }}
      />

      <div className="relative h-full p-8 rounded-3xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl" style={{ backgroundColor: `${category.color}15` }}>
            <Icon className="w-6 h-6" style={{ color: category.color }} />
          </div>
          <h3 className="text-xl font-bold text-white">{category.title}</h3>
        </div>

        <ul className="flex flex-wrap gap-2">
          {category.items.map((item) => (
            <li
              key={item}
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 bg-gray-900/80 border border-gray-700 hover:border-[#00F5D4]/50 hover:text-[#00F5D4] transition-colors"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function SkillsSection({ skills = [] }: SkillsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const icons = [Code2, Terminal, Database, Cloud, Layers];
  const colors = ['#00F5D4', '#7C9CFF', '#FFB86B', '#FF7AB6', '#A3E635'];

  const displayCategories: UISkillCategory[] = skills.map((dbCat, index) => ({
    title: dbCat.category,
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
    items: dbCat.items ?? [],
  }));

  return (
    <section id="skills" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="text-[#00F5D4] text-sm font-medium tracking-widest uppercase mb-4 block">
            Skills
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Skills & Technologies
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl">
            Technologies I&apos;ve used in the projects above.
          </p>
        </motion.div>

        {skills.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No skills added yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {displayCategories.map((category, index) => (
              <SkillCard
                key={category.title}
                category={category}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}