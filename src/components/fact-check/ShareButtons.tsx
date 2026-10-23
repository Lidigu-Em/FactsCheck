"use client";
import { useState } from "react";
import { Share2, MessageCircle, Copy, Check, Eye } from "lucide-react";
import type { Locale } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";

interface ShareButtonsProps {
  title: string;
  url: string;
  lang: Locale;
  initialShares?: number;
  viewsCount?: number;
}

export default function ShareButtons({
  title,
  url,
  lang,
  initialShares = 0,
  viewsCount = 0,
}: ShareButtonsProps) {
  const t = useTranslations(lang);
  const [shares, setShares] = useState(initialShares);
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    setShares((prev) => prev + 1);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      handleShareClick();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-y border-gray-100 dark:border-gray-800 my-8">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-red-600" />
          {t.detail.share}:
        </span>
        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleShareClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleShareClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <span>𝕏</span>
            Twitter
          </a>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold transition-colors border border-gray-200 dark:border-gray-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : t.detail.copyLink}
          </button>
        </div>
      </div>

      {/* Engagement counters */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        {viewsCount > 0 && (
          <span className="flex items-center gap-1 bg-gray-50 dark:bg-[#161726] px-2.5 py-1 rounded-full border border-gray-100 dark:border-gray-800">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <strong className="text-gray-700 dark:text-gray-300">{viewsCount.toLocaleString()}</strong> {t.feed.views}
          </span>
        )}
        {shares > 0 && (
          <span className="flex items-center gap-1 bg-gray-50 dark:bg-[#161726] px-2.5 py-1 rounded-full border border-gray-100 dark:border-gray-800">
            <Share2 className="w-3.5 h-3.5 text-gray-400" />
            <strong className="text-gray-700 dark:text-gray-300">{shares.toLocaleString()}</strong> {t.feed.shares}
          </span>
        )}
      </div>
    </div>
  );
}
