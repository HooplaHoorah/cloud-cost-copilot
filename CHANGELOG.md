
# Changelog
All notable changes to this project will be documented here.

The format is based on [Keep a Changelog] and this project aims to follow [Semantic Versioning].

## [v15.3.12] - 2025-10-20
### Added
- Demo Mode dataset and UI so the app is useful in brand-new AWS accounts.
- Light/Dark theme toggle and shared legend.

### Changed
- Dashboard layout: 2×2 grid with Top Services, Legend, Bar + Pie charts.

### Fixed
- **Logout**: clear local/session storage then redirect to Cognito `/logout` with `logout_uri`.
- **PKCE**: ensure `/oauth2/authorize` uses `redirect_uri` and consistent `state`/`verifier` handling.

### Security
- No secrets committed; `config.js` uses placeholders.
- Documented Allowed callback/sign-out URL configuration.

## [Unreleased]
- Rightsizing and Savings Plan recommendations
- Multi-account/organization view
- Marketplace packaging

[Keep a Changelog]: https://keepachangelog.com/en/1.1.0/
[Semantic Versioning]: https://semver.org/spec/v2.0.0.html
[v15.3.12]: https://github.com/<org>/<repo>/releases/tag/v15_3_12
