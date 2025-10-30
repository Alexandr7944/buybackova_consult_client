# Buybackova Consult Client

Клиентское приложение SPA на React + Vite + TypeScript с маршрутизацией через React Router v6.4+, Material UI для UI-компонентов и Reduxjs Toolkit для управления аутентификацией.

## Содержание

- Особенности
- Технологический стек
- Структура проекта
- Требования
- Установка и запуск
- Скрипты
- Переменные окружения
- Роутинг, защита маршрутов и роли
- Работа с данными
- Сборка и деплой
- Настройки сервера (history fallback)
- Тестирование (ручное)
- Траблшутинг

## Особенности

- Современный стек: Vite, React, TypeScript, Material UI.
- Клиентский роутинг с data APIs (loaders/actions) и ErrorBoundary/NotFound страницами.
- Защита маршрутов (guard) с проверкой авторизации и ролей пользователя, поддержка админских страниц.
- Ленивая подгрузка страниц (route-level code splitting).
- Удобные страницы ошибок и "404", адаптированные под светлую тему.

## Технологический стек

- React 19
- TypeScript
- Vite
- React Router v7.9+
- Material UI (@mui/material, @mui/icons-material)
- Reduxjs Toolkit для auth (src/store/useAuthStore.ts)
- date-fns

## Установка и запуск

1) Установить зависимости:

- npm install

2) Запустить dev-сервер:

- npm run dev

3) Открыть в браузере адрес, показанный Vite (по умолчанию http://localhost:5173).

## Скрипты

- dev — запуск dev-сервера Vite
- build — сборка в production (папка dist)
- preview — предпросмотр собранного проекта локально

## Переменные окружения

- VITE_DEV_SERVER_PATH
- VITE_SERVER_PATH
- VITE_PRODUCT_PATH

## Роутинг, защита маршрутов и роли

Маршруты описаны в src/router/RoutesList.tsx и создаются через createBrowserRouter. Используется loader withAuth для проверки авторизации и ролей.

Паттерн использования:
- Для защищённых страниц: loader: withAuth({ requireAuth: true, roles: ['user', 'admin'] })
- Для админских страниц: loader: withAuth({ requireAuth: true, roles: ['admin'] })

Логика:

- Если пользователь не авторизован и requireAuth=true — выполняется redirect на страницу логина (/auth/login).
- Если роль не подходит — возвращается 403 (или redirect на главную, по вашему выбору), что обрабатывается ErrorBoundary.

Синхронизация user в сторе:

- В loader нельзя работать со стором. Возвращайте сериализуемые данные пользователя из withAuth.
- В RootLayout читайте user из useRouteLoaderData("auth") и синхронизируйте стор в useEffect: setUser(user) или clearUser при отсутствии.

## Работа с данными

- API-утилиты: src/shared/api.ts
- Типы домена: src/pages/*/shared/types.ts
- Пример отправки данных: через useFetcher из React Router (см. AuditItem.tsx — PATCH по FormData)

## Сборка и деплой

Создать production-сборку:

- npm run build

Деплойте содержимое папки dist.

Если приложение размещается не в корне домена, задайте правильный base/basename:

- В vite.config.ts — base в зависимости от режима (mode):
    - base: isProd ? '/subpath/' : '/'
- В RoutesList.tsx — basename для createBrowserRouter:
    - const basename = import.meta.env.MODE === 'production' ? import.meta.env.VITE_PRODUCT_PATH : undefined

## Настройки сервера (history fallback)

Для корректной работы SPA при обновлении страницы на вложенном маршруте настройте history API fallback:

- Nginx:
  location / { try_files $uri $uri/ /index.html; }
  location /assets/ { alias /path/to/dist/assets/; add_header Cache-Control "public, max-age=31536000, immutable"; }

Важно: не переписывайте запросы к реальным статическим ассетам (dist/assets/*), иначе получите MIME-ошибки при загрузке модульных скриптов.

## Тестирование (ручное)

- Проверяйте переходы по защищённым маршрутам будучи авторизованным/неавторизованным.
- Проверяйте редиректы и 403 для ролей без доступа.
- Открывайте глубокие ссылки (например /audit/123) напрямую — страница должна загружаться.
- Страницы ошибок: ErrorBoundary должен показывать детали по toggle, NotFound — дружественный 404.

Поддержка

- Вопросы и баги создавайте в issue-трекере репозитория или сообщайте ответственному разработчику.
