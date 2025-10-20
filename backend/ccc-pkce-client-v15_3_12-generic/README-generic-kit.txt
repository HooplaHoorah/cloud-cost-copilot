# Cloud Cost Copilot — Generic Config Kit (v15_3_12)
Copy `config.js` and `token-ui.js` into the client folder. Update `userPoolDomain` and `clientId` with your own Cognito values. Ensure the redirect/sign-out URLs are allowed in your app client. Serve locally with:
  python -m http.server 8080
Then open:
  http://localhost:8080/cost-copilot-demo-root.pkce-dev.html