'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Fixed coordinates & timings to avoid Next.js SSR hydration mismatches with Math.random()
const PARTICLES = [
  { left: '12%', top: '25%', duration: 4.2, delay: 0.5 },
  { left: '85%', top: '15%', duration: 5.1, delay: 1.2 },
  { left: '45%', top: '70%', duration: 3.8, delay: 0.2 },
  { left: '70%', top: '80%', duration: 6.0, delay: 1.8 },
  { left: '25%', top: '40%', duration: 4.5, delay: 0.8 },
  { left: '90%', top: '60%', duration: 5.5, delay: 1.5 },
  { left: '15%', top: '85%', duration: 3.5, delay: 0.3 },
  { left: '60%', top: '20%', duration: 4.8, delay: 1.1 },
  { left: '35%', top: '90%', duration: 5.8, delay: 0.7 },
  { left: '80%', top: '35%', duration: 4.0, delay: 1.4 },
  { left: '05%', top: '50%', duration: 5.2, delay: 0.1 },
  { left: '50%', top: '10%', duration: 3.9, delay: 1.7 },
  { left: '75%', top: '95%', duration: 6.2, delay: 0.6 },
  { left: '30%', top: '15%', duration: 4.1, delay: 1.0 },
  { left: '65%', top: '55%', duration: 5.4, delay: 0.4 },
  { left: '95%', top: '80%', duration: 3.7, delay: 1.9 },
  { left: '20%', top: '65%', duration: 4.9, delay: 1.3 },
  { left: '40%', top: '30%', duration: 5.7, delay: 0.9 },
  { left: '55%', top: '85%', duration: 4.3, delay: 1.6 },
  { left: '10%', top: '05%', duration: 5.0, delay: 0.0 },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#030306]" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-200 h-200 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,212,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-0 right-1/4 w-150 h-150 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,217,181,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 w-125 h-125 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,212,0.08) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#00F5D4] rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            opacity: 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}