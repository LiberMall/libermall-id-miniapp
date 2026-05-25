# Changelog

All notable changes to the Libermall ID Mini App are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] — 2026-05-25

### Added
- First public release under the LiberMall organization.
- Tier-1 `README.md` with badges, architecture diagram, repo layout, full quickstart, deploy instructions, BotFather walkthrough, configuration table, roadmap.
- `LICENSE` (MIT with brand protection), `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`.
- `.editorconfig` for consistent indentation across editors.

### Changed
- Repository moved from `DeFiTON/libermall-id-miniapp` to `LiberMall/libermall-id-miniapp`.
- Documentation language: Russian → English. `public/index.html` `lang="ru"` → `lang="en"` (default fallback — app remains bilingual at runtime via Telegram `language_code`).

## [0.2.0] — 2026-05-24

### Added
- Stack-based navigation: each screen is `{ html(), wire() }`; push / pop driven by Telegram's `BackButton`.
- Four screens: Home (greeting + product grid + menu), Profile, Security, About.
- Profile screen showing TG identity (name, id, premium badge, username).
- Product grid with deep links to every Libermall ecosystem service.
- Theme-aware styling via Telegram's `themeParams` (light / dark / accent / hint).
- Haptic feedback (`HapticFeedback.impactOccurred('light')`) on every interaction.
- Safe-area padding (`env(safe-area-inset-*)`) for notch / home indicator.
- Native dialog wrappers (`showAlert`, `showPopup`) instead of browser `alert()`.
- RU / EN auto-detection from `Telegram.WebApp.initDataUnsafe.user.language_code`.
- 25 KB total payload, single-frame load, zero dependencies.

## [0.1.0] — 2026-05-24

### Added
- Initial Mini App scaffold: `index.html`, `app.css`, `app.js`, `favicon.svg`.
- Telegram WebApp SDK integration.
- Static deploy via `rsync` + nginx.
