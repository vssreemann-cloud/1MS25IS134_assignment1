/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { validatePdfFile, MAX_PDF_SIZE_BYTES } from '../utils/fileValidation';
import { SAMPLE_PAPERS, SamplePaperOption } from '../data/samplePapers';

interface UploadPanelProps {
  onFileSelected: (file: File) => void;
  onSampleSelected: (sample: SamplePaperOption) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({
  onFileSelected,
  onSampleSelected,
  isLoading,
  errorMessage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const processFile = (file: File) => {
    setLocalError(null);
    const validation = validatePdfFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      setLocalError(validation.error || 'Invalid file.');
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const displayError = errorMessage || localError;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4 tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Evidence-Grounded Document AI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight font-sans-ui mb-3">
          Understand Research. <span className="text-indigo-600">Discover Insights.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload any scientific or academic paper PDF. ResearchLens AI synthesizes plain-language overviews,
          extracts statistical evidence, rigorously flags limitations, and enables grounded Q&amp;A.
        </p>
      </div>

      {/* Error Callout */}
      {displayError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start space-x-3 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-900 mb-0.5">Upload Error</h4>
            <p>{displayError}</p>
          </div>
        </div>
      )}

      {/* Main Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-white ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01] shadow-md ring-4 ring-indigo-100'
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/70 shadow-xs'
        } ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-xs">
          <Upload className="w-8 h-8 text-indigo-600 animate-bounce duration-1000" />
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 font-sans-ui">
          Drop your research paper PDF here, or <span className="text-indigo-600 underline underline-offset-4">browse files</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
          Supported format: Standard academic PDF up to {MAX_PDF_SIZE_BYTES / (1024 * 1024)} MB. Tables, formulas, and charts are parsed automatically.
        </p>

        <div className="inline-flex items-center space-x-4 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 rounded-lg px-3.5 py-1.5">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>PDF format (.pdf)</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict zero-hallucination rules</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Client &amp; server verified</span>
          </span>
        </div>
      </div>

      {/* Instant Sample Papers Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-sans-ui">
              Or Explore Curated Benchmark Papers
            </h3>
            <p className="text-xs text-slate-500">
              Test ResearchLens AI immediately with authentic peer-reviewed studies (fully grounded).
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
            Demo Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_PAPERS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => !isLoading && onSampleSelected(sample)}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group text-left relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                    {sample.badge}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[140px]">{sample.fileName}</span>
                  </span>
                </div>

                <h4 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5 font-serif-academic leading-snug">
                  {sample.name}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {sample.abstract}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-medium">
                <span>Load Sample Report</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Privacy Card */}
      <div className="mt-10 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Privacy &amp; Research Integrity Commitment:</span>{' '}
          Files are processed in-session strictly for document synthesis. No permanent document storage is retained,
          no private PDF content is committed, and Gemini API keys remain securely guarded on the server.
        </div>
      </div>
    </div>
  );
};
