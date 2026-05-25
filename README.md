<div align="center">

# Libermall ID — Mini App

**The Telegram Mini App for [Libermall ID](https://id.libermall.com)** — your identity, your wallets, the whole ecosystem in one screen inside Telegram.

[![License: MIT](https://img.shields.io/badge/License-MIT-FFD60A.svg?style=flat-square)](LICENSE)
[![Mini App](https://img.shields.io/badge/Telegram-Mini%20App-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://t.me/LibermallIDbot)
[![Identity](https://img.shields.io/badge/Identity-id.libermall.com-FFD60A?style=flat-square&logo=safari&logoColor=black)](https://id.libermall.com)
[![No build step](https://img.shields.io/badge/build-none-22C55E?style=flat-square)](public/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](public/app.js)

[**Open the app**](https://t.me/LibermallIDbot/app) · [**Identity service**](https://id.libermall.com) · [**Bot repo**](https://github.com/LiberMall/libermall-id-bot) · [**Landing site repo**](https://github.com/LiberMall/libermall-id-landing)

</div>

---

## What is this?

A Tier-1 Telegram Mini App built on the [Telegram WebApp SDK](https://core.telegram.org/bots/webapps). It lets users:

- See their Libermall ID profile (Telegram name, id, premium badge, username)
- Open every product in the [Libermall ecosystem](https://libermall.com) with one tap — [DEX](https://dex.libermall.com), [PayLibermall](https://pay.libermall.com), [Libermall Card](https://card.libermall.com), [Marketplace](https://libermall.com)
- Manage profile, wallets, security from the same surface

No build step, no JavaScript framework, no bundler. Just `index.html`, `app.css`, `app.js` — served straight from nginx.

## Tier-1 UX features

- **Stack-based navigation** — each screen is an object with `html()` + `wire()`, push/pop driven by Telegram's `BackButton`
- **Haptic feedback** — every tap calls `HapticFeedback.impactOccurred()`
- **Theme-aware** — reads `themeParams` from `Telegram.WebApp` so the app matches the user's chat theme automatically
- **Safe-area padding** — respects the notch / home indicator via `env(safe-area-inset-*)`
- **Native dialogs** — uses `showAlert` / `showPopup` instead of browser-default `alert()`
- **RU / EN auto-detection** — reads `language_code` from `initDataUnsafe.user`

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Telegram client (iOS / Android / Desktop / Web)            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Telegram.WebApp ─────► initDataUnsafe.user           │  │
│  │  + BackButton + HapticFeedback + themeParams          │  │
│  └────────────────────────────┬──────────────────────────┘  │
└──────────────────────────────┬┴──────────────────────────────┘
                               │ HTTPS (cached 5 min)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             nginx static  →  /var/www/libermall-id-miniapp  │
│                                                              │
│   index.html  +  app.css  +  app.js  +  favicon.svg         │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
                  [user clicks product → deep link]
```

The app weighs roughly 25 KB total (HTML + CSS + JS, ungzipped). Load is single-frame.

## Repository layout

```
libermall-id-miniapp/
├── README.md            ← you are here
├── LICENSE              ← MIT
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── .editorconfig
├── .gitignore
└── public/              ← everything that ships
    ├── index.html       ← single page, loads SDK + module
    ├── app.js           ← screens, navigation stack, products
    ├── app.css          ← styles (theme-aware via CSS variables)
    └── favicon.svg
```

## Quickstart

```bash
git clone git@github.com:LiberMall/libermall-id-miniapp.git
cd libermall-id-miniapp/public
python3 -m http.server 8080
# → open http://localhost:8080 in Chrome with Telegram mock data
```

To test inside real Telegram, you need a public URL. Spin one up quickly:

```bash
npx serve public        # → http://localhost:3000
ngrok http 3000         # → https://random.ngrok.app
```

Then point your test bot's WebApp at the ngrok URL via [@BotFather](https://t.me/BotFather):

```
/newapp @your_test_bot
  → url: https://random.ngrok.app
```

## Deploy

The app is static — any CDN works (Cloudflare Pages, Vercel, Netlify, S3+CloudFront, nginx). We currently rsync onto the Libermall ID VPS:

```bash
rsync -avz --delete public/ root@89.127.218.87:/var/www/libermall-id-miniapp/
```

The nginx config block:

```nginx
location /app/ {
    alias /var/www/libermall-id-miniapp/;
    try_files $uri $uri/ /app/index.html;
    add_header Cache-Control "public, max-age=300";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

## BotFather registration

Done once per bot:

```
/setdomain @LibermallIDbot → id.libermall.com
/newapp @LibermallIDbot
  url: https://id.libermall.com/app/
  short_name: app
```

The app then opens via:
- The `webApp` button in any inline keyboard (used by `@LibermallIDbot`).
- The bot's main "Menu" button (Settings → Menu Button → URL).
- A direct deep link: `https://t.me/LibermallIDbot/app`.

## Configuration

The app reads its product list and brand colors from constants at the top of [`public/app.js`](public/app.js). To add an ecosystem product:

```js
const PRODUCTS = [
  // ...
  {
    id: 'my-new-product',
    name: 'My New Product',
    desc: t('Что это', 'What it is'),
    color: '#FF5733',
    emoji: 'MNP',
    url: 'https://my-new-product.libermall.com',
  },
];
```

The change ships with one `rsync` — no rebuild.

## Roadmap

- [x] Stack-based navigation with BackButton integration
- [x] Profile screen with TG identity + premium badge
- [x] Product grid with deep links to every ecosystem service
- [x] Theme-aware styling (light / dark from Telegram)
- [x] Haptic feedback on every interaction
- [x] Safe-area padding for notch devices
- [ ] Real TON wallet linking via TON Connect
- [ ] Email magic-link flow
- [ ] WebAuthn passkeys for 2FA
- [ ] Active sessions list + revoke
- [ ] Login audit log
- [ ] Real userinfo from Casdoor `/api/userinfo`
- [ ] Notifications subscription management

## Contributing

PRs welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Security

To report a vulnerability, see [`SECURITY.md`](SECURITY.md) — please don't open a public issue.

## License

[MIT](LICENSE) © 2026 Libermall.

The `Libermall` wordmark and the M-shield logo are trademarks of Libermall and are not covered by this MIT License; see the brand guidelines in [`LiberMall/libermall-id-landing`](https://github.com/LiberMall/libermall-id-landing/blob/main/BRANDBOOK.md).

---

<div align="center">

**Part of the [Libermall ecosystem](https://libermall.com).**

[Identity](https://id.libermall.com) · [DEX](https://dex.libermall.com) · [Pay](https://pay.libermall.com) · [Card](https://card.libermall.com)

</div>
