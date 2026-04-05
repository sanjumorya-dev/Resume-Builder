import { useMemo, useState } from 'react';
import type { ResumeFormData } from '../types';

type SkillsStepProps = {
  selectedSkills: ResumeFormData['skills'];
  profile: ResumeFormData['profile'];
  onChange: (skills: string[]) => void;
};

const SUGGESTIONS: Record<string, string[]> = {
  'Software Developer': ['React', 'TypeScript', 'Node.js', 'REST APIs', 'Git'],
  'Data Analyst': ['Python', 'SQL', 'Power BI', 'Tableau', 'Statistics'],
  'Product Manager': ['Roadmapping', 'Stakeholder Management', 'A/B Testing', 'Agile', 'Prioritization'],
  'UI/UX Designer': ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
  'Cybersecurity Analyst': ['SIEM', 'Threat Modeling', 'Incident Response', 'Risk Assessment', 'IAM'],
};

export function SkillsStep({ selectedSkills, profile, onChange }: SkillsStepProps) {
  const [customSkill, setCustomSkill] = useState('');

  const suggestions = useMemo(() => SUGGESTIONS[profile] ?? ['Communication', 'Problem Solving', 'Teamwork'], [profile]);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (selectedSkills.some((existing) => existing.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...selectedSkills, trimmed]);
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  const submitCustomSkill = () => {
    addSkill(customSkill);
    setCustomSkill('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700">AI-suggested skills</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((skill) => (
            <button
              type="button"
              key={skill}
              onClick={() => addSkill(skill)}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700">Selected skills</h3>
        <div className="mt-3 flex min-h-10 flex-wrap gap-2 rounded-lg border border-dashed border-slate-300 p-3">
          {selectedSkills.length === 0 ? (
            <p className="text-xs text-slate-500">No skills selected yet.</p>
          ) : (
            selectedSkills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="rounded-full bg-white/20 px-1 hover:bg-white/35">
                  ×
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={customSkill}
          onChange={(event) => setCustomSkill(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submitCustomSkill();
            }
          }}
          placeholder="Add custom skill"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <button
          type="button"
          onClick={submitCustomSkill}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Add Skill
        </button>
      </div>
    </div>
  );
}
