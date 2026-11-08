/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, BookOpen, Users, Compass, AlertTriangle, Layers, FileCheck } from 'lucide-react';
import { ResearchReport } from '../types/research';

interface ExecutiveSummaryHeaderProps {
  report: ResearchReport;
  fileName?: string;
  isSample?: boolean;
}

export const ExecutiveSummaryHeader: React.FC<ExecutiveSummaryHeaderProps> = ({
  report,
  fileName,
  isSample,
}) => {
  if (!report.isResearchPaper) {
    return (
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 sm:p-8 mb-8 text-amber-900">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-700 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sans-ui text-amber-950 mb-1">
              Document Not Identified as an Academic Research Paper
            </h2>
            <p className="text-sm text-amber-800 leading-relaxed mb-4">
              {report.rejectionReason || 'The uploaded file does not contain typical scientific structure, empirical methodology, or academic peer-review components.'}
            </p>
            <div className="text-xs text-amber-700/80 bg-white/60 rounded-lg p-3 border border-amber-200">
              <strong>Research Integrity Guardrail:</strong> ResearchLens AI strictly refuses to fabricate scientific reports for non-academic documents (e.g. bills, resumes, manuals, receipts).
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 mb-8 relative overflow-hidden">
      {/* Background scholarly watermark */}
      <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 text-slate-50 pointer-events-none select-none">
        <BookOpen className="w-64 h-64 opacity-40 text-slate-200" />
      </div>

      <div className="relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {isSample && (
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Verified Benchmark Sample
            </span>
          )}

          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>{report.methodology.studyDesignType}</span>
          </span>

          {report.publicationYear && (
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{report.publicationYear}</span>
            </span>
          )}

          {report.publicationVenue && (
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1 truncate max-w-xs">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{report.publicationVenue}</span>
            </span>
          )}
        </div>

        {/* Paper Title */}
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 font-serif-academic tracking-tight leading-tight mb-4">
          {report.title}
        </h1>

        {/* Authors */}
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6 flex-wrap gap-y-1">
          <Users className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-800">
            {report.authors && report.authors.length > 0
              ? report.authors.join(' • ')
              : 'Authors not reported in the paper'}
          </span>
          {fileName && (
            <span className="text-xs text-slate-400 font-mono hidden md:inline">
              (Source: {fileName})
            </span>
          )}
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Sample / Population
            </div>
            <div className="text-sm font-semibold text-slate-900 truncate" title={report.methodology.datasetOrSample}>
              {report.methodology.sampleSize || (report.methodology.datasetOrSample.length > 25 ? report.methodology.datasetOrSample.substring(0, 25) + '...' : report.methodology.datasetOrSample)}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Key Findings
            </div>
            <div className="text-sm font-semibold text-indigo-700 flex items-center space-x-1">
              <FileCheck className="w-4 h-4" />
              <span>{report.mainFindings.length} Verified Points</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Numeric Statistics
            </div>
            <div className="text-sm font-semibold text-slate-900 font-mono">
              {report.numericalResultsAndStatistics.length} Data Points
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Study Design
            </div>
            <div className="text-sm font-semibold text-slate-900 truncate" title={report.methodology.studyDesignType}>
              {report.methodology.studyDesignType}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
