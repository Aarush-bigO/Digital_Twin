/**
 * WebRTC Signaling & DataChannel Live Telemetry Protocol Types
 */

export interface TelemetryPacket {
  packetId: string;
  timestamp: number;
  appointmentId: string;
  senderRole: 'patient' | 'doctor';
  payloadType: 'VITALS_DELTA' | 'INTERVENTION_CALIBRATION' | 'HUD_PING';
  data: {
    systolicBP?: number;
    diastolicBP?: number;
    heartRate?: number;
    biologicalAgeDelta?: number;
    cvRisk?: number;
    interventions?: {
      extraActivityMin: number;
      sodiumSugarReduction: number;
      medicationAdherence: number;
      weightLossTarget: number;
    };
  };
}

export interface SignalingRoomState {
  roomId: string;
  patientConnected: boolean;
  doctorConnected: boolean;
  iceCandidatesQueued: number;
  dtlsEncrypted: boolean;
}
