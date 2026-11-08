/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResearchReport } from '../types/research';

export function formatReportAsMarkdown(report: ResearchReport, fileName?: string): string {
  const parts: string[] = [];

  parts.push(`# ResearchLens AI Analysis: ${report.title}`);
  if (fileName) parts.push(`*Analyzed from file: ${fileName}*`);
  parts.push(`*Generated on: ${new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}*\n`);

  // Metadata
  parts.push('## Document Information');
  parts.push(`- **Title**: ${report.title}`);
  parts.push(`- **Authors**: ${report.authors.length > 0 ? report.authors.join(', ') : 'Not reported in the paper'}`);
  parts.push(`- **Venue**: ${report.publicationVenue || 'Not reported in the paper'}`);
  parts.push(`- **Year**: ${report.publicationYear || 'Not reported in the paper'}`);
  parts.push('');

  // Overview
  parts.push('## Plain-Language Overview');
  parts.push(report.plainLanguageOverview);
  parts.push('');

  // Problem & Objectives
  parts.push('## Problem & Objectives');
  parts.push(`### Research Problem\n${report.researchProblemAndMotivation}\n`);
  if (report.researchQuestionsAndObjectives.length > 0) {
    parts.push('### Research Questions & Objectives');
    report.researchQuestionsAndObjectives.forEach((q) => parts.push(`- ${q}`));
    parts.push('');
  }

  // Methodology
  parts.push('## Methodology & Study Design');
  parts.push(`- **Design Type**: ${report.methodology.studyDesignType}`);
  parts.push(`- **Dataset / Sample**: ${report.methodology.datasetOrSample}`);
  if (report.methodology.sampleSize) {
    parts.push(`- **Sample Size**: ${report.methodology.sampleSize}`);
  }
  parts.push(`\n**Procedure Summary**:\n${report.methodology.procedureSummary}\n`);

  // Key Insights
  if (report.keyInsights.length > 0) {
    parts.push('## Key Insights (Non-repetitive summary)');
    report.keyInsights.forEach((insight, idx) => parts.push(`${idx + 1}. ${insight}`));
    parts.push('');
  }

  // Main Findings with Evidence
  parts.push('## Main Findings & Evidence');
  report.mainFindings.forEach((f, idx) => {
    parts.push(`### Finding ${idx + 1} (${f.causalType.toUpperCase()})`);
    parts.push(f.finding);
    if (f.statisticalContext) {
      parts.push(`- *Statistical Context*: ${f.statisticalContext}`);
    }
    if (f.evidence) {
      const page = f.evidence.pageNumber !== null ? `p. ${f.evidence.pageNumber}` : 'Page unverified';
      const section = f.evidence.section ? ` [${f.evidence.section}]` : '';
      parts.push(`- *Evidence Reference (${page}${section})*: "${f.evidence.quoteOrExcerpt}"`);
    }
    parts.push('');
  });

  // Numerical Statistics
  if (report.numericalResultsAndStatistics.length > 0) {
    parts.push('## Numerical Results & Statistics');
    report.numericalResultsAndStatistics.forEach((s) => {
      const page = s.pageNumber !== null ? ` (p. ${s.pageNumber})` : '';
      const unit = s.unit ? ` ${s.unit}` : '';
      parts.push(`- **${s.metric}**: ${s.value}${unit} — *${s.context}*${page}`);
    });
    parts.push('');
  }

  // Limitations
  parts.push('## Limitations & Cautions');
  parts.push('### Stated by Authors:');
  if (report.authorStatedLimitations.length > 0) {
    report.authorStatedLimitations.forEach((l) => parts.push(`- ${l}`));
  } else {
    parts.push('- No specific limitations stated by authors in the text.');
  }
  parts.push('');

  parts.push('### AI Observations & Caveats (Labeled AI Analysis):');
  if (report.aiObservationsAndCaveats.length > 0) {
    report.aiObservationsAndCaveats.forEach((c) => parts.push(`- [AI Observation] ${c}`));
  } else {
    parts.push('- No additional caveats identified beyond author remarks.');
  }
  parts.push('');

  // Practical Implications
  if (report.practicalImplications.length > 0) {
    parts.push('## Practical Implications');
    report.practicalImplications.forEach((p) => parts.push(`- ${p}`));
    parts.push('');
  }

  // Future Directions
  if (report.futureResearchDirections.length > 0) {
    parts.push('## Future Directions');
    report.futureResearchDirections.forEach((fd) => {
      const tag = fd.source === 'author' ? '[Author Suggestion]' : '[AI Observation]';
      parts.push(`- ${tag} ${fd.suggestion}${fd.rationale ? ` (${fd.rationale})` : ''}`);
    });
    parts.push('');
  }

  // Conclusion
  parts.push('## Conclusion');
  parts.push(report.conclusion);
  parts.push('');

  // Important Terms
  if (report.importantTerms.length > 0) {
    parts.push('## Important Terms & Concepts');
    report.importantTerms.forEach((t) => {
      parts.push(`- **${t.term}**: ${t.simpleExplanation}`);
    });
    parts.push('');
  }

  return parts.join('\n');
}

