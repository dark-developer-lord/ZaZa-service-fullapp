# 📚 Postman Setup Guide для ZaZa API

Полное руководство по импорту и использованию Postman Collection для тестирования всех 150+ API endpoints.

---

## 📥 Часть 1: Импорт Postman Collection

### Метод 1: Импорт через файл

1. **Откройте Postman**
   - Запустите приложение Postman на компьютер или используйте веб-версию на https://postman.com

2. **Перейдите в Import**
   - Нажмите кнопку **"Import"** в верхнем левом углу
   - Или используйте сочетание клавиш: `Ctrl+O` (Windows) / `Cmd+O` (Mac)

3. **Выберите файл**
   - Нажмите вкладку **"File"**
   - Нажмите **"Upload Files"**
   - Выберите файл `ZaZa-API.postman_collection.json`
   - Нажмите **"Import"**

4. **Коллекция успешно импортирована!**
   - В левой панели появится папка "ZaZa Service - Complete API Collection"
   - Развернитесь на 7 основных категорий (Auth, Customer, Driver, Vendor, Public, Config, Partner)

### Метод 2: Копирование JSON напрямую

1. Откройте **New > API Request**
2. Нажмите на иконку меню в левой панели
3. Выберите **"Import"**
4. Перейдите на вкладку **"Raw text"**
5. Вставьте содержимое файла `ZaZa-API.postman_collection.json`
6. Нажмите **"Continue"** → **"Import"**

---

## 🔧 Часть 2: Импорт Environment файла

### Добавление окружения

1. **Откройте управление окружениями**
   - Нажмите на иконку **"Environments"** в левой панели
   - Или нажмите иконку глаза в верхнем правом углу → **"Manage Environments"**

2. **Импортируйте файл окружения**
   - Нажмите **"Import"**
   - Выберите файл `ZaZa-API.postman_environment.json`

3. **Установите активное окружение**
   - В верхнем правом углу найдите dropdown с окружениями
   - Выберите **"ZaZa API Environments"** (или ваше название)

### Проверка переменных окружения

Должны быть доступны следующие переменные:

```
✓ base_url         → http://localhost:8000/api/v1
✓ base_url_v3      → http://localhost:8000/api/v3
✓ customer_token   → (пусто, заполнится после входа)
✓ driver_token     → (пусто, заполнится после входа)
✓ vendor_token     → (пусто, заполнится после входа)
✓ order_id         → 123 (пример для тестирования)
✓ restaurant_id    → 1 (пример для тестирования)
✓ product_id       → 5 (пример для тестирования)
```

---

## 🔐 Часть 3: Аутентификация и получение токенов

### Для Customers (Клиентов)

1. **Запросите OTP (v1 или v3)**
   - Вариант v1: `🔐 Authentication > V1 Sign-Up (Send OTP)` или `V1 Login (Send OTP)`
   - Вариант v3: `🔐 Authentication > V3 Register (Send OTP)` или `V3 Login (Send OTP)`
   - Передайте только `phone`
   - Нажмите **"Send"**
   - Если включен debug mode, OTP автоматически сохранится в `customer_otp`

2. **Подтвердите OTP и войдите**
   - Вариант v1: `🔐 Authentication > V1 Verify Phone (Complete Login)`
   - Вариант v3: `🔐 Authentication > V3 Verify Phone (Complete Login)`
   - Передайте `phone` и `otp`
   - Нажмите **"Send"**
   - `customer_token` автоматически сохранится в environment

3. **Проверьте токен**
   - В верхнем правом углу нажмите на иконку глаза
   - Найдите переменную `customer_token` - она должна быть заполнена

### Для Drivers (Водителей)

1. **Отправьте OTP запрос**
   - Откройте: `🔐 Authentication > Driver - Send OTP`
   - Укажите номер телефона
   - Нажмите **"Send"**

2. **Верифицируйте OTP**
   - Откройте: `🔐 Authentication > Driver - Verify OTP & Login`
   - Укажите номер телефона и код
   - Нажмите **"Send"**
   - Автоматически сохранится `driver_token`

### Для Vendors (Ресторанов)

