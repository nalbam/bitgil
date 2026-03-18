import Link from "next/link";
import { SITE_NAME } from "@/lib/constants/site";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            {SITE_NAME}
          </span>
          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
            Beta
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#overview" className="text-sm text-slate-400 transition-colors hover:text-white">Overview</Link>
          <Link href="#safety" className="text-sm text-slate-400 transition-colors hover:text-white">Safety</Link>
          <Link href="#routes" className="text-sm text-slate-400 transition-colors hover:text-white">Routes</Link>
          <Link href="#map" className="text-sm text-slate-400 transition-colors hover:text-white">Map</Link>
        </nav>
        <div className="flex items-center gap-3">
          <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white">Log in</button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500">Get Started</button>
        </div>
      </div>
    </header>
  );
}
