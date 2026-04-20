# ZaZa Customer App - API Documentation & Setup Guide

## 📱 Overview

The **ZaZa Customer App API** provides comprehensive endpoints for the customer mobile application (iOS/Android Flutter). This API enables customers to:

- 🔐 Authenticate via OTP
- 📍 Browse restaurants and products
- 🛒 Place and track orders
- 📋 Manage delivery addresses
- 💳 Use wallet for payments
- ❤️ Save favorite items to wishlist
- 🎟️ Apply promotional coupons

## 🚀 Quick Start

### 1. Import into Postman

**Method 1: Direct Import**
1. Open Postman
2. Click "File" → "Import"
3. Select `customer-api.postman_collection.json`
4. Import the collection

**Method 2: Import Environment**
```bash
# In Postman
File → Import → Select "customer-api.postman_environment.json"
```

### 2. Set Environment Variables

Open the imported environment and set:

```
base_url = http://localhost:8000/api/v1  # or https://api.zaza.tj/api/v1 for production
base_url_v3 = http://localhost:8000/api/v3  # or https://api.zaza.tj/api/v3 for production
customer_token = (will be auto-populated after login)
restaurant_id = 1
order_id = 1
```

### 3. Swagger UI

#### Open in Browser
1. Download `swagger-customer-ui.html`
2. Open in any web browser (double-click the file)
3. Interactive API documentation loads instantly

#### Features
- ✅ Try-it-out requests
- ✅ Real-time response preview
- ✅ Schema validation
- ✅ Request/response examples
- ✅ Persistent authentication token

## 📚 API Endpoints (25+ total)

### Authentication (OTP-only)

Новый поток для обычных пользователей полностью без пароля, email и nickname:

1. Ввести `phone`
2. Отправить запрос на OTP
3. Ввести `otp`
4. Получить `token` и войти

#### V1 Sign-Up (request OTP)
```
POST /auth/sign-up
```

**Request:**
```json
{
  "phone": "+992912345678"
}
```

**Response (200):**
```json
{
  "message": "OTP sent successfully",
  "is_phone_verified": 0,
  "phone_verify_end_url": "api/v1/auth/verify-phone"
}
```

#### V1 Login (request OTP)
```
POST /auth/login
```

**Request:**
```json
{
  "phone": "+992912345678"
}
```

#### V1 Verify Phone (complete login)
```
POST /auth/verify-phone
```

**Request:**
```json
{
  "phone": "+992912345678",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "phone_number_varified_successfully",
  "token": "<access_token>",
  "is_phone_verified": 1,
  "user": {
    "id": 1,
    "phone": "+992912345678",
    "email": "+992912345678@placeholder.zaza"
  }
}
```

#### V3 Register/Login (request OTP)
```
POST /register
POST /login
```

**Request (same for both):**
```json
{
  "phone": "+992912345678"
}
```

#### V3 Verify Phone (complete login)
```
POST /verify-phone
```

**Request:**
```json
{
  "phone": "+992912345678",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "token": "<access_token>",
  "message": "Авторизация выполнена успешно",
  "user": {
    "id": 1,
    "phone": "+992912345678",
    "is_phone_verified": 1
  }
}
```

#### Legacy compatibility endpoints
```
POST /auth/customer/send-otp
POST /auth/customer/verify-otp
```
Эти endpoint-ы оставлены для старых клиентов.

---

### Customer Profile (2 endpoints)

