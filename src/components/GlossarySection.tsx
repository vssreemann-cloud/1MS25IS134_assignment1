/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TermDefinition } from '../types/research';
import { BookOpen, Search, HelpCircle } from 'lucide-react';

interface GlossarySectionProps {
  terms: TermDefinition[];
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({ terms }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.simpleExplanation.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (!terms || terms.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
        No technical terms were singled out for explanation in this report.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs printable-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 font-sans-ui">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Important Terms &amp; Concepts (Explained Simply)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Complex academic terminology translated into plain, intuitive explanations.
          </p>
        </div>

        {terms.length > 3 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-48"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-indigo-300 transition-all shadow-2xs"
          >
            <div className="flex items-start space-x-2.5">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-slate-900 font-sans-ui mb-1">
                  {item.term}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-serif-academic">
                  {item.simpleExplanation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
