# 🔍 Swagger/OpenAPI Documentation

Полная Swagger/OpenAPI 3.0 документация для ZaZa API с интерактивным интерфейсом.

## 📖 Что такое Swagger?

Swagger (OpenAPI) - это стандартная спецификация для описания RESTful API:
- ✅ Автоматическая красивая интерактивная документация
- ✅ Тестирование endpoints прямо в браузере
- ✅ Генерирование SDK для разных языков
- ✅ Single source of truth для всей команды

---

## 🚀 Как использовать Swagger?

### Способ 1: Онлайн Swagger UI (РЕКОМЕНДУЮ!) 🌐

1. Перейди на **https://editor.swagger.io**
2. В меню нажми **File → Import URL**
3. Вставь URL своего `swagger.json` файла или загрузи локально
4. **TA-ДА!** Вся документация готова! ✨

### Способ 2: VS Code Preview

1. Установи расширение **OpenAPI (Swagger) Editor**
2. Открой файл `swagger.json`
3. Нажми иконку **Preview** (вверху справа)
4. Увидишь красивую интерактивную документацию

### Способ 3: Локально с Docker

```bash
# Если установлен Docker
docker run -p 8080:8080 \
  -e SWAGGER_JSON=/foo/swagger.json \
  -v $(pwd):/foo \
  swaggerapi/swagger-ui

# Откройте: http://localhost:8080
```

### Способ 4: В Laravel Backend

Добавь пакет для Swagger в Laravel:

```bash
composer require darkaonline/l5-swagger
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
php artisan l5-swagger:generate
```

Потом документация доступна на: **http://localhost:8000/api/documentation**

### Способ 5: В Node.js/Express

```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

Откроется на: **http://localhost:3000/api-docs**

---

## 📊 Структура Swagger файла

### Info Section
```json
{
  "title": "ZaZa Service API",
  "version": "1.0.0",
  "description": "Complete API documentation"
}
```

### Servers (Окружения)
```json
"servers": [
  { "url": "http://localhost:8000/api/v1", "description": "Development" },
  { "url": "https://api.zaza.tj/api/v1", "description": "Production" }
]
```

### Security Schemes (Аутентификация)
```json
"securitySchemes": {
  "BearerAuth": { "type": "http", "scheme": "bearer" },
  "QueryToken": { "type": "apiKey", "name": "token", "in": "query" }
}
```

### Components (Модели данных)
```json
"schemas": {
  "User": { /* структура User */ },
  "Order": { /* структура Order */ },
  "Product": { /* структура Product */ }
}
```

### Paths (Все endpoints)
Каждый endpoint описывает:
- 📍 Метод (GET, POST, PUT, DELETE)
- 🔒 Требуемую аутентификацию
- 📥 Input параметры
- 📤 Response примеры
- 📊 Status коды

---

## 🎯 Все 150+ Endpoints в Swagger

### 🔐 Authentication (9+ endpoints)
- `POST /auth/sign-up` (v1 OTP request)
- `POST /auth/login` (v1 OTP request)
- `POST /auth/verify-phone` (v1 OTP verify + token)
- `POST /register` (v3 OTP request)
- `POST /login` (v3 OTP request)
- `POST /verify-phone` (v3 OTP verify + token)
- `POST /auth/customer/send-otp` (legacy)
- `POST /auth/customer/verify-otp` (legacy)
- `POST /auth/delivery-man/send-otp`
- `POST /auth/delivery-man/verify-otp`
- `POST /auth/vendor/login`

### 👤 Customer APIs (10+ endpoints)
- `GET /customer/profile`
- `POST /customer/profile/update`
- `GET /customer/orders`
- `POST /customer/order/place`
- `GET /customer/addresses`
- `POST /customer/address/add`
- `GET /customer/wallet`
- `POST /customer/wallet/add`
- `GET /customer/wishlist`
- `POST /customer/wishlist/add`

### 🛵 Driver APIs (9+ endpoints)
- `GET /delivery-man/profile`
- `POST /delivery-man/update-location`
- `GET /delivery-man/available-orders`
- `POST /delivery-man/order/accept`
- `GET /delivery-man/active-orders`
- `POST /delivery-man/order/update-status`
- `POST /delivery-man/order/complete`
- `GET /delivery-man/earnings`
- `POST /delivery-man/earnings/withdraw`

### 🏪 Vendor APIs (9+ endpoints)
- `GET /vendor/profile`
- `GET /vendor/products`
- `POST /vendor/product/add`
- `GET /vendor/orders`
- `POST /vendor/order/confirm`
- `GET /vendor/earnings`
- `POST /vendor/earnings/payout`
- `GET /vendor/delivery-men`

### 📦 Public APIs (9 endpoints - без аутентификации!)
- `GET /restaurants`
- `GET /restaurant/{id}`
- `GET /products`
- `GET /product/{id}`
- `GET /categories`
- `GET /banners`
- `GET /coupons`
- `POST /coupon/validate`

### ⚙️ Configuration (4 endpoints)
- `GET /zones`
- `POST /delivery/calculate-charge`
- `GET /geocode/reverse`
- `GET /config`

### 📝 Partner APIs (2 endpoints)
- `POST /partner/restaurant/apply`
- `POST /partner/b2b/apply`

---

## 💡 Что видишь в Swagger UI

### Левая панель
- 📋 Список всех категорий (Auth, Customer, Driver и т.д.)
- 🔐 Иконки безопасности
- 📌 Быстрая навигация

### Центральное содержимое
- 📖 Полное описание каждого endpoint
- 📥 Request body с примерами
- 📤 Response примеры
- 📊 Все возможные коды ответов (200, 400, 401 и т.д.)

### Try it out кнопка ⚡
- 🧪 Интерактивное тестирование
- ✍️ Можешь вводить свои параметры  
- 🚀 Отправлять реальные запросы к API
- 📊 Видеть реальные ответы

---

## 🔐 Аутентификация в Swagger

### Bearer Token (Customers & Vendors)
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Нужно:
1. Войти через `/auth/verify-phone` (v1) или `/verify-phone` (v3)
2. Скопировать `token` из ответа
3. Нажать кнопку **"Authorize"** в Swagger UI
4. Вставить token в формате: `Bearer <token>`

### Query Token (Drivers)
```
GET /delivery-man/profile?token=YOUR_TOKEN_HERE
```

Автоматически добавляется в URL в Swagger UI

### Public (Нет аутентификации)
Любой может использовать без токена:
- `/restaurants`
- `/categories`
- `/products`
- и т.д.

---

## 🛠️ Генерирование SDK

Из `swagger.json` можно автоматически генерировать SDK для разных языков:

### JavaScript/TypeScript
```bash
npm install @openapitools/openapi-generator-cli -g

