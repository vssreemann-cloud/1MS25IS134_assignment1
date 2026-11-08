/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResearchReport, FindingItem, NumericalStatistic, FutureDirection, TermDefinition } from '../types/research';

export interface ValidationReportResult {
  isValid: boolean;
  sanitizedReport?: ResearchReport;
  error?: string;
}

export function sanitizeResearchReport(raw: any): ValidationReportResult {
  if (!raw || typeof raw !== 'object') {
    return {
      isValid: false,
      error: 'The analysis response did not contain a valid JSON object.',
    };
  }

  // Check if Gemini rejected the document as non-research paper
  if (raw.isResearchPaper === false) {
    return {
      isValid: true,
      sanitizedReport: {
        isResearchPaper: false,
        rejectionReason: typeof raw.rejectionReason === 'string' && raw.rejectionReason.trim().length > 0
          ? raw.rejectionReason
          : 'The uploaded file does not appear to be an academic or scientific research paper, or it was unreadable.',
        title: raw.title || 'Non-Research Document',
        authors: Array.isArray(raw.authors) ? raw.authors : [],
        publicationVenue: null,
        publicationYear: null,
        plainLanguageOverview: raw.plainLanguageOverview || '',
        researchProblemAndMotivation: '',
        researchQuestionsAndObjectives: [],
        methodology: {
          studyDesignType: 'N/A',
          description: '',
          datasetOrSample: 'N/A',
          sampleSize: null,
          procedureSummary: '',
        },
        mainFindings: [],
        keyInsights: [],
        numericalResultsAndStatistics: [],
        authorStatedLimitations: [],
        aiObservationsAndCaveats: [],
        practicalImplications: [],
        futureResearchDirections: [],
        conclusion: '',
        importantTerms: [],
      },
    };
  }

  // Validate title
  const title = typeof raw.title === 'string' && raw.title.trim().length > 0
    ? raw.title.trim()
    : 'Untitled Research Paper';

  // Authors
  const authors: string[] = Array.isArray(raw.authors)
    ? raw.authors.filter((a: any) => typeof a === 'string' && a.trim().length > 0)
    : [];

  const publicationVenue = typeof raw.publicationVenue === 'string' && raw.publicationVenue.trim().length > 0
    ? raw.publicationVenue.trim()
    : null;

  const publicationYear = typeof raw.publicationYear === 'string' && raw.publicationYear.trim().length > 0
    ? raw.publicationYear.trim()
    : null;

  const plainLanguageOverview = typeof raw.plainLanguageOverview === 'string'
    ? raw.plainLanguageOverview.trim()
    : 'No plain-language summary was generated for this paper.';

  const researchProblemAndMotivation = typeof raw.researchProblemAndMotivation === 'string'
    ? raw.researchProblemAndMotivation.trim()
    : 'Not reported in the paper';

  const researchQuestionsAndObjectives: string[] = Array.isArray(raw.researchQuestionsAndObjectives)
    ? raw.researchQuestionsAndObjectives.filter((q: any) => typeof q === 'string' && q.trim().length > 0)
    : [];

  // Methodology
  const rawMethod = raw.methodology || {};
  const methodology = {
    studyDesignType: typeof rawMethod.studyDesignType === 'string' && rawMethod.studyDesignType.trim().length > 0
      ? rawMethod.studyDesignType.trim()
      : 'Not explicitly specified',
    description: typeof rawMethod.description === 'string' && rawMethod.description.trim().length > 0
      ? rawMethod.description.trim()
      : 'Methodology details not reported in the paper.',
    datasetOrSample: typeof rawMethod.datasetOrSample === 'string' && rawMethod.datasetOrSample.trim().length > 0
      ? rawMethod.datasetOrSample.trim()
      : 'Not reported in the paper',
    sampleSize: typeof rawMethod.sampleSize === 'string' && rawMethod.sampleSize.trim().length > 0
      ? rawMethod.sampleSize.trim()
      : null,
    procedureSummary: typeof rawMethod.procedureSummary === 'string' && rawMethod.procedureSummary.trim().length > 0
      ? rawMethod.procedureSummary.trim()
      : 'Procedure summary not reported in the paper.',
  };

  // Main Findings
  const rawFindings: any[] = Array.isArray(raw.mainFindings) ? raw.mainFindings : [];
  const mainFindings: FindingItem[] = rawFindings.map((item, index) => {
    const id = item.id || `finding-${index + 1}`;
    const finding = typeof item.finding === 'string' ? item.finding.trim() : `Finding ${index + 1}`;
    const statisticalContext = typeof item.statisticalContext === 'string' && item.statisticalContext.trim().length > 0
      ? item.statisticalContext.trim()
      : null;

    const validCausalTypes = ['causal', 'correlational', 'observational', 'descriptive', 'unspecified'];
    const causalType = validCausalTypes.includes(item.causalType) ? item.causalType : 'unspecified';

    let evidence = null;
    if (item.evidence && typeof item.evidence === 'object') {
      const pageNumber = typeof item.evidence.pageNumber === 'number' && !isNaN(item.evidence.pageNumber)
        ? Math.max(1, Math.round(item.evidence.pageNumber))
        : null;
      const quoteOrExcerpt = typeof item.evidence.quoteOrExcerpt === 'string'
        ? item.evidence.quoteOrExcerpt.trim()
        : '';
      const section = typeof item.evidence.section === 'string' ? item.evidence.section.trim() : null;

      if (quoteOrExcerpt.length > 0 || pageNumber !== null) {
        evidence = {
          pageNumber,
          section,
          quoteOrExcerpt: quoteOrExcerpt || 'Evidence cited from manuscript text.',
        };
      }
    }

    return {
      id,
      finding,
      statisticalContext,
      causalType,
      evidence,
    };
  });

  // Key Insights
  const rawInsights = Array.isArray(raw.keyInsights) ? raw.keyInsights : [];
  const keyInsights: string[] = rawInsights
    .filter((k: any) => typeof k === 'string' && k.trim().length > 0)
    .slice(0, 7);

  // Numerical results & statistics
  const rawStats = Array.isArray(raw.numericalResultsAndStatistics) ? raw.numericalResultsAndStatistics : [];
  const numericalResultsAndStatistics: NumericalStatistic[] = rawStats.map((s: any) => ({
    metric: typeof s.metric === 'string' ? s.metric.trim() : 'Metric',
    value: typeof s.value === 'string' ? s.value.trim() : String(s.value ?? 'N/A'),
    unit: typeof s.unit === 'string' && s.unit.trim().length > 0 ? s.unit.trim() : null,
    context: typeof s.context === 'string' ? s.context.trim() : 'Context not provided',
    pageNumber: typeof s.pageNumber === 'number' && !isNaN(s.pageNumber) ? Math.round(s.pageNumber) : null,
  }));

  // Author Limitations
  const authorStatedLimitations: string[] = Array.isArray(raw.authorStatedLimitations)
    ? raw.authorStatedLimitations.filter((l: any) => typeof l === 'string' && l.trim().length > 0)
    : [];

  // AI Observations and Caveats
  const aiObservationsAndCaveats: string[] = Array.isArray(raw.aiObservationsAndCaveats)
    ? raw.aiObservationsAndCaveats.filter((c: any) => typeof c === 'string' && c.trim().length > 0)
    : [];

  // Practical Implications
  const practicalImplications: string[] = Array.isArray(raw.practicalImplications)
    ? raw.practicalImplications.filter((p: any) => typeof p === 'string' && p.trim().length > 0)
    : [];

  // Future research directions
  const rawFuture = Array.isArray(raw.futureResearchDirections) ? raw.futureResearchDirections : [];
  const futureResearchDirections: FutureDirection[] = rawFuture.map((f: any) => ({
    suggestion: typeof f.suggestion === 'string' ? f.suggestion.trim() : String(f),
    source: f.source === 'author' || f.source === 'ai_observation' ? f.source : 'author',
    rationale: typeof f.rationale === 'string' ? f.rationale.trim() : undefined,
  }));

  // Conclusion
  const conclusion = typeof raw.conclusion === 'string' && raw.conclusion.trim().length > 0
    ? raw.conclusion.trim()
    : 'Not explicitly summarized in the paper.';

  // Important terms
  const rawTerms = Array.isArray(raw.importantTerms) ? raw.importantTerms : [];
  const importantTerms: TermDefinition[] = rawTerms.map((t: any) => ({
    term: typeof t.term === 'string' ? t.term.trim() : 'Term',
    simpleExplanation: typeof t.simpleExplanation === 'string' ? t.simpleExplanation.trim() : '',
  }));

  return {
    isValid: true,
    sanitizedReport: {
      isResearchPaper: true,
      title,
      authors,
      publicationVenue,
      publicationYear,
      plainLanguageOverview,
      researchProblemAndMotivation,
      researchQuestionsAndObjectives,
      methodology,
      mainFindings,
      keyInsights,
      numericalResultsAndStatistics,
      authorStatedLimitations,
      aiObservationsAndCaveats,
      practicalImplications,
      futureResearchDirections,
      conclusion,
      importantTerms,
    },
  };
}
