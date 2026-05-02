"use client";

import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimerProps {
  startSeconds: number;
}

export function Timer({ startSeconds }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = startSeconds - elapsed;
  const isLow = remaining < 300 && remaining > 0;
  const isOver = remaining <= 0;

  return (
    <div className={`flex items-center gap-1.5 font-mono text-sm px-3 py-1.5 rounded-full border ${
      isOver ? "bg-red-50 border-red-300 text-red-600" :
      isLow ? "bg-amber-50 border-amber-300 text-amber-700" :
      "bg-gray-50 border-gray-200 text-gray-700"
    }`}>
      <Clock className="w-3.5 h-3.5" />
      <span>{isOver ? "Time's up" : formatTime(remaining)}</span>
    </div>
  );
}
