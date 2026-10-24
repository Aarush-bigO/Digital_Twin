# 🛡️ Healthcare Data Security & Responsible Disclosure Policy

Prescripto Digital Twin adheres to modern digital health information security practices to safeguard patient vitals and telehealth telemetry.

## 🔐 Security Architecture Controls
- **Data In Transit:** All API traffic, WebRTC signaling, and telehealth video streams enforce **TLS 1.3 / HTTPS** and **DTLS-SRTP** end-to-end encryption.
- **Cryptographic Financial Transactions:** Consultation booking fee escrow utilizes server-side **HMAC-SHA256** signature verification via Razorpay.
- **Authentication & Authorization:** Role-based access control (RBAC) enforced via cryptographically signed JWT tokens with expiration guards.
- **Zero Raw PHI in Cache:** Redis in-memory storage maintains only sanitized doctor availability sets and lock handles.

## 🚨 Reporting a Vulnerability
If you discover a security vulnerability within Prescripto Digital Twin, please report it responsibly:
- **Email:** `aarushbharti2005@gmail.com`
- Please provide reproducible steps and payload details. We commit to acknowledging receipt within 48 hours.
