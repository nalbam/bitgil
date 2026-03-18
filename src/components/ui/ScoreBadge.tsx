import { cn } from "@/lib/utils/cn";
import type { SafetyLevel } from "@/lib/maps/types";

interface ScoreBadgeProps {
  score: number;
  level: SafetyLevel;
  className?: string;
}

const levelConfig: Record<SafetyLevel, { label: string; color: string }> = {
  safe: { label: "Safe", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  moderate: { label: "Moderate", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  caution: { label: "Caution", color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export function ScoreBadge({ score, level, className }: ScoreBadgeProps) {
  const { label, color } = levelConfig[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", color, className)}>
      <span className="font-bold">{score}</span>
      <span className="opacity-70">{label}</span>
    </span>
  );
}
