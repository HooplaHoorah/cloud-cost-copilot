# Devpost Submission Copy — Cloud Cost Copilot

**Elevator pitch**  
Cloud Cost Copilot turns AWS spend into simple, actionable insights. It’s an AWS-native SPA with Cognito PKCE auth, Cost Explorer for truth, and optional Bedrock to explain what changed and why. Works great even in brand-new accounts via Demo Mode.

**What it does**
- Secure login via Cognito (PKCE)
- Period switching (7/30/This/Last) with synced cards + bar/pie charts
- Demo Mode for zero-spend accounts; clear empty states
- Optional Bedrock summaries (graceful fallback if disabled)

**How we built it**
- Frontend SPA (S3/CloudFront-ready; runs local for demo)
- Cognito Hosted UI (Authorization Code + PKCE)
- API Gateway + Lambda (Cost Explorer; optional Bedrock)
- CloudWatch for logs

**Challenges**
- Robust PKCE on localhost flows
- Zero-spend UX that still tells a story
- CE throttling/backoff and caching

**Accomplishments**
- Predictable Demo Mode + consistent totals
- Token panel for transparent auth troubleshooting
- Accessible light/dark themes and shared legend

**What’s next**
- Rightsizing + Savings Plan recommender
- Multi-account/org view
- Marketplace packaging

**AWS services**
Cognito, API Gateway, Lambda, Cost Explorer, (optional) Bedrock, CloudWatch, S3/CloudFront

**Screenshots (GitHub)**
- 00 Startup: `docs/screenshots/00-startup.png`
- 01 Login (PKCE): `docs/screenshots/01-login.png`
- 02 Token Panel: `docs/screenshots/02-token-panel.png`
- 03 Dashboard — Dark: `docs/screenshots/03-dashboard-dark.png`
- 04 Dashboard — Light: `docs/screenshots/04-dashboard-light.png`
- 05 Zero-Spend: `docs/screenshots/05-zero-spend.png`
- 06 Logout: `docs/screenshots/06-logout.png`

**Links**
- GitHub repo: https://github.com/HooplaHoorah/cloud-cost-copilot
- Demo video: https://youtu.be/sAfVSziJseU
- Release tag: `v15_3_12` (to be created on GitHub Releases)