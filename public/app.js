// Libermall ID Mini App — vanilla JS, Tier-1 UX
const tg = window.Telegram?.WebApp;
const haptic = tg?.HapticFeedback;
const isRu = ((tg?.initDataUnsafe?.user?.language_code || navigator.language || 'ru') + '').toLowerCase().startsWith('ru');

const t = (ru, en) => isRu ? ru : en;

const PRODUCTS = [
  { id: 'sites-reviews', name: 'Sites.Reviews', desc: t('Каталог отзывов','Review catalog'), color: '#2A7BFF', emoji: 'SR', url: 'https://sites.reviews' },
  { id: 'tonchat', name: 'TonChat AI', desc: t('AI-помощник','AI assistant'), color: '#0098EA', emoji: 'TC', url: 'https://tonchat.ai' },
  { id: 'tonceo', name: 'TON.CEO', desc: t('Соцсеть','Social'), color: '#6364FF', emoji: 'M', url: 'https://ton.ceo' },
  { id: 'dex', name: 'Libermall DEX', desc: t('Биржа на TON','TON DEX'), color: '#2ECC71', emoji: 'DEX', url: 'https://dex.libermall.com' },
  { id: 'card', name: 'Libermall Card', desc: t('Виртуальные карты','Virtual cards'), color: '#FFB02E', emoji: '$', url: 'https://card.libermall.com' },
  { id: 'mp', name: 'Marketplace', desc: t('Маркетплейс','Marketplace'), color: '#17212B', emoji: 'L', url: 'https://libermall.com' },
];

// ── stack-based navigation ──
const stack = [];
function push(screen) { stack.push(screen); render(); haptic?.impactOccurred('light'); }
function pop() {
  if (stack.length <= 1) return tg?.close();
  stack.pop(); render(); haptic?.impactOccurred('light');
}

function render() {
  const current = stack[stack.length - 1];
  document.getElementById('app').innerHTML = current.html();
  // Wire after render
  if (current.wire) current.wire();
  if (stack.length > 1) tg?.BackButton.show(); else tg?.BackButton.hide();
}

// ── screens ──
const Home = {
  html() {
    const user = tg?.initDataUnsafe?.user || {};
    const name = user.first_name ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : t('Гость', 'Guest');
    const initials = (user.first_name?.[0] || 'L').toUpperCase();
    const tgId = user.id || '—';
    const username = user.username ? '@' + user.username : '';
    const isPremium = user.is_premium;

    return `
      <div class="screen">
        <div class="profile-hero">
          <div class="row">
            <div class="avatar">${user.photo_url ? `<img src="${user.photo_url}" alt="">` : initials}</div>
            <div>
              <div class="profile-name">${escapeHtml(name)}${isPremium ? `<span class="profile-badge">⭐ Premium</span>` : ''}</div>
              <div class="profile-id">${escapeHtml(username)} · ID ${tgId}</div>
            </div>
          </div>
        </div>

        <div class="note">
          <strong>Libermall ID</strong> ${t('— один аккаунт для всей экосистемы. Откройте любой продукт ниже — войдёте автоматически.', '— one account for the whole ecosystem. Open any product below to log in automatically.')}
        </div>

        <div class="section-title">${t('Продукты экосистемы', 'Ecosystem products')}</div>
        <div class="grid-products" id="products"></div>

        <div class="section-title">${t('Управление', 'Manage')}</div>
        <div class="list">
          <div class="list-item" data-action="profile">
            <div class="list-item-icon" style="background:#2A7BFF;">👤</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('Профиль и кошельки', 'Profile & wallets')}</div>
              <div class="list-item-subtitle">${t('Привязанные TON-кошельки, email', 'Linked TON wallets, email')}</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
          <div class="list-item" data-action="security">
            <div class="list-item-icon" style="background:#2ECC71;">🔐</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('Безопасность', 'Security')}</div>
              <div class="list-item-subtitle">${t('Сессии, 2FA, аудит', 'Sessions, 2FA, audit')}</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
          <div class="list-item" data-action="about">
            <div class="list-item-icon" style="background:#FFB02E;">ℹ️</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('О Libermall ID', 'About Libermall ID')}</div>
              <div class="list-item-subtitle">${t('Что это и как работает', 'What it is and how it works')}</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
        </div>

        <div class="screen-foot">
          <a href="https://id.libermall.com/privacy.html" target="_blank">${t('Приватность','Privacy')}</a>
          ·
          <a href="https://id.libermall.com/terms.html" target="_blank">${t('Условия','Terms')}</a>
        </div>
      </div>`;
  },
  wire() {
    const grid = document.getElementById('products');
    grid.innerHTML = PRODUCTS.map(p => `
      <div class="product-card" data-url="${p.url}" data-id="${p.id}">
        <div class="icon" style="background:${p.color};">${p.emoji}</div>
        <div class="name">${p.name}</div>
        <div class="desc">${p.desc}</div>
      </div>`).join('');

    grid.querySelectorAll('.product-card').forEach(el => {
      el.addEventListener('click', () => {
        haptic?.selectionChanged();
        tg?.openLink(el.dataset.url);
      });
    });

    document.querySelectorAll('.list-item').forEach(el => {
      el.addEventListener('click', () => {
        const action = el.dataset.action;
        if (action === 'profile') push(Profile);
        if (action === 'security') push(Security);
        if (action === 'about') push(About);
      });
    });
  }
};

