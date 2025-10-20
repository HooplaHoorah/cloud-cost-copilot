
# Cloud Cost Copilot — Generic Setup Guide (Add‑ons for v15_3_12)

Drop these files into your **generic** client folder and overwrite existing files if prompted:
- `iam-policies/` — example IAM policies for a minimal backend
- `README-GENERIC.md` — this step-by-step guide

---

## A) Run Locally (Demo Mode)
1. In the client folder: `python -m http.server 8080`
2. Open: `http://localhost:8080/cost-copilot-demo-root.pkce-dev.html`
3. Use **Demo Mode** for a full walkthrough without touching AWS.

## B) Wire up your own AWS Cognito (PKCE)
1. Create a **User Pool**.
2. Create an **App client** (Authorization code grant; no secret).
   - Scopes: `openid`, `email`, `profile`
   - **Allowed callback URLs**: `http://localhost:8080/cost-copilot-demo-root.pkce-dev.html`
   - **Allowed sign-out URLs**: `http://localhost:8080/cost-copilot-demo-root.pkce-dev.html`
3. Copy your Hosted UI domain + app client id into `config.js`.
4. Test in a fresh Incognito window. Logout should bounce back and clear tokens.

## C) Backend (Optional)
Use the IAM policy samples in `iam-policies/` for a Lambda behind API Gateway to query Cost Explorer.

## D) Architecture (high level)
SPA → Cognito (PKCE) → API Gateway → Lambda → Cost Explorer (+ Bedrock optional)
