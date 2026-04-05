import type { ResumeFormData } from '../types';

type ExperienceStepProps = {
  value: ResumeFormData['experience'];
  onChange: (experience: ResumeFormData['experience']) => void;
  error?: string;
};

const LEVELS = ['Fresher', 'Junior', 'Mid-Level', 'Senior'] as const;

export function ExperienceStep({ value, onChange, error }: ExperienceStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-slate-700">Select your experience level</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {LEVELS.map((level) => {
          const active = value === level;
          return (
            <button
              type="button"
              key={level}
              onClick={() => onChange(level)}
              className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-300/40'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-700'
              }`}
            >
              {level}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
