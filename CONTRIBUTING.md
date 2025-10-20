
# Contributing to Cloud Cost Copilot

Thanks for helping! This doc explains how to run the project, propose changes, and keep PRs smooth.

## Scope
Cloud Cost Copilot is a browser-based dashboard for AWS cost insights with:
- Frontend SPA (Cognito PKCE auth, demo mode)
- Optional backend (API Gateway + Lambda → Cost Explorer; optional Bedrock)

## Quick dev setup
```bash
# Client (no deps required)
cd client/generic
python -m http.server 8080
# open http://localhost:8080/cost-copilot-demo-root.pkce-dev.html
```
- Set Cognito placeholders in `client/generic/config.js`, or just use **Demo Mode**.

## Branch & PR workflow
- Create a feature branch: `git checkout -b feat/<short-name>`
- Follow **Conventional Commits** for messages:
  - `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `perf:`, `test:`
- Open a PR against `main`. Include:
  - What changed & why
  - Screenshots (if UI)
  - Manual QA steps (see below)

## Coding standards
- Keep UI accessible in light/dark modes.
- Favor small, focused PRs (<300 lines when possible).
- JS/HTML/CSS: format with your editor’s default formatter; keep class/IDs consistent.

## Manual QA checklist
- [ ] Incognito: Login → **Tokens: present**
- [ ] Demo Mode toggles and period selector update cards/charts
- [ ] Zero-spend state looks clean
- [ ] Logout clears tokens and redirects via `/logout`
- [ ] No secrets committed (`config.js` uses placeholders)

## Filing issues
Use clear titles and repro steps. Label:
- `bug`, `feat`, `docs`, `security`, `good-first-issue`

## Security
Please **do not** open public issues for vulnerabilities.
Email: security@yourdomain.com (or use GitHub Security Advisories).

## Code of Conduct
Be kind and constructive. Harassment or discrimination isn’t tolerated.
