import type { VerdictInfo } from "@/lib/types";
import { CheckCircle, XCircle, AlertTriangle, HelpCircle } from "lucide-react";

const icons: Record<string, React.ElementType> = {
  "check-circle": CheckCircle,
  "x-circle": XCircle,
  "alert-triangle": AlertTriangle,
  "help-circle": HelpCircle,
};

const verdictClass: Record<string, string> = {
  false: "verdict-false",
  true: "verdict-true",
  misleading: "verdict-misleading",
  unproven: "verdict-unproven",
};

interface VerdictBadgeProps {
  verdict: VerdictInfo;
  size?: "sm" | "md" | "lg";
}

export default function VerdictBadge({ verdict, size = "md" }: VerdictBadgeProps) {
  const Icon = icons[verdict.iconName] ?? HelpCircle;
  const sizeClass = size === "lg" ? "text-sm px-4 py-2" : size === "sm" ? "text-[10px] px-2 py-1" : "text-xs px-3 py-1.5";
  return (
    <span
      className={`verdict-badge ${verdictClass[verdict.slug] ?? ""} ${sizeClass}`}
      style={{ backgroundColor: verdict.colorCode }}
    >
      <Icon className={size === "lg" ? "w-4 h-4" : "w-3 h-3"} />
      {verdict.name}
    </span>
  );
}
