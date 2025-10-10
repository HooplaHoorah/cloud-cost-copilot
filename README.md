# Cloud Cost Copilot (Hackathon)

A lightweight, serverless helper that reads **AWS Cost Explorer** data and produces short,
actionable cost insights (e.g., rightsizing, RI/SP coverage, tag hygiene).  
Built with **API Gateway + Lambda (Python)** and **Amazon Bedrock (Claude 3 Haiku)**.

## What it does
- Pulls cost/usage summaries from Cost Explorer
- Explains MoM changes in plain English
- Proposes quick optimizations and next steps

## Architecture
- **Frontend:** simple HTML/JS smoke pages using Cognito PKCE for auth
- **API:** Amazon API Gateway (JWT authorizer with Cognito)
- **Compute:** AWS Lambda (Python 3.11)
- **AI:** Amazon Bedrock (Claude 3 Haiku)
- **(Optional)** S3 for saving generated reports

## Privacy & data handling
- No PII/PHI. Inputs are account-level billing metadata (service, region, tag keys).
- Outputs are brief text recommendations; all results reviewed by engineers before action.

## Quick start (high level)
1. Enable Cognito Hosted UI + PKCE.
2. Attach `bedrock:InvokeModel*` (model-scoped) and Cost Explorer read actions to the Lambda role.
3. Set Lambda env var `MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0`.
4. Deploy API routes: `/chat` (POST, GET) and `/orchestrator` (GET, POST).
5. Open the PKCE smoke page, sign in, and call the endpoints.

## Endpoints (smoke)
- `GET /orchestrator` – auth check
- `POST /chat` – `{ "prompt": "What were my top 3 services last month and any quick savings?" }`

> This repository hosts documentation and sample code for an internal hackathon project by Hoopla Hoorah, LLC.
