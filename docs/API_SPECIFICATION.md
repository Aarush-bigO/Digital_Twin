# 📑 Prescripto Digital Twin — REST API Endpoint Specification

## 1. System Health & Probes
### `GET /health`
Returns structured uptime and dependency status (MongoDB, Redis, API Gateway).
- **Response `200 OK`**:
```json
{
  "status": "UP",
  "uptime": 14205,
  "services": {
    "apiGateway": { "status": "HEALTHY", "memoryUsageMb": 68 },
    "database": { "status": "CONNECTED" },
    "redisCache": { "status": "CONNECTED" }
  }
}
```

## 2. AI Specialist Triage
### `POST /api/ai-recommend`
Performs multi-symptom evaluation using Gemini 2.0 Flash with ML fallback.
- **Payload:**
```json
{ "symptoms": ["chest pain", "shortness of breath", "fatigue"] }
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "specialist": "Cardiologist",
  "doctors": [...]
}
```

## 3. Doctor Discovery & Booking
### `GET /api/doctor/list`
Fetches verified doctors roster with sub-4ms Redis cache-aside resolution.

### `POST /api/user/book-appointment`
Reserves a doctor slot with Redis distributed concurrency locking.
