type ProgressIndicatorProps = {
  steps: string[];
  currentStep: number;
};

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
        <span className="font-semibold">Step {currentStep + 1}</span>
        <span>of {steps.length}</span>
      </div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;
          return (
            <div
              key={step}
              className={`rounded-lg px-2 py-2 text-center text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : isDone
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-100 text-slate-500'
              }`}
            >
              {`Step ${index + 1}`}
            </div>
          );
        })}
      </div>
    </div>
  );
}
