import type { ResumeFormData } from '../types';

type DetailsStepProps = {
  formData: ResumeFormData;
  errors: Partial<Record<keyof ResumeFormData, string>>;
  onFieldChange: <K extends keyof ResumeFormData>(field: K, value: ResumeFormData[K]) => void;
};

type DetailFieldKey = 'education' | 'projects' | 'certifications' | 'links';

const fieldStyles =
  'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';

const textAreaFields: Array<{ key: DetailFieldKey; label: string; placeholder: string }> = [
  { key: 'education', label: 'Education', placeholder: 'B.Tech in Computer Science - ABC University (2024)' },
  { key: 'projects', label: 'Projects', placeholder: 'Project Name - impact and technologies used' },
  { key: 'certifications', label: 'Certifications', placeholder: 'AWS Cloud Practitioner, Google Data Analytics' },
  { key: 'links', label: 'Links', placeholder: 'LinkedIn, GitHub, Portfolio URL' },
];

export function DetailsStep({ formData, errors, onFieldChange }: DetailsStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Full name</label>
          <input
            value={formData.name}
            onChange={(event) => onFieldChange('name', event.target.value)}
            className={fieldStyles}
            placeholder="Jane Doe"
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
          <input
            value={formData.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
            className={fieldStyles}
            placeholder="jane@email.com"
          />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Phone number</label>
          <input
            value={formData.phone}
            onChange={(event) => onFieldChange('phone', event.target.value)}
            className={fieldStyles}
            placeholder="+1 555 123 4567"
          />
          {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
        </div>
      </div>

      {textAreaFields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
          <textarea
            value={formData[key]}
            onChange={(event) => onFieldChange(key, event.target.value)}
            className={`${fieldStyles} min-h-20`}
            placeholder={placeholder}
          />
          {errors[key] ? <p className="mt-1 text-xs text-red-600">{errors[key]}</p> : null}
        </div>
      ))}
    </div>
  );
}