1. **Откройте endpoint для входа**
   - Откройте: `🔐 Authentication > Vendor - Login`
   - Body должен содержать:
     ```json
     {
       "email": "vendor@restaurant.com",
       "password": "VendorPassword123!"
     }
     ```

2. **Нажмите Send**
   - Токен автоматически сохранится в `vendor_token`

---

## 📤 Часть 4: Первый запрос

### Тестирование Customer API

После успешной аутентификации:

1. **Получите профиль клиента**
   - Откройте: `👤 Customer APIs > Get Profile`
   - Нажмите **"Send"**
   - Вы должны получить данные текущего пользователя

2. **Получите список заказов**
   - Откройте: `👤 Customer APIs > Get Orders`
   - Нажмите **"Send"**
   - Вы получите пагинированный список заказов клиента

### Тестирование Public API

Эти endpoints **не требуют аутентификации**:

1. **Поиск ресторанов**
   - Откройте: `📦 Public Catalog APIs > Search Restaurants`
   - Нажмите **"Send"**
   - Вы получите список доступных ресторанов

2. **Получение категорий**
   - Откройте: `📦 Public Catalog APIs > Get Categories`
   - Нажмите **"Send"**
   - Вы получите все категории продуктов

---

## 🔄 Часть 5: Работа с переменными окружения

### Автоматическое сохранение токенов

Все endpoints с аутентификацией автоматически:
- ✅ Сохраняют токены в переменные окружения
- ✅ Используют эти токены в последующих запросах
- ✅ Передают токены в заголовках (Bearer) или параметрах (Query)

### Ручное обновление переменных

Если нужно обновить вручную:

1. Нажмите иконку глаза 👁️ (вверху справа)
2. Нажмите на название окружения → **"Edit"**
3. Обновите нужные переменные
4. Нажмите **"Save"**

### Использование переменных в запросах

```
Синтаксис: {{имя_переменной}}

Примеры:
- URL: {{base_url}}/customer/profile
- Header: Authorization: Bearer {{customer_token}}
- Query: ?token={{driver_token}}
- Body: { "order_id": {{order_id}} }
```

---

## 🧪 Часть 6: Тестирование все endpoint групп

### 1️⃣ Аутентификация (5 endpoints)
- ✅ Customer OTP Send/Verify
- ✅ Driver OTP Send/Verify
- ✅ Vendor Login

### 2️⃣ Customer APIs (35+ endpoints)
```
Основные:
- Get/Update Profile
- Get/Place Orders
- Get/Add Addresses
- Get/Add Wallet Balance
- Get Wishlist & Add Items
```

### 3️⃣ Driver APIs (30+ endpoints)
```
Основные:
- Get Profile
- Update Location (Real-time tracking)
- Get Available Orders
- Accept/Complete Delivery
- Get Earnings & Request Withdrawal
```

### 4️⃣ Vendor APIs (40+ endpoints)
```
Основные:
- Get/Add Products
- Get/Confirm Orders
- Get Earnings & Request Payout
- Manage Delivery Men
```

### 5️⃣ Public APIs (20+ endpoints)
```
НЕ требуют токена:
- Search Restaurants
- Get Product Details
- Get Categories
- Get Banners & Coupons
- Validate Coupon
```

### 6️⃣ Configuration APIs (4 endpoints)
- Get Delivery Zones
- Calculate Delivery Charge
- Reverse Geocoding
- Get System Config

### 7️⃣ Partner APIs (2 endpoints)
- Submit Restaurant Application
- Submit B2B Application

---

## 📋 Часть 7: Рабочий процесс для разработки

### Сценарий 1: Тестирование новой функции заказа

```
1. Аутентификация
   POST /auth/sign-up (или /auth/login) → получить OTP
   POST /auth/verify-phone → получить customer_token

2. Получение адресов
   GET /customer/addresses → выбрать address_id

3. Получение ресторанов
   GET /restaurants → выбрать restaurant_id

4. Получение меню
   GET /products?restaurant_id={{restaurant_id}}

5. Размещение заказа
   POST /customer/order/place
   {
     "restaurant_id": {{restaurant_id}},
     "delivery_address_id": {{address_id}},
     "items": [
       { "product_id": 5, "quantity": 2 },
       { "product_id": 8, "quantity": 1 }
     ],
     "payment_method": "wallet"
   }

6. Отслеживание статуса
   GET /customer/order/{{order_id}}
```

