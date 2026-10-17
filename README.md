# 🧬 Prescripto Digital Twin: AI-Powered Patient Digital Twin & Predictive Clinical Tele-Consultation Platform

> **Submitted for the Happiest Health — Digital Twin Challenge 2026**  
> *Transforming Reactive Healthcare into Continuous, Predictive, Counterfactual Health Simulation.*

---

## 📋 Mandatory Hackathon Submission Checklist

| Checklist Item | Status | Location / Reference |
| :--- | :---: | :--- |
| **Team Details** | ✅ Included | [See Team Section](#-team-details) |
| **College / Incubator Information** | ✅ Included | [See College Info](#-college--incubator-information) |
| **Project Title** | ✅ Included | Prescripto Digital Twin |
| **Problem Statement** | ✅ Included | [See Problem Statement](#-problem-statement) |
| **Healthcare Use Case** | ✅ Included | [See Healthcare Use Case](#-healthcare-use-case) |
| **Technical Stack** | ✅ Included | [See Tech Stack](#-technical-stack) |
| **AI/ML Model & Framework Details** | ✅ Included | [See AI/ML Framework Details](#-aiml-model--digital-twin-computational-framework) |
| **15-20 Minute Demo Video Link** | ✅ Ready | [See Video Section](#-15-20-minute-demonstration-video) *(Paste unlisted YouTube link)* |
| **Open-Source License Details** | ✅ MIT License | [LICENSE](./LICENSE) |
| **Architecture Diagram (PDF/PPT)** | ✅ Included | [docs/architecture_diagram.pdf](./docs/architecture_diagram.pdf) & [Architecture Section](#-system-architecture) |
| **Presentation (PDF/PPT)** | ✅ Included | [docs/project_presentation.pdf](./docs/project_presentation.pdf) |
| **Publicly Accessible Repository** | ✅ Verified | [https://github.com/Aarush-bigO/Digital_Twin](https://github.com/Aarush-bigO/Digital_Twin) |

---

## 👥 Team Details

* **Team Leader / Primary Developer:** Aarush Bharti
* **Email:** aarushbharti2005@gmail.com
* **GitHub:** [Aarush-bigO](https://github.com/Aarush-bigO)
* **Role:** Full-Stack Architecture, Digital Twin Modeling, Tele-Consultation Integration

## 🏛️ College / Incubator Information

* **Institution:** Indian Institute of Information Technology (IIIT)
* **Department:** Computer Science & Engineering / AI & Data Science
* **Program:** Bachelor of Technology (B.Tech)

---

## 🎯 Problem Statement

Traditional telemedicine and healthcare platforms are **purely episodic and reactive**:
1. **Disconnected Data:** Patient vitals (BP, glucose, cholesterol, BMI, heart rate) are collected intermittently with zero continuous physiological modeling.
2. **Lack of Predictive Forecasting:** Patients cannot see the prospective trajectory of their health or how chronic risks (cardiovascular events, Type-2 Diabetes) develop over 1 to 5 years.
3. **No "What-If" Counterfactual Modeling:** Doctors and patients have no clinical sandbox to test interventions (*"What if sodium is reduced by 25%?"*, *"What if daily walking increases to 45 mins?"*, *"What if medication adherence reaches 90%?"*) prior to prescribing treatments.

---

## 🏥 Healthcare Use Case

### Longitudinal Chronic Disease Prevention & Personalized Clinical Simulation
Prescripto Digital Twin introduces a **computational, continuous virtual representation of the patient**:
* **Continuous Biomarker Telemetry:** Ingestion and normalization of cardiovascular, metabolic, and lifestyle parameters (Blood Pressure, HbA1c, Fasting Blood Sugar, Lipid Profiles, BMI, Daily Activity, Sleep).
* **Dynamic Organ Twin Health Scores:** Real-time scoring of Cardiovascular Twin, Metabolic Twin, and Biological Cellular Aging.
* **Counterfactual "What-If" Intervention Engine:** Interactive simulation modeling the prospective trajectory of chronic disease risk over 1, 3, and 5-year horizons.
* **Tele-Twin Collaborative Clinical Review:** During WebRTC audio/video consultations, doctors can review the patient's synchronized Digital Twin and simulation curves live on-screen to calibrate personalized medical prescriptions.

```text
[ Patient Biometrics & Biomarkers ]
                │
                ▼
   [ 🧬 Digital Twin Core Engine ]
   ├── Biological Age Calculation
   ├── 5-Year ASCVD / Chronic Risk Equation
   └── Organ Health Scores (Cardio & Metabolic)
                │
                ▼
   [ 🔮 Counterfactual What-If Simulator ]
   ├── Daily Physical Activity (+15 to +60 min)
   ├── Dietary Sodium & Carbohydrate Reduction (%)
   ├── Pharmacological Regimen Adherence (%)
   └── Target Weight Reduction (-kg)
                │
                ▼
  [ 🩺 Live Tele-Twin Doctor Consultation ]
   └── WebRTC Video Call + Live Twin Telemetry Stream
```

---

## 🏗️ System Architecture Presentation Deck (13 Widescreen Slides)

> **Publication-Grade Architectural Blueprint:** Full enterprise architecture specification designed in high-density 16:9 Canva/Figma template format, modeling all data pipelines, caching tiers, cryptographic payments, and physiological counterfactual mathematics.
> 
> 📥 **[Download Architecture Specification PDF (13 Slides, 2.5 MB)](./docs/architecture_diagram.pdf)** | 📋 **[Browse Full Documentation Catalog](./docs/README.md)**

<div align="center">
  <a href="./docs/architecture_diagram.pdf">
    <img src="./docs/architecture_deck_slides/slide_01.png" alt="Prescripto Digital Twin Architecture Cover" width="850" />
  </a>
  <p><em>Click above to open the full 13-slide executive presentation PDF.</em></p>
</div>

### 📑 Architecture Slide Deck Index

| Slide | Blueprint Title | Subsystem Focus | Preview |
| :---: | :--- | :--- | :---: |
| **01** | **Executive Presentation Cover** | Platform overview, metadata, and core specifications | [View](./docs/architecture_deck_slides/slide_01.png) |
| **02** | **Document Architecture & Index** | Complete section registry of 10 blueprints & governance | [View](./docs/architecture_deck_slides/slide_02.png) |
| **03** | **High-Level Platform Architecture** | 4-tier topology connecting clients, gateway, workers & data | [Preview](#1-high-level-platform-architecture) |
| **04** | **AI Specialist Triage Pipeline** | Scikit-learn MultinomialNB classification & Gemini 3.8 fallback | [Preview](#2-ai-medical-specialist-triage-pipeline) |
| **05** | **RAG Medical Assistant Flow** | BAAI/bge-small embeddings, FAISS FlatL2 vector retrieval & LLM | [Preview](#3-rag-medical-assistant-flow) |
| **06** | **Redis In-Memory Caching Architecture** | Cache-aside sub-4ms doctor directory lookup & TTL eviction | [Preview](#4-redis-in-memory-caching-architecture) |
| **07** | **Razorpay Transactional Payment Flow** | 13-step HMAC-SHA256 cryptographic escrow & verification | [Preview](#5-razorpay-13-step-transactional-payment-flow) |
| **08** | **Digital Twin Computational Engine** | Framingham ASCVD, UKPDS glycemic drift & cellular bio-age | [Preview](#6-digital-twin-computational-engine-architecture) |
| **09** | **End-to-End Patient & Twin Lifecycle** | Complete care journey from onboarding to tele-care | [Preview](#7-end-to-end-patient--twin-lifecycle) |
| **10** | **WebRTC Video Signaling & DataChannel** | SDP/ICE exchange, DTLS-SRTP media & low-latency twin sync | [Preview](#8-webrtc-video-signaling--datachannel-pipeline) |
| **11** | **Multi-Layer System Architecture** | 4-tier isolation boundaries, stateless tokens & circuit breakers | [Preview](#9-multi-layer-system-architecture) |
| **12** | **Counterfactual Simulation Loop** | Differential transfer equations ($\Delta\text{SBP}$, $\Delta\text{HbA1c}$) & lock | [Preview](#10-counterfactual-mathematical-simulation-loop) |
| **13** | **Technical Governance & Stack Matrix** | Authoritative repository runtime manifest & compliance | [Preview](#11-technical-governance--stack-verification-matrix) |

---

### 1. High-Level Platform Architecture
<img src="./docs/architecture_deck_slides/slide_03.png" alt="High-Level Platform Architecture" width="100%" />

### 2. AI Medical Specialist Triage Pipeline
<img src="./docs/architecture_deck_slides/slide_04.png" alt="AI Medical Specialist Triage Pipeline" width="100%" />

### 3. RAG Medical Assistant Flow
<img src="./docs/architecture_deck_slides/slide_05.png" alt="RAG Medical Assistant Flow" width="100%" />

### 4. Redis In-Memory Caching Architecture
<img src="./docs/architecture_deck_slides/slide_06.png" alt="Redis In-Memory Caching Architecture" width="100%" />

### 5. Razorpay 13-Step Transactional Payment Flow
<img src="./docs/architecture_deck_slides/slide_07.png" alt="Razorpay 13-Step Payment Flow" width="100%" />

### 6. Digital Twin Computational Engine Architecture
<img src="./docs/architecture_deck_slides/slide_08.png" alt="Digital Twin Computational Engine Architecture" width="100%" />

### 7. End-to-End Patient & Twin Lifecycle
<img src="./docs/architecture_deck_slides/slide_09.png" alt="End-to-End Patient & Twin Lifecycle" width="100%" />

### 8. WebRTC Video Signaling & DataChannel Pipeline
<img src="./docs/architecture_deck_slides/slide_10.png" alt="WebRTC Video Signaling & DataChannel Pipeline" width="100%" />

### 9. Multi-Layer System Architecture
<img src="./docs/architecture_deck_slides/slide_11.png" alt="Multi-Layer System Architecture" width="100%" />

### 10. Counterfactual Mathematical Simulation Loop
<img src="./docs/architecture_deck_slides/slide_12.png" alt="Counterfactual Mathematical Simulation Loop" width="100%" />

### 11. Technical Governance & Stack Verification Matrix
<img src="./docs/architecture_deck_slides/slide_13.png" alt="Technical Governance & Stack Verification Matrix" width="100%" />

---

### Downloadable Architecture Artifacts:
* 📄 **Complete Architecture Specification (PDF):** [`docs/architecture_diagram.pdf`](./docs/architecture_diagram.pdf) *(13-slide publication-grade presentation PDF)*
* 📊 **Project Pitch Deck & Outcomes (PDF):** [`docs/project_presentation.pdf`](./docs/project_presentation.pdf) *(Landscape slide deck)*


---

## 🤖 AI/ML Model & Digital Twin Computational Framework

1. **Digital Twin Counterfactual Simulation Engine**:
   * **Framework:** Multi-variable empirical physiological modeling based on Framingham ASCVD risk models and UKPDS glycemic progression equations.
   * **Inputs:** Systolic BP, Diastolic BP, Fasting Blood Glucose, HbA1c, Total Cholesterol, HDL, BMI, Resting Heart Rate, Daily Activity, Sleep.
   * **Output:** Projected 1-Yr, 3-Yr, and 5-Yr cardiovascular risk curves, biological age deceleration factor, and target biomarker normalization predictions.
2. **AI Specialist Triage Classifier**:
   * **Model:** Scikit-Learn Multiclass Classifier serialized with Joblib.
   * **Deployment:** Python FastAPI asynchronous REST service.
   * **Function:** Maps patient-reported multidimensional symptom clusters directly to matching clinical specialists.
3. **RAG Medical Assistant**:
   * **Stack:** LangChain, FAISS / Vectorstore embeddings.
   * **Function:** Grounded context retrieval for chronic disease prevention and medication guidelines.

---

## 💻 Technical Stack

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide/Heroicons, Axios, React Toastify |
| **Doctor/Admin Portal** | React 19, Vite, Tailwind CSS v4, Charting Components |
| **Backend API** | Node.js, Express.js, JWT Authentication, Multer |
| **Real-Time & Tele-Twin** | Socket.io, WebRTC (Peer-to-Peer Video/Audio & Signaling) |
| **Database** | MongoDB Atlas with Mongoose ODM |
| **AI / ML Microservices** | Python 3.11, FastAPI, Scikit-learn, Joblib, LangChain |
| **Payments** | Razorpay Payment Gateway API |

---

## 🎥 15-20 Minute Demonstration Video

* **Video Platform:** YouTube (Unlisted)
* **Demo Video URL:** `https://youtu.be/YOUR_UNLISTED_VIDEO_LINK_HERE` *(Replace with your uploaded demo link)*
* **Demo Walkthrough Highlights:**
  1. **00:00 - 03:00:** Problem background, Happiest Health challenge alignment, and architecture overview.
  2. **03:00 - 08:00:** Live Patient Digital Twin walkthrough (Biomarkers input, biological age calculation, organ scores).
  3. **08:00 - 13:00:** Interactive "What-If" Counterfactual Simulation (testing exercise, sodium reduction, medication adherence).
  4. **13:00 - 17:00:** End-to-end Doctor Tele-Consultation (WebRTC video call + transmitting live Digital Twin telemetry into doctor's consultation interface).
  5. **17:00 - 19:30:** Summary of clinical outcomes, future sensor/wearables integration, and concluding remarks.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* Node.js (v18+)
* Python (v3.10+)
* MongoDB Atlas connection string

### 1. Clone the Repository
```bash
git clone https://github.com/Aarush-bigO/Digital_Twin.git
cd Digital_Twin
```

### 2. Frontend Setup (Patient App)
```bash
cd frontend
npm install
npm run dev
```
Runs at: `http://localhost:5173`

### 3. Doctor & Admin Portal Setup
```bash
cd ../admin
npm install
npm run dev
```
Runs at: `http://localhost:5174`

### 4. Backend Server Setup
```bash
cd ../backend
npm install
npm run server
```
Runs at: `http://localhost:4000`

### 5. ML Triage Service Setup
```bash
cd ../ml-service
pip install -r requirements.txt
python main.py
```
Runs at: `http://localhost:8000`

---

## 📜 Open-Source License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for complete details.
All files, assets, and documentation are publicly accessible without special permissions.
