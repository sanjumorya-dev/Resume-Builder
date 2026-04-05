const sections = ['Experience', 'Education', 'Projects', 'Skills', 'Certifications', 'Languages'];
const experienceLevels = ['Fresher', '1–2 years', '3–5 years', '5+ years'];

const templates = [
  { id: 'modern', name: 'Modern Professional', description: 'Bold headings + ATS-safe structure' },
  { id: 'classic', name: 'Classic Executive', description: 'Traditional spacing for leadership roles' }
];

const featureCards = [
  { title: 'A draft in 10 mins', body: 'The AI builder is 10× faster than creating one from scratch.' },
  { title: 'Zero mistakes', body: "Auto checks grammar, tone, and impact before you export." },
  { title: 'ATS templates', body: 'Layouts are designed to be readable by recruiter systems.' },
  { title: 'Get paid more', body: 'Highlight measurable impact and negotiate with confidence.' }
];

export default function App() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white">
            ✨
          </div>
          <p className="text-2xl font-bold tracking-tight">ResumeAI</p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl bg-slate-50 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-xl text-indigo-600">
              ⏱
            </div>
            <h1 className="text-2xl font-bold md:text-4xl">
              <span className="text-indigo-600">29,976</span> resumes created today
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.8fr]">
            <div className="space-y-7">
              <div>
                <label className="mb-2 block text-lg font-semibold">Which job role are you targeting?</label>
                <select className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-lg shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
                  <option>Select a role or type below</option>
                  <option>Software Engineer</option>
                  <option>Product Manager</option>
                  <option>Data Analyst</option>
                  <option>UI/UX Designer</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-lg font-semibold">Search and add specific skills</label>
                <input
                  className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-lg shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Search skills (e.g. React, Python, Project Management)"
                />
              </div>

              <div>
                <p className="mb-3 text-lg font-semibold">Which sections do you need?</p>
                <div className="flex flex-wrap gap-2">
                  {sections.map((section, index) => (
                    <button
                      key={section}
                      type="button"
                      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                        index === 0 || section === 'Education' || section === 'Skills'
                          ? 'border-indigo-500 bg-indigo-600 text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-lg font-semibold">What is your experience level?</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {experienceLevels.map((level, idx) => (
                    <button
                      key={level}
                      type="button"
                      className={`rounded-2xl border px-4 py-3 text-base font-medium transition ${
                        idx === 0
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-lg font-semibold">Select a Template</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {templates.map((template, idx) => (
                    <button
                      key={template.id}
                      type="button"
                      className={`rounded-2xl border p-4 text-left transition ${
                        idx === 0
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                          : 'border-slate-300 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{template.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold">Why builders choose ResumeAI</h2>
              <div className="mt-5 space-y-4">
                {featureCards.map((feature) => (
                  <article key={feature.title} className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{feature.body}</p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
