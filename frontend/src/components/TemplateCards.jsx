export default function TemplateCards({ templates, selectedTemplate }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Choose a Template</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => {
          const selected = template.id === selectedTemplate;
          return (
            <article
              key={template.id}
              className={`rounded-xl border p-4 transition ${
                selected
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                  : 'border-slate-200 bg-white hover:border-brand-300'
              }`}
            >
              <h3 className="font-semibold">{template.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{template.description}</p>
              {selected ? (
                <span className="mt-3 inline-flex rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
                  Selected
                </span>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
