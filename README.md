# ZaZa Service — Full App

A complete food/delivery service ecosystem consisting of four interconnected applications.

## Applications

| App | Stack | Description |
|-----|-------|-------------|
| **Backend API** | Laravel 10, Passport OAuth, MySQL | Core REST API powering all apps |
| **Customer App** | Flutter (iOS/Android) | End-user ordering app |
| **Driver App** | Flutter (iOS/Android) | Delivery driver app |
| **Restaurant Web** | React 19 + Vite + TypeScript | Partner/restaurant landing & request forms |

## Structure

```
back-end-app/store-maestro-back/   ← Laravel API
front-end-customer-app/ZaZaGoo/    ← Customer Flutter app
front-end-app-delivery/Zaza Driver/ ← Driver Flutter app
front-end-app-restaurant/zazaTJ/   ← Restaurant web app
```

## Features

- Phone + OTP authentication (customers & drivers)
- Real-time order management
- Multi-vendor: restaurants, pharmacies, supermarkets, box delivery
- Wallet system with withdrawal requests
- Driver geolocation & online/offline toggle
- Partner request forms (restaurant & B2B)
- Multi-payment: PayPal, Paytm, RazorPay, Flutterwave, SSLCommerz, wallet

## Getting Started

### Backend
```bash
cd back-end-app/store-maestro-back
cp .env.example .env
composer install
php artisan key:generate
php artisan passport:install
php artisan migrate --seed
php artisan serve
```

### Customer & Driver Apps
```bash
flutter pub get
flutter run
```

### Restaurant Web
```bash
cd front-end-app-restaurant/zazaTJ
npm install
npm run dev
```
