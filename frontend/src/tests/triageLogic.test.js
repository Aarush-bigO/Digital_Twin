/**
 * Unit Test Suite: Clinical Triage Response Normalization & Heuristics
 */

describe('Clinical Triage Response Normalization', () => {
  const sanitizeSpecialist = (rawSpecialty) => {
    const validSpecialties = [
      'Cardiologist',
      'Neurologist',
      'Gastroenterologist',
      'Pulmonologist',
      'Endocrinologist',
      'Dermatologist',
      'General Physician'
    ];
    if (!rawSpecialty) return 'General Physician';
    const match = validSpecialties.find(
      s => s.toLowerCase() === rawSpecialty.trim().toLowerCase()
    );
    return match || 'General Physician';
  };

  test('should sanitize valid clinical specialties correctly', () => {
    expect(sanitizeSpecialist('cardiologist')).toBe('Cardiologist');
    expect(sanitizeSpecialist('PULMONOLOGIST')).toBe('Pulmonologist');
    expect(sanitizeSpecialist('  Dermatologist  ')).toBe('Dermatologist');
  });

  test('should fallback to General Physician when given unknown or null input', () => {
    expect(sanitizeSpecialist('')).toBe('General Physician');
    expect(sanitizeSpecialist(null)).toBe('General Physician');
    expect(sanitizeSpecialist('Astrologer')).toBe('General Physician');
  });

  test('should correctly flag emergency red-line symptoms', () => {
    const isEmergency = (symptoms) => {
      const redLines = ['chest pain', 'shortness of breath', 'loss of consciousness', 'stroke', 'severe bleeding'];
      const text = (symptoms || '').toLowerCase();
      return redLines.some(flag => text.includes(flag));
    };

    expect(isEmergency('Patient reports sudden acute chest pain radiating to left arm')).toBe(true);
    expect(isEmergency('Mild headache and runny nose')).toBe(false);
    expect(isEmergency('Sudden shortness of breath after exertion')).toBe(true);
  });
});
