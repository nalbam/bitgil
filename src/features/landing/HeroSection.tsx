export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute left-1/3 top-2/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
          Safety-first route navigation
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
          Come home{" "}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">safely</span>{" "}
          tonight
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
          Bitgil analyzes streetlights, CCTV coverage, police presence, and more to visualize the safest routes home for students at night.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95">Explore Routes</button>
          <button className="rounded-xl border border-white/10 px-8 py-3.5 text-base font-semibold text-slate-300 transition-colors hover:border-white/20 hover:text-white">Learn More</button>
        </div>
        <div className="flex flex-wrap justify-center gap-8 pt-4">
          {[{ label: "Safety Factors", value: "5+" }, { label: "Route Options", value: "3" }, { label: "Real-time Data", value: "Soon" }].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/10 p-1.5">
          <div className="h-2 w-0.5 animate-bounce rounded-full bg-slate-400" />
        </div>
      </div>
    </section>
  );
}
