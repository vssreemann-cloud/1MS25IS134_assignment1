# ResearchLens AI

> **"Understand research. Discover insights."**

ResearchLens AI is a full-stack research-paper analysis agent designed for students, researchers, clinicians, and curious readers. It transforms dense academic PDF papers into structured, evidence-grounded reports with verified statistics, clear plain-language summaries, explicit separation of author claims from AI observations, and interactive grounded Q&A.

---

## 🌟 Key Features

1. **Document-Grounded Understanding**:
   - Parses complex PDF papers, tables, methodology, and numerical data using server-side Gemini 3.8 Flash with the Files API.
   - Enforces strict anti-hallucination rules: if authors, p-values, sample sizes, or publication venues are unstated, they are explicitly marked as "Not reported in the paper".

2. **Strict Scientific Integrity Rules**:
   - **Causal vs. Correlational Distinction**: Only experiments with randomized allocation are labeled as *Causal Inference*. Observational and survey studies are marked *Correlational (Non-Causal)* with methodological cautions.
   - **Preservation of Null/Negative Results**: Absence of statistical significance (p > 0.05) is faithfully reported, preventing false equivalence claims.
   - **Separation of Perspectives**:
     - *Author-Stated Limitations*: Disclosed directly by manuscript authors.
     - *AI Observations & Caveats*: Analytical caveats, sample homogeneity notes, or selection bias considerations labeled explicitly as `[AI Observation]`.
     - *Future Research Directions*: Categorized by author proposals vs. AI suggested lines of inquiry.
   - **Evidence Citations**: Pinpoints page numbers and verbatim excerpts for core empirical findings.

3. **Curated Benchmark Sample Papers**:
   - Includes full verified benchmark papers ready for instant testing without needing an immediate PDF upload:
     - **Clinical RCT (2024)**: *Sleep Extension Improves Working Memory & Attentional Control in College Students* (N = 124, Ospan scores, PVT vigilance, p = 0.03).
     - **Seminal AI Architecture (2017)**: *Attention Is All You Need* (Vaswani et al., Transformer, Multi-Head Attention, BLEU 28.4 and 41.8).

4. **Ask-The-Paper Grounded Chat**:
   - Chat interface answering queries strictly from the manuscript text.
   - Automatically cites document pages (`[p. X]`) and admits when information is absent from the text.

5. **Multi-Format Export & Print View**:
   - Export structured reports as raw JSON (`.json`) matching `research_output_schema.json`.
   - Export formatted academic summary as Markdown (`.md`).
   - One-click printer-friendly report view with customized `@media print` CSS.
   - Instant "Analyze Another Paper" session reset to protect confidentiality.

---

## 🔒 Security & Privacy

- **Server-Side API Security**: Gemini API calls are executed strictly on the Node.js Express server (`server.ts`). The `GEMINI_API_KEY` is never transmitted to the browser or bundled in client code.
- **Ephemeral Session Privacy**: Uploaded PDF files are processed in-session. No permanent disk storage is retained, and temporary buffers are purged immediately after analysis.
- **Prompt Injection Defense**: Text extracted from uploaded PDFs is treated purely as passive data, preventing embedded instructions from manipulating the agent.

---

## 🚀 Environment Variables

Copy `.env.example` to `.env` or configure via the AI Studio Secrets panel:

```env
# Required for Gemini AI API calls (injected automatically in AI Studio)
GEMINI_API_KEY="your-gemini-api-key"

# Hosting URL (injected automatically at runtime)
APP_URL="http://localhost:3000"
```

---

## 🛠️ Project Structure

```text
├── index.html                   # HTML entry point with synchronized metadata & academic fonts
├── metadata.json                # AI Studio capabilities & permissions metadata
├── package.json                 # Node dependencies and scripts
├── research_output_schema.json  # JSON Schema specification for research report
├── server.ts                    # Express server with Gemini Files API & chat routes
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── src/
│   ├── App.tsx                  # Main application layout and tab controller
│   ├── main.tsx                 # React DOM mount
│   ├── index.css                # Tailwind CSS imports & custom typography
│   ├── data/
│   │   └── samplePapers.ts      # Ground-truth benchmark research papers
│   ├── types/
│   │   └── research.ts          # Core TypeScript data models
│   ├── utils/
│   │   ├── fileValidation.ts    # PDF file type and 25MB size validation
│   │   ├── researchValidator.ts # JSON structure and integrity validation
│   │   ├── exportReport.ts      # Markdown, JSON, and print formatting
│   │   └── research.test.ts     # node:test unit tests
│   └── components/
│       ├── Navbar.tsx           # Header, export menu, session reset
│       ├── UploadPanel.tsx      # Drag & drop upload and sample selector
│       ├── AnalysisProgress.tsx # Real-time analysis progress stages
│       ├── ExecutiveSummaryHeader.tsx # Header card with metadata & design badges
│       ├── OverviewSection.tsx  # Plain-language overview & 5 key insights
│       ├── MethodologySection.tsx # Study design, sample size, & procedures
│       ├── FindingsSection.tsx  # Empirical findings with causal badges & quotes
│       ├── StatisticsTable.tsx  # Quantitative metrics table with filter
│       ├── LimitationsAndCaveatsSection.tsx # Author limitations vs AI caveats
│       ├── GlossarySection.tsx  # Simple explanations of technical terms
│       ├── AskThePaperChat.tsx  # Grounded chat with document page citations
│       └── AboutModal.tsx       # Scientific integrity and methodology info
```

---

## 🧪 Testing

Run deterministic unit tests:

```bash
npx --yes tsx --test src/utils/research.test.ts
```

---

## ⚠️ Known Limitations

1. **Scanned / Handwritten Documents**: Papers must contain readable digital text. Low-resolution OCR or handwritten notes may yield reduced accuracy.
2. **Password-Protected PDFs**: Encrypted or DRM-locked PDFs cannot be read and will trigger an informative rejection message.
3. **Domain Coverage**: While ResearchLens AI handles medicine, computer science, psychology, economics, and natural sciences, highly non-standard formatting (e.g. non-standard patents) may place certain findings under general descriptive categories.