### Сценарий 2: Тестирование доставки

```
1. Логин водителя
   POST /auth/delivery-man/verify-otp → получить driver_token

2. Получение доступных заказов
   GET /delivery-man/available-orders?token={{driver_token}}

3. Принятие заказа
   POST /delivery-man/order/accept
   { "order_id": 123, "token": "{{driver_token}}" }

4. Обновление локации (каждые 10-15 сек)
   POST /delivery-man/update-location
   {
     "latitude": 37.7749,
     "longitude": -122.4194,
     "token": "{{driver_token}}"
   }

5. Завершение доставки
   POST /delivery-man/order/complete
   {
     "order_id": 123,
     "signature": "base64_signature",
     "token": "{{driver_token}}"
   }

6. Проверка заработков
   GET /delivery-man/earnings?token={{driver_token}}&from=2026-01-01&to=2026-03-26
```

---

## 🐛 Часть 8: Решение проблем

### Проблема: "Invalid token" при отправке запроса

**Решение:**
1. Проверьте, что вы выбрали правильное окружение (вверху справа)
2. Заново проведите аутентификацию
3. Убедитесь, что токен не истёк (обычно 24 часа)
4. В Postman Settings отключите SSL verification временно

### Проблема: "404 Not Found"

**Решение:**
1. Проверьте, что `base_url` правильный (http://localhost:8000/api/v1)
2.확정 что backend сервер запущен
3. Проверьте в консоли backend сервера есть ли ошибки
4. Обновите коллекцию - может быть endpoint был изменён

### Проблема: "CORS Error"

**Решение:**
1. Отключите CORS check в Postman Settings
2. Или сделайте запрос через Backend proxy

### Проблема: Переменные окружения не заполняются автоматически

**Решение:**
1. Проверьте вкладку "Tests" в запросе (должны быть поставлены скрипты)
2. Смотрите Response - правильный ли он?
3. Убедитесь что Response содержит данные в формате JSON

---

## 📊 Часть 9: Посмотреть ответы и логирование

### Pre-request Script (подготовка перед запросом)

```javascript
// Добавьте дополнительные параметры перед отправкой
console.log("Sending request to: " + pm.request.url);
console.log("Using token: " + pm.environment.get("customer_token"));
```

### Test Script (обработка ответа)

```javascript
// Проверка успешного ответа
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

// Сохранение данных для последующих запросов
pm.test("Save order_id", function () {
    var response = pm.response.json();
    if (response.data && response.data.id) {
        pm.environment.set("order_id", response.data.id);
    }
});

// Просмотр полного ответа
console.log(pm.response.json());
```

### Просмотр Console

1. Нажмите **"Console"** внизу Postman
2. Здесь вы увидите:
   - ✅ Все отправленные запросы
   - ✅ Все полученные ответы
   - ✅ Ошибки и логи из скриптов
   - ✅ Значения переменных

---

## 📱 Часть 10: Использование Postman на мобильном

### Postman для iOS

1. Скачайте приложение из App Store
2. Импортируйте коллекцию через:
   - Меню → Import → Qr code или файл

### Postman для Android

1. Скачайте приложение из Google Play
2. Этапы импорта аналогичны iOS

---

## 🚀 Быстрые ссылки

| Задача | Путь |
|--------|------|
| Импорт коллекции | File → Import → Choose File |
| Выбор окружения | 👁️ (вверху справа) |
| Просмотр переменных | 👁️ → Manage Environments |
| Консоль логов | View → Show Console |
| Истории запросов | Sidebar → History |
| Сохраненные ответы | Sidebar → Responses |

---

## 📞 Контакты и поддержка

**Если есть вопросы:**
- 📧 Email: dev@zaza.tj
- 📖 API Docs: Смотрите файл `API.md` в репозитории
- 🐛 Issues: GitHub Issues в репозитории ZaZa-service-fullapp

---

**Успешного тестирования! 🎉**

*Документация актуальна на 26 Марта 2026 года*
