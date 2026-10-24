# 🤝 Contributing to Prescripto Digital Twin

Thank you for your interest in contributing to **Prescripto Digital Twin**! This document outlines our development guidelines, code standards, and PR workflows.

## 🌿 Git Branching Strategy
- `main`: Protected production branch. All code must pass CI tests before merging.
- `feat/*`: New features (e.g., `feat/blood-glucose-sensor-sync`).
- `fix/*`: Bug fixes and clinical calibration adjustments.
- `docs/*`: Architectural guides and documentation updates.

## 📝 Commit Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` Introduces a new capability.
- `fix:` Fixes a bug or calculation drift.
- `docs:` Documentation-only changes.
- `perf:` Performance improvements (e.g. caching).
- `ci:` Continuous integration workflows.
- `test:` Unit or integration test additions.

## 🧪 Local Testing Before Pull Request
```bash
# 1. Frontend validation
cd frontend && npm run build

# 2. Admin portal validation
cd ../admin && npm run build

# 3. Backend syntax validation
cd ../backend && node -c server.js
```

## 🔒 Healthcare Privacy Principles
- Never commit patient Identifiable Health Information (PHI).
- Always verify all test vitals are synthetic dummy figures.
