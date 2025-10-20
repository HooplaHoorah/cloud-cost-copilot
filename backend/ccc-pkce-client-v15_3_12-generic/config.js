/* Cloud Cost Copilot — config (generic template) */
window.CFG = {
  // Your Cognito Hosted UI domain, e.g. "https://your-domain.auth.us-east-1.amazoncognito.com"
  userPoolDomain: "https://REPLACE_ME.auth.REGION.amazoncognito.com",
  // App client ID from your Cognito User Pool (PKCE app client without secret)
  clientId: "REPLACE_ME_CLIENT_ID",
  // These two must be in Allowed callback URLs / Allowed sign-out URLs in your app client
  redirectUri: "http://localhost:8080/cost-copilot-demo-root.pkce-dev.html",
  signOutRedirectUri: "http://localhost:8080/cost-copilot-demo-root.pkce-dev.html",
  // Scopes requested during login
  scopes: ["openid","email","profile"]
};