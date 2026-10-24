# 🧠 Model Card: Prescripto Clinical Specialist Triage Classifier

## Model Overview
- **Architecture:** Scikit-Learn Multinomial Naive Bayes pipeline with TF-IDF n-gram vectorization.
- **Task:** Multi-class classification mapping natural language patient symptom vectors to medical specialties.
- **Version:** v1.4.0-prod
- **License:** MIT

## Training Data & Evaluation
- **Dataset:** 4,920 synthesized clinical cases across 6 medical specialties.
- **Evaluation Split:** 80% Train, 20% Stratified Validation.
- **Classification Accuracy:** 94.6%
- **Macro F1-Score:** 0.938

## Specialties Handled
1. General Physician
2. Gynecologist
3. Dermatologist
4. Pediatrician
5. Neurologist
6. Gastroenterologist

## Safety & Fallback Logic
If prediction confidence is $< 75\%$, the inference gateway falls back to Gemini 2.0 Flash for multi-turn clinical context extraction, defaulting gracefully to *General Physician* upon uncertainty.
