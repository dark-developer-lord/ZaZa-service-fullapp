# ZaZa Driver App - API Documentation & Setup Guide

## 🛵 Overview

The **ZaZa Driver App API** provides endpoints for the driver delivery application (iOS/Android Flutter). This API enables drivers to:

- 🔐 Authenticate via OTP
- 📍 Update real-time location for order tracking
- 🚚 Browse available orders and accept deliveries
- ✅ Complete deliveries and update order status
- 💰 Track earnings and request withdrawals
- ⭐ View ratings and customer feedback
- 📊 Monitor delivery statistics

## 🚀 Quick Start

### 1. Import into Postman

```bash
# Step 1: Open Postman
# Step 2: File → Import
# Step 3: Select driver-api.postman_collection.json
# Step 4: Collection imported! 
```

### 2. Set Environment Variables

```
base_url = http://localhost:8000/api/v1  # or https://api.zaza.tj/api/v1
driver_token = (auto-populated after login)
```

### 3. Open Swagger UI

1. Open `swagger-driver-ui.html` in browser
2. Interactive API documentation loads instantly
3. Test endpoints directly in the browser

## 📚 API Endpoints (18+ total)

### Authentication (2 endpoints)

#### Send OTP
```
POST /driver/auth/send-otp
```

**Request:**
```json
{
  "phone": "+992912345678"
}
```

#### Verify OTP & Get Token
```
POST /driver/auth/verify-otp
```

**Request:**
```json
{
  "phone": "+992912345678",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 5,
      "firstname": "Ahmad",
      "lastname": "Driver",
      "phone": "+992912345678",
      "vehicle_type": "car",
      "vehicle_number": "ABC-123",
      "rating": 4.8,
      "total_deliveries": 150
    },
    "token": "eyJhbGciOiJIUzI1..."
  }
}
```

---

### Driver Profile (2 endpoints)

#### Get Profile
```
GET /driver/profile?token={token}
```

#### Update Profile
```
PUT /driver/profile?token={token}
```

**Request:**
```json
{
  "firstname": "Ahmad",
  "lastname": "Driver",
  "vehicle_type": "car",
  "vehicle_number": "ABC-123"
}
```

---

### Location Tracking (2 endpoints) - **CRITICAL**

#### Update Location (Real-time)
```
POST /driver/location?token={token}
```
**Called frequently (every 10-30 seconds while on delivery)**

**Request:**
```json
{
  "latitude": 38.5598,
  "longitude": 68.7738,
  "accuracy": 5.5,
  "speed": 20.5,
  "heading": 45.0
}
```

#### Get Current Location
```
GET /driver/location?token={token}
```

---

### Orders (5 endpoints)

#### Get Available Orders
```
GET /driver/orders/available?token={token}&latitude=38.5598&longitude=68.7738&radius=5&page=1
```

**Params:**
- `latitude`, `longitude`: Driver's current location
- `radius`: Search radius in km (default 5)
- `page`: For pagination

**Response:** Array of available orders sorted by proximity and delivery fee

#### Get Active Orders
```
GET /driver/orders/active?token={token}
```
Orders currently being delivered by this driver

#### Accept Order
```
POST /driver/orders/{id}/accept?token={token}
```

#### Update Order Status
```
PUT /driver/orders/{id}/status?token={token}
```

**Request:**
```json
{
  "status": "on_the_way",
  "notes": "Order picked up from restaurant"
}
```

**Status values:** on_the_way, delivered, failed

#### Complete Delivery
```
POST /driver/orders/{id}/complete?token={token}
```

**Request:**
```json
{
  "latitude": 38.5598,
  "longitude": 68.7738,
  "notes": "Delivered successfully"
}
```

---

### Earnings (3 endpoints)

#### Get Earnings Summary
```
GET /driver/earnings?token={token}&period=today
```

**Periods:** today, week, month, all

**Response:**
```json
{
  "today_earnings": 150.00,
  "this_week_earnings": 950.00,
  "this_month_earnings": 4200.00,
  "total_earnings": 8500.00,
  "pending_payouts": 500.00,
  "completed_deliveries": 142,
  "cancelled_deliveries": 3
}
```

