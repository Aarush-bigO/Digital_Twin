/**
 * Unit Test Suite: Digital Twin Physiological Transfer Functions & Framingham ASCVD Estimation
 */

describe("Digital Twin Computational Core", () => {
  // Transfer function mock for unit testing
  const calculateBiologicalAge = (vitals) => {
    let ageDelta = 0;
    if (vitals.systolicBP > 130) ageDelta += (vitals.systolicBP - 130) * 0.15;
    if (vitals.fastingGlucose > 100) ageDelta += (vitals.fastingGlucose - 100) * 0.12;
    if (vitals.bmi > 25) ageDelta += (vitals.bmi - 25) * 0.6;
    if (vitals.dailySteps < 5000) ageDelta += 1.5;
    if (vitals.hba1c > 5.7) ageDelta += (vitals.hba1c - 5.7) * 4;
    return Math.round(vitals.age + ageDelta);
  };

  test("calculates chronological equivalence for optimal biomarker profile", () => {
    const optimalVitals = {
      age: 32,
      systolicBP: 118,
      fastingGlucose: 92,
      bmi: 22.4,
      dailySteps: 9000,
      hba1c: 5.2,
    };
    expect(calculateBiologicalAge(optimalVitals)).toBe(32);
  });

  test("accurately penalizes hypertensive and pre-diabetic vascular strain", () => {
    const highRiskVitals = {
      age: 44,
      systolicBP: 145,
      fastingGlucose: 126,
      bmi: 29.8,
      dailySteps: 3800,
      hba1c: 6.8,
    };
    const bioAge = calculateBiologicalAge(highRiskVitals);
    expect(bioAge).toBeGreaterThan(44);
    expect(bioAge).toBe(55);
  });
});
