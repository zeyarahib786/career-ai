# Changelog

## [1.0.0] — 2026-06 — Initial Production Release

### Added
- Full MERN stack — Node.js 20 + Express 4 + MongoDB 7 + React 18 + Vite 5
- Backend: REST API with 7 endpoints across 4 resource groups
- Models: Certification (SGA-01–06), Track (t1–t4), Enrollment, Participant (PDPL separation)
- Pricing service: bundle 5%, team 10%/20%, UAE VAT 5% — exact v11 HTML parity
- Email service: HTML enrollment confirmation + admin notification
- Frontend: all v11 sections — Hero, Programmes, Why, FAQ, CTA
- i18n: 391 EN + 391 AR keys — verbatim from v11 production HTML
- Bilingual EN/AR with RTL/LTR, timezone detection, localStorage persist
- Enrollment modal: 3-step form with live pricing from API
- All 4 legal pages: Privacy (PDPL/DIFC DPL), Terms (DIFC Courts), Accessibility, Cookies
- Docker Compose: MongoDB + API + nginx frontend
- Comprehensive SETUP.md with 13 sections

### Security
- Helmet: CSP without unsafe-inline, frameAncestors:none, objectSrc:none
- CORS: explicit origin allowlist
- Rate limiting: 100/15min global, 5/15min enrollment
- Request ID middleware for correlation tracing
- Participant data stored separately from Enrollment (PDPL/DIFC DPL compliance)
- 7-year retention policy enforced via pre-save hook

### Compliance
- UAE PDPL Federal Decree No. 45 of 2021
- DIFC Data Protection Law 2020
- WCAG 2.1 AA — keyboard navigation, ARIA, focus management, RTL/LTR, reduced motion
- W3C HTML5 — semantic structure, heading hierarchy
- ISO 9001:2015 — quality management
- RFC 9116 — security.txt
