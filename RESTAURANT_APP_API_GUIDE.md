# ZaZa Restaurant (Vendor) Portal - API Documentation & Setup Guide

## 🏪 Overview

The **ZaZa Restaurant (Vendor) API** provides endpoints for the restaurant web portal (React 19 + Vite). This API enables restaurant managers to:

- 🔐 Authenticate and manage accounts
- 📋 Manage menu products and categories
- 📦 Process and track customer orders
- 👥 Manage delivery personnel
- 💰 Track earnings and view analytics
- 📊 Generate sales reports and insights
- ⚙️ Manage restaurant settings and hours

## 🚀 Quick Start

### 1. Import into Postman

```bash
# Step 1: Open Postman
# Step 2: File → Import  
# Step 3: Select restaurant-api.postman_collection.json
# Step 4: Collection imported!
```

### 2. Set Environment Variables

```
base_url = http://localhost:8000/api/v1  # or https://api.zaza.tj/api/v1
vendor_token = (auto-populated after login)
order_id = (update as needed)
```

### 3. Open Swagger UI

1. Open `swagger-restaurant-ui.html` in browser
2. Interactive API documentation loads instantly
3. Test endpoints directly in the browser

---

## 📚 API Endpoints (20+ total)

### Authentication (1 endpoint)

#### Vendor Login
```
POST /vendor/auth/login
```

**Request:**
```json
{
  "email": "vendor@restaurant.com",
  "password": "secure_password_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Manager",
      "email": "vendor@restaurant.com",
      "phone": "+992912345678",
      "restaurant_id": 5,
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Vendor Profile & Restaurant (4 endpoints)

#### Get Vendor Profile
```
GET /vendor/profile
Authorization: Bearer {token}
```

#### Update Vendor Profile
```
PUT /vendor/profile
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "John Manager",
  "email": "manager@restaurant.com",
  "phone": "+992912345678"
}
```

#### Get Restaurant Details
```
GET /vendor/restaurant
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Pizza King Restaurant",
    "description": "Best pizza in Dushanbe",
    "image": "https://api.zaza.tj/images/restaurant.jpg",
    "logo": "https://api.zaza.tj/images/logo.jpg",
    "address": "123 Main Street, Dushanbe",
    "latitude": 38.5598,
    "longitude": 68.7738,
    "phone": "+992912345678",
    "email": "info@pizzaking.tj",
    "status": "active",
    "rating": 4.7,
    "reviews_count": 234,
    "open_time": "10:00",
    "close_time": "23:00"
  }
}
```

#### Update Restaurant Details
```
PUT /vendor/restaurant
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Pizza King Restaurant",
  "description": "Best pizza in Dushanbe",
  "phone": "+992912345678",
  "open_time": "10:00",
  "close_time": "23:00"
}
```

---

### Products Management (5 endpoints)

#### Get All Products
```
GET /vendor/products?page=1&per_page=20&category=pizza&status=active
Authorization: Bearer {token}
```

**Query params:**
- `page`: Pagination (default 1)
- `per_page`: Items per page (default 20)
- `category`: Filter by category
- `status`: Filter by status (active, inactive)

#### Create Product
```
POST /vendor/products
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with mozzarella and tomato sauce",
  "category_id": 1,
  "price": 45.00,
  "discount_price": 40.00,
  "stock": 50,
  "preparation_time": 15
}
```

#### Get Product Details
```
GET /vendor/products/{id}
Authorization: Bearer {token}
```

#### Update Product
```
PUT /vendor/products/{id}
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Margherita Pizza Updated",
  "price": 50.00,
  "discount_price": 45.00,
  "status": "active"
}
```

#### Delete Product
```
DELETE /vendor/products/{id}
Authorization: Bearer {token}
```

---

### Orders Management (5 endpoints)

#### Get All Orders
```
GET /vendor/orders?page=1&status=pending&from_date=2024-01-01&to_date=2024-01-31
Authorization: Bearer {token}
```

**Query params:**
- `page`: Pagination
- `status`: pending, confirmed, preparing, ready, on_the_way, delivered, cancelled
- `from_date`, `to_date`: Date range filter

#### Get Order Details
```
GET /vendor/orders/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1234,
    "order_number": "ORD-2024-001",
    "customer_name": "Ahmad Hassan",
    "customer_phone": "+992912345679",
    "items": [
      {
        "product_id": 1,
        "product_name": "Margherita Pizza",
        "quantity": 2,
        "price": 40.00
      }
    ],
    "subtotal": 80.00,
    "tax": 8.00,
    "delivery_fee": 10.00,
    "total": 98.00,
    "status": "pending",
    "payment_method": "card",
    "notes": "No onions please",
    "created_at": "2024-01-15T14:30:00Z"
  }
}
```

#### Confirm Order
```
POST /vendor/orders/{id}/confirm
Authorization: Bearer {token}
```

**Request:**
```json
{
  "estimated_time": 20
}
```
Sets estimated preparation time in minutes

#### Reject Order
```
POST /vendor/orders/{id}/reject
Authorization: Bearer {token}
```

**Request:**
```json
{
  "reason": "Sold out/Unavailable"
}
```

#### Update Order Status
```
PUT /vendor/orders/{id}/status
Authorization: Bearer {token}
```

**Request:**
```json
{
  "status": "preparing"
}
```

**Status flow:** pending → confirmed → preparing → ready → on_the_way → delivered

---

### Earnings & Analytics (3 endpoints)

#### Get Earnings
```
GET /vendor/earnings?period=today
Authorization: Bearer {token}
```

**Periods:** today, week, month, year

**Response:**
```json
{
  "success": true,
  "data": {
    "total_revenue": 4500.00,
    "total_orders": 45,
    "average_order_value": 100.00,
    "commission": 675.00,
    "net_earnings": 3825.00
  }
}
```

#### Get Analytics & Reports
```
GET /vendor/analytics?from_date=2024-01-01&to_date=2024-01-31
Authorization: Bearer {token}
```

Provides detailed sales reports, popular items, peak hours, etc.

---

### Delivery Men Management (2 endpoints)

#### Get All Delivery Men
```
GET /vendor/delivery-men
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ahmad Driver",
      "phone": "+992912345670",
      "vehicle_type": "car",
      "vehicle_number": "ABC-123",
      "status": "active",
      "rating": 4.8,
      "assigned_orders": 3
    }
  ]
}
```

#### Update Delivery Man Status
```
PUT /vendor/delivery-men/{id}
Authorization: Bearer {token}
```

**Request:**
```json
{
  "status": "active"
}
```

---

## 🔐 Authentication

### Bearer Token Flow

1. **Login** → POST /vendor/auth/login
2. **Get Token** → Receive JWT token
3. **Use Token** → Include in Authorization header

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Order Processing Workflow

```
1. GET /vendor/orders (status=pending)
   ↓
