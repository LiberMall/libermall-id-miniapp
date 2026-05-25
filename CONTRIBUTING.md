# Contributing to Libermall ID Mini App

Thanks for considering a contribution! This Mini App is part of the [Libermall ID](https://id.libermall.com) ecosystem.

## Quick start

```bash
git clone git@github.com:LiberMall/libermall-id-miniapp.git
cd libermall-id-miniapp/public
python3 -m http.server 8080
# → open http://localhost:8080 (Telegram SDK won't load fully outside Telegram)
```

For end-to-end testing inside a real Telegram client:

```bash
npx serve public
ngrok http 3000
# register the ngrok URL with @BotFather → /newapp
```

## Project layout

```
public/
├── index.html       ← single page, loads the WebApp SDK + module
├── app.js           ← screens, navigation stack, product list, all logic
├── app.css          ← styles (theme-aware via CSS variables)
└── favicon.svg
```

There's no build step. Edit files, refresh the WebApp in Telegram (pull to refresh).

## Code style

- Vanilla ES modules (`import` / `export`)
- 2-space indent, trailing commas, single quotes
- No transpilation, no bundler
- One screen per object: `{ html() {...}, wire() {...} }`
- Reach for the Telegram SDK first (`Telegram.WebApp.HapticFeedback`, `BackButton`, `MainButton`, `showAlert`, `showPopup`) before adding a custom widget.

## Adding a new screen

1. Define the screen object in [`public/app.js`](public/app.js):
   ```js
   const Settings = {
     html() {
       return `<h1>${t('Настройки', 'Settings')}</h1>...`;
     },
     wire() {
       document.querySelector('#save').addEventListener('click', () => {
         haptic?.impactOccurred('light');
         // ...
       });
     },
   };
   ```
2. Push to it from somewhere: `push(Settings)`.
3. The stack automatically shows `BackButton` and handles pop.

## RU / EN copy

The app is bilingual. Every string must have both variants. Use the helper:

```js
t('Русский текст', 'English text')
```

Brand: always **Libermall** (capital L, the rest lowercase) — both in RU and EN.

## CSS — theme variables

The app reads Telegram's theme via CSS variables wired in `app.css`:

```css
:root {
  --bg:           var(--tg-theme-bg-color, #FFFFFF);
  --text:         var(--tg-theme-text-color, #111111);
  --hint:         var(--tg-theme-hint-color, #999999);
  --link:         var(--tg-theme-link-color, #2A7BFF);
  --button:       var(--tg-theme-button-color, #2A7BFF);
  --button-text:  var(--tg-theme-button-text-color, #FFFFFF);
  --secondary-bg: var(--tg-theme-secondary-bg-color, #F4F4F5);
}
```

Use these variables everywhere — never hard-code colors except for product accent colors in `PRODUCTS`.

## Pull-request checklist

- [ ] Branch from `main`, name `topic/short-description`
- [ ] One logical change per PR
- [ ] Tested locally with `python3 -m http.server` AND inside Telegram via ngrok
- [ ] Both RU and EN copy added where applicable
- [ ] `README.md` updated if features changed
- [ ] `CHANGELOG.md` entry under `## Unreleased`
- [ ] No new external dependencies (we ship zero-dependency)

## License

By contributing you agree your code is licensed under [MIT](LICENSE).
