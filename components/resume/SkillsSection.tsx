'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Database, Cloud, Terminal, Layers, LucideIcon } from 'lucide-react';

export interface DBSkillCategory {
  id?: string;
  category: string;
  items: string[];
}

export interface UISkill {
  name: string;
  level: number;
}

export interface UISkillCategory {
  title: string;
  icon: LucideIcon;
  color: string;
  skills: UISkill[];
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
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${category.color}20, transparent)` }}
      />

      <div className="relative h-full p-8 rounded-3xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all duration-300 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="p-3 rounded-2xl"
            style={{ backgroundColor: `${category.color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color: category.color }} />
          </div>
          <h3 className="text-xl font-bold text-white">{category.title}</h3>
        </div>

        {/* Skills */}
        <div className="space-y-5">
          {category.skills.map((skill, skillIndex) => (
            <div key={skill.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm font-medium">{skill.name}</span>
                <span className="text-gray-500 text-xs">{skill.level}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${category.color}, ${category.color}80)`,
                  }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.level}%` } : {}}
                  transition={{
                    duration: 1,
                    delay: index * 0.15 + skillIndex * 0.1 + 0.3,
                    ease: 'easeOut',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsSection({ skills = [] }: SkillsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Map database properties to the UI format (assigning visual colors/icons)
  const icons = [Code2, Terminal, Database, Cloud, Layers];
  const colors = ['#00F5D4', '#00D9B5', '#00BFA5', '#00A896', '#02C39A'];

  const displayCategories: UISkillCategory[] = skills.map((dbCat, index) => ({
    title: dbCat.category,
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
    skills: dbCat.items.map((item) => ({
      name: item,
      level: 80 + (item.length % 16),
    })),
  }));

  const tools = skills.flatMap((cat) => cat.items);

  return (
    <section id="skills" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="text-[#00F5D4] text-sm font-medium tracking-widest uppercase mb-4 block">
            Expertise
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Skills & Technologies
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl">
            My technical toolkit — constantly evolving through hands-on projects and continuous learning
          </p>
        </motion.div>

        {/* Skills grid */}
        {skills.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No skills added yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
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

        {/* Tools & Technologies - Only show if there are tools */}
        {tools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-linear-to-r from-[#00F5D4]/5 via-transparent to-[#00F5D4]/5 rounded-3xl" />
            <div className="relative p-8 md:p-12 rounded-3xl border border-gray-800 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8">
                <Layers className="w-6 h-6 text-[#00F5D4]" />
                <h3 className="text-xl font-bold text-white">Technologies & Frameworks</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {tools.map((tool, index) => (
                  <motion.span
                    key={`${tool}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + (index % 10) * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-5 py-2.5 rounded-full bg-gray-900/80 text-gray-300 border border-gray-700 hover:border-[#00F5D4]/50 hover:text-[#00F5D4] hover:bg-[#00F5D4]/5 transition-all duration-300 cursor-default text-sm font-medium"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}