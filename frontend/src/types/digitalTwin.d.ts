/**
 * Prescripto Digital Twin - Clinical Biomarker & Physiological Engine Types
 */

export interface PatientBiomarkers {
  age: number;
  gender: 'male' | 'female';
  systolicBP: number;       // mmHg
  diastolicBP: number;      // mmHg
  fastingGlucose: number;   // mg/dL
  hba1c: number;            // %
  totalCholesterol: number; // mg/dL
  hdlCholesterol: number;   // mg/dL
  bmi: number;              // kg/m2
  restingHeartRate: number; // bpm
  dailySteps: number;       // count
  sleepHours: number;       // hours
}

export interface WhatIfInterventions {
  extraActivityMin: number;       // Daily minutes
  sodiumSugarReduction: number;   // Percentage (0 - 50%)
  medicationAdherence: number;    // Percentage (0 - 100%)
  weightLossTarget: number;       // Kilograms
}

export interface DigitalTwinMetrics {
  biologicalAge: number;
  baselineCvRisk: number;         // 5-year ASCVD event probability (%)
  simulatedCvRisk: number;        // Counterfactual forecasted risk (%)
  riskReductionPct: number;       // Relative mitigation (%)
  baselineScore: number;          // 0 - 100 vitality index
  simulatedScore: number;         // Post-intervention vitality index
  projectedSystolicBP: number;    // Forecasted BP
  projectedHbA1c: number;         // Forecasted Glycemic control
}

export interface DigitalTwinSnapshot {
  timestamp: string;
  patientId?: string;
  vitals: PatientBiomarkers;
  interventions: WhatIfInterventions;
  twinMetrics: DigitalTwinMetrics;
}