const Profile = {
  html() {
    const user = tg?.initDataUnsafe?.user || {};
    return `
      <div class="screen">
        <header>
          <h1>${t('Профиль и кошельки', 'Profile & wallets')}</h1>
          <p class="lead">${t('Управляйте связанными аккаунтами и кошельками', 'Manage linked accounts and wallets')}</p>
        </header>

        <div class="section-title">${t('Telegram', 'Telegram')}</div>
        <div class="list">
          <div class="list-item">
            <div class="list-item-icon" style="background:#0098EA;">TG</div>
            <div class="list-item-body">
              <div class="list-item-title">${user.first_name || ''} ${user.last_name || ''}</div>
              <div class="list-item-subtitle">${user.username ? '@' + user.username : '—'} · ID ${user.id || ''}</div>
            </div>
            <div class="profile-badge">✓ ${t('подключено','linked')}</div>
          </div>
        </div>

        <div class="section-title">${t('TON-кошельки', 'TON wallets')}</div>
        <div class="list">
          <div class="list-item" data-action="link-ton">
            <div class="list-item-icon" style="background:#0098EA;">+</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('Привязать TON-кошелёк', 'Link TON wallet')}</div>
              <div class="list-item-subtitle">${t('Tonkeeper, MyTonWallet, Tonhub', 'Tonkeeper, MyTonWallet, Tonhub')}</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
        </div>

        <div class="section-title">Email</div>
        <div class="list">
          <div class="list-item" data-action="set-email">
            <div class="list-item-icon" style="background:#94A3B8;">@</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('Указать email для recovery', 'Set recovery email')}</div>
              <div class="list-item-subtitle">${t('Опционально, для восстановления доступа', 'Optional, for account recovery')}</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
        </div>

        <div class="note" style="margin-top:24px;">
          ${t('🚧 Привязка кошельков и email — в Phase 3 roadmap. Скоро будет доступно.', '🚧 Wallet & email linking — in Phase 3 roadmap. Coming soon.')}
        </div>
      </div>`;
  },
  wire() {
    document.querySelectorAll('.list-item[data-action]').forEach(el => {
      el.addEventListener('click', () => {
        haptic?.notificationOccurred('warning');
        tg?.showAlert(t('Эта функция будет доступна в Phase 3. Следите за обновлениями @LibermallIDbot.', 'This feature will be available in Phase 3. Follow @LibermallIDbot for updates.'));
      });
    });
  }
};

