/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FindingItem } from '../types/research';
import { Quote, ChevronDown, ChevronUp, Copy, Check, ShieldAlert, Sparkles, Bookmark } from 'lucide-react';

interface FindingsSectionProps {
  findings: FindingItem[];
}

export const FindingsSection: React.FC<FindingsSectionProps> = ({ findings }) => {
  const [expandedId, setExpandedId] = useState<string | null>(findings[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const copyQuote = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getCausalBadge = (type: FindingItem['causalType']) => {
    switch (type) {
      case 'causal':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Causal Inference</span>
          </span>
        );
      case 'correlational':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldAlert className="w-3 h-3 text-amber-500" />
            <span>Correlational (Non-Causal)</span>
          </span>
        );
      case 'observational':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span>Observational</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span>Descriptive</span>
          </span>
        );
    }
  };

  if (!findings || findings.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
        No empirical findings were identified in the paper.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-sans-ui">
            Core Empirical Findings
          </h3>
          <p className="text-xs text-slate-500">
            Grounded directly against the manuscript text. Verified statistical parameters and exact page citations.
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
          {findings.length} Findings Reported
        </span>
      </div>

      <div className="space-y-3">
        {findings.map((item, index) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id || index}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden printable-card ${
                isExpanded ? 'border-indigo-300 shadow-sm ring-1 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </span>
                    {getCausalBadge(item.causalType)}
                    {item.evidence?.pageNumber !== null && item.evidence?.pageNumber !== undefined && (
                      <span className="inline-flex items-center space-x-1 text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
                        <Bookmark className="w-3 h-3 text-indigo-500" />
                        <span>p. {item.evidence.pageNumber}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-semibold text-slate-900 font-serif-academic leading-snug">
                    {item.finding}
                  </h4>

                  {item.statisticalContext && (
                    <div className="inline-block bg-slate-50 border border-slate-200/80 rounded-md px-2.5 py-1 text-xs font-mono text-slate-700">
                      <span className="font-semibold text-slate-500 mr-1.5">Statistics:</span>
                      {item.statisticalContext}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 shrink-0 mt-1"
                  aria-label={isExpanded ? 'Collapse evidence' : 'Expand evidence'}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Expandable Evidence Drawer */}
              {isExpanded && item.evidence && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/70 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <Quote className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        Verified Document Evidence {item.evidence.section ? `• ${item.evidence.section}` : ''}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyQuote(item.id, item.evidence!.quoteOrExcerpt);
                      }}
                      className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors px-2 py-0.5 rounded hover:bg-white border border-transparent hover:border-slate-200"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Quote</span>
                        </>
                      )}
                    </button>
                  </div>

                  <blockquote className="p-3 bg-white rounded-lg border border-slate-200/90 text-slate-700 italic font-serif-academic text-sm leading-relaxed">
                    &ldquo;{item.evidence.quoteOrExcerpt}&rdquo;
                  </blockquote>

                  {item.causalType === 'correlational' && (
                    <div className="mt-2.5 text-xs text-amber-800 bg-amber-50 rounded p-2 border border-amber-200 flex items-start space-x-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Methodological Caution:</strong> The authors established correlation between these variables; do not infer direct causation from this observational measure.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
