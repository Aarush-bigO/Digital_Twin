# Clinical Validation & Physiological Biomarker Specifications

## Overview
The **Patient Digital Twin** mathematical model transforms continuous resting and dynamic biometric signals into predictive physiological health states. This document details the medical reference baselines and consensus guidelines used to establish normal, elevated, and critical thresholds.

---

## 1. Biomarker Reference Matrix

| Biomarker | Standard Unit | Normal Range | Borderline / Pre-Clinical | Critical / High Risk | Clinical Reference Standard |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Systolic BP** | mmHg | 90 – 119 | 120 – 129 (Elevated) | ≥ 130 (Stage 1/2 HTN) | ACC / AHA 2017 Guidelines |
| **Diastolic BP** | mmHg | 60 – 79 | 80 – 89 | ≥ 90 | ACC / AHA 2017 Guidelines |
| **Resting Heart Rate** | bpm | 60 – 85 | 86 – 99 | < 50 (Bradycardia) / > 100 (Tachycardia) | AHA Clinical Cardiology Standards |
| **Oxygen Saturation (SpO2)** | % | 95 – 100 | 92 – 94 | < 92 (Hypoxemic Alert) | WHO Pulse Oximetry Guidelines |
| **Heart Rate Variability (HRV)** | ms (SDNN) | > 45 | 25 – 45 | < 25 (Autonomic Strain) | Task Force of ESC & NASPE |
| **Fasting Blood Glucose** | mg/dL | 70 – 99 | 100 – 125 (Prediabetes) | ≥ 126 (Diabetes) | ADA 2024 Standards of Care |
| **Respiratory Rate** | breaths/min | 12 – 18 | 19 – 22 | < 10 or > 24 | Emergency Medicine Triage Index |

---

## 2. Biological Age Differential Equation

The biological age computation incorporates multi-organ biomarker stress multipliers:
$$\text{Age}_{\text{bio}} = \text{Age}_{\text{chrono}} + \Delta_{\text{cardio}} + \Delta_{\text{metabolic}} + \Delta_{\text{autonomic}}$$

Where:
- $\Delta_{\text{cardio}} = \frac{\text{SBP} - 120}{10} \times 0.6 + \frac{\text{DBP} - 80}{8} \times 0.4$
- $\Delta_{\text{metabolic}} = \frac{\text{Glucose} - 90}{15} \times 0.5$
- $\Delta_{\text{autonomic}} = \frac{50 - \text{HRV}}{10} \times 0.7$

---

## 3. Regulatory Disclaimer
The MedLink 360 Patient Digital Twin is an assistive clinical intelligence simulation platform designed for educational, triage preview, and telemedicine monitoring workflows. It is **not** a replacement for primary physician diagnostic evaluation.
