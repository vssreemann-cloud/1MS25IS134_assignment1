/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NumericalStatistic } from '../types/research';
import { Hash, Search, Bookmark } from 'lucide-react';

interface StatisticsTableProps {
  statistics: NumericalStatistic[];
}

export const StatisticsTable: React.FC<StatisticsTableProps> = ({ statistics }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStats = statistics.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.metric.toLowerCase().includes(q) ||
      s.value.toLowerCase().includes(q) ||
      s.context.toLowerCase().includes(q) ||
      (s.unit && s.unit.toLowerCase().includes(q))
    );
  });

  if (!statistics || statistics.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
        No numerical statistics were explicitly tabulated in the paper.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden printable-card">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 font-sans-ui">
            <Hash className="w-4 h-4 text-indigo-600" />
            <span>Extracted Quantitative Metrics &amp; Statistical Context</span>
          </h3>
          <p className="text-xs text-slate-500">
            Units, effect sizes, and context preserved faithfully from the text.
          </p>
        </div>

        {statistics.length > 4 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-48"
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Metric / Variable</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">Unit</th>
              <th className="py-3 px-4">Context / Meaning</th>
              <th className="py-3 px-4 text-right">Page</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStats.map((stat, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900">
                  {stat.metric}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                  {stat.value}
                </td>
                <td className="py-3 px-4 text-xs text-slate-500 font-mono">
                  {stat.unit || '—'}
                </td>
                <td className="py-3 px-4 text-xs text-slate-600 leading-relaxed max-w-md">
                  {stat.context}
                </td>
                <td className="py-3 px-4 text-right">
                  {stat.pageNumber !== null && stat.pageNumber !== undefined ? (
                    <span className="inline-flex items-center space-x-1 text-xs text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      <Bookmark className="w-3 h-3 text-indigo-400" />
                      <span>p. {stat.pageNumber}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300 font-mono">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
