import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-[#080d1a] py-4">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-xs text-slate-600">
          &copy; {year} {SITE_NAME} — {SITE_DESCRIPTION}
        </p>
      </div>
    </footer>
  );
}
