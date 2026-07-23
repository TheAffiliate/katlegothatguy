'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Settings,
  Briefcase,
  Code,
  Wrench,
  Activity,
  Lock,
  Image as ImageIcon,
  X,
  CheckCircle,
  Upload,
  Mail,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
  featured: boolean;
}

export interface SkillCategory {
  id?: string;
  category: string;
  items: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface AdminSettings {
  resume_url: string;
  admin_password: string;
  job_available: boolean;
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  messages: ContactMessage[];
}

function CustomSwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#00F5D4]' : 'bg-gray-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0 bg-gray-400'
        }`}
      />
    </button>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AdminSettings>({
    resume_url: '',
    admin_password: 'admin123',
    job_available: true,
    experience: [],
    projects: [],
    skills: [],
    messages: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    async function loadSupabaseData() {
      try {
        // 1. Fetch Portfolio Settings
        const { data: settingsData } = await supabase
          .from('portfolio_settings')
          .select('*')
          .eq('id', 1)
          .single();

        // 2. Fetch Experiences
        const { data: expData } = await supabase
          .from('experiences')
          .select('*')
          .order('sort_order', { ascending: true });

        // 3. Fetch Projects
        const { data: projData } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });

        // 4. Fetch Skills
        const { data: skillData } = await supabase
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true });

        // 5. Fetch Contact Messages
        const { data: msgData } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false });

        setSettings({
          resume_url: settingsData?.resume_url || '',
          admin_password: settingsData?.admin_password || 'admin123',
          job_available: settingsData?.job_available ?? true,
          experience: expData || [],
          projects: projData || [],
          skills: skillData || [],
          messages: msgData || [],
        });
      } catch (error) {
        console.error('Error fetching Supabase data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSupabaseData();
  }, [router]);

  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (!error) {
      setSettings((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg.id !== id),
      }));
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    setIsUploadingResume(true);
    try {
      const fileName = `resume-${Date.now()}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      setSettings(prev => ({ ...prev, resume_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume. Check console for details.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await supabase.from('portfolio_settings').upsert({
        id: 1,
        resume_url: settings.resume_url,
        admin_password: settings.admin_password,
        job_available: settings.job_available,
        updated_at: new Date().toISOString(),
      });

      localStorage.setItem('admin_password', settings.admin_password);

      await supabase.from('experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (settings.experience.length > 0) {
        const formattedExp = settings.experience.map((exp, idx) => ({
          title: exp.title,
          company: exp.company,
          location: exp.location,
          period: exp.period,
          current: exp.current,
          description: exp.description,
          achievements: exp.achievements,
          technologies: exp.technologies,
          sort_order: idx,
        }));
        await supabase.from('experiences').insert(formattedExp);
      }

      await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (settings.projects.length > 0) {
        const formattedProj = settings.projects.map((proj, idx) => ({
          title: proj.title,
          description: proj.description,
          image: proj.image,
          tags: proj.tags,
          github: proj.github,
          live: proj.live,
          featured: proj.featured,
          sort_order: idx,
        }));
        await supabase.from('projects').insert(formattedProj);
      }

      await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (settings.skills.length > 0) {
        const formattedSkills = settings.skills.map((skill, idx) => ({
          category: skill.category,
          items: skill.items,
          sort_order: idx,
        }));
        await supabase.from('skills').insert(formattedSkills);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings to Supabase:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addExperience = () => {
    setSettings((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: '',
          company: '',
          location: '',
          period: '',
          current: false,
          description: '',
          achievements: [],
          technologies: [],
        },
      ],
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: unknown) => {
    setSettings((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setSettings((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: '',
          description: '',
          image: '',
          tags: [],
          github: '',
          live: '',
          featured: false,
        },
      ],
    }));
  };

  const updateProject = (index: number, field: keyof Project, value: unknown) => {
    setSettings((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateProject(index, 'image', e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    setSettings((prev) => ({
      ...prev,
      skills: [...prev.skills, { category: '', items: [] }],
    }));
  };

  const updateSkill = (index: number, field: keyof SkillCategory, value: unknown) => {
    setSettings((prev) => {
      const updated = [...prev.skills];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, skills: updated };
    });
  };

  const removeSkill = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030306] flex items-center justify-center">
        <div className="text-white">Loading portfolio configuration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030306] text-white py-20 px-6 relative">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[#030306]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00F5D4]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D9B5]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-[#00F5D4]" />
            <h1 className="text-4xl md:text-5xl font-bold">Portfolio Settings</h1>
          </div>
          <p className="text-gray-400 text-lg">Manage your live database configuration via Supabase</p>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-gray-900/60 border border-gray-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-[#00F5D4]" />
            <h2 className="text-2xl font-bold">Security</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 font-medium mb-2 block">Admin Password</label>
              <input
                type="text"
                value={settings.admin_password}
                onChange={(e) => setSettings({ ...settings, admin_password: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00F5D4] focus:outline-none h-12 rounded-xl px-4 text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Messages Inbox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-gray-900/60 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#00F5D4]" />
              <h2 className="text-2xl font-bold">Client Messages</h2>
            </div>
            <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">
              {settings.messages.length} Total
            </span>
          </div>

          <div className="space-y-4">
            {settings.messages.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No messages received yet.</p>
            ) : (
              settings.messages.map((msg) => (
                <div key={msg.id} className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold">{msg.name}</h3>
                      <a href={`mailto:${msg.email}`} className="text-sm text-[#00F5D4] hover:underline">
                        {msg.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm bg-gray-900/40 p-4 rounded-xl border border-gray-800/50">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Resume URL & File Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-gray-900/60 border border-gray-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-[#00F5D4]" />
            <h2 className="text-2xl font-bold">Resume</h2>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResumeUpload}
                disabled={isUploadingResume}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              />
              <div className={`flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl transition-colors ${isUploadingResume ? 'border-[#00F5D4] bg-[#00F5D4]/5' : 'border-gray-700 bg-gray-800/30 hover:border-[#00F5D4]/50'}`}>
                <Upload className={`w-8 h-8 mb-3 ${isUploadingResume ? 'text-[#00F5D4] animate-bounce' : 'text-gray-400'}`} />
                <span className="text-white font-medium">
                  {isUploadingResume ? 'Uploading...' : 'Upload Your Resume'}
                </span>
                <span className="text-sm text-gray-500 mt-1">PDF files only</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 font-medium mb-2 block">Resume URL</label>
              <input
                type="url"
                placeholder="https://example.com/your-resume.pdf"
                value={settings.resume_url}
                onChange={(e) => setSettings({ ...settings, resume_url: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00F5D4] focus:outline-none h-12 rounded-xl px-4 text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Job Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-gray-900/60 border border-gray-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-[#00F5D4]" />
            <h2 className="text-2xl font-bold">Availability Status</h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
            <div>
              <p className="text-white font-medium mb-1">Currently Available for Work</p>
              <p className="text-sm text-gray-400">Show availability badge on contact section</p>
            </div>
            <CustomSwitch
              checked={settings.job_available}
              onCheckedChange={(checked) => setSettings({ ...settings, job_available: checked })}
            />
          </div>
        </motion.div>

        {/* Work Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-gray-900/60 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-[#00F5D4]" />
              <h2 className="text-2xl font-bold">Work Experience</h2>
            </div>
            <button
              onClick={addExperience}
              className="bg-[#00F5D4] hover:bg-[#00D9B5] text-black px-4 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              + Add
            </button>
          </div>

          <div className="space-y-6">
            {settings.experience.map((exp, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">Experience #{index + 1}</h3>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    className="bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                  />
                  <input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                  />
                  <input
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                    className="bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                  />
                  <input
                    placeholder="Period (e.g. Jan 2020 - Dec 2022)"
                    value={exp.period}
                    onChange={(e) => updateExperience(index, 'period', e.target.value)}
                    className="bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/50">
                  <CustomSwitch
                    checked={exp.current || false}
                    onCheckedChange={(checked) => updateExperience(index, 'current', checked)}
                  />
                  <span className="text-sm text-gray-300">Currently working here</span>
                </div>

                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-[#00F5D4]"
                />

                <input
                  placeholder="Achievements (comma-separated)"
                  value={exp.achievements?.join(', ') || ''}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      'achievements',
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                  className="w-full bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                />

                <input
                  placeholder="Technologies (comma-separated)"
                  value={exp.technologies?.join(', ') || ''}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      'technologies',
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                  className="w-full bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-gray-900/60 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Code className="w-6 h-6 text-[#00F5D4]" />
              <h2 className="text-2xl font-bold">Projects</h2>
            </div>
            <button
              onClick={addProject}
              className="bg-[#00F5D4] hover:bg-[#00D9B5] text-black px-4 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              + Add
            </button>
          </div>

          <div className="space-y-6">
            {settings.projects.map((project, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">Project #{index + 1}</h3>
                  <button
                    onClick={() => removeProject(index)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <input
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e) => updateProject(index, 'title', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                />

                <textarea
                  placeholder="Description"
                  value={project.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-[#00F5D4]"
                />

                <div className="space-y-3">
                  <label className="text-sm text-gray-400 font-medium">Project Image</label>
                  {project.image ? (
                    <div className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt="Project preview"
                        className="w-full h-48 object-cover rounded-xl border border-gray-700"
                      />
                      <button
                        onClick={() => updateProject(index, 'image', '')}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-[#00F5D4]/50 transition-colors bg-gray-800/30">
                      <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(index, file);
                        }}
                      />
                    </label>
                  )}
                  <input
                    placeholder="Or paste image URL"
                    value={project.image || ''}
                    onChange={(e) => updateProject(index, 'image', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                  />
                </div>

                <input
                  placeholder="Tags (comma-separated)"
                  value={project.tags?.join(', ') || ''}
                  onChange={(e) =>
                    updateProject(
                      index,
                      'tags',
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                  className="w-full bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="GitHub URL"
                    value={project.github}
                    onChange={(e) => updateProject(index, 'github', e.target.value)}
                    className="bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                  />
                  <input
                    placeholder="Live Demo URL"
                    value={project.live}
                    onChange={(e) => updateProject(index, 'live', e.target.value)}
                    className="bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <CustomSwitch
                    checked={project.featured}
                    onCheckedChange={(checked) => updateProject(index, 'featured', checked)}
                  />
                  <span className="text-sm text-gray-400">Featured Project</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-gray-900/60 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Wrench className="w-6 h-6 text-[#00F5D4]" />
              <h2 className="text-2xl font-bold">Skills & Technologies</h2>
            </div>
            <button
              onClick={addSkill}
              className="bg-[#00F5D4] hover:bg-[#00D9B5] text-black px-4 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              + Add Category
            </button>
          </div>

          <div className="space-y-6">
            {settings.skills.map((skill, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">Category #{index + 1}</h3>
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <input
                  placeholder="Category Name (e.g. Frontend)"
                  value={skill.category}
                  onChange={(e) => updateSkill(index, 'category', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                />

                <input
                  placeholder="Skills (comma-separated)"
                  value={skill.items?.join(', ') || ''}
                  onChange={(e) =>
                    updateSkill(
                      index,
                      'items',
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                  className="w-full bg-gray-800/50 border border-gray-700 text-white h-10 rounded-xl px-4 text-sm"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 sticky bottom-6 z-20"
        >
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-[#00F5D4] hover:bg-[#00D9B5] text-black font-semibold h-14 rounded-xl text-lg transition-colors disabled:opacity-50 cursor-pointer shadow-lg"
          >
            {isSaving ? 'Saving to Database...' : 'Save All Settings'}
          </button>

          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-green-400 bg-gray-900/90 border border-green-500/30 px-4 py-3 rounded-xl"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium text-sm">Saved to Supabase!</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}