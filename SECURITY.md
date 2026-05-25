# Security Policy

## Reporting a vulnerability

If you discover a security issue in the Libermall ID Mini App **do not open a public GitHub issue**. Use one of these private channels instead:

| Channel | Use it for |
|---|---|
| **Email**: [`security@libermall.com`](mailto:security@libermall.com) | Most reports. PGP key on request. |
| **GitHub Security Advisory** | Private coordinated disclosure via the *Security* tab |
| **Telegram** to [@LibermallIDbot](https://t.me/LibermallIDbot) → `/security` | Quick disclosure with screenshots |

We acknowledge reports within **48 hours**, triage within **5 business days**, and aim to ship a fix within **30 days** for high-severity issues.

## Scope

In scope:

- The Mini App served at [`id.libermall.com/app/`](https://id.libermall.com/app/)
- This source code repository
- The handoff between `@LibermallIDbot` and the Mini App
- Any data the app sends to Libermall ID admin / userinfo endpoints

Out of scope:

- Vulnerabilities in the [Telegram WebApp SDK](https://core.telegram.org/bots/webapps) itself — report to Telegram
- Vulnerabilities in upstream [Casdoor](https://github.com/casdoor/casdoor) — report directly to that project
- Phishing or social-engineering against operators
- Theoretical CVEs without a working proof-of-concept

## Special note on `initDataUnsafe`

The app currently reads `Telegram.WebApp.initDataUnsafe` for display purposes (greeting, avatar initials, premium badge). This data is **never** trusted for auth decisions — every privileged action will route through Libermall ID's HMAC-validated `initData` on the server side.

If you find a code path that uses `initDataUnsafe` for an authorization check, that's a valid security issue and we want to know.

## Safe-harbor

We won't pursue legal action against researchers who:

1. Make good-faith effort to avoid privacy violations and service degradation.
2. Don't exfiltrate data beyond what's needed to prove the issue.
3. Give us reasonable time to remediate before public disclosure (typically 90 days).
4. Don't exploit the issue for personal gain.

## Hall of fame

Researchers who report valid vulnerabilities will be credited (with consent) in [`CHANGELOG.md`](CHANGELOG.md) and on [`id.libermall.com/security.html`](https://id.libermall.com/security.html).
