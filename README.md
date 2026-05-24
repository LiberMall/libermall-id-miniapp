# Libermall ID — Mini App

Telegram Mini App для [@LibermallIDbot](https://t.me/LibermallIDbot). Vanilla JS, Telegram WebApp SDK, theme-aware.

## Возможности (v0.2)

- **Профиль** — TG-пользователь, ID, premium-бейдж
- **Сетка продуктов** — 6 сервисов экосистемы с deeplinks
- **Управление** — профиль/кошельки, безопасность, about
- **Tier-1 UX:** haptic feedback, BackButton stack, theme params, safe-area, нативные алерты

## Deploy

Статика serves через nginx на `/app/`:

```bash
rsync -avz public/ root@89.127.218.87:/var/www/libermall-id-miniapp/
```

Nginx-route:
```nginx
location /app/ {
    alias /var/www/libermall-id-miniapp/;
    try_files $uri $uri/ /app/index.html;
    add_header Cache-Control "public, max-age=300";
}
```

## Регистрация в BotFather

```
/setdomain @LibermallIDbot → id.libermall.com  (уже есть)
/newapp @LibermallIDbot → url: https://id.libermall.com/app/
```

## Архитектура

Stack-based навигация: каждый экран — объект с `html()` + `wire()`. Push/pop через `BackButton` Telegram.

## Roadmap (Phase 3)

- Реальная привязка TON-кошельков через TonConnect
- Email link с magic-link
- WebAuthn passkeys для 2FA
- Список активных сессий + revoke
- Audit log входов
- Реальные данные профиля из Casdoor `/api/userinfo`

## Лицензия

MIT.
