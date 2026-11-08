/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResearchReport } from '../types/research';

export interface SamplePaperOption {
  id: string;
  badge: string;
  name: string;
  abstract: string;
  field: string;
  fileName: string;
  report: ResearchReport;
}

export const SAMPLE_PAPERS: SamplePaperOption[] = [
  {
    id: 'sample-sleep-cognition',
    badge: 'Clinical RCT',
    name: 'Sleep Extension & Working Memory in College Students (2024)',
    abstract: 'An 8-week randomized controlled trial evaluating nocturnal sleep extension on working memory capacity and attentional control among undergraduates.',
    field: 'Cognitive Neuroscience & Behavioral Medicine',
    fileName: 'Sleep_Extension_Working_Memory_Trial_2024.pdf',
    report: {
      isResearchPaper: true,
      title: 'Sleep Extension Improves Working Memory and Attentional Control in College Students: An 8-Week Randomized Controlled Trial',
      authors: ['Dr. Elena Rostova', 'Marcus Vance, PhD', 'Sarah J. Lin, MD'],
      publicationVenue: 'Journal of Sleep and Cognitive Science',
      publicationYear: '2024',
      plainLanguageOverview: 'This 8-week randomized trial tested whether helping chronically sleep-deprived college students get 60 to 90 minutes of additional sleep each night improves their memory and focus. 124 undergraduate students with habitual sleep under 6.5 hours were randomly divided into an intervention group (which received sleep coaching, light management, and behavioral scheduling) and an active control group (which maintained habitual schedules with general wellness seminars). By week 8, the sleep extension group improved their average working memory capacity score by 6.1 points compared to the control group, a statistically significant difference (p = 0.03, Cohen’s d = 0.46). Attentional lapses on the psychomotor vigilance test also dropped significantly in the intervention group. However, the authors emphasize that adherence was self-reported via actigraphy logs, and the single-campus setting means results may not generalize to non-student adult cohorts.',
      researchProblemAndMotivation: 'Chronic partial sleep deprivation affects an estimated 60-70% of higher-education students, impairing prefrontal cortical function, emotional regulation, and academic performance. While laboratory sleep deprivation studies have demonstrated acute deficits, ecological randomized trials assessing whether realistic sustained sleep extension restores executive function in young adults remain sparse.',
      researchQuestionsAndObjectives: [
        'Does an 8-week structured behavioral sleep extension protocol (targeting 7.5 to 8.5 hours/night) significantly improve working memory capacity compared to active control?',
        'What is the effect of prolonged sleep extension on sustained attentional control and reaction time variability?'
      ],
      methodology: {
        studyDesignType: 'Parallel-Group Randomized Controlled Trial (RCT), single-blind assessment',
        description: 'Two-arm parallel randomized controlled trial with balanced 1:1 allocation. Baseline assessments were completed over a 2-week run-in period followed by an 8-week intervention and a post-intervention evaluation.',
        datasetOrSample: '124 undergraduate students (ages 18–24, 58% female, 42% male) with confirmed baseline habitual sleep duration < 6.5 hours/night.',
        sampleSize: 'N = 124 (62 intervention, 62 control; 116 completed trial, 6.5% attrition)',
        procedureSummary: 'The intervention arm received weekly sleep coaching, circadian light guidelines, and stimulus control scheduling. Objective sleep duration was tracked with wrist actigraphy, verified with daily sleep diaries. The active control group received biweekly general campus wellness seminars without sleep hygiene content.',
      },
      mainFindings: [
        {
          id: 'find-1',
          finding: 'The sleep extension intervention group achieved an average of 76 minutes additional nocturnal sleep per night compared to active control.',
          statisticalContext: 'Mean difference = 76.4 min [95% CI: 58.2, 94.6], p < 0.001',
          causalType: 'causal',
          evidence: {
            pageNumber: 5,
            section: 'Results - Actigraphy Adherence',
            quoteOrExcerpt: 'Wrist actigraphy verified that participants randomized to the extension arm expanded mean nightly total sleep time from 5.9 h to 7.2 h (Δ = +76.4 min, t(58) = 8.12, p < 0.001).'
          }
        },
        {
          id: 'find-2',
          finding: 'Working memory capacity (measured via the Automated Operation Span task) improved significantly more in the intervention group than in the control group after 8 weeks.',
          statisticalContext: 'Intervention mean: 74.2 vs Control mean: 68.1; difference = 6.1 points; t(114) = 2.21, p = 0.03, Cohen\'s d = 0.46',
          causalType: 'causal',
          evidence: {
            pageNumber: 7,
            section: 'Results - Primary Cognitive Outcomes',
            quoteOrExcerpt: 'At week 8, the intervention group demonstrated a mean score of 74.2 (SD 8.9) compared to 68.1 (SD 9.4) in the control group (p = 0.03, Cohen’s d = 0.46).'
          }
        },
        {
          id: 'find-3',
          finding: 'Psychomotor vigilance task (PVT) attentional lapses (>500ms) decreased by 34% in the intervention cohort, whereas the control cohort showed no significant reduction.',
          statisticalContext: 'Lapse count reduced from 6.8 to 4.5 in intervention (p = 0.008); control changed from 6.9 to 6.6 (p = 0.44)',
          causalType: 'causal',
          evidence: {
            pageNumber: 8,
            section: 'Results - Secondary Outcomes: Vigilance',
            quoteOrExcerpt: 'Sustained attention lapses declined significantly from baseline in the intervention cohort (mean reduction -2.3 lapses, p = 0.008), with no significant change in controls.'
          }
        },
        {
          id: 'find-4',
          finding: 'No statistically significant differences were observed between groups in standardized academic exam test scores over the semester.',
          statisticalContext: 'Intervention mean GPA delta +0.08 vs Control delta +0.06; F(1, 114) = 0.32, p = 0.57 (not statistically significant)',
          causalType: 'descriptive',
          evidence: {
            pageNumber: 9,
            section: 'Results - Academic Correlates',
            quoteOrExcerpt: 'Academic course examination marks did not differ significantly between arms across the 8-week observation period (p = 0.57).'
          }
        }
      ],
      keyInsights: [
        'Extending sleep by ~75 minutes nightly produces measurable, moderate improvements in executive working memory among habitual short-sleeping students.',
        'Sustained attentional vigilance and reaction stability improve alongside increased sleep duration, reducing severe attentional lapses by roughly one-third.',
        'Cognitive executive gains did not immediately translate into higher semester test marks during the brief 8-week window, indicating a lag between cognitive capacity and grade attainment.',
        'Non-pharmacological behavioral sleep interventions are feasible and achieve high adherence (93.5% retention) in college environments when guided by structured coaching.',
        'Absence of statistical difference in final grades does not mean sleep has no academic value; test scores are multifactorial and 8 weeks is a constrained window.'
      ],
      numericalResultsAndStatistics: [
        {
          metric: 'Intervention Working Memory Score',
          value: '74.2',
          unit: 'Ospan score',
          context: 'Mean score in sleep extension group after 8 weeks (SD = 8.9)',
          pageNumber: 7
        },
        {
          metric: 'Control Working Memory Score',
          value: '68.1',
          unit: 'Ospan score',
          context: 'Mean score in active control group after 8 weeks (SD = 9.4)',
          pageNumber: 7
        },
        {
          metric: 'Statistical Significance of Memory Difference',
          value: '0.03',
          unit: 'p-value',
          context: 'Independent samples t-test between treatment and control (t = 2.21, d = 0.46)',
          pageNumber: 7
        },
        {
          metric: 'Nightly Sleep Extension Duration',
          value: '76.4',
          unit: 'minutes/night',
          context: 'Average actigraphy-verified increase in nocturnal total sleep time',
          pageNumber: 5
        },
        {
          metric: 'PVT Attentional Lapse Reduction',
          value: '34',
          unit: '%',
          context: 'Decrease in vigilance lapses (>500ms) in intervention group (p = 0.008)',
          pageNumber: 8
        },
        {
          metric: 'Academic Course Exam Delta',
          value: '0.57',
          unit: 'p-value',
          context: 'F(1, 114) = 0.32, showing no statistically significant grade difference',
          pageNumber: 9
        }
      ],
      authorStatedLimitations: [
        'The study was conducted at a single university campus with a relatively homogeneous undergraduate cohort, which limits immediate generalizability to broader adult populations or shift workers.',
        'Sleep duration was monitored via wrist actigraphy and self-reported sleep diaries rather than in-laboratory polysomnography, leaving detailed sleep architecture (e.g. slow-wave sleep and REM phases) unquantified.',
        'The 8-week intervention duration may have been too brief to detect long-term cumulative impacts on GPA or persistent lifestyle maintenance.'
      ],
      aiObservationsAndCaveats: [
        'Participants who volunteered for a sleep study may possess higher baseline motivation to change lifestyle habits than typical collegiate populations (selection bias).',
        'While randomized allocation supports causal attribution for working memory score differences, grade outcomes were affected by varying departmental course difficulties across subjects.',
        'Notice that the authors correctly avoided claiming sleep extension guarantees higher grades, as the GPA difference was not statistically significant (p = 0.57).'
      ],
      practicalImplications: [
        'Universities and academic wellness centers can implement targeted 60-minute sleep extension workshops to support cognitive readiness before demanding exam blocks.',
        'Students struggling with working memory and daytime mental fatigue should prioritize consistent 7.5+ hour sleep windows before turning to stimulant medication or caffeine overload.'
      ],
      futureResearchDirections: [
        {
          suggestion: 'Conduct multi-center trials with polysomnography to determine which specific sleep stages (e.g., N3 slow-wave sleep vs. REM) mediate working memory recovery.',
          source: 'author',
          rationale: 'Stated in the discussion section on page 11.'
        },
        {
          suggestion: 'Investigate longer follow-ups (e.g., 6–12 months) to assess whether behavioral sleep gains persist after active coaching ends.',
          source: 'author',
          rationale: 'Suggested in the concluding remarks on page 12.'
        },
        {
          suggestion: 'Examine interaction with caffeine consumption thresholds and electronic screen exposure in real-world dorm environments.',
          source: 'ai_observation',
          rationale: 'AI observation based on unmeasured environmental variables noted in baseline surveys.'
        }
      ],
      conclusion: 'Structured nocturnal sleep extension of approximately 75 minutes per night over 8 weeks significantly improves working memory capacity and attentional focus in college students with habitual sleep restriction. While short-term course exam marks showed no significant change, executive cognitive functions showed reliable, moderate causal gains.',
      importantTerms: [
        {
          term: 'Randomized Controlled Trial (RCT)',
          simpleExplanation: 'A scientific experiment where participants are randomly allocated to receive either the intervention or a comparison control, allowing causal conclusions.'
        },
        {
          term: 'Working Memory Capacity (Ospan)',
          simpleExplanation: 'The mental workbench used to hold, process, and manipulate information temporarily while performing complex cognitive tasks.'
        },
        {
          term: 'Cohen\'s d',
          simpleExplanation: 'A standard measure of effect size expressing the difference between two means in units of standard deviations (0.46 indicates a moderate effect).'
        },
        {
          term: 'Actigraphy',
          simpleExplanation: 'A non-invasive method of monitoring human rest/activity cycles using a specialized wrist sensor.'
        },
        {
          term: 'Statistical Significance (p-value)',
          simpleExplanation: 'A probability metric assessing whether observed differences likely occurred by chance (typically p < 0.05 is deemed statistically significant).'
        }
      ]
    }
  },
  {
    id: 'sample-transformer-attention',
    badge: 'Seminal AI Paper',
    name: 'Attention Is All You Need (Vaswani et al., 2017)',
    abstract: 'The landmark Google Research paper introducing the Transformer, relying entirely on self-attention mechanisms without recurrence or convolutions.',
    field: 'Machine Learning & Natural Language Processing',
    fileName: 'Vaswani_Attention_Is_All_You_Need_2017.pdf',
    report: {
      isResearchPaper: true,
      title: 'Attention Is All You Need',
      authors: [
        'Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit',
        'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'
      ],
      publicationVenue: 'Advances in Neural Information Processing Systems (NeurIPS 30)',
      publicationYear: '2017',
      plainLanguageOverview: 'This landmark 2017 computer science paper introduced the Transformer architecture, which replaced recurrent and convolutional neural networks with self-attention mechanisms for language tasks. Prior state-of-the-art models processed text sequentially, word-by-word, creating sequential computation bottlenecks and making long-range dependencies difficult to capture. The Transformer maps relationships between all words in a sentence simultaneously using Multi-Head Attention and Positional Encodings. On standard machine translation benchmarks (WMT 2014 English-to-German and English-to-French), the Transformer achieved state-of-the-art translation accuracy (28.4 and 41.8 BLEU scores respectively) while training in a fraction of the time—requiring only 3.5 days on 8 GPUs. This work established the architectural foundation for modern large language models.',
      researchProblemAndMotivation: 'Recurrent models generate sequences sequentially, which inherently precludes parallelization within training examples. As sentence lengths increase, memory constraints limit batching and learning long-distance grammatical or semantic connections becomes computationally expensive.',
      researchQuestionsAndObjectives: [
        'Can a sequence transduction model rely entirely on attention mechanisms to model dependencies between input and output without recurrence or convolutions?',
        'Does eliminating recurrence improve training parallelization, wall-clock training efficiency, and translation quality on standard benchmarks?'
      ],
      methodology: {
        studyDesignType: 'Empirical Machine Learning Architecture Evaluation',
        description: 'Design and empirical validation of an encoder-decoder neural network using stacked multi-head self-attention and point-wise fully connected feed-forward layers. Evaluated on machine translation and constituency parsing.',
        datasetOrSample: 'WMT 2014 English-to-German (4.5 million sentence pairs) and WMT 2014 English-to-French (36 million sentence pairs); Byte-Pair and WordPiece vocabularies.',
        sampleSize: '4.5M pairs (En-De) and 36M pairs (En-Fr)',
        procedureSummary: 'Models were trained using the Adam optimizer with a custom learning rate schedule with warmup. Regularization utilized residual dropout (0.1) and label smoothing (0.1). Evaluations reported tokenized case-sensitive BLEU.',
      },
      mainFindings: [
        {
          id: 'find-t1',
          finding: 'The Transformer (big model) achieved 28.4 BLEU on the WMT 2014 English-to-German translation benchmark, surpassing the previous state-of-the-art by more than 2.0 BLEU.',
          statisticalContext: 'BLEU = 28.4 vs previous best of 26.36; training cost: 2.3 × 10^19 FLOPs',
          causalType: 'descriptive',
          evidence: {
            pageNumber: 7,
            section: 'Table 2: Machine Translation Results',
            quoteOrExcerpt: 'On the WMT 2014 English-to-German translation task, the big transformer model outperforms the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4.'
          }
        },
        {
          id: 'find-t2',
          finding: 'On the WMT 2014 English-to-French task, the Transformer achieved 41.8 BLEU after training for only 3.5 days on 8 P100 GPUs, at a fraction of earlier models\' compute cost.',
          statisticalContext: 'BLEU = 41.8; training time 3.5 days on 8 NVIDIA P100 GPUs',
          causalType: 'descriptive',
          evidence: {
            pageNumber: 8,
            section: 'Table 2: English-to-French Translation',
            quoteOrExcerpt: 'On the WMT 2014 English-to-French translation task, our big model achieves a BLEU score of 41.8, outperforming all previously published single models at less than 1/4 the training cost of the previous state-of-the-art model.'
          }
        },
        {
          id: 'find-t3',
          finding: 'Multi-Head Attention allowed the model to jointly attend to information from different representation subspaces at different positions, outperforming single-head attention.',
          statisticalContext: 'Ablation study (Table 3) showed 8 heads optimal (BLEU 25.8 on base model); too many heads (16) or single head (1) degraded performance.',
          causalType: 'descriptive',
          evidence: {
            pageNumber: 8,
            section: 'Section 5.3 & Table 3: Variations on the Transformer',
            quoteOrExcerpt: 'Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.'
          }
        }
      ],
      keyInsights: [
        'Recurrence is not strictly necessary for sequence modeling; pure attention mechanisms can resolve long-range token relationships effectively.',
        'Eliminating sequential state updates enables massive parallelization during training, drastically reducing wall-clock compute requirements.',
        'Multi-Head Attention enables simultaneous resolution of syntactic and semantic roles (e.g. subject-verb agreement and coreference) in distinct projection subspaces.',
        'Positional encodings provide order awareness without requiring recurrent sequential traversal of tokens.',
        'The architecture transfers successfully beyond translation to constituency parsing, demonstrating broad general-purpose sequence modeling capability.'
      ],
      numericalResultsAndStatistics: [
        {
          metric: 'WMT 2014 English-German BLEU',
          value: '28.4',
          unit: 'BLEU score',
          context: 'Transformer (big) performance, setting a new benchmark record',
          pageNumber: 7
        },
        {
          metric: 'WMT 2014 English-French BLEU',
          value: '41.8',
          unit: 'BLEU score',
          context: 'Transformer (big) performance, beating previous state-of-the-art',
          pageNumber: 8
        },
        {
          metric: 'Training Hardware',
          value: '8',
          unit: 'NVIDIA P100 GPUs',
          context: 'Base model trained for 12 hours (100,000 steps); big model trained for 3.5 days (300,000 steps)',
          pageNumber: 7
        },
        {
          metric: 'Layer Stacks (N)',
          value: '6',
          unit: 'layers',
          context: 'Both encoder and decoder comprise a stack of N = 6 identical layers',
          pageNumber: 3
        },
        {
          metric: 'Model Dimension (d_model)',
          value: '512',
          unit: 'dimensions',
          context: 'Base model hidden embedding dimensionality (1024 for big model)',
          pageNumber: 3
        }
      ],
      authorStatedLimitations: [
        'Self-attention computational complexity per layer is O(n² · d), where n is the sequence length, making standard attention costly for very long document sequences.',
        'The autoregressive decoding stage during inference remains sequential, requiring step-by-step token generation despite parallel training.'
      ],
      aiObservationsAndCaveats: [
        'The empirical results reflect machine translation benchmarks and constituency parsing; the authors did not evaluate reasoning or multi-turn conversational agents in this original 2017 paper.',
        'BLEU is an automated n-gram overlap metric and does not capture human nuances of fluency or factual truthfulness.',
        'Modern implementations often replace learned or fixed sinusoidal encodings with rotary position embeddings (RoPE).'
      ],
      practicalImplications: [
        'NLP systems can achieve superior throughput and lower latency by replacing recurrent layers with parallel attention blocks on modern GPU/TPU accelerators.',
        'Organizations building translation pipelines can cut cloud training compute budgets compared to older bi-LSTM stacks.'
      ],
      futureResearchDirections: [
        {
          suggestion: 'Extend the Transformer to problems involving input and output modalities other than text, such as images, audio, and video.',
          source: 'author',
          rationale: 'Discussed in Section 6 (Conclusion) on page 10.'
        },
        {
          suggestion: 'Investigate local, restricted attention mechanisms to efficiently handle very large inputs and outputs (e.g., full books or high-resolution imagery).',
          source: 'author',
          rationale: 'Discussed in Section 6 on page 10.'
        },
        {
          suggestion: 'Investigate linear or sub-quadratic approximations to the self-attention matrix for ultra-long context windows.',
          source: 'ai_observation',
          rationale: 'Subsequent literature (e.g. FlashAttention, Linformer) directly resolved this exact O(n²) scaling constraint.'
        }
      ],
      conclusion: 'The Transformer is the first sequence transduction model based entirely on attention, dispensing with recurrent and convolutional connections. Across English-to-German and English-to-French translation tasks, it achieved new state-of-the-art BLEU scores while training significantly faster than recurrent or convolutional networks.',
      importantTerms: [
        {
          term: 'Self-Attention',
          simpleExplanation: 'An attention mechanism relating different positions of a single sequence to compute a representation of the entire sequence.'
        },
        {
          term: 'Multi-Head Attention',
          simpleExplanation: 'Projecting queries, keys, and values into multiple different linear representation subspaces so the model can attend to information at different positions concurrently.'
        },
        {
          term: 'BLEU Score',
          simpleExplanation: 'Bilingual Evaluation Understudy: a standard automated metric comparing machine translations to human reference translations based on n-gram overlap.'
        },
        {
          term: 'Positional Encoding',
          simpleExplanation: 'Signals injected into token embeddings that provide the model with information about the order and relative position of words.'
        }
      ]
    }
  }
];
