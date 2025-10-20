/* Cloud Cost Copilot — PKCE helper (generic kit, v15_3_12) */
(function () {
  const B64URL = (bytes) =>
    btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/,"");
  const rand = (n = 32) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return a; };
  const sha256 = async (s) => {
    const data = new TextEncoder().encode(s);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return B64URL(new Uint8Array(buf));
  };

  const S = {
    get: (k) => JSON.parse(sessionStorage.getItem(k)),
    set: (k, v) => sessionStorage.setItem(k, JSON.stringify(v)),
    del: (k) => sessionStorage.removeItem(k),
    clear: () => sessionStorage.clear()
  };

  function cfg() {
    if (!window.CFG) throw new Error("CFG missing: expected window.CFG");
    const c = window.CFG;
    if (!c.userPoolDomain || !c.clientId || !c.redirectUri) throw new Error("CFG incomplete");
    return c;
  }
  function base() {
    const d = cfg().userPoolDomain.replace(/^https?:\/\//, "");
    return `https://${d}`;
  }
  function scopes() {
    return (cfg().scopes && cfg().scopes.length ? cfg().scopes : ["openid","email","profile"]).join(" ");
  }
  function signOutRedirect() {
    return cfg().signOutRedirectUri || cfg().redirectUri;
  }

  function setStatus() {
    const dump = CCCTokens.dump();
    const present = !!(dump && dump.access_token);
    const t = document.getElementById("tokenStatus"); if (t) t.textContent = present ? "present" : "missing";
    const e = document.getElementById("tokenExpiry"); if (e) e.textContent = present && dump.expires_at ? new Date(dump.expires_at).toLocaleString() : "-";
    const s = document.getElementById("tokenScopes"); if (s) s.textContent = present ? (dump.scope || scopes()) : "-";
  }

  async function exchange(code, verifier) {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: cfg().clientId,
      redirect_uri: cfg().redirectUri,
      code_verifier: verifier
    });
    const resp = await fetch(`${base()}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!resp.ok) throw new Error(`token exchange failed (${resp.status})`);
    return await resp.json();
  }

  async function refresh() {
    const dump = S.get("ccc.tokens");
    if (!dump || !dump.refresh_token) {
      alert("No refresh token available.");
      return null;
    }
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: cfg().clientId,
      refresh_token: dump.refresh_token
    });
    const resp = await fetch(`${base()}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!resp.ok) throw new Error(`refresh failed (${resp.status})`);
    const tok = await resp.json();
    const next = { ...dump, ...tok };
    if (tok.expires_in) next.expires_at = Date.now() + tok.expires_in * 1000;
    S.set("ccc.tokens", next);
    setStatus();
    return next;
  }

  function logout() {
    try {
      S.del("ccc.tokens");
      S.del("ccc.pkce");
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expires_at");
    } catch (e) { console.warn("Local storage cleanup warning:", e); }
    setStatus();
    const p = new URLSearchParams({ client_id: cfg().clientId, logout_uri: signOutRedirect() });
    window.location.assign(`${base()}/logout?${p.toString()}`);
  }

  function login() {
    const state = B64URL(rand(24));
    const verifier = B64URL(rand(32));
    S.set("ccc.pkce", { state, verifier });
    sha256(verifier).then((challenge) => {
      const url = new URL(`${base()}/oauth2/authorize`);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("client_id", cfg().clientId);
      url.searchParams.set("redirect_uri", cfg().redirectUri);
      url.searchParams.set("scope", scopes());
      url.searchParams.set("state", state);
      url.searchParams.set("code_challenge", challenge);
      url.searchParams.set("code_challenge_method", "S256");
      window.location.assign(url.toString());
    });
  }

  function readQuery() {
    const url = new URL(window.location.href);
    return { code: url.searchParams.get("code"), state: url.searchParams.get("state") };
  }

  async function maybeHandleRedirect() {
    const qp = readQuery();
    if (!qp.code) return;
    const stash = S.get("ccc.pkce") || {};
    if (qp.state && stash.state && qp.state !== stash.state) {
      console.warn("State mismatch on redirect; ignoring code.");
      return;
    }
    const tok = await exchange(qp.code, stash.verifier);
    if (tok.expires_in) tok.expires_at = Date.now() + tok.expires_in * 1000;
    S.set("ccc.tokens", tok);
    try { history.replaceState({}, document.title, cfg().redirectUri); } catch (_) {}
    setStatus();
  }

  window.CCCTokens = {
    login, refresh, logout,
    id: () => (S.get("ccc.tokens") || {}).id_token || null,
    access: () => (S.get("ccc.tokens") || {}).access_token || null,
    dump: () => S.get("ccc.tokens") || null,
    clear: () => { S.del("ccc.tokens"); setStatus(); }
  };

  document.addEventListener("DOMContentLoaded", () => {
    setStatus();
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener("click", (e) => { e.preventDefault(); fn(); }); };
    bind("loginBtn", CCCTokens.login);
    bind("refreshBtn", CCCTokens.refresh);
    bind("clearBtn", () => CCCTokens.clear());
    bind("logoutBtn", CCCTokens.logout);
    maybeHandleRedirect();
  });
})();