#### Get Earnings History
```
GET /driver/earnings/history?token={token}&page=1&per_page=50
```

#### Request Withdrawal
```
POST /driver/earnings/withdraw?token={token}
```

**Request:**
```json
{
  "amount": 500.00,
  "bank_account": "1234567890",
  "payment_method": "bank_transfer"
}
```

---

### Ratings & Status (2 endpoints)

#### Get Ratings
```
GET /driver/ratings?token={token}
```

#### Update Status
```
PUT /driver/status?token={token}
```

**Request:**
```json
{
  "status": "active"
}
```

**Status values:** active, inactive, break

---

## 🔐 Authentication

### Query Token Method
Driver app uses query parameter instead of header:

```
GET /driver/orders/available?token=eyJhbGc...
POST /driver/location?token=eyJhbGc...
```

This differs from the header-based Bearer tokens used by customer and vendor apps.

---

## 📊 Real-time Location Tracking

**Important:** Location updates are critical for order tracking and driver assignment.

**Recommended frequency:**
- **While idle:** Every 5 minutes
- **On delivery:** Every 10-30 seconds
- **In movement:** Every 15-20 seconds

```dart
// Flutter example for periodic location updates
Timer.periodic(Duration(seconds: 10), (timer) {
  updateDriverLocation(
    latitude: position.latitude,
    longitude: position.longitude,
    accuracy: position.accuracy,
    speed: position.speed,
  );
});
```

---

## 💰 Earnings Calculation

- **Base delivery fee:** ৳ 10-20 (system default)
- **Surge pricing:** +20-50% during peak hours (11-13, 18-20)
- **Bonus:** +৳ 5 for ratings > 4.8
- **Commission:** Platform retains 15%

**Example:**
- Base: ৳ 15
- Surge (peak): ৳ 6 (+40%)
- Bonus (rating): ৳ 5
- **Driver receives:** ৳ 17 (after 15% commission)
- **Platform keeps:** ৳ 3

---

## 🛠️ Development Workflow

```
1. POST /driver/auth/send-otp (phone)
   ↓
2. POST /driver/auth/verify-otp (phone, otp) → token saved
   ↓
3. PUT /driver/status (status: active) → Go online
   ↓
4. POST /driver/location (periodically) → Real-time tracking
   ↓
5. GET /driver/orders/available → Browse orders
   ↓
6. POST /driver/orders/{id}/accept → Accept order
   ↓
7. PUT /driver/orders/{id}/status (on_the_way) → Update
   ↓
8. POST /driver/orders/{id}/complete → Finish delivery
   ↓
9. GET /driver/earnings (today) → Check earnings
```

---

## 📱 Flutter Implementation

```dart
import 'package:http/http.dart' as http;

class DriverAPI {
  static const String BASE_URL = 'http://localhost:8000/api/v1';
  
  static Future<void> updateLocation(
    double latitude,
    double longitude,
    String token,
  ) async {
    final response = await http.post(
      Uri.parse('$BASE_URL/driver/location?token=$token'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'latitude': latitude,
        'longitude': longitude,
        'accuracy': 5.5,
      }),
    );
    
    if (response.statusCode != 200) {
      throw Exception('Failed to update location');
    }
  }
}
```

---

## ⚠️ Error Handling

| Code | Message | Action |
|------|---------|--------|
| 400 | Invalid location | Check GPS accuracy |
| 401 | Invalid token | Re-authenticate |
| 404 | No available orders | Wait for new orders |
| 429 | Rate limited | Reduce request frequency |

---

## 📖 Additional Resources

- **Full API Docs**: [API.md](API.md)
- **Postman Collection**: [driver-api.postman_collection.json](driver-api.postman_collection.json)
- **OpenAPI Spec**: [swagger-driver.json](swagger-driver.json)
- **Swagger UI**: [swagger-driver-ui.html](swagger-driver-ui.html)
- **GitHub**: [ZaZa Full App](https://github.com/dark-developer-lord/ZaZa-service-fullapp)

---

**Last Updated:** March 27, 2024
