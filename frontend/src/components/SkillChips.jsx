export default function SkillChips({ skills = [] }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Key Skills</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm text-brand-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
