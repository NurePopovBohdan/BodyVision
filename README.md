# Вебсервіс для візуалізації бажаної фізичної форми

MERN MVP для бакалаврського дипломного проєкту: користувач реєструється, додає поточні параметри тіла, задає цільову фізичну форму, а система рахує різницю, прогрес, BMI/BMR/калорії та базові рекомендації.

## Технічний план

1. Backend REST API
- Express.js сервер з MongoDB через Mongoose.
- JWT авторизація, bcrypt-хешування паролів.
- Моделі: `User`, `BodyMeasurement`, `FitnessGoal`.
- Контролери для авторизації, профілю, замірів, цілей, рекомендацій і dashboard-даних.
- Окремий модуль `utils/calculations.js` для BMI, BMR, калорій, різниць і прогресу.
- Централізована обробка помилок, валідація форм через `express-validator`.
- Swagger UI для демонстрації REST API.
- Seed script з демо-користувачем і тестовою історією прогресу.

2. Frontend React
- React Router: login, register, dashboard, profile, measurements, goals, recommendations.
- Axios API-клієнт з JWT.
- Context API для авторизації.
- Recharts для графіків ваги, відсотка жиру та талії.
- SVG-компонент для умовної візуалізації поточної і бажаної форми.
- Loading/error states і базова валідація форм.

3. Демонстрація на захисті
- Запуск локально без платних API.
- Демо-акаунт через seed script.
- Dashboard показує найважливіші метрики, графіки, прогрес і рекомендації.
- Swagger використовується як технічна документація API.

## Структура backend

```text
backend/
  server.js
  app.js
  config/db.js
  models/User.js
  models/BodyMeasurement.js
  models/FitnessGoal.js
  controllers/*.js
  routes/*.js
  middleware/*.js
  utils/calculations.js
  seed/seed.js
```

## Структура frontend

```text
frontend/
  src/api/axios.js
  src/context/AuthContext.jsx
  src/pages/Login.jsx
  src/pages/Register.jsx
  src/pages/Dashboard.jsx
  src/pages/Profile.jsx
  src/pages/Measurements.jsx
  src/pages/Goals.jsx
  src/pages/Recommendations.jsx
  src/components/*.jsx
  src/styles.css
```

## Встановлення

Перед запуском переконайся, що локальна MongoDB працює на `mongodb://127.0.0.1:27017`, або вкажи власний рядок підключення в `.env`.

```bash
cd backend
npm install
copy ..\.env.example .env
npm run seed
npm run dev
```

Для Windows PowerShell можна використати:

```powershell
cd backend
npm install
Copy-Item ..\.env.example .env
npm run seed
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend буде доступний на `http://127.0.0.1:5173`.

API буде доступне на `http://localhost:5000`.
Swagger документація: `http://localhost:5000/api/docs`.

## Демо-акаунт

Після `npm run seed`:

- Email: `demo@bodyvision.local`
- Password: `Demo12345`

## REST API endpoints

### Auth

- `POST /api/auth/register` — реєстрація.
- `POST /api/auth/login` — вхід і отримання JWT.
- `GET /api/auth/me` — поточний користувач.

### User profile

- `GET /api/users/profile` — профіль користувача.
- `PUT /api/users/profile` — оновлення профілю.

### Measurements

- `GET /api/measurements` — список замірів.
- `POST /api/measurements` — створити замір.
- `GET /api/measurements/:id` — один замір.
- `PUT /api/measurements/:id` — оновити замір.
- `DELETE /api/measurements/:id` — видалити замір.

### Goals

- `GET /api/goals` — список цілей.
- `GET /api/goals/active` — активна ціль.
- `POST /api/goals` — створити ціль і зробити її активною.
- `PUT /api/goals/:id` — оновити ціль.
- `DELETE /api/goals/:id` — видалити ціль.

### Recommendations

- `GET /api/recommendations` — BMI, BMR, калорії, темп цілі та попередження.

### Dashboard

- `GET /api/dashboard` — агреговані дані для frontend: поточний замір, активна ціль, різниці, прогрес і серії для графіків.

## Приклад заголовка авторизації

```http
Authorization: Bearer <jwt_token>
```
