/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ResearchReport } from '../types/research';
import { Compass, Users, GitFork, ClipboardList, ShieldCheck } from 'lucide-react';

interface MethodologySectionProps {
  report: ResearchReport;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({ report }) => {
  const method = report.methodology;

  return (
    <div className="space-y-6">
      {/* Top Banner: Study Design & Sample */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs printable-card">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3 pb-2 border-b border-slate-100">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Study Design &amp; Architecture</span>
          </div>
          <div className="space-y-2">
            <div className="text-base font-semibold text-slate-900 font-sans-ui">
              {method.studyDesignType}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-serif-academic">
              {method.description}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs printable-card">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3 pb-2 border-b border-slate-100">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Dataset, Cohort &amp; Sample Size</span>
          </div>
          <div className="space-y-2">
            {method.sampleSize && (
              <div className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono font-bold px-2.5 py-1 rounded-md mb-1">
                Sample: {method.sampleSize}
              </div>
            )}
            <p className="text-sm text-slate-600 leading-relaxed font-serif-academic">
              {method.datasetOrSample}
            </p>
          </div>
        </div>
      </div>

      {/* Procedure Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs printable-card">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3 pb-2 border-b border-slate-100">
          <ClipboardList className="w-4 h-4 text-indigo-600" />
          <span>Experimental Procedures, Interventions &amp; Controls</span>
        </div>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif-academic">
          {method.procedureSummary}
        </p>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-start space-x-3 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>Scientific Rigor Assessment:</strong> Study procedures must distinguish active interventions from observational surveys. Causal claims in ResearchLens AI are restricted to studies with randomized control or robust quasi-experimental controls.
          </div>
        </div>
      </div>
    </div>
  );
};
