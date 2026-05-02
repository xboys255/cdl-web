"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;        // descriptive label OR AdSense data-ad-slot ID
  className?: string;
  format?: "auto" | "banner" | "horizontal" | "rectangle" | "vertical";
}

declare global {
  interface Window {
    adsbygoogle: { push: (obj: object) => void } & unknown[];
  }
}

export function AdSlot({ slot, className = "", format = "auto" }: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet — Auto Ads will handle it
    }
  }, [client]);

  // No publisher ID set — show placeholder (dev / pending approval)
  if (!client) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded text-gray-400 text-xs min-h-[90px] ${className}`}
      >
        Ad — {slot}
      </div>
    );
  }

  // "banner" is a legacy alias for "horizontal" in our codebase
  const adFormat = format === "banner" ? "horizontal" : format;

  // Real AdSense unit
  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}
