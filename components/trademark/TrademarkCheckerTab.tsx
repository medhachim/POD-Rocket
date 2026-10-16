'use client';

import React, { useState, useMemo } from 'react';
import { checkTrademark, TrademarkCheckResult, getUsptoSearchUrl, getTmHuntSearchUrl, getGoogleCopyrightUrl, getJustiaSearchUrl } from '@/lib/trademarkChecker';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  Scale, 
  FileText, 
  RefreshCw, 
  Tag, 
  FileCheck,
  Zap,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export function TrademarkCheckerTab() {
  const [inputText, setInputText] = useState('Vintage 1984 Limited Edition 40th Birthday Retro Cassette T-Shirt');
  const [activeFilter, setActiveFilter] = useState<'all' | 'flagged' | '1-gram' | '2-gram' | '3-gram'>('all');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Sample phrases for quick testing
  const samplePhrases = [
    { label: 'Clean POD Title', text: 'Vintage 1984 Limited Edition 40th Birthday Retro Cassette T-Shirt' },
    { label: 'Nike Infringement Alert', text: 'Just Do It Workout Gym Fitness Running Vintage Graphic Tee' },
    { label: 'Boy Mom / Mama Bear (Known Ban)', text: 'Proud Boy Mom Mama Bear Resting Beach Face Mother Gift' },
    { label: 'Disney Character IP', text: 'Retro Disney Mickey Mouse Hakuna Matata Lion Kingdom Hoodie' },
    { label: 'Apple iPhone (Prompt ASIN)', text: 'Apple iPhone 11 Unlocked PRODUCT RED Smartphone Merch Case' },
    { label: 'Super Bowl / NFL', text: 'Sunday Game Day Football Super Bowl Champion Tailgate Shirt' },
  ];

  // Scan text
  const result: TrademarkCheckResult = useMemo(() => {
    return checkTrademark(inputText);
  }, [inputText]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(label);
    toast.success(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const filteredNgrams = useMemo(() => {
    if (activeFilter === 'flagged') return result.ngrams.filter(n => n.isFlagged);
    if (activeFilter === '1-gram') return result.ngrams.filter(n => n.ngramType === '1-gram');
    if (activeFilter === '2-gram') return result.ngrams.filter(n => n.ngramType === '2-gram');
    if (activeFilter === '3-gram') return result.ngrams.filter(n => n.ngramType === '3-gram');
    return result.ngrams;
  }, [result.ngrams, activeFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-mono mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              USPTO Class 025 (Clothing & Apparel) Focus
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Merch by Amazon Trademark & Copyright Scanner
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Automated 1-word, 2-word, and 3-word n-gram analysis against known registered trademarks, brand names, and character IPs to prevent account strikes and rejections.
            </p>
          </div>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form & Sample Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Paste Product Title, Bullets, or Sentence
              </label>
              <button
                onClick={() => setInputText('')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter title, brand name, or bullet points to scan for Class 025 trademark conflicts..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all leading-relaxed"
              />
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-medium text-slate-400 block">
                Quick Test Examples:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePhrases.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(sample.text)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Database Link Actions for whole phrase */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 flex items-center mr-1">Deep Registry Search:</span>
              <a
                href={getUsptoSearchUrl(inputText)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-medium flex items-center gap-1.5"
              >
                USPTO TESS (Class 025) <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={getTmHuntSearchUrl(inputText)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-medium flex items-center gap-1.5"
              >
                TMHunt Search <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={getGoogleCopyrightUrl(inputText)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium flex items-center gap-1.5"
              >
                Google Copyright <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={getJustiaSearchUrl(inputText)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium flex items-center gap-1.5"
              >
                Justia TM <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Safe Output & Auto-Sanitized Merch Copy */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Sanitized & Safe Merch Copy (Ready to Upload)
              </h3>
            </div>

            <div className="space-y-4">
              {/* Sanitized Title */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Safe Clean Title:</span>
                  <button
                    onClick={() => handleCopy(result.cleanTitle, 'Clean Title')}
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {copiedType === 'Clean Title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Safe Title
                  </button>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-white">
                  {result.cleanTitle || '(Title empty)'}
                </div>
              </div>

              {/* Safe Keywords Tag Cloud */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Safe Merch Backend Keywords:</span>
                  <button
                    onClick={() => handleCopy(result.sanitizedKeywords.join(', '), 'Safe Keywords')}
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {copiedType === 'Safe Keywords' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy All Tags
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.sanitizedKeywords.length > 0 ? (
                    result.sanitizedKeywords.map((tag, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleCopy(tag, 'Keyword')}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {tag}
                        <Copy className="w-2.5 h-2.5 text-slate-500" />
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">No clean keywords extracted</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Card, Risk Gauge, and Detected Violations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Risk Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              Safety Score & Merch Compliance
            </h3>

            {/* Status Indicator */}
            <div className="space-y-3">
              {result.overallStatus === 'Safe' && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Safe to Upload (Class 025 Clear)
                  </div>
                  <p className="text-xs text-emerald-200/80">
                    No active high-risk trademarks or protected brand phrases found in our USPTO Class 025 index.
                  </p>
                </div>
              )}

              {result.overallStatus === 'Check Required' && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-700/60 text-amber-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Manual Review Recommended
                  </div>
                  <p className="text-xs text-amber-200/80">
                    Some words or slogans carry potential disputes in apparel classifications. Verify on USPTO TESS before publishing.
                  </p>
                </div>
              )}

              {result.overallStatus === 'Trademark Alert' && (
                <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-700 text-rose-300 space-y-1 animate-pulse">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    Trademark Alert: Do Not Upload!
                  </div>
                  <p className="text-xs text-rose-200/90">
                    Direct match with registered Class 025 trademarks or high-enforcement brand IPs. Publishing this will trigger rejection.
                  </p>
                </div>
              )}

              {/* Risk Meter */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Risk Assessment:</span>
                  <span
                    className={`font-bold ${
                      result.riskScore > 50
                        ? 'text-rose-400'
                        : result.riskScore > 20
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {result.riskScore}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      result.riskScore > 50
                        ? 'bg-rose-500'
                        : result.riskScore > 20
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(5, result.riskScore)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase">N-Grams Evaluated</span>
                <div className="text-base font-bold text-white font-mono mt-0.5">{result.totalCheckedPhrases}</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase">High Risk Terms</span>
                <div className="text-base font-bold text-rose-400 font-mono mt-0.5">{result.matchedTrademarks.length}</div>
              </div>
            </div>

            {/* Flagged Terms Details */}
            {result.matchedTrademarks.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Conflicting Terms:
                </span>
                <div className="space-y-2">
                  {result.matchedTrademarks.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-950 border border-rose-900/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-rose-400 uppercase text-xs">
                          &quot;{m.phrase}&quot;
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800">
                          {m.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {m.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full N-Gram Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              N-Gram Decomposition & Registry Deep Links
            </h3>
            <p className="text-xs text-slate-400">
              Inspect every single word, 2-word, and 3-word sub-phrase with pre-filled USPTO Class 025 and TMHunt queries.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['all', 'flagged', '1-gram', '2-gram', '3-gram'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Phrase / N-Gram</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-right">Direct Registry Search</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredNgrams.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No n-grams match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredNgrams.map((ngram, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-900/50 transition-colors ${
                      ngram.isFlagged ? 'bg-rose-950/20' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-200">
                      {ngram.isFlagged ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          {ngram.phrase}
                        </span>
                      ) : (
                        <span>{ngram.phrase}</span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-slate-400 font-mono">
                      {ngram.ngramType}
                    </td>

                    <td className="py-2.5 px-4">
                      {ngram.isFlagged ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          {ngram.match?.category || 'Registered'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40">
                          Class 025 Clear
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={ngram.usptoSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-medium inline-flex items-center gap-1"
                        >
                          USPTO TESS <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={ngram.tmHuntSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-xs font-medium inline-flex items-center gap-1"
                        >
                          TMHunt <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={ngram.googleCopyrightUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                          title="Google Copyright Search"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
