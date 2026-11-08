/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, BookOpen, AlertCircle, FileCheck, Lock, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans-ui">
                About ResearchLens AI
              </h3>
              <p className="text-xs text-slate-500">Methodology &amp; Research Integrity Architecture</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center space-x-1.5 font-sans-ui">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Core Mission</span>
            </h4>
            <p className="text-slate-600 font-serif-academic">
              ResearchLens AI bridges the gap between dense scientific literature and actionable comprehension for students, researchers, physicians, and curious readers.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center space-x-1.5 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Research Integrity Rules</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-indigo-600">•</span>
                <span><strong>Zero-Hallucination Grounding:</strong> Claims are grounded strictly in the uploaded document. If an author, venue, sample size, or statistic is missing, it is reported as null or &ldquo;Not reported in the paper&rdquo;.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-indigo-600">•</span>
                <span><strong>Causal vs. Correlational Rigor:</strong> We never conflate correlation with causation. Only experimental designs with randomized controls earn the &ldquo;Causal Inference&rdquo; label.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-indigo-600">•</span>
                <span><strong>Negative &amp; Null Results Preserved:</strong> Statistically non-significant outcomes (e.g. p &gt; 0.05) are faithfully preserved. Absence of significance is never rewritten as proof of equivalence.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-indigo-600">•</span>
                <span><strong>Document Citations:</strong> Page numbers and excerpted quotations are provided for every key finding where identifiable from the PDF.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center space-x-1.5 font-sans-ui">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Security &amp; Privacy</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Files uploaded to ResearchLens AI are analyzed server-side in ephemeral sessions using Google GenAI SDK. No uploaded papers are permanently retained or stored in public repositories. Gemini API keys are maintained exclusively in server secrets.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
