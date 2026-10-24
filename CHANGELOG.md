# 📜 Changelog

All notable changes to the **Prescripto Digital Twin** platform are documented in this file, adhering to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

## [2.4.0] - 2026-10-24
### Added
- Interactive Physiological Digital Twin HUD with Framingham ASCVD 10-year risk modeling.
- Counterfactual "What-If" intervention simulation sandbox for lifestyle & medication adherence.
- Biological cellular age delta calculations.
- Dual-stage AI Specialist Triage pipeline (Scikit-learn + Gemini 2.0 Flash).
- Global Edge Vercel CDN deployment with sub-50ms TTFB.
- Structured `/health` liveness and readiness probe endpoint.

### Fixed
- SPA subroute rewrites for direct navigation to `/digital-twin`.
- Doctor / Admin portal navigation routing.
- Replaced contact phone numbers with verified placeholder standards.

## [2.0.0] - 2026-10-18
### Added
- WebRTC peer-to-peer audio/video tele-consultations over DTLS-SRTP encryption.
- Redis in-memory cache-aside architecture for sub-4ms doctor discovery.
- Distributed concurrency locking for race-free appointment slot booking.
- Razorpay cryptographic payment fee escrow with HMAC-SHA256 verification.
