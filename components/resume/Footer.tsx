'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUp, FileText } from 'lucide-react';

interface FooterProps {
  scrollToSection: (sectionId: string) => void;
  resumeUrl?: string;
}

export default function Footer({ scrollToSection, resumeUrl }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-6 border-t border-gray-800">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-[#00F5D4]/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright & Resume Link */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <span>© {currentYear} Katlego Sebona.</span>
              <span className="hidden sm:inline">Crafted with</span>
              <Heart className="w-4 h-4 text-[#00F5D4] hidden sm:inline" />
              <span className="hidden sm:inline">and lots of passion.</span>
            </div>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00F5D4] transition-colors flex items-center gap-1.5 text-xs border border-gray-800 px-3 py-1 rounded-full hover:border-[#00F5D4]/40 bg-gray-900/40"
              >
                <FileText className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span>View CV</span>
              </a>
            )}
          </div>

          {/* Back to top button */}
          <motion.button
            onClick={() => scrollToSection('hero')}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 text-gray-400 hover:border-[#00F5D4] hover:text-[#00F5D4] transition-all duration-300 cursor-pointer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">Back to top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}