/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, AlertCircle, Bot, BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import { FutureDirection } from '../types/research';

interface LimitationsAndCaveatsSectionProps {
  authorLimitations: string[];
  aiObservations: string[];
  practicalImplications: string[];
  futureDirections: FutureDirection[];
}

export const LimitationsAndCaveatsSection: React.FC<LimitationsAndCaveatsSectionProps> = ({
  authorLimitations,
  aiObservations,
  practicalImplications,
  futureDirections,
}) => {
  return (
    <div className="space-y-8">
      {/* Side-by-Side Limitations & AI Observations */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 font-sans-ui">
            Study Limitations &amp; Methodological Caveats
          </h3>
          <p className="text-xs text-slate-500">
            Strict separation between author self-disclosed limitations and AI analytical cautions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Author-Stated Limitations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs printable-card">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3 pb-3 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span>Stated by the Authors in Manuscript</span>
              <span className="ml-auto text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Author-Disclosed
              </span>
            </div>

            {authorLimitations.length > 0 ? (
              <ul className="space-y-3">
                {authorLimitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-sm text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No explicit limitation section was disclosed by the authors in the text.
              </p>
            )}
          </div>

          {/* Column 2: AI Observations & Caveats */}
          <div className="bg-amber-50/40 rounded-2xl border border-amber-200/80 p-6 shadow-xs printable-card">
            <div className="flex items-center space-x-2 text-amber-950 font-bold text-sm mb-3 pb-3 border-b border-amber-200/60">
              <Bot className="w-4 h-4 text-amber-700" />
              <span>AI Analytical Observations &amp; Caveats</span>
              <span className="ml-auto text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                AI Observation
              </span>
            </div>

            {aiObservations.length > 0 ? (
              <ul className="space-y-3">
                {aiObservations.map((obs, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-sm text-amber-900 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-amber-800 block mb-0.5">
                        [AI Observation]
                      </span>
                      <span>{obs}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-amber-700 italic">
                No additional unstated caveats identified beyond author remarks.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Practical Implications */}
      {practicalImplications.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs printable-card">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base mb-3 pb-2 border-b border-slate-100">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <span>Practical Implications &amp; Real-World Takeaways</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practicalImplications.map((imp, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-slate-800 flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{imp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Future Research Directions */}
      {futureDirections.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs printable-card">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h4 className="text-base font-bold text-slate-900 font-sans-ui">
              Future Research Directions
            </h4>
            <span className="text-xs text-slate-400">
              Categorized by Author Recommendations vs AI Proposed Lines of Inquiry
            </span>
          </div>

          <div className="space-y-3">
            {futureDirections.map((dir, idx) => {
              const isAuthor = dir.source === 'author';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-sm ${
                    isAuthor
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-indigo-50/40 border-indigo-200 text-indigo-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isAuthor
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      {isAuthor ? 'Author Stated Direction' : 'AI Suggested Horizon'}
                    </span>
                    {dir.rationale && (
                      <span className="text-xs text-slate-400 italic">
                        {dir.rationale}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">{dir.suggestion}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
