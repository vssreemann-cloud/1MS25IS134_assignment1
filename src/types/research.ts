/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EvidenceRef {
  pageNumber: number | null; // null if unstated in the paper
  section?: string | null;
  quoteOrExcerpt: string;
}

export interface FindingItem {
  id: string;
  finding: string;
  statisticalContext?: string | null; // e.g. "p = 0.03, Cohen's d = 0.46" or "No statistically significant difference (p = 0.18)"
  causalType: 'causal' | 'correlational' | 'observational' | 'descriptive' | 'unspecified';
  evidence?: EvidenceRef | null;
}

export interface NumericalStatistic {
  metric: string;
  value: string;
  unit?: string | null;
  context: string;
  pageNumber?: number | null;
}

export interface TermDefinition {
  term: string;
  simpleExplanation: string;
}

export interface FutureDirection {
  suggestion: string;
  source: 'author' | 'ai_observation';
  rationale?: string;
}

export interface ResearchReport {
  isResearchPaper: boolean; // false if unreadable or not an academic/scientific research paper
  rejectionReason?: string | null;
  title: string;
  authors: string[];
  publicationVenue: string | null;
  publicationYear: string | null;
  plainLanguageOverview: string; // 150-250 words
  researchProblemAndMotivation: string;
  researchQuestionsAndObjectives: string[];
  methodology: {
    studyDesignType: string; // e.g. "Randomized Controlled Trial", "Cross-Sectional Survey", etc.
    description: string;
    datasetOrSample: string; // sample size, demographics, or "Not reported in the paper"
    sampleSize?: string | null;
    procedureSummary: string;
  };
  mainFindings: FindingItem[];
  keyInsights: string[]; // 5 concise, non-repetitive points
  numericalResultsAndStatistics: NumericalStatistic[];
  authorStatedLimitations: string[];
  aiObservationsAndCaveats: string[]; // Explicitly labeled as AI observations
  practicalImplications: string[];
  futureResearchDirections: FutureDirection[];
  conclusion: string;
  importantTerms: TermDefinition[];
}

export interface AnalysisSession {
  sessionId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  isSample: boolean;
  fileUri?: string | null;
  report: ResearchReport;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  pageReferences?: number[];
  directQuotes?: string[];
  isAiInterpretation?: boolean;
}
