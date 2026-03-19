import Link from "next/link";
import { SITE_NAME } from "@/lib/constants/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            {SITE_NAME}
          </span>
          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
            Beta
          </span>
        </Link>
      </div>
    </header>
  );
}
