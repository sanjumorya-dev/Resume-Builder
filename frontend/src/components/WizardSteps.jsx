export default function WizardSteps({ steps, currentStep = 0 }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Resume Wizard</h2>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <li key={step} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isComplete
                    ? 'bg-emerald-500 text-white'
                    : isActive
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-200 text-slate-700'
                }`}
              >
                {index + 1}
              </span>
              <span className={isActive ? 'font-medium text-brand-700' : 'text-slate-700'}>{step}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