2. POST /vendor/orders/{id}/confirm (estimated_time)
   → Order confirmed, customer notified
   ↓
3. PUT /vendor/orders/{id}/status (preparing)
   → Notify driver that order is being prepared
   ↓
4. PUT /vendor/orders/{id}/status (ready)
   → Order ready for pickup
   ↓
5. Driver picks up order
   ↓
6. Customer receives delivery
   → System automatically marks as delivered
```

---

## 💰 Earnings Model

**Commission Structure:**
- Platform takes: 15% of total revenue
- Restaurant gets: 85% (minus payment processing fees 2-3%)

**Example:**
- Customer order: ৳ 100
- Commission: ৳ 15
- **Restaurant receives:** ৳ 85

---

## 📱 React Implementation

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';
let vendorToken = '';

// Login
export const vendorLogin = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/vendor/auth/login`, {
    email,
    password,
  });
  vendorToken = response.data.data.token;
  localStorage.setItem('vendorToken', vendorToken);
  return response.data;
};

// Get Orders
export const getOrders = async (page = 1, status = 'pending') => {
  return axios.get(
    `${API_BASE}/vendor/orders?page=${page}&status=${status}`,
    {
      headers: { Authorization: `Bearer ${vendorToken}` },
    }
  );
};

// Confirm Order
export const confirmOrder = async (orderId: number, estimatedTime: number) => {
  return axios.post(
    `${API_BASE}/vendor/orders/${orderId}/confirm`,
    { estimated_time: estimatedTime },
    {
      headers: { Authorization: `Bearer ${vendorToken}` },
    }
  );
};
```

---

## ⚠️ Error Handling

| Code | Message | Action |
|------|---------|--------|
| 400 | Bad request | Check request format |
| 401 | Invalid token | Re-login |
| 403 | Forbidden | Check permissions |
| 404 | Not found | Verify resource ID |
| 422 | Validation failed | Check parameters |
| 429 | Rate limited | Wait before retry |

---

## 🛠️ Best Practices

### 1. Order Management
- Check for new pending orders every 10-15 seconds
- Confirm/reject orders within 2 minutes
- Update status in real-time

### 2. Product Management
- Keep stock quantities updated
- Set prices competitively
- Use high-quality product images
- Add detailed descriptions

### 3. Performance
- Cache restaurant details for 1 hour
- Paginate large lists (20-30 items per page)
- Use date range filters for reports
- Implement retry logic for failed requests

---

## 📖 Additional Resources

- **Full API Docs**: [API.md](API.md)
- **Postman Collection**: [restaurant-api.postman_collection.json](restaurant-api.postman_collection.json)
- **OpenAPI Spec**: [swagger-restaurant.json](swagger-restaurant.json)
- **Swagger UI**: [swagger-restaurant-ui.html](swagger-restaurant-ui.html)
- **GitHub**: [ZaZa Full App](https://github.com/dark-developer-lord/ZaZa-service-fullapp)

---

**Last Updated:** March 27, 2024
