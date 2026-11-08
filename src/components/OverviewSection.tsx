/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ResearchReport } from '../types/research';
import { BookOpen, Target, Sparkles, CheckCircle2 } from 'lucide-react';

interface OverviewSectionProps {
  report: ResearchReport;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ report }) => {
  return (
    <div className="space-y-6">
      {/* Plain Language Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs printable-card">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base mb-3 pb-3 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>Plain-Language Overview</span>
          <span className="text-[11px] font-semibold text-slate-400 font-mono ml-auto">
            150–250 Words
          </span>
        </div>

        <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-serif-academic">
          {report.plainLanguageOverview}
        </p>
      </div>

      {/* 5 Key Insights */}
      {report.keyInsights && report.keyInsights.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs printable-card">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base mb-4 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>5 Key Takeaway Insights</span>
            <span className="text-xs text-slate-400 ml-auto hidden sm:inline">Concise &amp; Non-repetitive</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {report.keyInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start space-x-3 text-sm text-slate-800"
              >
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed font-medium">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Problem & Objectives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs printable-card">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3 pb-2 border-b border-slate-100">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Research Problem &amp; Motivation</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-serif-academic">
            {report.researchProblemAndMotivation}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs printable-card">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Research Questions &amp; Objectives</span>
          </div>
          {report.researchQuestionsAndObjectives && report.researchQuestionsAndObjectives.length > 0 ? (
            <ul className="space-y-2.5">
              {report.researchQuestionsAndObjectives.map((q, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-slate-700 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">Not explicitly enumerated in the manuscript.</p>
          )}
        </div>
      </div>

      {/* Conclusion */}
      {report.conclusion && (
        <div className="bg-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs printable-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-200 mb-2 font-sans-ui">
            Author Conclusions
          </h3>
          <p className="text-sm sm:text-base text-indigo-50 leading-relaxed font-serif-academic">
            {report.conclusion}
          </p>
        </div>
      )}
    </div>
  );
};
