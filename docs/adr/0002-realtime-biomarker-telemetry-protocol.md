# ADR 0002: Real-Time Physiological Telemetry Transmission Protocol

## Context and Problem Statement
The Patient Digital Twin generates continuous biometric telemetry (Heart Rate, Systolic/Diastolic BP, SpO2, HRV, Respiratory Rate, Blood Glucose) at variable sampling frequencies (1 Hz to 50 Hz). A secure, bidirectional, and low-latency transport layer is required between the patient's client and the doctor/admin observation dashboard.

## Considered Options
1. **HTTP Long-Polling**: High overhead, poor latency (> 800ms), heavy server connection exhaustion.
2. **Standard WebSocket (Socket.IO)**: Good latency (~100ms), centralized relay, easily load balanced.
3. **WebRTC DataChannels with WebSocket Signaling Fallback (Selected)**:
   - WebRTC DataChannel (RTCDataChannel) for direct peer-to-peer telemetry streaming with sub-20ms latency.
   - Socket.IO as the signaling protocol and fallback transport for symmetric NAT/firewall configurations.

## Decision Outcome
Chosen option: **Option 3 (WebRTC DataChannels with Socket.IO Fallback)**.

### Positive Consequences
- **Ultra-low latency**: Real-time waveform rendering on doctor portal without lag.
- **End-to-End Encryption (DTLS/SRTP)**: Physiological vitals transmitted peer-to-peer are encrypted without intermediary server exposure.
- **Graceful Degradation**: If WebRTC ICE negotiation fails, system falls back to WebSocket messages.

## Status
Accepted and documented in `frontend/src/types/telemetry.d.ts`.
