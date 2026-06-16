# Mercur Marketplace

Це навчальний маркетплейс, у якому є три окремі частини:

- покупець переглядає каталог і додає товари до кошика;
- продавець керує своїми товарами та замовленнями;
- адміністратор контролює весь майданчик.

Проєкт побудований на **Mercur** і **Medusa**. Для клієнтської частини використано React та Vite, а дані зберігаються у PostgreSQL.

У поточній демо-базі є **12 продавців і 112 товарів**. Це не порожній шаблон: після запуску можна відразу перейти до каталогу, відкрити кабінети продавців і переглянути адміністративну панель.

## Що вже працює

- каталог із пошуком і категоріями;
- сторінки товарів із цінами та варіантами;
- відображення магазину-продавця;
- кошик зі зміною кількості товарів;
- адаптивний інтерфейс для телефона й комп'ютера;
- кабінет продавця;
- адміністративна панель;
- товари, категорії, залишки та зв'язки з продавцями;
- скрипти для повторного наповнення демо-даними.

Оформлення замовлення в storefront поки демонстраційне. Каталог і кошик працюють, але платіжний провайдер ще не підключений.

## Швидкий старт

Якщо база та Docker-контейнери вже були створені на цьому комп'ютері, достатньо виконати:

```powershell
docker start mercur-postgres mercur-redis
bun install
bun run dev -- --ui=stream
```

Після запуску відкрийте:

| Що відкрити | Адреса |
| --- | --- |
| Магазин для покупців | http://localhost:8000 |
| Адміністративна панель | http://localhost:7000/dashboard |
| Кабінет продавця | http://localhost:7001/seller |
| Backend API | http://localhost:9000 |

Перевірити роботу API можна за адресою http://localhost:9000/health.

## Демо-вхід

### Адміністратори

Пароль для всіх адміністраторів: `admin123`

```text
admin@local.com
admin2@local.com
admin3@local.com
```

### Продавці

Пароль для всіх продавців: `seller123`

```text
ceramics@local.com
linen@local.com
wood@local.com
studio@local.com
coffee@local.com
honey@local.com
tech@local.com
green@local.com
craft@local.com
kids@local.com
sport@local.com
beauty@local.com
```

Ці паролі потрібні лише для локальної демонстрації. Не використовуйте їх у публічному середовищі.

## Як усе влаштовано

```text
apps/
  storefront/     магазин для покупців
  admin/          панель адміністратора
  vendor/         кабінет продавця

packages/
  api/            Medusa/Mercur API та seed-скрипти
```

Застосунки запускаються разом через Turborepo:

- storefront працює на порту `8000`;
- admin працює на порту `7000`;
- vendor працює на порту `7001`;
- API працює на порту `9000`.

## Технології

- React 18 і Vite 5;
- TypeScript;
- Medusa 2;
- Mercur 2;
- PostgreSQL;
- Redis;
- Bun;
- Turborepo.

## Запуск на чистому комп'ютері

### 1. Встановіть необхідне

Потрібні:

- Node.js 20 або новіший;
- Bun 1.3 або новіший;
- Docker Desktop.

Також переконайтеся, що порти `5433`, `6379`, `7000`, `7001`, `8000` і `9000` вільні.

### 2. Запустіть PostgreSQL і Redis

```powershell
docker run -d --name mercur-postgres -e POSTGRES_USER=mercur -e POSTGRES_PASSWORD=mercur -e POSTGRES_DB=mercur -p 5433:5432 postgres:16-alpine
docker run -d --name mercur-redis -p 6379:6379 redis:7-alpine
```

Надалі замість створення контейнерів використовуйте:

```powershell
docker start mercur-postgres mercur-redis
```

### 3. Налаштуйте API

Створіть локальний env-файл із шаблону:

```powershell
Copy-Item packages/api/.env.template packages/api/.env
```

Для локального запуску він має виглядати приблизно так:

```env
STORE_CORS=http://localhost:8000,http://localhost:7000,http://localhost:7001
ADMIN_CORS=http://localhost:7000,http://localhost:9000
VENDOR_CORS=http://localhost:7001
AUTH_CORS=http://localhost:7000,http://localhost:7001,http://localhost:9000
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgres://mercur:mercur@localhost:5433/mercur
JWT_SECRET=replace-with-a-long-random-value
COOKIE_SECRET=replace-with-a-long-random-value
```

### 4. Встановіть залежності та підготуйте базу

```powershell
bun install
cd packages/api
bun x medusa db:migrate
bun run seed
bun x medusa user -e admin@local.com -p admin123
cd ../..
```

Команда `seed` створює базові налаштування магазину: регіон, валюту, канал продажів, доставку, publishable API key та стартові товари.

### 5. Налаштуйте storefront

Створіть файл `apps/storefront/.env`:

```env
VITE_MEDUSA_BACKEND_URL=http://localhost:9000
VITE_MEDUSA_PUBLISHABLE_KEY=your_publishable_api_key
```

Publishable API key можна знайти в адміністративній панелі після запуску backend.

### 6. Запустіть проєкт

Поверніться до кореневої папки й виконайте:

```powershell
bun run dev -- --ui=stream
```

## Демо-дані

Для відновлення повного демо-стану тепер є одна команда:

Запускати їх потрібно з папки `packages/api`.

```powershell
cd packages/api
bun run seed
```

Вона створює все необхідне для демонстрації:

- базові налаштування Medusa: регіон, валюту, доставку, sales channel і publishable API key;
- 3 admin-акаунти;
- 12 seller-акаунтів;
- 112 товарів;
- категорії, варіанти, ціни, зображення та складські залишки;
- зв'язки товарів із конкретними продавцями.

Seed ідемпотентний: він перевіряє наявні акаунти й товари, тому повторний запуск не має створювати дублікати.

## Корисні команди

Запустити весь проєкт:

```powershell
bun run dev
```

Перевірити production-збірку:

```powershell
bun run build
```

Зібрати лише storefront:

```powershell
cd apps/storefront
bun run build
```

Зібрати лише backend:

```powershell
cd packages/api
bun run build
```

Форматування та lint:

```powershell
bun run format
bun run lint
```

## Як storefront отримує товари

Спочатку storefront запитує активний регіон:

```http
GET /store/regions
```

Потім завантажує товари:

```http
GET /store/products?region_id={region_id}
```

Кожен Store API запит містить publishable key:

```http
x-publishable-api-key: your_publishable_api_key
```

Разом із товарами storefront отримує розраховані ціни, варіанти, залишки, категорії та інформацію про продавця.

## Перед публікацією

Поточна конфігурація розрахована на локальну демонстрацію. Перед розгортанням потрібно:

1. Замінити `JWT_SECRET` і `COOKIE_SECRET`.
2. Змінити або видалити всі демо-акаунти.
3. Налаштувати production PostgreSQL і Redis.
4. Замінити localhost у CORS-конфігурації.
5. Підключити оплату, email і файлове сховище.
6. Не додавати `.env` файли в Git.

## Примітка про зображення

Демо-каталог використовує зовнішні зображення. Вони потрібні для презентації інтерфейсу й не зберігаються всередині репозиторію.
