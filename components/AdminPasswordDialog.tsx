'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPasswordDialog({ isOpen, onClose }: AdminPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const router = useRouter();

  // Reset form state during render when `isOpen` changes to true
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setPassword('');
      setError('');
      setIsResetting(false);
      setResetSent(false);
    }
  }

  const handleClose = () => {
    setPassword('');
    setError('');
    setIsResetting(false);
    setResetSent(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const storedPassword = localStorage.getItem('admin_password') || 'admin123';

    if (password === storedPassword) {
      localStorage.setItem('admin_authenticated', 'true');
      handleClose();
      router.push('/admin');
    } else {
      setError('Incorrect password');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      setResetSent(true);
      setTimeout(() => {
        setIsResetting(false);
        setResetSent(false);
        setResetEmail('');
      }, 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError('Failed to send reset email: ' + errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md z-10"
        >
          <div className="p-8 rounded-3xl bg-gray-900/95 border border-gray-800 backdrop-blur-xl relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isResetting ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-[#00F5D4]/10">
                    <Lock className="w-6 h-6 text-[#00F5D4]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Admin Access</h2>
                    <p className="text-sm text-gray-400">Enter password to continue</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00F5D4] focus:outline-none focus:ring-1 focus:ring-[#00F5D4]/20 h-12 rounded-xl pl-4 pr-12 text-sm transition-colors"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <button
                    type="submit"
                    className="w-full bg-[#00F5D4] hover:bg-[#00D9B5] text-black font-semibold h-12 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,245,212,0.3)] cursor-pointer"
                  >
                    Access Admin
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsResetting(true)}
                    className="w-full text-sm text-gray-400 hover:text-[#00F5D4] transition-colors cursor-pointer mt-2"
                  >
                    Forgot password?
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-[#00F5D4]/10">
                    <Lock className="w-6 h-6 text-[#00F5D4]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                    <p className="text-sm text-gray-400">We&apos;ll email you your password</p>
                  </div>
                </div>

                {!resetSent ? (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 font-medium mb-2 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Your email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00F5D4] focus:outline-none focus:ring-1 focus:ring-[#00F5D4]/20 h-12 rounded-xl px-4 text-sm transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Leave empty to use your registered email
                      </p>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                      type="submit"
                      className="w-full bg-[#00F5D4] hover:bg-[#00D9B5] text-black font-semibold h-12 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,245,212,0.3)] cursor-pointer"
                    >
                      Send Password
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsResetting(false)}
                      className="w-full text-sm text-gray-400 hover:text-[#00F5D4] transition-colors cursor-pointer mt-2"
                    >
                      Back to login
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-green-400 mb-2 font-medium">✓ Password sent to your email!</p>
                    <p className="text-sm text-gray-400">Check your inbox</p>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}