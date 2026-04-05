import { useMemo, useState } from 'react';
import { defaultTemplateId, resumeTemplates } from '../templates';
import type {
  EducationItem,
  ProjectItem,
  RegenerateSection,
  ResumeData,
  ResumeSectionKey,
} from '../types/resume';
import { exportAsDocx, exportAsPdf } from '../utils/exportResume';

interface ResumePreviewProps {
  generatedData: ResumeData;
  onChange?: (updated: ResumeData) => void;
  regenerateSection?: RegenerateSection;
}

const defaultRegenerateSection: RegenerateSection = async (section, currentResume) => {
  const response = await fetch(`/api/ai/resume/regenerate/${section}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume: currentResume }),
  });

  if (!response.ok) {
    throw new Error(`Unable to regenerate ${section}.`);
  }

  return response.json();
};

export const ResumePreview = ({
  generatedData,
  onChange,
  regenerateSection = defaultRegenerateSection,
}: ResumePreviewProps) => {
  const [resume, setResume] = useState<ResumeData>(generatedData);
  const [templateId, setTemplateId] = useState(defaultTemplateId);
  const [busySection, setBusySection] = useState<ResumeSectionKey | null>(null);

  const selectedTemplate = useMemo(
    () => resumeTemplates.find((template) => template.id === templateId) ?? resumeTemplates[0],
    [templateId],
  );

  const updateResume = (next: ResumeData) => {
    setResume(next);
    onChange?.(next);
  };

  const patchSection = async (section: ResumeSectionKey) => {
    setBusySection(section);
    try {
      const patch = await regenerateSection(section, resume);
      updateResume({ ...resume, ...patch });
    } finally {
      setBusySection(null);
    }
  };

  const updateListItem = <T extends { id: string }>(
    list: T[],
    id: string,
    updater: (item: T) => T,
  ): T[] => list.map((item) => (item.id === id ? updater(item) : item));

  const updateBullets = (
    section: 'experience' | 'education' | 'projects',
    itemId: string,
    bulletIndex: number,
    value: string,
  ) => {
    if (section === 'experience') {
      updateResume({
        ...resume,
        experience: updateListItem(resume.experience, itemId, (item) => ({
          ...item,
          bullets: item.bullets.map((bullet, index) => (index === bulletIndex ? value : bullet)),
        })),
      });
      return;
    }

    if (section === 'education') {
      updateResume({
        ...resume,
        education: updateListItem(resume.education, itemId, (item: EducationItem) => ({
          ...item,
          bullets: item.bullets.map((bullet, index) => (index === bulletIndex ? value : bullet)),
        })),
      });
      return;
    }

    updateResume({
      ...resume,
      projects: updateListItem(resume.projects, itemId, (item: ProjectItem) => ({
        ...item,
        bullets: item.bullets.map((bullet, index) => (index === bulletIndex ? value : bullet)),
      })),
    });
  };

  return (
    <article style={{ fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.45, maxWidth: 900 }}>
      <header>
        <h1>{resume.name}</h1>
        <p>
          <strong>{resume.title}</strong>
        </p>
        <p>{[resume.location, resume.email, resume.phone, ...(resume.links ?? [])].filter(Boolean).join(' • ')}</p>
      </header>

      <section aria-label="template-selection">
        <label htmlFor="template-picker">Template: </label>
        <select id="template-picker" value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
          {resumeTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </section>

      <section>
        <h2>Summary</h2>
        <button type="button" onClick={() => patchSection('summary')} disabled={busySection === 'summary'}>
          {busySection === 'summary' ? 'Regenerating…' : 'Regenerate'}
        </button>
        <textarea
          aria-label="summary"
          value={resume.summary}
          onChange={(event) => updateResume({ ...resume, summary: event.target.value })}
          rows={4}
          style={{ width: '100%' }}
        />
      </section>

      <section>
        <h2>Experience</h2>
        <button type="button" onClick={() => patchSection('experience')} disabled={busySection === 'experience'}>
          {busySection === 'experience' ? 'Regenerating…' : 'Regenerate'}
        </button>
        {resume.experience.map((item) => (
          <article key={item.id}>
            <h3>{item.role}</h3>
            <p>
              {item.company} | {item.dateRange}
            </p>
            <ul>
              {item.bullets.map((bullet, index) => (
                <li key={`${item.id}-exp-${index}`}>
                  <input
                    aria-label={`experience-bullet-${index}`}
                    value={bullet}
                    onChange={(event) => updateBullets('experience', item.id, index, event.target.value)}
                    style={{ width: '100%' }}
                  />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2>Skills</h2>
        <button type="button" onClick={() => patchSection('skills')} disabled={busySection === 'skills'}>
          {busySection === 'skills' ? 'Regenerating…' : 'Regenerate'}
        </button>
        <ul>
          {resume.skills.map((skill, index) => (
            <li key={`${skill}-${index}`}>
              <input
                aria-label={`skill-${index}`}
                value={skill}
                onChange={(event) => {
                  const nextSkills = [...resume.skills];
                  nextSkills[index] = event.target.value;
                  updateResume({ ...resume, skills: nextSkills });
                }}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Education</h2>
        <button type="button" onClick={() => patchSection('education')} disabled={busySection === 'education'}>
          {busySection === 'education' ? 'Regenerating…' : 'Regenerate'}
        </button>
        {resume.education.map((item) => (
          <article key={item.id}>
            <h3>{item.school}</h3>
            <p>
              {item.degree} | {item.dateRange}
            </p>
            <ul>
              {item.bullets.map((bullet, index) => (
                <li key={`${item.id}-edu-${index}`}>
                  <input
                    aria-label={`education-bullet-${index}`}
                    value={bullet}
                    onChange={(event) => updateBullets('education', item.id, index, event.target.value)}
                    style={{ width: '100%' }}
                  />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2>Projects</h2>
        <button type="button" onClick={() => patchSection('projects')} disabled={busySection === 'projects'}>
          {busySection === 'projects' ? 'Regenerating…' : 'Regenerate'}
        </button>
        {resume.projects.map((item) => (
          <article key={item.id}>
            <h3>{item.name}</h3>
            {item.link ? <p>{item.link}</p> : null}
            <ul>
              {item.bullets.map((bullet, index) => (
                <li key={`${item.id}-proj-${index}`}>
                  <input
                    aria-label={`project-bullet-${index}`}
                    value={bullet}
                    onChange={(event) => updateBullets('projects', item.id, index, event.target.value)}
                    style={{ width: '100%' }}
                  />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section aria-label="export-controls">
        <h2>Export</h2>
        <button type="button" onClick={() => exportAsPdf()}>
          Export PDF
        </button>
        <button type="button" onClick={() => exportAsDocx(resume, selectedTemplate)}>
          Export DOCX
        </button>
      </section>

      <section aria-label="ats-preview">
        <h2>ATS Plain-Text Preview</h2>
        <pre style={{ whiteSpace: 'pre-wrap', border: '1px solid #ddd', padding: 16 }}>
          {selectedTemplate.render(resume)}
        </pre>
      </section>
    </article>
  );
};