export function downloadJsonFile(data: any, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMarkdownFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadPdfReport(report: ResearchReport, fileName?: string) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm
  let yPos = 20;

  // Helper to ensure enough space on current page or add new page
  const ensureSpace = (needed: number) => {
    if (yPos + needed > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Helper for standardized section headings
  const addSectionHeading = (title: string) => {
    ensureSpace(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(67, 56, 202); // indigo-700
    doc.text(title.toUpperCase(), margin, yPos);
    yPos += 2;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, margin + contentWidth, yPos);
    yPos += 5;
    doc.setTextColor(30, 41, 59); // slate-800
  };

  // 1. Header Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(99, 102, 241); // indigo-500
  doc.text('RESEARCHLENS AI • EVIDENCE-GROUNDED SCIENTIFIC REPORT', margin, yPos);
  yPos += 5;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // slate-900
  const titleLines = doc.splitTextToSize(report.title, contentWidth);
  doc.text(titleLines, margin, yPos);
  yPos += titleLines.length * 6 + 2;

  // Metadata (Authors, Venue, Year)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600

  const authorsText = report.authors.length > 0 ? report.authors.join(', ') : 'Authors not explicitly stated';
  const metaLines = doc.splitTextToSize(`Authors: ${authorsText}`, contentWidth);
  doc.text(metaLines, margin, yPos);
  yPos += metaLines.length * 4.5;

  const venueYear = [
    report.publicationVenue ? `Venue: ${report.publicationVenue}` : null,
    report.publicationYear ? `Year: ${report.publicationYear}` : null,
    fileName ? `Source: ${fileName}` : null,
  ].filter(Boolean).join('   |   ');

  if (venueYear) {
    const venueLines = doc.splitTextToSize(venueYear, contentWidth);
    doc.text(venueLines, margin, yPos);
    yPos += venueLines.length * 4.5 + 2;
  }

  // Divider line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, yPos, margin + contentWidth, yPos);
  yPos += 6;

  // 2. Executive Plain-Language Overview
  addSectionHeading('1. Plain-Language Executive Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const overviewLines = doc.splitTextToSize(report.plainLanguageOverview, contentWidth);
  ensureSpace(overviewLines.length * 4.5 + 4);
  doc.text(overviewLines, margin, yPos);
  yPos += overviewLines.length * 4.5 + 5;

  // 3. Problem & Objectives
  addSectionHeading('2. Research Problem & Objectives');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Core Problem Investigated:', margin, yPos);
  yPos += 4;
  doc.setFont('helvetica', 'normal');
  const probLines = doc.splitTextToSize(report.researchProblemAndMotivation, contentWidth);
  ensureSpace(probLines.length * 4.5 + 4);
  doc.text(probLines, margin, yPos);
  yPos += probLines.length * 4.5 + 3;

  if (report.researchQuestionsAndObjectives.length > 0) {
    ensureSpace(report.researchQuestionsAndObjectives.length * 5 + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Research Questions / Objectives:', margin, yPos);
    yPos += 4;
    doc.setFont('helvetica', 'normal');
    report.researchQuestionsAndObjectives.forEach((q) => {
      const qLines = doc.splitTextToSize(`• ${q}`, contentWidth - 4);
      ensureSpace(qLines.length * 4.5);
      doc.text(qLines, margin + 2, yPos);
      yPos += qLines.length * 4.5;
    });
    yPos += 3;
  }

  // 4. Methodology & Study Design
  addSectionHeading('3. Methodology & Study Design');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`Study Design Type: `, margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(report.methodology.studyDesignType, margin + 34, yPos);
  yPos += 4.5;

  if (report.methodology.sampleSize) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Cohort / Sample: `, margin, yPos);
    doc.setFont('helvetica', 'normal');
    const sampleText = `${report.methodology.sampleSize} (${report.methodology.datasetOrSample})`;
    const sampleLines = doc.splitTextToSize(sampleText, contentWidth - 30);
    doc.text(sampleLines, margin + 30, yPos);
    yPos += sampleLines.length * 4.5 + 1;
  }

  doc.setFont('helvetica', 'bold');
  doc.text('Procedure Summary:', margin, yPos);
  yPos += 4;
  doc.setFont('helvetica', 'normal');
  const procLines = doc.splitTextToSize(report.methodology.procedureSummary, contentWidth);
  ensureSpace(procLines.length * 4.5 + 4);
  doc.text(procLines, margin, yPos);
  yPos += procLines.length * 4.5 + 5;

  // 5. Key Empirical Findings
  addSectionHeading('4. Core Empirical Findings & Evidence Citations');
  report.mainFindings.forEach((f, idx) => {
    const causalTag = f.causalType ? ` [${f.causalType.toUpperCase()}]` : '';
    const statText = f.statisticalContext ? ` (Statistics: ${f.statisticalContext})` : '';
    const findingHeading = `#${idx + 1}: ${f.finding}${causalTag}${statText}`;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const headingLines = doc.splitTextToSize(findingHeading, contentWidth);
    ensureSpace(headingLines.length * 4.5 + 10);
    doc.text(headingLines, margin, yPos);
    yPos += headingLines.length * 4.5 + 1;

    if (f.evidence) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const pageCitation = f.evidence.pageNumber !== null ? `[Page ${f.evidence.pageNumber}] ` : '';
      const sectionText = f.evidence.section ? `[${f.evidence.section}] ` : '';
      const quoteLines = doc.splitTextToSize(`Evidence: "${f.evidence.quoteOrExcerpt}" ${pageCitation}${sectionText}`, contentWidth - 4);
      ensureSpace(quoteLines.length * 4 + 2);
      doc.text(quoteLines, margin + 4, yPos);
      yPos += quoteLines.length * 4 + 2.5;
      doc.setTextColor(30, 41, 59);
    }
  });
  yPos += 2;

  // 6. Quantitative Statistics Table
  if (report.numericalResultsAndStatistics.length > 0) {
    addSectionHeading('5. Quantitative Statistics & Extracted Metrics');
    report.numericalResultsAndStatistics.forEach((s) => {
      const page = s.pageNumber !== null ? ` (p. ${s.pageNumber})` : '';
      const unit = s.unit ? ` ${s.unit}` : '';
      const statLine = `• ${s.metric}: ${s.value}${unit} — ${s.context}${page}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const sLines = doc.splitTextToSize(statLine, contentWidth - 2);
      ensureSpace(sLines.length * 4.5);
      doc.text(sLines, margin + 2, yPos);
      yPos += sLines.length * 4.5;
    });
    yPos += 5;
  }

  // 7. Limitations & AI Cautions
  addSectionHeading('6. Limitations & Methodological Cautions');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Limitations Stated by Authors:', margin, yPos);
  yPos += 4;
  doc.setFont('helvetica', 'normal');
  if (report.authorStatedLimitations.length > 0) {
    report.authorStatedLimitations.forEach((l) => {
      const lLines = doc.splitTextToSize(`• ${l}`, contentWidth - 4);
      ensureSpace(lLines.length * 4.5);
      doc.text(lLines, margin + 2, yPos);
      yPos += lLines.length * 4.5;
    });
  } else {
    doc.text('• None explicitly stated in document.', margin + 2, yPos);
    yPos += 4.5;
  }
  yPos += 2;

  doc.setFont('helvetica', 'bold');
  doc.text('AI Analytical Observations & Cautions:', margin, yPos);
  yPos += 4;
  doc.setFont('helvetica', 'normal');
  if (report.aiObservationsAndCaveats.length > 0) {
    report.aiObservationsAndCaveats.forEach((c) => {
      const cLines = doc.splitTextToSize(`• [AI Observation] ${c}`, contentWidth - 4);
      ensureSpace(cLines.length * 4.5);
      doc.text(cLines, margin + 2, yPos);
      yPos += cLines.length * 4.5;
    });
  }
  yPos += 5;

  // 8. Glossary
  if (report.importantTerms.length > 0) {
    addSectionHeading('7. Scientific Terms & Explanations');
    report.importantTerms.forEach((t) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      const termLine = `• ${t.term}: `;
      const termWidth = doc.getTextWidth(termLine);
      doc.setFont('helvetica', 'normal');
      const defLines = doc.splitTextToSize(t.simpleExplanation, contentWidth - termWidth - 4);
      ensureSpace(Math.max(defLines.length * 4.5, 6));
      doc.setFont('helvetica', 'bold');
      doc.text(termLine, margin + 2, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(defLines, margin + 2 + termWidth, yPos);
      yPos += defLines.length * 4.5 + 1.5;
    });
  }

  // Running Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);
    doc.text('ResearchLens AI • Evidence-Grounded Scientific Analysis Report', margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, margin + contentWidth - 18, pageHeight - 8);
  }

  // Trigger browser download
  const sanitizedTitle = (report.title || 'research_report').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${sanitizedTitle}_report.pdf`);
}
