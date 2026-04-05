import type { ResumeFormData } from '../types';

type ProfileStepProps = {
  value: ResumeFormData['profile'];
  onChange: (profile: ResumeFormData['profile']) => void;
  error?: string;
};

const PROFILE_OPTIONS = [
  'Software Developer',
  'Data Analyst',
  'Product Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'Cybersecurity Analyst',
];

export function ProfileStep({ value, onChange, error }: ProfileStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="profile" className="mb-2 block text-sm font-semibold text-slate-700">
          Choose your target profile
        </label>
        <select
          id="profile"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="">Select a profile</option>
          {PROFILE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
