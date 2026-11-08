/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, FileText, Download, Printer, Trash2, Info, ChevronDown, Check, FileDown, Loader2 } from 'lucide-react';
import { ResearchReport } from '../types/research';
import { downloadJsonFile, downloadMarkdownFile, downloadPdfReport, formatReportAsMarkdown } from '../utils/exportReport';

interface NavbarProps {
  activeTab: 'upload' | 'analysis' | 'about';
  setActiveTab: (tab: 'upload' | 'analysis' | 'about') => void;
  hasActiveSession: boolean;
  fileName?: string;
  report?: ResearchReport | null;
  onClearSession: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasActiveSession,
  fileName,
  report,
  onClearSession,
  onOpenAbout,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExportPdf = async () => {
    if (!report || isExportingPdf) return;
    try {
      setIsExportingPdf(true);
      await downloadPdfReport(report, fileName);
    } catch (e) {
      console.error('Failed to export PDF:', e);
    } finally {
      setIsExportingPdf(false);
      setShowExportMenu(false);
    }
  };

  const handlePrint = () => {
    setShowExportMenu(false);
    window.print();
  };

  const handleExportJson = () => {
    if (!report) return;
    const sanitizedTitle = (report.title || 'research_report').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadJsonFile(report, `${sanitizedTitle}_analysis.json`);
    setShowExportMenu(false);
  };

  const handleExportMarkdown = () => {
    if (!report) return;
    const md = formatReportAsMarkdown(report, fileName);
    const sanitizedTitle = (report.title || 'research_report').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadMarkdownFile(md, `${sanitizedTitle}_summary.md`);
    setShowExportMenu(false);
  };

  const handleCopyMarkdown = async () => {
    if (!report) return;
    const md = formatReportAsMarkdown(report, fileName);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowExportMenu(false);
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('upload')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-900 flex items-center justify-center text-white shadow-xs ring-1 ring-indigo-950/20 shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-semibold text-base sm:text-lg text-slate-900 tracking-tight font-sans-ui">
                  ResearchLens <span className="text-indigo-600 font-bold">AI</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                  Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">Understand research. Discover insights.</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'upload'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Upload
            </button>

            {hasActiveSession && (
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Analysis</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
              </button>
            )}

            <button
              onClick={onOpenAbout}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Methodology</span>
            </button>
          </nav>

          {/* Actions: Export & Reset */}
          <div className="flex items-center space-x-2">
            {hasActiveSession && report && (
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                  <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Export Report
                    </div>

                    {/* Direct PDF Download */}
                    <button
                      onClick={handleExportPdf}
                      disabled={isExportingPdf}
                      className="w-full text-left px-3 py-2 text-xs text-indigo-700 bg-indigo-50/60 hover:bg-indigo-50 flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2">
                        {isExportingPdf ? (
                          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                        ) : (
                          <FileDown className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="font-semibold">{isExportingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
                      </div>
                      <span className="text-[10px] text-indigo-700 font-mono font-bold bg-indigo-100/80 px-1.5 py-0.5 rounded">
                        .pdf
                      </span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleExportJson}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-medium">Download JSON</span>
                      <span className="text-[10px] text-slate-400 font-mono">.json</span>
                    </button>
                    <button
                      onClick={handleExportMarkdown}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-medium">Download Markdown</span>
                      <span className="text-[10px] text-slate-400 font-mono">.md</span>
                    </button>
                    <button
                      onClick={handleCopyMarkdown}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-medium">{copied ? 'Copied to Clipboard!' : 'Copy Markdown Text'}</span>
                      {copied && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handlePrint}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-medium">Print / Browser Print</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {hasActiveSession && (
              <button
                onClick={onClearSession}
                title="Remove current document from session"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
