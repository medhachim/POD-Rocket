'use client';

import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { checkTrademark, TrademarkCheckResult } from '@/lib/trademarkChecker';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Sparkles,
  Info,
  Scale,
  FileCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface TrademarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  asin?: string;
}

export function TrademarkModal({ isOpen, onClose, title, asin }: TrademarkModalProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'flagged' | '1-gram' | '2-gram' | '3-gram'>('all');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Perform full Class 025 scan
  const result: TrademarkCheckResult = useMemo(() => {
    return checkTrademark(title);
  }, [title]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    toast.success(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const getStatusBadge = () => {
    switch (result.overallStatus) {
      case 'Safe':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/80 text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-xs font-semibold">
              Status: <span className="font-bold">Safe for Merch</span>
            </div>
          </div>
        );
      case 'Check Required':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-700/80 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <div className="text-xs font-semibold">
              Status: <span className="font-bold">Check Required</span>
            </div>
          </div>
        );
      case 'Trademark Alert':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/90 border border-rose-700/80 text-rose-300 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <div className="text-xs font-semibold">
              Status: <span className="font-bold">Trademark Alert (High Risk)</span>
            </div>
          </div>
        );
    }
  };

  const filteredNgrams = useMemo(() => {
    if (activeFilter === 'flagged') return result.ngrams.filter(n => n.isFlagged);
    if (activeFilter === '1-gram') return result.ngrams.filter(n => n.ngramType === '1-gram');
    if (activeFilter === '2-gram') return result.ngrams.filter(n => n.ngramType === '2-gram');
    if (activeFilter === '3-gram') return result.ngrams.filter(n => n.ngramType === '3-gram');
    return result.ngrams;
  }, [result.ngrams, activeFilter]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="USPTO Class 025 (Apparel) Trademark & Copyright Inspector"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Top Status & Overview Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Target Classification: Class 025 (Clothing & Merch)
                </span>
                {asin && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    ASIN: {asin}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white line-clamp-2">
                &ldquo;{title}&rdquo;
              </h4>
            </div>

            <div className="flex-shrink-0">
              {getStatusBadge()}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Risk Level</span>
              <div className="font-bold text-white font-mono">{result.riskScore}% Risk</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Phrases Scanned</span>
              <div className="font-bold text-cyan-400 font-mono">{result.totalCheckedPhrases} n-grams</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Direct TM Hits</span>
              <div className={`font-bold font-mono ${result.matchedTrademarks.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {result.matchedTrademarks.length} Flagged
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Merch Account Safety</span>
              <div className="font-bold text-emerald-400 font-mono">
                {result.overallStatus === 'Trademark Alert' ? 'DO NOT UPLOAD' : 'Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Flagged Trademarks Alert List (if any) */}
        {result.matchedTrademarks.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Critical Trademark Conflicts Detected
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              The following words/phrases are registered trademarks in Class 025 (Clothing). Using these in your Merch by Amazon title, brand, or bullets will cause immediate rejection or account termination:
            </p>

            <div className="space-y-2 pt-1">
              {result.matchedTrademarks.map((match, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-rose-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-rose-400 uppercase text-sm mr-2">
                      &quot;{match.phrase}&quot;
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800 mr-2">
                      {match.category}
                    </span>
                    <span className="text-slate-400 text-xs block sm:inline mt-0.5 sm:mt-0">
                      {match.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <a
                      href={`https://tmsearch.uspto.gov/search/search-results?query=${encodeURIComponent(`"${match.phrase}"[COMB] AND 025[IC]`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 flex items-center gap-1"
                    >
                      USPTO TESS <ExternalLink className="w-3 h-3 text-cyan-400" />
                    </a>
                    <a
                      href={`https://tmhunt.com/?q=${encodeURIComponent(match.phrase)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 flex items-center gap-1"
                    >
                      TMHunt <ExternalLink className="w-3 h-3 text-amber-400" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safe Copy Actions Section */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Safe Merch Title & Tag Exporter
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Stripped of all risky trademark words
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Sanitized Title */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Sanitized Merch Title:</span>
                <button
                  onClick={() => handleCopy(result.cleanTitle, 'Clean Title')}
                  className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-medium cursor-pointer"
                >
                  {copiedItem === 'Clean Title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Safe Title
                </button>
              </div>
              <p className="text-xs text-slate-200 font-mono bg-slate-900 p-2 rounded border border-slate-800/80">
                {result.cleanTitle}
              </p>
            </div>

            {/* Sanitized Keywords */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Safe Backend Keywords:</span>
                <button
                  onClick={() => handleCopy(result.sanitizedKeywords.join(', '), 'Safe Keywords')}
                  className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-medium cursor-pointer"
                >
                  {copiedItem === 'Safe Keywords' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Safe Tags
                </button>
              </div>
              <p className="text-xs text-slate-200 font-mono bg-slate-900 p-2 rounded border border-slate-800/80 truncate">
                {result.sanitizedKeywords.join(', ') || 'No keywords generated'}
              </p>
            </div>
          </div>
        </div>

        {/* N-Grams Inspection Table & Official Database Links */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4 text-cyan-400" />
                Extracted N-Grams & One-Click Official Database Search
              </h4>
              <p className="text-xs text-slate-400">
                Every 1-word, 2-word, and 3-word combination verified against USPTO Class 025 (Apparel).
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {(['all', 'flagged', '1-gram', '2-gram', '3-gram'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
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

          {/* Table Container */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase text-[10px] tracking-wider sticky top-0 z-10">
                  <th className="py-2.5 px-3">Phrase / N-Gram</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Risk Assessment</th>
                  <th className="py-2.5 px-3 text-right">Official Registry Links</th>
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
                      <td className="py-2 px-3 font-mono font-medium text-slate-200">
                        {ngram.isFlagged ? (
                          <span className="text-rose-400 font-bold flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                            {ngram.phrase}
                          </span>
                        ) : (
                          <span>{ngram.phrase}</span>
                        )}
                      </td>

                      <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">
                        {ngram.ngramType}
                      </td>

                      <td className="py-2 px-3">
                        {ngram.isFlagged ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                            {ngram.match?.category || 'Registered'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40">
                            Clear
                          </span>
                        )}
                      </td>

                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={ngram.usptoSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-[11px] font-medium inline-flex items-center gap-1"
                            title="Search USPTO TESS for Class 025"
                          >
                            USPTO <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <a
                            href={ngram.tmHuntSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-[11px] font-medium inline-flex items-center gap-1"
                            title="Search TMHunt"
                          >
                            TMHunt <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <a
                            href={ngram.googleCopyrightUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                            title="Google Image / Copyright Search"
                          >
                            <Search className="w-3 h-3" />
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
    </Modal>
  );
}
