'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Calendar, Sparkles, Code2, Lightbulb, Users, Download } from 'lucide-react';

interface DownloadResumeButtonProps {
  isInView: boolean;
  resumeUrl?: string;
}

function DownloadResumeButton({ isInView, resumeUrl }: DownloadResumeButtonProps) {
  const handleDownload = () => {
    // Use the passed resumeUrl prop, fallback to default path if undefined
    const url = resumeUrl || '/Katlego_Sebona_CV.pdf';
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Resume file is not available currently.');
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 1 }}
      onClick={handleDownload}
      className="w-full p-4 rounded-2xl border border-gray-800 bg-gray-900/30 text-white font-medium hover:border-[#00F5D4] hover:bg-[#00F5D4]/5 hover:text-[#00F5D4] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
    >
      <Download className="w-4 h-4" />
      <span>Download Resume</span>
      <span className="group-hover:translate-x-1 transition-transform">→</span>
    </motion.button>
  );
}

interface AboutSectionProps {
  jobAvailable?: boolean;
  resumeUrl?: string;
}

export default function AboutSection({ resumeUrl }: AboutSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: '1+', label: 'Years Experience' },
    { value: '7+', label: 'Projects Completed' },
    { value: '2+', label: 'Happy Clients' },
    { value: '95%', label: 'Client Satisfaction' },
  ];

  const highlights = [
    { icon: Code2, text: 'Clean, maintainable code' },
    { icon: Lightbulb, text: 'Creative problem solver' },
    { icon: Users, text: 'Team collaboration' },
  ];

  return (
    <section id="about" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="text-[#00F5D4] text-sm font-medium tracking-widest uppercase mb-4 block">
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Turning Vision Into
            <br />
            <span className="text-gray-500">Digital Reality</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Bio card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-r from-[#00F5D4]/20 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative p-8 rounded-3xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#00F5D4] to-[#00D9B5] p-0.5">
                    <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#00F5D4]">K</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Katlego Sebona</h3>
                    <p className="text-gray-400">Software Developer</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00F5D4]" />
                    Johannesburg, South Africa
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00F5D4]" />
                    Since 2020
                  </span>
                </div>

                <p className="text-gray-400 leading-relaxed mb-6">
                  I&apos;m a dedicated software developer with hands-on experience designing and 
                  implementing web and mobile applications. I specialize in React, Next.js, 
                  Kotlin, and backend technologies like Appwrite and Firebase, creating 
                  solutions that make a real impact.
                </p>

                <p className="text-gray-400 leading-relaxed">
                  From healthcare systems to community platforms, I build applications 
                  that solve real-world problems. My recent work includes clinic management 
                  systems, donation platforms, and financial monitoring dashboards.
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-2xl bg-gray-900/30 border border-gray-800 text-center group hover:border-[#00F5D4]/30 transition-colors"
                >
                  <item.icon className="w-6 h-6 text-[#00F5D4] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-gray-400">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quote */}
            <div className="p-8 rounded-3xl bg-linear-to-br from-[#00F5D4]/10 to-transparent border border-[#00F5D4]/20 relative overflow-hidden">
              <Sparkles className="w-8 h-8 text-[#00F5D4] mb-4" />
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed italic">
                &quot;Technology should solve real problems and improve lives. 
                That&apos;s what drives me to build applications that make a difference.&quot;
              </p>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#00F5D4]/10 rounded-full blur-3xl" />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 group hover:border-[#00F5D4]/30 transition-all duration-300"
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-[#00F5D4] transition-colors">
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Download CV button */}
            <DownloadResumeButton isInView={isInView} resumeUrl={resumeUrl} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}