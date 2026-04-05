import WizardSteps from './components/WizardSteps';
import TemplateCards from './components/TemplateCards';
import PreviewPane from './components/PreviewPane';
import SkillChips from './components/SkillChips';

const defaultSteps = [
  'Personal Details',
  'Experience',
  'Education',
  'Skills',
  'Review'
];

const defaultTemplates = [
  { id: 'modern', name: 'Modern', description: 'Clean layout with accent color.' },
  { id: 'classic', name: 'Classic', description: 'Traditional single-column resume.' },
  { id: 'compact', name: 'Compact', description: 'Dense layout for senior profiles.' }
];

const defaultSkills = ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Prompting'];

export default function App() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="space-y-6">
          <header className="rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-brand-700">AI Resume Builder</h1>
            <p className="mt-2 text-sm text-slate-600">
              Draft, enhance, and export resumes with an AI-assisted wizard.
            </p>
          </header>

          <WizardSteps steps={defaultSteps} currentStep={2} />
          <TemplateCards templates={defaultTemplates} selectedTemplate="modern" />
          <SkillChips skills={defaultSkills} />
        </section>

        <PreviewPane
          name="Jordan Applicant"
          summary="Full-stack engineer with a focus on product delivery, DX, and AI integrations."
          experience={[
            'Built internal resume optimizer that reduced review time by 45%.',
            'Led migration from legacy templates to React component system.'
          ]}
        />
      </div>
    </main>
  );
}
