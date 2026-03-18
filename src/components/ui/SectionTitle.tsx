import { cn } from "@/lib/utils/cn";

interface SectionTitleProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionTitle({ label, title, description, className, align = "center" }: SectionTitleProps) {
  return (
    <div className={cn("space-y-4", align === "center" && "text-center", className)}>
      {label && (
        <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-blue-400">
          {label}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
      {description && (
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400">{description}</p>
      )}
    </div>
  );
}
