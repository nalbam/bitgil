import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-[#080d1a] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">{SITE_NAME}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{SITE_DESCRIPTION}</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Product</h4>
            <ul className="space-y-2">
              {["Overview", "Safety", "Routes", "Map"].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase()}`} className="text-sm text-slate-400 transition-colors hover:text-white">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "API", "GitHub", "Contact"].map((item) => (
                <li key={item}><span className="text-sm text-slate-600">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/5 pt-8 text-center">
          <p className="text-sm text-slate-600">&copy; {year} {SITE_NAME}. Built for safer nights.</p>
        </div>
      </div>
    </footer>
  );
}
