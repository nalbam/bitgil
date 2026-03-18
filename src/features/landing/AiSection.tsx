export function AiSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-900/20 to-indigo-900/10 p-12">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Coming Soon
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">AI-powered route intelligence</h2>
            <p className="text-base leading-relaxed text-slate-400">
              The next version of Bitgil will leverage AI to detect behavioral patterns, predict risk hotspots based on time of day and historical incident data, and proactively suggest safer routes — before you even ask.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {["Pattern recognition", "Time-based risk analysis", "Predictive routing", "Incident correlation"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
