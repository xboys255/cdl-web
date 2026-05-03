"use client";

import { useState } from "react";

interface ShareButtonProps {
  score: number;
  passed: boolean;
  testName: string;
}

export function ShareButton({ score, passed, testName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const siteUrl = "https://www.cdlprepkit.com";
  const shareText = passed
    ? `I scored ${score}% and PASSED the ${testName} practice test on CDLPrepKit! Free CDL prep at cdlprepkit.com`
    : `I scored ${score}% on the ${testName} practice test on CDLPrepKit. Studying harder! Free CDL prep at cdlprepkit.com`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Share your score</p>
      <div className="flex flex-wrap justify-center gap-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <span>𝕏</span> Share on X
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <span>👍</span> Share on Facebook
        </a>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <span>🔗</span> {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
