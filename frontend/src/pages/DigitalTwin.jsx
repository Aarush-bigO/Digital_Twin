import React, { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function DigitalTwin() {
  const navigate = useNavigate();
  const { currencySymbol } = useContext(AppContext);

  // Core Baseline Biometrics
  const [vitals, setVitals] = useState({
    age: 38,
    gender: "male",
    systolicBP: 138,
    diastolicBP: 88,
    fastingGlucose: 114,
    hba1c: 6.2,
    totalCholesterol: 218,
    hdlCholesterol: 42,
    bmi: 28.2,
    restingHeartRate: 78,
    dailySteps: 4500,
    sleepHours: 6.5,
  });

  // What-If Intervention Simulator
  const [interventions, setInterventions] = useState({
    extraActivityMin: 30, // mins per day
    sodiumSugarReduction: 25, // %
    medicationAdherence: 80, // %
    weightLossTarget: 4, // kg
  });

  // Handle Input Changes
  const handleVitalChange = (field, value) => {
    setVitals((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleInterventionChange = (field, value) => {
    setInterventions((prev) => ({ ...prev, [field]: Number(value) }));
  };

  // Preset Profiles
  const loadPreset = (type) => {
    if (type === "risk") {
      setVitals({
        age: 44,
        gender: "male",
        systolicBP: 145,
        diastolicBP: 92,
        fastingGlucose: 126,
        hba1c: 6.8,
        totalCholesterol: 235,
        hdlCholesterol: 38,
        bmi: 29.8,
        restingHeartRate: 84,
        dailySteps: 3800,
        sleepHours: 5.8,
      });
      setInterventions({
        extraActivityMin: 35,
        sodiumSugarReduction: 30,
        medicationAdherence: 90,
        weightLossTarget: 6,
      });
      toast.info("Loaded Pre-Diabetic & Hypertensive Twin Profile");
    } else if (type === "healthy") {
      setVitals({
        age: 32,
        gender: "female",
        systolicBP: 118,
        diastolicBP: 76,
        fastingGlucose: 92,
        hba1c: 5.2,
        totalCholesterol: 175,
        hdlCholesterol: 58,
        bmi: 22.4,
        restingHeartRate: 64,
        dailySteps: 9200,
        sleepHours: 7.8,
      });
      setInterventions({
        extraActivityMin: 15,
        sodiumSugarReduction: 10,
        medicationAdherence: 100,
        weightLossTarget: 0,
      });
      toast.success("Loaded Optimal Healthy Twin Profile");
    }
  };

  // Digital Twin Dynamic Calculations
  const twinMetrics = useMemo(() => {
    // 1. Biological Twin Age Delta
    let ageDelta = 0;
    if (vitals.systolicBP > 130) ageDelta += (vitals.systolicBP - 130) * 0.15;
    if (vitals.fastingGlucose > 100) ageDelta += (vitals.fastingGlucose - 100) * 0.12;
    if (vitals.bmi > 25) ageDelta += (vitals.bmi - 25) * 0.6;
    if (vitals.dailySteps < 5000) ageDelta += 1.5;
    if (vitals.hba1c > 5.7) ageDelta += (vitals.hba1c - 5.7) * 4;
    const biologicalAge = Math.round(vitals.age + ageDelta);

    // 2. Baseline 5-Year Cardiovascular & Metabolic Risk (%)
    let baselineCvRisk = 3.5;
    if (vitals.systolicBP > 120) baselineCvRisk += (vitals.systolicBP - 120) * 0.35;
    if (vitals.totalCholesterol > 180) baselineCvRisk += (vitals.totalCholesterol - 180) * 0.08;
    if (vitals.hba1c > 5.7) baselineCvRisk += (vitals.hba1c - 5.7) * 6.5;
    if (vitals.bmi > 25) baselineCvRisk += (vitals.bmi - 25) * 0.8;
    baselineCvRisk = Math.min(Math.max(Math.round(baselineCvRisk * 10) / 10, 2.0), 65.0);

    // 3. Baseline Twin Health Score (0 - 100)
    let score = 100;
    if (vitals.systolicBP > 120) score -= (vitals.systolicBP - 120) * 0.7;
    if (vitals.fastingGlucose > 100) score -= (vitals.fastingGlucose - 100) * 0.6;
    if (vitals.hba1c > 5.7) score -= (vitals.hba1c - 5.7) * 14;
    if (vitals.bmi > 25) score -= (vitals.bmi - 25) * 2;
    score = Math.max(Math.min(Math.round(score), 98), 35);

    // 4. Simulated Impact of Interventions
    const activityImpact = (interventions.extraActivityMin / 45) * 0.22;
    const dietImpact = (interventions.sodiumSugarReduction / 50) * 0.25;
    const medImpact = (interventions.medicationAdherence / 100) * 0.28;
    const weightImpact = (interventions.weightLossTarget / 8) * 0.18;

    const totalReductionFactor = Math.min(
      activityImpact + dietImpact + medImpact + weightImpact,
      0.68
    );

    const simulatedCvRisk = Math.max(
      Math.round(baselineCvRisk * (1 - totalReductionFactor) * 10) / 10,
      1.5
    );

    const riskReductionPct = Math.round(
      ((baselineCvRisk - simulatedCvRisk) / baselineCvRisk) * 100
    );

    const projectedSystolicBP = Math.round(
      vitals.systolicBP -
        interventions.sodiumSugarReduction * 0.22 -
        interventions.extraActivityMin * 0.15 -
        interventions.weightLossTarget * 0.8
    );

    const projectedHbA1c = (
      vitals.hba1c -
      (interventions.extraActivityMin * 0.008 +
        interventions.sodiumSugarReduction * 0.007 +
        interventions.weightLossTarget * 0.04)
    ).toFixed(1);

    const simulatedTwinScore = Math.min(
      Math.round(score + totalReductionFactor * 35),
      98
    );

    return {
      biologicalAge,
      baselineCvRisk,
      simulatedCvRisk,
      riskReductionPct,
      baselineScore: score,
      simulatedScore: simulatedTwinScore,
      projectedSystolicBP,
      projectedHbA1c: Math.max(Number(projectedHbA1c), 5.0),
    };
  }, [vitals, interventions]);

  const saveTwinSnapshot = () => {
    localStorage.setItem("patient_digital_twin", JSON.stringify({ vitals, interventions, twinMetrics }));
    toast.success("Digital Twin snapshot saved to your health profile!");
  };

  const consultSpecialist = () => {
    saveTwinSnapshot();
    if (vitals.systolicBP >= 140 || vitals.totalCholesterol > 220) {
      navigate("/doctors/General physician");
    } else if (vitals.hba1c >= 6.5 || vitals.fastingGlucose >= 120) {
      navigate("/doctors/General physician");
    } else {
      navigate("/doctors");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Banner */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Continuous Patient Twin & Predictive Health Simulation
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                Patient Digital Twin
              </h1>
              <p className="text-gray-500 mt-2 max-w-2xl text-sm leading-relaxed">
                A continuous, personalized computational model of your physiological vitals. Simulate future lifestyle & medication interventions to forecast disease trajectory before treatment.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loadPreset("risk")}
                className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3.5 py-2 rounded-lg font-medium transition cursor-pointer"
              >
                ⚡ Load Sample: Pre-Diabetic/Hypertensive
              </button>
              <button
                onClick={() => loadPreset("healthy")}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 py-2 rounded-lg font-medium transition cursor-pointer"
              >
                🌿 Load Sample: Optimal Healthy
              </button>
            </div>
          </div>
        </div>

        {/* Top Summary Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Twin Vitality Score */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Twin Health Vitality
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-primary">
                {twinMetrics.baselineScore}
              </span>
              <span className="text-xs text-gray-400">/ 100</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                Sim: {twinMetrics.simulatedScore}
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${twinMetrics.baselineScore}%` }}
              />
            </div>
          </div>

          {/* Biological Age */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Biological Twin Age
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-gray-800">
                {twinMetrics.biologicalAge} yrs
              </span>
              <span className="text-xs text-gray-400">({vitals.age} cal)</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {twinMetrics.biologicalAge > vitals.age ? (
                <span className="text-amber-600 font-medium">
                  +{twinMetrics.biologicalAge - vitals.age} yrs accelerated aging
                </span>
              ) : (
                <span className="text-emerald-600 font-medium">
                  Optimal cellular vitality
                </span>
              )}
            </p>
          </div>

          {/* 5-Yr Risk */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              5-Yr Chronic Event Risk
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-amber-600">
                {twinMetrics.baselineCvRisk}%
              </span>
              <span className="text-xs text-emerald-600 font-medium ml-auto bg-emerald-50 px-2 py-0.5 rounded">
                ↓ {twinMetrics.simulatedCvRisk}% sim
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Cardiovascular & metabolic trajectory
            </p>
          </div>

          {/* Projected Improvement */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Simulation Risk Drop
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-emerald-600">
                -{twinMetrics.riskReductionPct}%
              </span>
              <span className="text-xs text-gray-400">mitigation</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Achievable through modeled interventions
            </p>
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Vitals Input (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Biomarker Telemetry
                </h2>
                <p className="text-xs text-gray-500">
                  Patient physical & laboratory measurements
                </p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">
                Live Twin Sync
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    value={vitals.age}
                    onChange={(e) => handleVitalChange("age", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    BMI (kg/m²)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.bmi}
                    onChange={(e) => handleVitalChange("bmi", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={vitals.systolicBP}
                    onChange={(e) => handleVitalChange("systolicBP", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={vitals.diastolicBP}
                    onChange={(e) => handleVitalChange("diastolicBP", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Glycemic Markers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Fasting Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={vitals.fastingGlucose}
                    onChange={(e) => handleVitalChange("fastingGlucose", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    HbA1c (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.hba1c}
                    onChange={(e) => handleVitalChange("hba1c", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Lipid Profile */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Total Cholesterol (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={vitals.totalCholesterol}
                    onChange={(e) => handleVitalChange("totalCholesterol", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    HDL Good Cholesterol
                  </label>
                  <input
                    type="number"
                    value={vitals.hdlCholesterol}
                    onChange={(e) => handleVitalChange("hdlCholesterol", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Lifestyle Vitals */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Daily Steps
                  </label>
                  <input
                    type="number"
                    value={vitals.dailySteps}
                    onChange={(e) => handleVitalChange("dailySteps", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Resting Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={vitals.restingHeartRate}
                    onChange={(e) => handleVitalChange("restingHeartRate", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={saveTwinSnapshot}
              className="mt-6 w-full border border-primary text-primary py-2.5 rounded-xl font-medium hover:bg-primary/5 transition text-sm cursor-pointer"
            >
              Update Digital Twin Baseline
            </button>
          </div>

          {/* Right Column: "What-If" Counterfactual Simulator (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Simulation Controls */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    "What-If" Counterfactual Simulation Engine
                  </h2>
                  <p className="text-xs text-gray-500">
                    Adjust clinical & lifestyle parameters to simulate prospective organ twin response
                  </p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                  Twin Prediction Active
                </span>
              </div>

              <div className="space-y-5">
                {/* Exercise Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-2">
                    <span>🏃 Extra Daily Physical Activity</span>
                    <span className="text-primary font-bold">
                      +{interventions.extraActivityMin} mins/day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={interventions.extraActivityMin}
                    onChange={(e) => handleInterventionChange("extraActivityMin", e.target.value)}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                {/* Dietary Sodium/Sugar */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-2">
                    <span>🥗 Sodium & Refined Sugar Reduction</span>
                    <span className="text-primary font-bold">
                      -{interventions.sodiumSugarReduction}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={interventions.sodiumSugarReduction}
                    onChange={(e) => handleInterventionChange("sodiumSugarReduction", e.target.value)}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                {/* Medication Adherence */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-2">
                    <span>💊 Prescribed Regimen Adherence</span>
                    <span className="text-primary font-bold">
                      {interventions.medicationAdherence}% Adherent
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={interventions.medicationAdherence}
                    onChange={(e) => handleInterventionChange("medicationAdherence", e.target.value)}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                {/* Weight Loss Target */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-2">
                    <span>⚖️ Targeted Weight Reduction</span>
                    <span className="text-primary font-bold">
                      -{interventions.weightLossTarget} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="1"
                    value={interventions.weightLossTarget}
                    onChange={(e) => handleInterventionChange("weightLossTarget", e.target.value)}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Simulated Trajectory Comparison Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 mb-4">
                Forecasted Clinical Trajectory (1-Year vs 5-Year Horizon)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Physiological Biomarker</th>
                      <th className="pb-3 font-semibold">Baseline State</th>
                      <th className="pb-3 font-semibold">Forecasted Twin State</th>
                      <th className="pb-3 font-semibold">Clinical Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr>
                      <td className="py-3 font-medium">Systolic Blood Pressure</td>
                      <td className="py-3 text-amber-700">{vitals.systolicBP} mmHg</td>
                      <td className="py-3 text-emerald-600 font-bold">
                        {twinMetrics.projectedSystolicBP} mmHg
                      </td>
                      <td className="py-3">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                          Normalized
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Glycated Hemoglobin (HbA1c)</td>
                      <td className="py-3 text-amber-700">{vitals.hba1c}%</td>
                      <td className="py-3 text-emerald-600 font-bold">
                        {twinMetrics.projectedHbA1c}%
                      </td>
                      <td className="py-3">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                          Euglycemic
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">5-Year Cardiovascular Event Risk</td>
                      <td className="py-3 text-amber-700">{twinMetrics.baselineCvRisk}%</td>
                      <td className="py-3 text-emerald-600 font-bold">
                        {twinMetrics.simulatedCvRisk}%
                      </td>
                      <td className="py-3">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                          -{twinMetrics.riskReductionPct}% Risk
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Predicted Biological Age</td>
                      <td className="py-3 text-amber-700">{twinMetrics.biologicalAge} yrs</td>
                      <td className="py-3 text-emerald-600 font-bold">
                        {Math.max(vitals.age - 2, vitals.age)} yrs
                      </td>
                      <td className="py-3">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                          Decelerated
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={consultSpecialist}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition shadow-md shadow-primary/20 text-sm text-center cursor-pointer"
                >
                  Consult Specialist with Twin Telemetry →
                </button>
                <button
                  onClick={saveTwinSnapshot}
                  className="border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition text-sm cursor-pointer"
                >
                  Save Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