#### Get Profile
```
GET /customer/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "phone": "+992912345678",
    "image": "https://api.zaza.tj/images/profile.jpg",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Profile
```
PUT /customer/profile
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "firstname": "John",
  "lastname": "Doe Updated",
  "email": "newemail@example.com",
  "image": "binary_file"
}
```

---

### Orders (5 endpoints)

#### Get All Orders
```
GET /customer/orders?page=1&per_page=15&status=delivered
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (int): Page number, default 1
- `per_page` (int): Items per page, default 15
- `status` (string): Filter by status (pending, confirmed, preparing, ready, on_the_way, delivered, cancelled)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_number": "ORD-2024-001",
      "restaurant": {
        "id": 1,
        "name": "Pizza King",
        "image": "https://api.zaza.tj/images/restaurant.jpg"
      },
      "items": [
        {
          "id": 1,
          "name": "Margherita Pizza",
          "quantity": 2,
          "price": 45.00
        }
      ],
      "status": "delivered",
      "delivery_address": {
        "label": "Home",
        "address": "123 Main Street",
        "latitude": 38.5598,
        "longitude": 68.7738
      },
      "subtotal": 90.00,
      "delivery_fee": 10.00,
      "tax": 12.00,
      "total": 112.00,
      "payment_method": "card",
      "driver": {
        "id": 5,
        "name": "Ahmad",
        "phone": "+992912345679",
        "vehicle": "Toyota Camry",
        "rating": 4.8
      },
      "created_at": "2024-01-15T14:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total": 25,
    "per_page": 15
  }
}
```

#### Get Order Details
```
GET /customer/orders/{id}
Authorization: Bearer {token}
```

#### Create Order
```
POST /customer/orders
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "restaurant_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "special_instructions": "No onion, extra cheese"
    },
    {
      "product_id": 5,
      "quantity": 1,
      "special_instructions": ""
    }
  ],
  "delivery_address_id": 1,
  "payment_method": "card",
  "coupon_code": "SUMMER20",
  "notes": "Please ring the bell twice"
}
```

#### Cancel Order
```
PUT /customer/orders/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "status": "cancelled"
}
```

---

### Addresses (4 endpoints)

#### Get All Addresses
```
GET /customer/addresses
Authorization: Bearer {token}
```

#### Add Address
```
POST /customer/addresses
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "label": "Home",
  "address": "123 Main Street, Dushanbe",
  "latitude": 38.5598,
  "longitude": 68.7738,
  "default": true
}
```

**Labels:** Home, Work, Other

#### Update Address
```
PUT /customer/addresses/{id}
Authorization: Bearer {token}
```

#### Delete Address
```
DELETE /customer/addresses/{id}
Authorization: Bearer {token}
```

---

### Wallet (2 endpoints)

#### Get Wallet
```
GET /customer/wallet
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "balance": 250.50,
    "total_earned": 500.00,
    "total_spent": 249.50
  }
}
```

#### Add Balance
```
POST /customer/wallet/add-balance
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "amount": 100.00,
  "payment_method": "card"
}
```

---

### Wishlist (3 endpoints)

#### Get Wishlist
```
GET /customer/wishlist
Authorization: Bearer {token}
```

#### Add to Wishlist
```
POST /customer/wishlist
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "product_id": 1
}
```

#### Remove from Wishlist
```
DELETE /customer/wishlist/{id}
Authorization: Bearer {token}
```

---

### Public Endpoints (8 endpoints - No Auth Required)

#### Get Restaurants
```
GET /restaurants?page=1&per_page=15&sort=rating
```

**Query Parameters:**
- `page`: Page number
- `per_page`: Items per page
- `category`: Filter by cuisine
- `search`: Search by name
- `latitude`, `longitude`: For location-based search
- `sort`: rating, delivery_time, delivery_fee

#### Get Restaurant Products
```
GET /restaurants/{id}/products?category=pizza&page=1
```

#### Search Products
```
GET /products/search?q=pizza&category=italian
```

#### Get Categories
```
GET /categories
```

#### Get Coupons
```
GET /coupons
```

#### Validate Coupon
```
POST /coupons/{code}/validate
Content-Type: application/json
```

**Request:**
```json
{
  "order_amount": 100.00
}
```

---

## 🔐 Authentication

### Bearer Token Flow

1. **Send OTP** → Get OTP via SMS
2. **Verify OTP** → Receive Bearer token
3. **Use Token** → Include in Authorization header for all authenticated requests

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

- ⏰ Default: 24 hours
- 🔄 Refresh: Automatic token refresh before expiration
- ❌ Revoke: Send logout request to invalidate

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* Resource data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "invalid_request",
  "message": "Validation failed",
  "errors": {
    "phone": ["Phone number is required"]
  }
}
```

### Status Codes
- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Unprocessable Entity
- `429`: Rate Limited (>100 req/min)
- `500`: Internal Server Error

---

## 🛠️ Development & Testing

### Setup Postman Environment

```json
{
  "base_url": "http://localhost:8000/api/v1",
  "base_url_v3": "http://localhost:8000/api/v3",
  "customer_token": "",
  "restaurant_id": "1",
  "order_id": "1"
}
```

### Test Workflow

```
1. POST /auth/sign-up (phone) or POST /auth/login (phone)
   ↓
2. POST /auth/verify-phone (phone, otp) → token saved
   ↓
3. GET /restaurants (browse)
   ↓
4. POST /customer/orders (create order) → order_id saved
   ↓
5. GET /customer/orders/{order_id} (track)
```

---

## 📱 Mobile Implementation

### Flutter Example
```dart
final token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

final response = await http.get(
  Uri.parse('http://localhost:8000/api/v1/customer/profile'),
  headers: {
    'Authorization': token,
    'Content-Type': 'application/json',
  },
);
```

---

## ⚠️ Error Handling

### Common Errors

| Code | Message | Solution |
|------|---------|----------|
| 401 | Invalid token | Re-authenticate with OTP |
| 404 | Resource not found | Check ID validity |
| 422 | Validation failed | Check request parameters |
| 429 | Too many requests | Wait before retrying |

---

## 📖 Additional Resources

- **Full API Docs**: [API.md](API.md)
- **Postman Collection**: [customer-api.postman_collection.json](customer-api.postman_collection.json)
- **OpenAPI Spec**: [swagger-customer.json](swagger-customer.json)
- **Swagger UI**: [swagger-customer-ui.html](swagger-customer-ui.html)
- **GitHub**: [ZaZa Full App](https://github.com/dark-developer-lord/ZaZa-service-fullapp)

---

## 🔗 Quick Links

- **Dev API**: http://localhost:8000/api/v1
- **Prod API**: https://api.zaza.tj/api/v1
- **Support**: support@zaza.tj
- **Documentation**: [Full Docs](API.md)

---

**Last Updated:** March 27, 2024
