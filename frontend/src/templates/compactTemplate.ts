import type { ResumeData } from '../types/resume';

export const compactTemplate = {
  id: 'compact',
  name: 'Compact ATS',
  description: 'Dense, plain-text-focused format with clear semantic labels.',
  render: (resume: ResumeData): string => `
${resume.name.toUpperCase()}
${resume.title}
${[resume.email, resume.phone, resume.location, ...(resume.links ?? [])]
  .filter(Boolean)
  .join(' | ')}

PROFILE
${resume.summary}

PROFESSIONAL EXPERIENCE
${resume.experience
  .map(
    (item) => `${item.role}, ${item.company} | ${item.dateRange}\n${item.bullets
      .map((bullet) => `• ${bullet}`)
      .join('\n')}`,
  )
  .join('\n\n')}

CORE SKILLS
${resume.skills.join(', ')}

EDUCATION
${resume.education
  .map(
    (item) => `${item.degree}, ${item.school} | ${item.dateRange}\n${item.bullets
      .map((bullet) => `• ${bullet}`)
      .join('\n')}`,
  )
  .join('\n\n')}

PROJECT HIGHLIGHTS
${resume.projects
  .map(
    (item) => `${item.name}${item.link ? ` | ${item.link}` : ''}\n${item.bullets
      .map((bullet) => `• ${bullet}`)
      .join('\n')}`,
  )
  .join('\n\n')}`.trim(),
};