const Security = {
  html() {
    return `
      <div class="screen">
        <header>
          <h1>${t('Безопасность', 'Security')}</h1>
          <p class="lead">${t('Двухфакторная защита, активные сессии, история входов', 'Two-factor auth, active sessions, login history')}</p>
        </header>

        <div class="list">
          <div class="list-item" data-action="2fa">
            <div class="list-item-icon" style="background:#2ECC71;">🔐</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('Двухфакторная аутентификация', 'Two-factor authentication')}</div>
              <div class="list-item-subtitle">TOTP / WebAuthn passkeys</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
          <div class="list-item" data-action="sessions">
            <div class="list-item-icon" style="background:#2A7BFF;">📱</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('Активные сессии', 'Active sessions')}</div>
              <div class="list-item-subtitle">${t('Где вы залогинены прямо сейчас', 'Where you are logged in right now')}</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
          <div class="list-item" data-action="log">
            <div class="list-item-icon" style="background:#94A3B8;">📋</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('История входов', 'Login history')}</div>
              <div class="list-item-subtitle">${t('Аудит за последние 30 дней', 'Audit for last 30 days')}</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
        </div>

        <div class="note" style="margin-top:24px;">
          ${t('🚧 Полное управление безопасностью — в Phase 3.', '🚧 Full security management — in Phase 3.')}
        </div>
      </div>`;
  },
  wire() {
    document.querySelectorAll('.list-item[data-action]').forEach(el => {
      el.addEventListener('click', () => {
        haptic?.notificationOccurred('warning');
        tg?.showAlert(t('Будет доступно в Phase 3.', 'Coming in Phase 3.'));
      });
    });
  }
};

const About = {
  html() {
    return `
      <div class="screen">
        <header>
          <h1>${t('О Libermall ID', 'About Libermall ID')}</h1>
          <p class="lead">${t('Единая идентификация для всей экосистемы', 'Unified identity for the whole ecosystem')}</p>
        </header>

        <div class="note">
          <strong>Libermall ID</strong> ${t('— это сервис единой авторизации (Single Sign-On). Создаёте аккаунт один раз — пользуетесь во всех продуктах экосистемы Libermall без повторных регистраций.', '— is a single sign-on service. Create one account and use it across all Libermall ecosystem products with no extra registrations.')}
        </div>

        <div class="section-title">${t('Как это работает', 'How it works')}</div>
        <div class="list">
          <div class="list-item">
            <div class="list-item-icon" style="background:#2A7BFF;">1</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('Telegram-вход', 'Telegram login')}</div>
              <div class="list-item-subtitle">${t('Войдите одним тапом через Telegram', 'One-tap login via Telegram')}</div>
            </div>
          </div>
          <div class="list-item">
            <div class="list-item-icon" style="background:#0098EA;">2</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('Привязка TON-кошелька', 'Link TON wallet')}</div>
              <div class="list-item-subtitle">${t('Соедините крипто-идентичность', 'Connect crypto identity')}</div>
            </div>
          </div>
          <div class="list-item">
            <div class="list-item-icon" style="background:#2ECC71;">3</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('Доступ во все сервисы', 'Access to all services')}</div>
              <div class="list-item-subtitle">${t('OAuth/OIDC автоматически', 'OAuth/OIDC automatically')}</div>
            </div>
          </div>
        </div>

        <div class="section-title">${t('Ссылки', 'Links')}</div>
        <div class="list">
          <div class="list-item" data-url="https://id.libermall.com/">
            <div class="list-item-icon" style="background:#2A7BFF;">🌐</div>
            <div class="list-item-body">
              <div class="list-item-title">id.libermall.com</div>
              <div class="list-item-subtitle">${t('Сайт Libermall ID','Libermall ID website')}</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
          <div class="list-item" data-url="https://id.libermall.com/developers.html">
            <div class="list-item-icon" style="background:#17212B;">{ }</div>
            <div class="list-item-body">
              <div class="list-item-title">${t('Документация для разработчиков','Developer docs')}</div>
              <div class="list-item-subtitle">OpenID Connect, OAuth 2.0</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
          <div class="list-item" data-url="https://github.com/DeFiTON/libermall-id">
            <div class="list-item-icon" style="background:#000;">★</div>
            <div class="list-item-body">
              <div class="list-item-title">GitHub</div>
              <div class="list-item-subtitle">DeFiTON/libermall-id</div>
            </div>
            <div class="list-item-arrow">›</div>
          </div>
        </div>

        <div class="screen-foot">Libermall ID v0.2 · Phase 2</div>
      </div>`;
  },
  wire() {
    document.querySelectorAll('.list-item[data-url]').forEach(el => {
      el.addEventListener('click', () => {
        haptic?.selectionChanged();
        tg?.openLink(el.dataset.url);
      });
    });
  }
};

// ── helpers ──
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ── init ──
function init() {
  if (tg) {
    tg.ready();
    tg.expand();
    tg.BackButton.onClick(pop);
    tg.setHeaderColor('secondary_bg_color');
  }
  push(Home);
}

document.addEventListener('DOMContentLoaded', init);
