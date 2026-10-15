"use client";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export default function EmergencyBanner({ text }: { text: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="bg-red-700 text-white text-xs py-2 px-4 flex items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-2 flex-1 justify-center text-center">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span className="font-medium">{text}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-white/80 hover:text-white ml-2 shrink-0"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
