/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePdfFile, MAX_PDF_SIZE_BYTES } from './fileValidation';
import { sanitizeResearchReport } from './researchValidator';
import { formatReportAsMarkdown } from './exportReport';
import { SAMPLE_PAPERS } from '../data/samplePapers';

test('validatePdfFile correctly validates PDFs', () => {
  // Valid PDF
  const valid = validatePdfFile({ name: 'paper.pdf', size: 1024 * 500, type: 'application/pdf' });
  assert.equal(valid.valid, true);
  assert.equal(valid.error, undefined);

  // Invalid extension
  const invalidExt = validatePdfFile({ name: 'paper.docx', size: 5000 });
  assert.equal(invalidExt.valid, false);
  assert.match(invalidExt.error!, /standard PDF document/);

  // Empty file
  const empty = validatePdfFile({ name: 'empty.pdf', size: 0 });
  assert.equal(empty.valid, false);
  assert.match(empty.error!, /empty/);

  // Oversized file
  const oversized = validatePdfFile({ name: 'huge.pdf', size: MAX_PDF_SIZE_BYTES + 1000 });
  assert.equal(oversized.valid, false);
  assert.match(oversized.error!, /File is too large/);
});

test('sanitizeResearchReport handles non-research paper rejection', () => {
  const rejectedRaw = {
    isResearchPaper: false,
    rejectionReason: 'The provided document is an electrical utility invoice, not a research paper.',
  };

  const result = sanitizeResearchReport(rejectedRaw);
  assert.equal(result.isValid, true);
  assert.equal(result.sanitizedReport?.isResearchPaper, false);
  assert.equal(
    result.sanitizedReport?.rejectionReason,
    'The provided document is an electrical utility invoice, not a research paper.'
  );
});

test('sanitizeResearchReport cleans and preserves research integrity fields', () => {
  const sample = SAMPLE_PAPERS[0].report;
  const result = sanitizeResearchReport(sample);

  assert.equal(result.isValid, true);
  const rep = result.sanitizedReport!;
  assert.equal(rep.isResearchPaper, true);
  assert.equal(rep.title, sample.title);
  assert.equal(rep.authors.length, 3);
  assert.equal(rep.publicationYear, '2024');
  assert.equal(rep.methodology.sampleSize, 'N = 124 (62 intervention, 62 control; 116 completed trial, 6.5% attrition)');
  assert.equal(rep.mainFindings.length >= 3, true);

  // Check causal type preservation and evidence
  const firstFinding = rep.mainFindings[0];
  assert.equal(firstFinding.causalType, 'causal');
  assert.equal(firstFinding.evidence?.pageNumber, 5);

  // Check author limitations vs AI observations separation
  assert.equal(rep.authorStatedLimitations.length, 3);
  assert.equal(rep.aiObservationsAndCaveats.length, 3);
});

test('sanitizeResearchReport handles missing or malformed fields safely without crashing', () => {
  const rawMalformed = {
    title: '  Incomplete Study on Memory  ',
    // missing authors, methodology, findings
  };

  const result = sanitizeResearchReport(rawMalformed);
  assert.equal(result.isValid, true);
  const rep = result.sanitizedReport!;
  assert.equal(rep.title, 'Incomplete Study on Memory');
  assert.deepEqual(rep.authors, []);
  assert.equal(rep.publicationVenue, null);
  assert.equal(rep.publicationYear, null);
  assert.equal(rep.methodology.datasetOrSample, 'Not reported in the paper');
  assert.deepEqual(rep.mainFindings, []);
  assert.deepEqual(rep.importantTerms, []);
});

test('formatReportAsMarkdown generates structured markdown report with citations', () => {
  const sample = SAMPLE_PAPERS[0].report;
  const md = formatReportAsMarkdown(sample, 'sleep_trial.pdf');

  assert.match(md, /# ResearchLens AI Analysis/);
  assert.match(md, /Sleep Extension Improves Working Memory/);
  assert.match(md, /## Methodology & Study Design/);
  assert.match(md, /p\. 5/);
  assert.match(md, /\[AI Observation\]/);
  assert.match(md, /## Important Terms & Concepts/);
});

test('downloadPdfReport function is exported and callable', async () => {
  const { downloadPdfReport } = await import('./exportReport');
  assert.equal(typeof downloadPdfReport, 'function');
});
