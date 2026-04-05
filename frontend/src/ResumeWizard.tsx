import { useMemo, useState } from 'react';
import { DetailsStep } from './components/DetailsStep';
import { ExperienceStep } from './components/ExperienceStep';
import { ProfileStep } from './components/ProfileStep';
import { ProgressIndicator } from './components/ProgressIndicator';
import { SkillsStep } from './components/SkillsStep';
import { TemplateStep } from './components/TemplateStep';
import type { ResumeFormData } from './types';

const stepTitles = ['Profile', 'Experience', 'Skills', 'Details', 'Template'];

const initialFormData: ResumeFormData = {
  profile: '',
  experience: '',
  skills: [],
  name: '',
  email: '',
  phone: '',
  education: '',
  projects: '',
  certifications: '',
  links: '',
  template: '',
};

type FormErrors = Partial<Record<keyof ResumeFormData, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{3}\)?[\s-]?)\d{3}[\s-]?\d{4}$/;

function validate(formData: ResumeFormData): FormErrors {
  const errors: FormErrors = {};

  if (!formData.profile) errors.profile = 'Please select a target profile.';
  if (!formData.experience) errors.experience = 'Please select an experience level.';
  if (!formData.name.trim()) errors.name = 'Name is required.';

  if (!formData.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = 'Enter a valid email format.';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!phoneRegex.test(formData.phone.trim())) {
    errors.phone = 'Enter a valid US phone format.';
  }

  if (!formData.education.trim()) errors.education = 'Education details are required.';
  if (!formData.projects.trim()) errors.projects = 'At least one project detail is required.';
  if (!formData.template) errors.template = 'Please choose a template.';

  return errors;
}

export function ResumeWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ResumeFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(formData), [formData]);

  const stepFields: Array<Array<keyof ResumeFormData>> = [
    ['profile'],
    ['experience'],
    [],
    ['name', 'email', 'phone', 'education', 'projects'],
    ['template'],
  ];

  const currentStepHasError = stepFields[currentStep].some((field) => Boolean(errors[field]));
  const formIsValid = Object.keys(errors).length === 0;

  const onFieldChange = <K extends keyof ResumeFormData>(field: K, value: ResumeFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStepHasError) {
      setSubmitted(true);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, stepTitles.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleGenerate = () => {
    setSubmitted(true);
    if (!formIsValid) return;
    // Replace with real generation flow
    alert('Resume generated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 px-4 py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[260px_1fr]">
        <ProgressIndicator steps={stepTitles} currentStep={currentStep} />

        <main className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30 sm:p-8">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Resume Wizard</p>
            <h1 className="text-2xl font-bold text-slate-900">{stepTitles[currentStep]}</h1>
          </header>

          <section
            key={currentStep}
            className="transition-all duration-300 ease-out"
          >
            {currentStep === 0 ? (
              <ProfileStep
                value={formData.profile}
                onChange={(value) => onFieldChange('profile', value)}
                error={submitted ? errors.profile : undefined}
              />
            ) : null}

            {currentStep === 1 ? (
              <ExperienceStep
                value={formData.experience}
                onChange={(value) => onFieldChange('experience', value)}
                error={submitted ? errors.experience : undefined}
              />
            ) : null}

            {currentStep === 2 ? (
              <SkillsStep
                selectedSkills={formData.skills}
                profile={formData.profile}
                onChange={(skills) => onFieldChange('skills', skills)}
              />
            ) : null}

            {currentStep === 3 ? (
              <DetailsStep
                formData={formData}
                onFieldChange={onFieldChange}
                errors={submitted ? errors : {}}
              />
            ) : null}

            {currentStep === 4 ? (
              <TemplateStep
                value={formData.template}
                onChange={(value) => onFieldChange('template', value)}
                error={submitted ? errors.template : undefined}
              />
            ) : null}
          </section>

          <footer className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {currentStep < stepTitles.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!formIsValid}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                Generate Resume
              </button>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
}
