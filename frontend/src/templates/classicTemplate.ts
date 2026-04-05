import type { ResumeData } from '../types/resume';

export const classicTemplate = {
  id: 'classic',
  name: 'Classic ATS',
  description: 'Single-column layout with standard section headings.',
  render: (resume: ResumeData): string => `
${resume.name}
${resume.title}
${[resume.location, resume.email, resume.phone, ...(resume.links ?? [])]
    .filter(Boolean)
    .join(' • ')}

SUMMARY
${resume.summary}

EXPERIENCE
${resume.experience
  .map(
    (item) => `${item.role} — ${item.company} (${item.dateRange})\n${item.bullets
      .map((bullet) => `- ${bullet}`)
      .join('\n')}`,
  )
  .join('\n\n')}

SKILLS
${resume.skills.join(' • ')}

EDUCATION
${resume.education
  .map(
    (item) => `${item.school} — ${item.degree} (${item.dateRange})\n${item.bullets
      .map((bullet) => `- ${bullet}`)
      .join('\n')}`,
  )
  .join('\n\n')}

PROJECTS
${resume.projects
  .map(
    (item) => `${item.name}${item.link ? ` (${item.link})` : ''}\n${item.bullets
      .map((bullet) => `- ${bullet}`)
      .join('\n')}`,
  )
  .join('\n\n')}`.trim(),
};
