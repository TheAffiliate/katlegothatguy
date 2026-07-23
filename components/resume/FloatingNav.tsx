'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import AdminPasswordDialog from '@/components/AdminPasswordDialog';

interface FloatingNavProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function FloatingNav({ activeSection, scrollToSection }: FloatingNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Nav */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block transition-all duration-300 ${
          isScrolled ? 'top-4' : 'top-6'
        }`}
      >
        <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-gray-900/80 backdrop-blur-xl border border-gray-800">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 cursor-pointer ${
                activeSection === item.id
                  ? 'text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-0 bg-[#00F5D4] rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.nav>

      {/* Mobile Nav Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 md:hidden p-3 rounded-full bg-gray-900/80 backdrop-blur-xl border border-gray-800 text-white cursor-pointer"
        aria-label="Toggle Navigation Menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-4 top-20 z-40 md:hidden"
          >
            <div className="p-4 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-gray-800 space-y-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeSection === item.id
                      ? 'bg-[#00F5D4] text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo / Admin Trigger */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => setShowAdminDialog(true)}
        className="fixed top-6 left-6 z-50 text-xl font-bold text-white hover:text-[#00F5D4] transition-colors cursor-pointer"
        title="Admin Access"
      >
        <span className="text-[#00F5D4]">K</span>S
      </motion.button>

      {/* Admin Modal */}
      {typeof AdminPasswordDialog !== 'undefined' && (
        <AdminPasswordDialog 
          isOpen={showAdminDialog} 
          onClose={() => setShowAdminDialog(false)} 
        />
      )}
    </>
  );
}