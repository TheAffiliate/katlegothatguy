import { supabase } from '@/lib/supabaseClient';
import PortfolioPage from '@/components/resume/PortfolioPage';
import type { Project } from '@/lib/types';

export type {
  Experience,
  Project,
  SkillCategory,
  PortfolioSettings,
} from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [exp, proj, skill, sett] = await Promise.all([
    supabase.from('experiences').select('*').order('sort_order', { ascending: true }),
    supabase.from('projects').select('*').order('sort_order', { ascending: true }),
    supabase.from('skills').select('*').order('sort_order', { ascending: true }),
    supabase.from('portfolio_settings').select('*').eq('id', 1).single(),
  ]);

  const projectList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects by Katlego Sebona',
    itemListElement: (proj.data ?? []).map((p: Project, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareSourceCode',
        name: p.title,
        description: p.description,
        url: p.live || undefined,
        codeRepository: p.github || undefined,
        programmingLanguage: p.tags,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectList).replace(/</g, '\\u003c'),
        }}
      />
      <PortfolioPage
        experiences={exp.data ?? []}
        projects={proj.data ?? []}
        skills={skill.data ?? []}
        settings={sett.data ?? null}
      />
    </>
  );
}