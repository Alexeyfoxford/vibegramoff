# VibeGram – Подключение настоящей облачной БД

По умолчанию VibeGram использует **настоящий SQLite через sql.js (WASM)**, сохранённый в IndexedDB. Это не localStorage – это полноценный SQL с FK, индексами, транзакциями.

Но это локально, для одного браузера. Для общения с другими пользователями:

## Вариант 1 – Turso (рекомендуется, 2 минуты)

Turso = SQLite в облаке (libSQL).

1. Зарегистрируйтесь: https://turso.tech
2. `turso db create vibegram`
3. `turso db tokens create vibegram`
4. Выполните схему: `turso db shell vibegram < public/vibegram-schema.sql`
5. В VibeGram: Настройки → Cloud Sync → вставьте:
   - TURSO_URL = libsql://vibegram-xxx.turso.io
   - TURSO_TOKEN = eyJ...
6. Перезапустите. Готово – реальный мультиплеер.

Код cloud-адаптера уже в src/App.tsx (VibeCloud, закомментирован – раскомментируйте при использовании).

## Вариант 2 – Cloudflare D1

1. `wrangler d1 create vibegram`
2. `wrangler d1 execute vibegram --file=./public/vibegram-schema.sql`
3. Задеплойте `public/worker-d1.js` как Worker.
4. Укажите URL воркера в настройках.

## Что уже есть локально

- Таблицы: users, chats, messages, bans, reports, contacts, bots, avatar_proposals
- FK, индексы, транзакции
- BanManager, авто-модерация
- E2EE
- Reactions (Twemoji SVG)
- Файлы до 25 МБ с предпросмотром
- Голосовые, видеозвонки WebRTC
- 4 минималистичные темы, видео-обои
- Избранное, Реклама
- Контакты с кастомными именами, предложение аватара
- Группы/каналы публичные/приватные, роли, права
- Бот-конструктор
- Админ-панель: доступ только через isAdmin в защищённых Firestore Rules (см. SECURITY.md)

Всё работает оффлайн, данные кэшируются.