openapi-generator-cli generate \
  -i swagger.json \
  -g typescript \
  -o ./generated-sdk
```

### Python
```bash
pip install openapi-generator

openapi-generator generate \
  -i swagger.json \
  -g python \
  -o ./generated-sdk
```

### Go
```bash
openapi-generator generate \
  -i swagger.json \
  -g go \
  -o ./generated-sdk
```

---

## 🎓 Пример одного endpoint в Swagger

```json
{
  "/customer/order/place": {
    "post": {
      "tags": ["👤 Customer APIs"],
      "summary": "Place new order",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "restaurant_id": { "type": "integer" },
                "delivery_address_id": { "type": "integer" },
                "items": { "type": "array" },
                "payment_method": { "type": "string" }
              }
            }
          }
        }
      },
      "responses": {
        "201": { "description": "Order placed successfully" }
      }
    }
  }
}
```

Это описывает:
- 📍 Путь: `/customer/order/place`
- 🔒 Метод: POST с Bearer Token аутентификацией
- 📥 Какие параметры нужно отправить
- 📤 Какой ответ вернется (201 статус)

---

## 📋 Быстрые ссылки

| Задача | Инструмент |
|--------|-----------|
| 📖 Читать документацию | `/API.md` |
| 🧪 Тестировать API | Postman Collection |
| 🔍 Интерактивное изучение | Swagger UI (editor.swagger.io) |
| 🛠️ Интегрировать в backend | `/swagger.json` |
| 💻 Генерировать SDK | openapi-generator-cli |

---

## ✨ Преимущества использования Swagger

### Для разработчиков
✅ Полная документация всех endpoints в одном месте  
✅ Примеры запросов и ответов  
✅ Тестирование напрямую из документации  
✅ Валидация данных с JSON Schema  

### Для API потребителей
✅ Быстрое понимание структуры API  
✅ Интерактивное изучение endpoints  
✅ Иллюстрированные примеры  
✅ Понимание требуемых параметров  

### Для команды
✅ Single source of truth для документации  
✅ Синхронизация документации с кодом  
✅ Версионирование API  
✅ Стандартный формат OpenAPI  

---

## 📚 Дополнительные ресурсы

- **OpenAPI Specification**: https://spec.openapis.org/oas/v3.0.0
- **Swagger Editor**: https://editor.swagger.io
- **Swagger UI**: https://github.com/swagger-api/swagger-ui
- **OpenAPI Generator**: https://openapi-generator.tech

---

**Готово! Теперь у тебя есть профессиональная API документация! 🎉**

*Документация актуальна на 26 Марта 2026 года*
