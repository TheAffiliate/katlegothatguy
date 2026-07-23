'use client';

import React, { useRef, useState, useSyncExternalStore } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle, Loader2, ArrowUpRight } from 'lucide-react';

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

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface AvailabilityCardProps {
  isInView: boolean;
  jobAvailable?: boolean;
}

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getJobAvailableSnapshot = () => {
  return localStorage.getItem('job_available');
};

const getServerSnapshot = () => null;

function AvailabilityCard({ isInView, jobAvailable }: AvailabilityCardProps) {
  const jobAvailableRaw = useSyncExternalStore(
    subscribe,
    getJobAvailableSnapshot,
    getServerSnapshot
  );

  // Use the passed prop if available, otherwise fallback to localStorage / default
  const isAvailable = jobAvailable !== undefined ? jobAvailable : jobAvailableRaw !== 'false';

  if (!isAvailable) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="p-6 rounded-2xl bg-linear-to-br from-[#00F5D4]/10 to-transparent border border-[#00F5D4]/20"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
        </span>
        <span className="text-white font-medium">Currently Available</span>
      </div>
      <p className="text-gray-400 text-sm">
        Open to full-time opportunities, freelance projects, and interesting collaborations.
      </p>
    </motion.div>
  );
}

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'Kcs888gp@gmail.com',
    href: 'mailto:Kcs888gp@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Johannesburg, South Africa',
    href: '#',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '(064) 670-0111',
    href: 'tel:+27646700111',
  },
];

const socialLinks = [
  { icon: GithubIcon, label: 'GitHub', href: 'https://github.com/TheAffiliate' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/katlegothatguy' },
];

interface ContactSectionProps {
  jobAvailable?: boolean;
}

export default function ContactSection({ jobAvailable }: ContactSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Contact submit error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-[#00F5D4] text-sm font-medium tracking-widest uppercase mb-4 block">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Let&apos;s Work Together
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Info cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-[#00F5D4]/30 hover:bg-gray-900/70 transition-all duration-300"
                >
                  <div className="p-3 rounded-xl bg-[#00F5D4]/10 group-hover:bg-[#00F5D4]/20 transition-colors">
                    <item.icon className="w-5 h-5 text-[#00F5D4]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-white font-medium group-hover:text-[#00F5D4] transition-colors">
                      {item.value}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-[#00F5D4] ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                </motion.a>
              ))}
            </div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-6 border-t border-gray-800"
            >
              <p className="text-sm text-gray-500 mb-4">Follow me on</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-gray-400 hover:border-[#00F5D4]/30 hover:text-[#00F5D4] hover:bg-[#00F5D4]/5 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Availability */}
            <AvailabilityCard isInView={isInView} jobAvailable={jobAvailable} />
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-linear-to-r from-[#00F5D4]/10 via-transparent to-[#00F5D4]/10 rounded-3xl blur-xl" />

              <form
                onSubmit={handleSubmit}
                className="relative p-8 md:p-10 rounded-3xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00F5D4] focus:outline-none focus:ring-1 focus:ring-[#00F5D4]/20 h-12 rounded-xl transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00F5D4] focus:outline-none focus:ring-1 focus:ring-[#00F5D4]/20 h-12 rounded-xl transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium">Message</label>
                  <textarea
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full p-4 bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00F5D4] focus:outline-none focus:ring-1 focus:ring-[#00F5D4]/20 rounded-xl resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-[#00F5D4] hover:bg-[#00D9B5] text-black font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,245,212,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>

                {status === 'error' && (
                  <p className="text-red-400 text-sm text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}