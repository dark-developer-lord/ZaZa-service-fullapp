# ZaZa Server-to-Server Integrations Guide

## Overview

This guide documents all backend outbound API integrations for the ZaZa food delivery platform. The backend makes calls to external third-party services for SMS delivery, payment processing, email notifications, push notifications, and AI services.

**Base URLs:**
- **Production:** `https://api.zaza.tj`
- **Development:** `http://localhost:8000`

---

## Table of Contents

1. [SMS Services](#sms-services)
2. [Payment Gateways](#payment-gateways)
3. [Email Service](#email-service)
4. [Firebase Notifications](#firebase-notifications)
5. [Storage Services](#storage-services)
6. [AI Services](#ai-services)
7. [Webhook Handlers](#webhook-handlers)
8. [Integration Flows](#integration-flows)
9. [Configuration](#configuration)
10. [Security & Best Practices](#security--best-practices)

---

## SMS Services

### Overview

The backend sends SMS messages through two primary providers:
- **Nexmo (Vonage)** - Primary provider
- **Oson SMS** - Fallback provider

### Workflow

```
User sends phone → Backend generates OTP → Send via SMS Provider → SMS delivered
                                        ↓ (fallback if fails)
                                    Oson SMS
```

### Configuration Files

**`config/nexmo.php`**
```php
'nexmo' => [
    'key' => env('NEXMO_KEY'),
    'secret' => env('NEXMO_SECRET'),
    'sms' => [
        'from' => env('NEXMO_SMS_FROM', 'ZaZa'),
    ]
],
```

**`config/osonsmsservice.php`**
```php
'oson' => [
    'api_key' => env('OSON_SMS_API_KEY'),
    'api_url' => 'https://api.oson.tj/api/v1/sms',
    'sender_id' => 'ZAZA'
],
```

### API Endpoints

#### Send OTP

**Endpoint:** `POST /internal/sms/send-otp`

**Request:**
```json
{
  "phone": "+992901234567",
  "user_type": "customer",
  "length": 6
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| phone | string | Yes | International format phone number |
| user_type | string | Yes | customer, driver, or vendor |
| length | integer | No | OTP digit length (default: 6) |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "reference": "ref_987654321",
  "provider": "nexmo",
  "expiry_seconds": 300
}
```

**Response (503 Service Unavailable):**
```json
{
  "success": false,
  "message": "All SMS providers failed",
  "error": "SMS service temporarily unavailable",
  "retry_after": 60
}
```

### Error Handling

- **Invalid phone format:** Returns 400 with validation error
- **Provider quota exceeded:** Tries fallback provider
- **Network timeout:** Retries with exponential backoff (3 attempts)
- **Rate limiting:** Returns 429 with retry-after header

### Testing

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/v1/internal/sms/send-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "phone": "+992901234567",
    "user_type": "customer"
  }'
```

**Laravel Code Example:**
```php
use App\Services\SmsService;

$smsService = app(SmsService::class);
$result = $smsService->sendOtp(
    phone: '+992901234567',
    userType: 'customer'
);

if ($result['success']) {
    session(['otp_reference' => $result['reference']]);
}
```

---

## Payment Gateways

The backend integrates with 5 payment providers, each serving specific geographic regions:

| Provider | Region | Currency | Use Case |
|----------|--------|----------|----------|
| **Razorpay** | India | INR | Customers, Wallet Top-ups |
| **PayPal** | Global | USD, EUR, GBP | International Payments |
| **SSLCommerz** | Bangladesh | BDT | Bangladeshi Customers |
| **Paytm** | India | INR | Alternative Indian Gateway |
| **Flutterwave** | Africa | NGN, GHS, ZAR | African Markets |

### Payment Flow

```
Customer initiates payment
         ↓
Backend creates order in Payment Gateway
         ↓
Customer completes payment in gateway
         ↓
Gateway sends webhook confirmation
         ↓
Backend verifies signature and updates order
         ↓
Customer receives confirmation
```

### Razorpay Integration

**Configuration:** `config/razor.php`

#### Create Order

**Endpoint:** `POST /internal/payment/razorpay/create-order`

**Request:**
```json
{
  "amount": 10000,
  "currency": "INR",
  "customer_id": 1,
  "order_type": "wallet_topup",
  "description": "Wallet Top-up - Customer"
}
```

**Response (201 Created):**
```json
{
  "razorpay_order_id": "order_1Aa00000000001",
  "amount": 10000,
  "currency": "INR",
  "status": "created",
  "receipt": "order_receipt_001",
  "created_at": 1679223000
}
```

#### Verify Payment

**Endpoint:** `POST /internal/payment/razorpay/verify`

**Request:**
```json
{
  "razorpay_order_id": "order_1Aa00000000001",
  "razorpay_payment_id": "pay_1Aa00000000001",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "payment_id": "pay_1Aa00000000001",
  "status": "captured",
  "amount": 10000,
  "verified_at": "2026-03-27T10:30:00Z"
}
```

**Signature Verification:**
```php
// Laravel + Razorpay SDK
use Razorpay\Api\Api;

$api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

try {
    $api->utility->verifyPaymentSignature([
        'razorpay_order_id' => $razorpayOrderId,
        'razorpay_payment_id' => $razorpayPaymentId,
        'razorpay_signature' => $razorpaySignature
    ]);
    // Signature is valid
} catch (\Exception $e) {
    // Invalid signature - potential fraud
    Log::warning('Invalid Razorpay signature', ['error' => $e->getMessage()]);
}
```

### PayPal Integration

**Configuration:** `config/paypal.php`

#### Create Transaction

**Endpoint:** `POST /internal/payment/paypal/create-transaction`

**Request:**
```json
{
  "amount": 100.00,
  "currency": "USD",
  "customer_email": "customer@example.com",
  "description": "Order Payment - Food Delivery",
  "return_url": "https://app.zaza.tj/payment/return",
  "cancel_url": "https://app.zaza.tj/payment/cancel"
}
```

**Response (201 Created):**
```json
{
  "transaction_id": "5O190127TN364715T",
  "paypal_link": "https://sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-12345",
  "status": "created"
}
```

### SSLCommerz Integration (Bangladesh)

**Configuration:** `config/sslcommerz.php`

**Request:**
```json
{
  "amount": 500.00,
  "currency": "BDT",
  "customer_id": 1,
  "customer_email": "customer@example.com",
  "customer_phone": "+8801234567890"
}
```

### Payment Provider Selection Logic

```php
// In PaymentService
public function selectProvider($amount, $currency, $userCountry)
{
    return match($userCountry) {
        'IN' => match($currency) {
            'INR' => 'razorpay', // Primary for India
            default => 'paypal'
        },
        'BD' => 'sslcommerz',
        'NG', 'GH' => 'flutterwave',
        default => 'paypal'
    };
}
```

---

## Email Service

### Overview

The backend sends transactional emails via SMTP with Laravel Mail service. All emails are queued for asynchronous delivery to avoid blocking the request.

**Configuration:** `config/mail.php`

```php
'driver' => env('MAIL_DRIVER', 'smtp'),
'host' => env('MAIL_HOST'),
'port' => env('MAIL_PORT', 587),
'username' => env('MAIL_USERNAME'),
'password' => env('MAIL_PASSWORD'),
'encryption' => env('MAIL_ENCRYPTION', 'tls')
```

### Email Templates

| Template | Use Case | Priority | Variables |
|----------|----------|----------|-----------|
| `order_confirmation` | Order placed | high | order_id, items, total, delivery_time |
| `password_reset` | Forgot password | high | reset_link, expiry_time |
| `payment_receipt` | Payment completed | normal | transaction_id, amount, method, date |
| `vendor_onboarding` | New restaurant signup | normal | restaurant_name, dashboard_link, login_id |
| `delivery_completed` | Order delivered | low | order_id, delivery_time, rating_link |

### Send Email Endpoint

**Endpoint:** `POST /internal/email/send`

**Request:**
```json
{
  "to": "customer@example.com",
  "subject": "Order Confirmation - Order #12345",
  "template": "order_confirmation",
  "data": {
    "order_id": "12345",
    "customer_name": "John Doe",
    "restaurant_name": "Pizza Paradise",
    "items": [
      {"name": "Margherita Pizza", "qty": 2, "price": "$12.99"},
      {"name": "Caesar Salad", "qty": 1, "price": "$8.99"}
    ],
    "total_amount": "$34.97",
    "delivery_time": "30 minutes"
  },
  "priority": "high"
}
```

**Response (202 Accepted):**
```json
{
  "queued": true,
  "job_id": "job_abc123xyz",
  "estimated_delivery": 30,
  "status": "queued"
}
```

### Email Queue Configuration

**`config/queue.php`**
```php
'default' => env('QUEUE_CONNECTION', 'database'),
'connections' => [
    'database' => [
        'driver' => 'database',
        'table' => 'jobs',
        'queue' => 'default',
        'retry_after' => 90,
    ],
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => env('REDIS_QUEUE', 'default'),
        'retry_after' => 90,
        'block_for' => null,
    ],
]
```

### Laravel Code Example

```php
use App\Mail\OrderConfirmationMail;
use Illuminate\Support\Facades\Mail;

// Queue for async delivery
Mail::queue(new OrderConfirmationMail($order));

// Or send immediately (not recommended)
Mail::send(new OrderConfirmationMail($order));

// Check queue status
php artisan queue:work database --tries=3 --timeout=60
```

---

## Firebase Notifications

### Overview

Push notifications are sent to mobile apps (iOS/Android) via Firebase Cloud Messaging (FCM).

**Configuration:** `config/firebase.php`

```php
'firebase' => [
    'project_id' => env('FIREBASE_PROJECT_ID'),
    'credential_file' => base_path('firebase-credentials.json'),
    'database_url' => env('FIREBASE_DATABASE_URL'),
]
```

### FCM Topics

| Topic | Subscribers | Use Case |
|-------|-------------|----------|
| `customer_order_updates` | All customers | Order status changes |
| `customer_promotions` | Opted-in customers | Promotional offers |
| `driver_assignments` | Online drivers | New delivery assignments |
| `driver_earnings` | All drivers | Daily earnings summary |
| `restaurant_new_orders` | All vendors | New incoming orders |

### Send Notification Endpoint

**Endpoint:** `POST /internal/firebase/send-notification`

#### Variant 1: Send to Specific Devices

**Request:**
```json
{
  "device_tokens": [
    "dKRjP7n_DAQCZN",
    "fLkJh2m_CAQAZM"
  ],
  "title": "Order Confirmed!",
  "body": "Your order has been confirmed by the restaurant",
  "data": {
    "order_id": "12345",
    "action": "open_order",
    "restaurant_name": "Pizza Paradise"
  },
  "notification_type": "order_status"
}
```

#### Variant 2: Send to Topic

**Request:**
```json
{
  "topic": "customer_promotions",
  "title": "Special Offer!",
  "body": "Get 30% off on your next order",
  "data": {
    "promo_code": "SAVE30",
    "expiry_date": "2026-04-27"
  },
  "notification_type": "promotion"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message_ids": [
    "0:1679223000000000%abc123def456",
    "0:1679223001000000%xyz789uvw123"
  ],
  "failed_tokens": [],
  "total_sent": 2
}
```

### Firebase Admin SDK Setup

```php
use Google\Cloud\Firestore\FirestoreClient;
use Kreait\Firebase\Factory;

$factory = (new Factory)->withServiceAccount(
    base_path('firebase-credentials.json')
);

$messaging = $factory->createMessaging();

// Send to topic
$message = [
    'topic' => 'customer_promotions',
    'notification' => [
        'title' => 'Special Offer!',
        'body' => 'Get 30% off'
    ],
    'data' => [
        'promo_code' => 'SAVE30'
    ]
];

$messaging->send($message);
```

---

## Storage Services

### Overview

The backend stores files (images, documents, receipts) in configurable storage backends.

**Supported Backends:**
- **Local Filesystem** - Development
- **Azure Blob Storage** - Production
- **AWS S3** - Alternative production

**Configuration:** `config/filesystems.php`

```php
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app'),
    ],
    'azure' => [
        'driver' => 'azure',
        'account' => env('AZURE_STORAGE_ACCOUNT'),
        'key' => env('AZURE_STORAGE_KEY'),
        'container' => env('AZURE_STORAGE_CONTAINER'),
    ],
    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
    ],
]
```

### Upload Endpoint

**Endpoint:** `POST /internal/storage/upload`

**Request (multipart/form-data):**
```
file: <binary file data>
path: products/images
disk: azure
```

**Response (201 Created):**
```json
{
  "success": true,
  "url": "https://storage.azure.com/zaza/products/images/pizza-123.jpg",
  "path": "products/images/pizza-123.jpg",
  "size": 245678,
  "mime_type": "image/jpeg"
}
```

### Storage Paths Structure

```
storage/
  ├── products/images/         # Product photos (public)
  ├── restaurants/logos/       # Restaurant logos (public)
  ├── users/documents/         # ID documents, proofs (private)
  ├── invoices/               # Order receipts (private)
  └── certificates/           # Business certificates (private)
```

---

## AI Services

### Overview

The backend integrates with OpenAI API for text classification and analysis tasks.

**Configuration:** `config/ai.php`

```php
'openai' => [
    'api_key' => env('OPENAI_API_KEY'),
    'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
    'max_tokens' => env('OPENAI_MAX_TOKENS', 500),
]
```

### Classification Endpoint

**Endpoint:** `POST /internal/ai/classify`

#### Use Case 1: Product Category Classification

**Request:**
```json
{
  "text": "Delicious grilled chicken breast with herb butter sauce and seasonal vegetables",
  "classification_type": "product_category",
  "categories": ["chicken", "beef", "seafood", "vegetarian", "dessert"]
}
```

**Response:**
```json
{
  "classification": "chicken",
  "confidence": 0.98,
  "reasoning": "The text explicitly mentions 'grilled chicken breast' as the main ingredient"
}
```

#### Use Case 2: Review Sentiment Analysis

**Request:**
```json
{
  "text": "Amazing food quality! The delivery was incredibly fast. Highly recommend!",
  "classification_type": "sentiment_analysis",
  "categories": ["positive", "neutral", "negative"]
}
```

**Response:**
```json
{
  "classification": "positive",
  "confidence": 0.95,
  "reasoning": "Multiple positive adjectives and strong recommendation indicate customer satisfaction"
}
```

### OpenAI API Usage

```php
use OpenAI;

$client = OpenAI::client(env('OPENAI_API_KEY'));

$response = $client->chat()->create([
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        ['role' => 'system', 'content' => 'You are a product classifier'],
        ['role' => 'user', 'content' => $productDescription]
    ],
    'temperature' => 0.3,
    'max_tokens' => 100
]);

$classification = $response['choices'][0]['message']['content'];
```

---

## Webhook Handlers

### Razorpay Webhook

**Endpoint:** `POST /internal/webhook/razorpay`

**Event Types:**
- `payment.authorized` - Payment authorized (pre-approval)
- `payment.captured` - Payment successfully captured
- `payment.failed` - Payment failed

**Webhook Request:**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "id": "pay_1Aa00000000001",
      "entity": "payment",
      "amount": 10000,
      "currency": "INR",
      "status": "captured",
      "method": "card",
      "created_at": 1679223000
    },
    "order": {
      "id": "order_1Aa00000000001",
      "entity": "order",
      "amount": 10000,
      "status": "paid"
    }
  }
}
```

**Signature Verification:**
```php
$webhookSecret = env('RAZORPAY_WEBHOOK_SECRET');
$body = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';

$expectedSignature = hash_hmac('sha256', $body, $webhookSecret);

if (!hash_equals($expectedSignature, $signature)) {
    http_response_code(401);
    exit('Webhook signature verification failed');
}
```

### PayPal Webhook

**Endpoint:** `POST /internal/webhook/paypal`

**Event Types:**
- `CHECKOUT.ORDER.COMPLETED` - Order completed
- `PAYMENT.CAPTURE.COMPLETED` - Payment captured
- `PAYMENT.CAPTURE.DENIED` - Payment denied

**Webhook Request:**
```json
{
  "id": "WH-1A2B3C4D5E6F7G8H9I0J",
  "event_type": "CHECKOUT.ORDER.COMPLETED",
  "create_time": "2026-03-27T10:30:00Z",
  "resource": {
    "id": "5O190127TN364715T",
    "status": "COMPLETED",
    "payer": {
      "email_address": "customer@example.com"
    },
    "purchase_units": [
      {
        "reference_id": "order_12345",
        "amount": {
          "currency_code": "USD",
          "value": "100.00"
        }
      }
    ]
  }
}
```

---

## Integration Flows

### Flow 1: Customer OTP Authentication

```
┌─────────────┐
│   Customer  │
│  App Login  │
└──────┬──────┘
       │ POST /auth/send-otp
       ↓
┌─────────────────────────┐
│ ZaZa Backend            │
│ Generate OTP (6 digits) │
│ Store reference         │
└──────┬──────────────────┘
       │ POST /internal/sms/send-otp
       ↓
┌─────────────────────┐      ┌──────────────────┐
│ Nexmo SMS Service   │─────→│ Customer Phone   │
│ (Primary)           │      │ Receives SMS: 123456
└───────┬─────────────┘      └──────────────────┘
        │ (if fails)
        ↓
┌─────────────────────┐
│ Oson SMS Service    │
│ (Fallback)          │
└─────────────────────┘
        │
        ↓
┌──────────────────────────────┐
│ Customer enters OTP in app   │
│ POST /auth/verify-otp        │
└──────┬───────────────────────┘
       │ Verify against stored reference
       ↓
┌──────────────────────┐
│ JWT Token Generated  │
│ Return to app        │
└──────────────────────┘
```

### Flow 2: Wallet Top-up with Payment

```
┌─────────────────┐
│ Customer clicks │
│ "Add Wallet"    │
└────────┬────────┘
         │ POST /customer/wallet/add-balance
         ↓
┌────────────────────────────┐
│ Backend receives request   │
│ Determine payment gateway  │
│ (Razorpay for India)       │
└────────┬───────────────────┘
         │ POST /internal/payment/razorpay/create-order
         ↓
┌────────────────────────────┐
│ Razorpay API               │
│ Creates order              │
│ Returns order ID           │
└────────┬───────────────────┘
         │
         ↓
┌──────────────────────────────┐
│ Return order details to app  │
│ App shows payment form       │
└────────┬─────────────────────┘
         │
         ↓
┌────────────────────────────┐
│ Customer enters card       │
│ Razorpay processes payment │
│ Returns payment ID         │
└────────┬───────────────────┘
         │ Webhook: CHECKOUT.ORDER.COMPLETED
         ↓
┌──────────────────────────────────┐
│ Backend receives webhook         │
│ Verify signature                 │
│ Update customer wallet balance   │
│ Create transaction record        │
└──────────┬───────────────────────┘
           │ Async queue job
           ↓
┌──────────────────────────────┐
│ Send confirmation email      │
│ Send push notification       │
│ Update app balance           │
└──────────────────────────────┘
```

### Flow 3: Order Confirmation → Notifications

```
┌──────────────────────┐
│ Vendor views order   │
│ Clicks "Confirm"     │
└──────┬───────────────┘
       │ POST /vendor/orders/{id}/confirm
       ↓
┌────────────────────────────────┐
│ Backend receives confirmation  │
│ Update order status            │
│ Calculate prep time            │
└────────┬───────────────────────┘
         │ Multiple notification tasks
         ├─────────→ Send Email
         │           (to customer)
         │           /internal/email/send
         │
         ├─────────→ Firebase Push
         │           (to customer device)
         │           /internal/firebase/send-notification
         │
         └─────────→ WebSocket/Broadcast
                     (real-time dashboard)
```

---

## Configuration

### Environment Variables

Create `.env` file with the following:

```env
# SMS Providers
NEXMO_KEY=your_nexmo_api_key
NEXMO_SECRET=your_nexmo_secret
NEXMO_SMS_FROM=ZaZa

OSON_SMS_API_KEY=your_oson_api_key
OSON_SMS_URL=https://api.oson.tj/api/v1/sms

# Payment Gateways - Razorpay
RAZORPAY_KEY=rzp_test_xxxxxxxxxx
RAZORPAY_SECRET=xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=webhook_secret_xxxxx

# Payment Gateways - PayPal
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret

# Payment Gateways - SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASS=your_store_password

# Email (SMTP)
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_CREDENTIALS_FILE=firebase-credentials.json

# Storage
FILESYSTEM_DRIVER=azure
AZURE_STORAGE_ACCOUNT=your_account_name
AZURE_STORAGE_KEY=your_storage_key
AZURE_STORAGE_CONTAINER=zaza

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-3.5-turbo

# Queue
QUEUE_CONNECTION=database
```

### Service Account Setup

#### Firebase Service Account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as `firebase-credentials.json` in project root
4. Never commit to git!

```bash
# Add to .gitignore
firebase-credentials.json
```

#### Razorpay Webhook Setup

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://api.zaza.tj/internal/webhook/razorpay`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret to `.env`

---

## Security & Best Practices

### 1. API Key Management

```php
// ❌ NEVER do this
$config = [
    'api_key' => 'razorpay_key_secret_exposed'
];

// ✅ ALWAYS do this
$config = [
    'api_key' => env('RAZORPAY_KEY'),
    'secret' => env('RAZORPAY_SECRET')
];
```

### 2. Webhook Signature Verification

**Always verify webhook signatures** before processing payments:

```php
// ✅ CORRECT
$signature = request()->header('X-Razorpay-Signature');
if (!verifySignature($payload, $signature)) {
    Log::warning('Invalid webhook signature');
    return response()->json(['error' => 'Invalid signature'], 401);
}

// ❌ WRONG - processing without verification
$payment = json_decode(request()->getContent());
// ...process payment without verification
```

### 3. Rate Limiting

```php
// config/rate-limits.php
'sms' => [
    'per_phone' => 5,      // 5 OTPs
    'per_minute' => 1,     // 1 per minute
    'per_hour' => 10,      // 10 per hour
],
'emails' => [
    'per_user' => 100,     // 100 emails
    'per_day' => 1000,     // 1000 total per day
],
```

### 4. Payment Error Handling

```php
try {
    $result = $paymentGateway->processPayment($order);
} catch (PaymentGatewayException $e) {
    Log::error('Payment processing failed', [
        'order_id' => $order->id,
        'error_code' => $e->getCode(),
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    
    // Notify customer
    Mail::queue(new PaymentFailedMail($order));
    
    // Don't expose sensitive error details to client
    return response()->json([
        'error' => 'Payment processing failed. Please try again.'
    ], 400);
}
```

### 5. Logging Best Practices

```php
// ✅ Log essential information
Log::info('Payment captured', [
    'order_id' => $order->id,
    'amount' => $order->total,
    'gateway' => 'razorpay',
    'timestamp' => now()
]);

// ❌ NEVER log sensitive data
Log::info('Payment details', [
    'card_number' => $card->number,           // ❌ PCI DSS violation
    'cvv' => $card->cvv,                      // ❌ Don't log
    'razorpay_secret' => env('RAZORPAY_SECRET') // ❌ Never expose
]);
```

### 6. Retry Logic with Exponential Backoff

```php
$maxRetries = 3;
$retryDelay = 1; // seconds

for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
    try {
        return $smsService->sendOtp($phone);
    } catch (SmsProviderException $e) {
        if ($attempt === $maxRetries) {
            throw $e;
        }
        sleep($retryDelay);
        $retryDelay *= 2; // Exponential backoff
    }
}
```

### 7. Timeout Configuration

```php
// config/services.php
'sms' => [
    'nexmo' => [
        'timeout' => 5,    // 5 seconds
        'connect_timeout' => 3
    ],
    'oson' => [
        'timeout' => 8,
        'connect_timeout' => 4
    ]
],
'payment' => [
    'razorpay' => ['timeout' => 10],
    'paypal' => ['timeout' => 15]
],
```

---

## Testing

### Postman Collection

Import `server-integrations.postman_collection.json` into Postman:

1. Open Postman
2. Click "Import"
3. Select `server-integrations.postman_collection.json`
4. Set environment variables:
   - `base_url`: `http://localhost:8000/api/v1`
   - `api_token`: Your internal API token
5. Run requests

### Local Testing with Docker

```bash
# Start development environment
docker-compose up -d

# Run migrations
docker-compose exec app php artisan migrate

# Create test data
docker-compose exec app php artisan tinker
>>> $customer = User::factory()->state(['type' => 'customer'])->create();
>>> $customer->id

# Test SMS endpoint
curl -X POST http://localhost:8000/api/v1/internal/sms/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+992901234567", "user_type": "customer"}'
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| SMS not received | Wrong phone format | Use international format: +992... |
| Payment webhook not received | Webhook URL not registered | Go to provider dashboard and add webhook |
| Firebase notification not sent | Device token expired | Refresh device tokens regularly |
| Email not delivered | SMTP credentials expired | Update MAIL_PASSWORD in .env |
| AI classification timeout | Slow API response | Implement timeout handling, cache results |

### Debug Mode

```php
// Enable debug logging
env('APP_DEBUG=true')

// Check queue jobs
php artisan queue:failed
php artisan queue:retry

// Monitor SMS logs
tail -f storage/logs/sms.log

// Test payment configuration
php artisan tinker
>>> config('razor')
```

---

## Reference

- [Razorpay API Docs](https://razorpay.com/docs/api/)
- [PayPal Developer](https://developer.paypal.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/database)
- [OpenAI API](https://platform.openai.com/docs)
- [Nexmo SMS API](https://developer.vonage.com/sms)

---

**Last Updated:** March 27, 2026  
**Version:** 1.0.0  
**Maintained By:** ZaZa Development Team
