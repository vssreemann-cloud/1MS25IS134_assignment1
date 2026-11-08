/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { UploadPanel } from './components/UploadPanel';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ExecutiveSummaryHeader } from './components/ExecutiveSummaryHeader';
import { OverviewSection } from './components/OverviewSection';
import { MethodologySection } from './components/MethodologySection';
import { FindingsSection } from './components/FindingsSection';
import { StatisticsTable } from './components/StatisticsTable';
import { LimitationsAndCaveatsSection } from './components/LimitationsAndCaveatsSection';
import { GlossarySection } from './components/GlossarySection';
import { AskThePaperChat } from './components/AskThePaperChat';
import { AboutModal } from './components/AboutModal';
import { ResearchReport } from './types/research';
import { SamplePaperOption } from './data/samplePapers';
import { downloadPdfReport } from './utils/exportReport';
import {
  FileText,
  Compass,
  CheckCircle,
  ShieldAlert,
  BookOpen,
  MessageSquare,
  Sparkles,
  Printer,
  RotateCcw,
  FileDown,
  Download,
} from 'lucide-react';

type ReportTabType = 'overview' | 'methodology' | 'findings' | 'limitations' | 'glossary' | 'chat';

// Helper to safely parse JSON responses and gracefully handle HTML/non-JSON errors
async function readResponseJson<T = any>(response: Response): Promise<T> {
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      try {
        const errorJson = await response.json();
        throw new Error(errorJson.error || `Request failed with status ${response.status}`);
      } catch (err: any) {
        throw new Error(err.message || `Request failed with status ${response.status}`);
      }
    } else {
      const rawText = await response.text();
      // Extract human-readable error from HTML if possible
      const preMatch = rawText.match(/<pre>([\s\S]*?)<\/pre>/i);
      const titleMatch = rawText.match(/<title>([\s\S]*?)<\/title>/i);
      let errorSummary = preMatch ? preMatch[1].replace(/<[^>]+>/g, '').trim() : titleMatch ? titleMatch[1].trim() : '';
      if (!errorSummary) {
        errorSummary = rawText.trim().slice(0, 150) || response.statusText;
      }
      throw new Error(`Server error (${response.status}): ${errorSummary}`);
    }
  }

  if (!isJson) {
    const rawText = await response.text();
    const titleMatch = rawText.match(/<title>([\s\S]*?)<\/title>/i);
    const summary = titleMatch ? titleMatch[1].trim() : rawText.trim().slice(0, 100);
    throw new Error(`Expected JSON response from server, but received ${contentType || 'non-JSON content'}: ${summary}`);
  }

  return response.json();
}

