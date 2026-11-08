/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Loader2, FileSearch, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AnalysisProgressProps {
  fileName: string;
}

const STAGES = [
  { label: 'Uploading PDF to secure analysis session', icon: Loader2, duration: 2500 },
  { label: 'Reading paper structure, formulas, and tables', icon: FileSearch, duration: 4000 },
  { label: 'Extracting key empirical findings & numerical statistics', icon: Sparkles, duration: 4500 },
  { label: 'Verifying causal claims & checking author limitations', icon: ShieldCheck, duration: 3500 },
  { label: 'Preparing verified, evidence-grounded report', icon: CheckCircle2, duration: 99999 },
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ fileName }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStageIndex(1), 2500);
    const timer2 = setTimeout(() => setCurrentStageIndex(2), 6500);
    const timer3 = setTimeout(() => setCurrentStageIndex(3), 11000);
    const timer4 = setTimeout(() => setCurrentStageIndex(4), 14500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-sm relative">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600"></span>
        </span>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2 font-sans-ui">
        Analyzing Research Paper
      </h2>
      <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto truncate font-mono">
        {fileName}
      </p>

      {/* Dynamic Progress Stages */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-left space-y-4">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div
              key={stage.label}
              className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
                isCurrent
                  ? 'text-indigo-900 font-medium scale-[1.01]'
                  : isDone
                  ? 'text-slate-400'
                  : 'text-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : isCurrent
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span className="flex-1">{stage.label}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 mt-6 italic">
        Grounding analysis against documented PDF evidence... This typically takes 10–20 seconds.
      </p>
    </div>
  );
};
