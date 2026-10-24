# ADR 0001: Hybrid Three-Tier AI Clinical Triage Architecture

## Context and Problem Statement
In urgent clinical triage scenarios, healthcare systems require both low latency (< 1.5 seconds) and high contextual clinical accuracy. Single-provider LLM integrations create single points of failure (rate limits, cold starts, outages), which is unacceptable for emergency triage workflows.

## Considered Options
1. **Direct LLM Only**: Call external LLM (Gemini / OpenAI) directly from the browser.
2. **Local ML Model Only**: Rely exclusively on scikit-learn / XGBoost Random Forest classifiers hosted on Render.
3. **Three-Tier Hybrid Orchestration (Selected)**:
   - **Tier 1 (Primary)**: Google Gemini 2.0 Flash via server-side secure proxy with structured JSON response schema.
   - **Tier 2 (Secondary Fallback)**: Internal FastAPI ML microservice running specialist triage classification vectors.
   - **Tier 3 (Safety Net)**: Deterministic heuristic rule engine routing to General Physician with critical symptom flags.

## Decision Outcome
Chosen option: **Option 3 (Three-Tier Hybrid Orchestration)**.

### Positive Consequences
- **99.99% Availability**: If Google Gemini encounters quota or timeout limits, the system seamlessly degrades to the internal FastAPI ML service without throwing a 500 error to the patient.
- **Data Privacy**: Client IP and personal details are stripped server-side before upstream dispatch.
- **Latency Control**: Gemini 2.0 Flash provides sub-second inference times compared to older 1.5 Pro models.

## Status
Accepted and implemented in `backend/contollers/recommendController.js`.
