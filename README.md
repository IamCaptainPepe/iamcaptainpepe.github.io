# CaptainPepe — portfolio-сайт

Личный портфолио-сайт Evgeny Purkov / CaptainPepe в стиле **award / dark compute** (Awwwards-эстетика: aurora, glass-cards, kinetic typography, 3D tilt).

## Что внутри

- **Vanilla** HTML / CSS / JS — без npm, build, фреймворков.
- **Билингвальный**: переключатель **EN / RU** в шапке, выбор сохраняется в `localStorage`, `<html lang>` обновляется.
- **Секции**: hero (аватар пирата-Pepe, CTA, status-пилюли), Stack (железо + инструменты), Featured Cysic (OG + CyRunner Ambassador), Projects (Portal to Bitcoin, Dill, Inference), Team Begunki Uzlov, Meme Lab, Contact, footer (2026).
- **Дизайн**: deep navy-black фон с медленной cyan/violet aurora, glass-карточки с hairline-бордерами, grain/vignette-оверлеи, custom cursor glow (только desktop, `pointer:fine`), magnetic-кнопки, 3D tilt карточек, scroll-reveal через `IntersectionObserver`, kinetic split-name в hero, поддержка `prefers-reduced-motion`.
- **Шрифты**: Syne (display) + Outfit (body) с Google Fonts.
- **Иконки**: Simple Icons CDN (точные URL из брифа) + Lucide (`unpkg.com/lucide@latest`).
- **SEO**: title/description/OG-теги, favicon из аватара, `assets/og-cover.png`.
- **A11y**: semantic HTML, фокус-кольца, `aria-*` на переключателях и меню, skip-link, `noscript`-фолбэк.

## Файлы

```
portfolio-redesign/
├── index.html   # весь контент (EN/RU через data-en/data-ru)
├── styles.css   # дизайн-система, CSS-переменные, reduced-motion
├── app.js       # i18n, lucide, cursor glow, magnetic, tilt, reveal, mobile nav
├── README.md
└── assets/
    ├── avatar.png     # пират-Pepe (сжат, 720px) — hero
    ├── favicon.png    # 64px
    └── og-cover.png   # OG-обложка 1200×630
```

## Деплой на GitHub Pages

Вариант А — в существующий репозиторий live-сайта (полная замена):

1. `git clone git@github.com:iamcaptainpepe/portfolio-site.git`
2. Скопируй содержимое этого каталога в корень репозитория (или в `docs/`, если Pages настроен на `main /docs`):
   ```bash
   cp index.html styles.css app.js README.md assets/ <repo>/
   ```
3. Коммить и пуш:
   ```bash
   git add -A && git commit -m "redesign: award-style dark compute portfolio" && git push
   ```
4. Pages должен уже быть включён (repo settings → Pages → `main` / root) — сайт обновится сам.

Вариант Б — новый репозиторий:

1. Создай репо (например, `portfolio-redesign`).
2. `git init`, скопируй файлы, `git add -A`, `git commit -m "portfolio"`.
3. `git remote add origin git@github.com:<user>/<repo>.git && git push -u origin main`.
4. Settings → Pages → Source: **Deploy from a branch** → ветка `main`, папка `/` (root).

## Локальный предпросмотр

```bash
cd portfolio-redesign
python3 -m http.server 19388
# → http://127.0.0.1:19388/
```

> Примечание: все URL-иконки Simple Icons и Lucide CDN подхватываются в рантайме; сайт готов к продакшну без сборки.