export default function App() {
  const [activeNav, setActiveNav] = useState<'upload' | 'analysis' | 'about'>('upload');
  const [activeReportTab, setActiveReportTab] = useState<ReportTabType>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [analyzingFileName, setAnalyzingFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Session State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isSample, setIsSample] = useState(false);
  const [report, setReport] = useState<ResearchReport | null>(null);

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!report || isDownloadingPdf) return;
    try {
      setIsDownloadingPdf(true);
      await downloadPdfReport(report, fileName);
    } catch (e) {
      console.error('Failed to download PDF:', e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Handle uploading real user PDF
  const handleFileSelected = async (file: File) => {
    setIsLoading(true);
    setAnalyzingFileName(file.name);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await readResponseJson(response);
      setSessionId(data.sessionId);
      setFileName(data.fileName);
      setIsSample(false);
      setReport(data.report);
      setActiveNav('analysis');
      setActiveReportTab('overview');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      let userFriendlyMessage = err?.message || 'Failed to analyze PDF. Please verify file integrity.';
      if (err?.name === 'TypeError' && err?.message?.toLowerCase().includes('fetch')) {
        userFriendlyMessage =
          'Network connection interrupted during upload. The document may be large or the connection timed out. Please try uploading again.';
      }
      setErrorMessage(userFriendlyMessage);
      setActiveNav('upload');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting curated sample paper
  const handleSampleSelected = async (sample: SamplePaperOption) => {
    setIsLoading(true);
    setAnalyzingFileName(sample.fileName);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/samples/${sample.id}`, {
        method: 'POST',
      });

      const data = await readResponseJson(response);
      setSessionId(data.sessionId);
      setFileName(data.fileName);
      setIsSample(true);
      setReport(data.report);
      setActiveNav('analysis');
      setActiveReportTab('overview');
    } catch (err: any) {
      console.error('Failed to load sample:', err);
      setErrorMessage(err.message || 'Unable to load sample benchmark paper.');
      setActiveNav('upload');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear current document and reset session
  const handleClearSession = async () => {
    if (sessionId) {
      try {
        await fetch('/api/clear-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
      } catch (e) {
        // ignore
      }
    }

    setSessionId(null);
    setFileName('');
    setIsSample(false);
    setReport(null);
    setActiveNav('upload');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 flex flex-col font-sans-ui">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeNav}
        setActiveTab={setActiveNav}
        hasActiveSession={Boolean(report)}
        fileName={fileName}
        report={report}
        onClearSession={handleClearSession}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <AnalysisProgress fileName={analyzingFileName} />
        ) : activeNav === 'upload' || !report ? (
          <UploadPanel
            onFileSelected={handleFileSelected}
            onSampleSelected={handleSampleSelected}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        ) : (
          <div className="space-y-6">
            {/* Executive Summary Header */}
            <ExecutiveSummaryHeader report={report} fileName={fileName} isSample={isSample} />

            {report.isResearchPaper && (
              <>
                {/* Secondary Report Navigation Tabs */}
                <div className="border-b border-slate-200 bg-white rounded-xl shadow-2xs p-1.5 flex overflow-x-auto items-center gap-1.5 no-print">
                  <button
                    onClick={() => setActiveReportTab('overview')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                      activeReportTab === 'overview'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Overview &amp; Insights</span>
                  </button>

                  <button
                    onClick={() => setActiveReportTab('methodology')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                      activeReportTab === 'methodology'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Methodology &amp; Sample</span>
                  </button>

                  <button
                    onClick={() => setActiveReportTab('findings')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                      activeReportTab === 'findings'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Findings &amp; Statistics</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        activeReportTab === 'findings' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {report.mainFindings.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveReportTab('limitations')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                      activeReportTab === 'limitations'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Limitations &amp; Cautions</span>
                  </button>

                  <button
                    onClick={() => setActiveReportTab('glossary')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                      activeReportTab === 'glossary'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Glossary</span>
                    {report.importantTerms.length > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          activeReportTab === 'glossary' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {report.importantTerms.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveReportTab('chat')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 sm:ml-auto ${
                      activeReportTab === 'chat'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    <span>Ask The Paper</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>

                {/* Interactive Tab Content Panes (Hidden during Print) */}
                <div className="transition-all duration-150 print:hidden">
                  {activeReportTab === 'overview' && <OverviewSection report={report} />}

                  {activeReportTab === 'methodology' && <MethodologySection report={report} />}

                  {activeReportTab === 'findings' && (
                    <div className="space-y-8">
                      <FindingsSection findings={report.mainFindings} />
                      <StatisticsTable statistics={report.numericalResultsAndStatistics} />
                    </div>
                  )}

                  {activeReportTab === 'limitations' && (
                    <LimitationsAndCaveatsSection
                      authorLimitations={report.authorStatedLimitations}
                      aiObservations={report.aiObservationsAndCaveats}
                      practicalImplications={report.practicalImplications}
                      futureDirections={report.futureResearchDirections}
                    />
                  )}

                  {activeReportTab === 'glossary' && (
                    <GlossarySection terms={report.importantTerms} />
                  )}

                  {activeReportTab === 'chat' && sessionId && (
                    <AskThePaperChat sessionId={sessionId} report={report} />
                  )}
                </div>

                {/* Complete Multi-Section Layout (Active exclusively during browser Print/Save to PDF) */}
                <div className="hidden print:block space-y-8">
                  <OverviewSection report={report} />
                  <MethodologySection report={report} />
                  <FindingsSection findings={report.mainFindings} />
                  <StatisticsTable statistics={report.numericalResultsAndStatistics} />
                  <LimitationsAndCaveatsSection
                    authorLimitations={report.authorStatedLimitations}
                    aiObservations={report.aiObservationsAndCaveats}
                    practicalImplications={report.practicalImplications}
                    futureDirections={report.futureResearchDirections}
                  />
                  <GlossarySection terms={report.importantTerms} />
                </div>

                {/* Bottom Action Bar for Quick Download / Session Reset / Print */}
                <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 no-print">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Document session active &bull; Client &amp; server grounded</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloadingPdf}
                      className="inline-flex items-center space-x-1.5 text-white bg-indigo-600 hover:bg-indigo-700 py-1.5 px-3.5 rounded-lg font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center space-x-1.5 text-slate-700 hover:text-indigo-600 py-1.5 px-3 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Full Report</span>
                    </button>

                    <button
                      onClick={handleClearSession}
                      className="inline-flex items-center space-x-1.5 text-red-600 hover:text-red-700 py-1.5 px-3 rounded-lg hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Analyze Another Paper</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">ResearchLens AI</span>
            <span>&mdash; Understand research. Discover insights.</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-slate-800 transition-colors">
              Methodology &amp; Integrity
            </button>
            <span>&bull;</span>
            <span>Gemini 3.8 Flash Powered</span>
          </div>
        </div>
      </footer>

      {/* About & Methodology Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
