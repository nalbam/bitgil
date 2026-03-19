import { cn } from "@/lib/utils/cn";
import type { SafetyFactor, SafetyLevel } from "@/lib/maps/types";

interface SafetyBreakdownProps {
  factors: SafetyFactor[];
  score: number;
  level: SafetyLevel;
}

const BASE_SCORE = 50;
const MAX_BAR = 40;

const levelLabel: Record<SafetyLevel, string> = {
  safe: "Safe",
  moderate: "Moderate",
  caution: "Caution",
};

const levelColor: Record<SafetyLevel, string> = {
  safe: "text-emerald-400",
  moderate: "text-yellow-400",
  caution: "text-red-400",
};

export function SafetyBreakdown({ factors, score, level }: SafetyBreakdownProps) {
  return (
    <div className="space-y-2 pt-3">
      {factors.map((factor) => {
        const isNegative = factor.impact < 0;
        const barWidth = Math.min(Math.abs(factor.impact) / MAX_BAR, 1) * 100;

        return (
          <div key={factor.type} className="flex items-center gap-2 text-xs">
            <span className="w-24 shrink-0 truncate text-slate-400">{factor.label}</span>
            <div className="relative h-3 flex-1 rounded-full bg-white/5">
              <div
                className={cn(
                  "absolute top-0 h-3 rounded-full",
                  isNegative ? "right-1/2 bg-red-500/60" : "left-1/2 bg-emerald-500/60",
                )}
                style={{ width: `${barWidth / 2}%` }}
              />
            </div>
            <span
              className={cn(
                "w-10 shrink-0 text-right font-mono",
                isNegative ? "text-red-400" : "text-emerald-400",
              )}
            >
              {isNegative ? "" : "+"}{factor.impact}
            </span>
          </div>
        );
      })}
      <div className="mt-3 border-t border-white/5 pt-2 text-xs text-slate-400">
        Base {BASE_SCORE} &rarr; Final{" "}
        <span className={cn("font-bold", levelColor[level])}>{score}</span>{" "}
        <span className={cn(levelColor[level])}>({levelLabel[level]})</span>
      </div>
    </div>
  );
}
