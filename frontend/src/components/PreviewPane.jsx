export default function PreviewPane({ name, summary, experience = [] }) {
  return (
    <aside className="rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:h-fit">
      <h2 className="text-lg font-semibold">Live Preview</h2>
      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="mt-2 text-sm text-slate-700">{summary}</p>

        <h4 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Experience</h4>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
          {experience.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
