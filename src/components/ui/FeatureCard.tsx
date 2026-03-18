import type React from "react";
import { cn } from "@/lib/utils/cn";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn("rounded-xl border border-white/5 bg-white/[0.03] p-6 transition-colors hover:border-white/10 hover:bg-white/[0.05]", className)}>
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">{icon}</div>
      <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}
