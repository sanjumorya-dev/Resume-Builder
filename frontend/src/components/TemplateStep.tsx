import type { ResumeFormData } from '../types';

type TemplateStepProps = {
  value: ResumeFormData['template'];
  onChange: (template: string) => void;
  error?: string;
};

const templates = [
  { id: 'modern-ats', name: 'Modern ATS', palette: 'from-slate-800 to-slate-600' },
  { id: 'classic-pro', name: 'Classic Pro', palette: 'from-indigo-700 to-indigo-500' },
  { id: 'minimal-clean', name: 'Minimal Clean', palette: 'from-emerald-700 to-emerald-500' },
];

export function TemplateStep({ value, onChange, error }: TemplateStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-slate-700">Choose an ATS-friendly template</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const active = value === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              className={`rounded-xl border p-3 text-left transition-all duration-200 ${
                active ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-300 hover:border-indigo-400'
              }`}
            >
              <div className={`h-28 rounded-lg bg-gradient-to-br ${template.palette} p-2`}>
                <div className="space-y-1 rounded bg-white/95 p-2">
                  <div className="h-2 w-2/3 rounded bg-slate-300" />
                  <div className="h-2 w-1/2 rounded bg-slate-200" />
                  <div className="mt-3 h-1.5 w-full rounded bg-slate-200" />
                  <div className="h-1.5 w-5/6 rounded bg-slate-200" />
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{template.name}</p>
              <p className="text-xs text-slate-500">ATS-ready, optimized structure</p>
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
