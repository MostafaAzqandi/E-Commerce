# Enterprise-Grade E-Commerce REST API

A highly scalable, robust, and decoupled e-commerce backend architecture built with **Node.js**, **Express.js**, and **MongoDB**, heavily optimized for maximum throughput using **Redis**. This system leverages modular architecture patterns, custom caching mechanisms, advanced role-based security, and event-driven notifications.

## 🚀 Key Architectural Highlights

### ⚡ Custom Caching & Invalidation Engine (`cacheMiddleware.js` & `clearCache.js`)

- **Performance Layer:** Implemented a custom middleware layer to cache slow, read-heavy queries (such as product catalogs) inside Redis.
- **Proactive Invalidation:** Uses a dedicated `clearCache.js` utility. When an admin updates or deletes a product, the cache is automatically invalidated in real-time, preventing stale data delivery without sacrificing database performance.

### 🛒 Pure In-Memory Cart Synchronization (`cartController.js`)

- **Zero-Database Overhead:** To avoid continuous disk I/O operations, shopping carts bypass MongoDB entirely. Carts are managed via a unified synchronization pattern (`PUT /api/v1/cart`) where states are evaluated against live product stock and written to Redis with a 14-day Time-To-Live (TTL).

### 🛡️ Layered Security Middleware Pool

- **State-Independent Authentication (`authMiddleware.js` & `generateToken.js`):** Secure token-based access utilizing signed JSON Web Tokens (JWT) extracted from HTTP-Only cookies.
- **Granular Authorization:** Multi-tier role management isolating client-side endpoints from sensitive administrative features via `adminRoutes.js`.
- **Distributed Rate Limiting (`rateLimiterMiddleware.js`):** Implemented a Redis-backed fixed-window rate limiter preventing malicious brute-force attacks on auth endpoints and safeguarding system resources across horizontally scaled clusters.

### 🔔 Event-Driven Notification System (`createNotification.js`)

- **System Event Triggers:** Decoupled utility to fire contextual user alerts during critical application lifecycle stages—such as order state transitions or profile updates—storing lightweight operational tracking inside `notificationModel.js`.

---

## 🛠️ Tech Stack & Ecosystem

- **Runtime & Framework:** Node.js, Express.js
- **Databases:** MongoDB (Persistence layer via Mongoose), Redis (High-speed caching & session state store)
- **Security:** JSON Web Tokens (JWT), BCrypt password hashing, customized CORS policy blocks
- **Error Management (`errorMiddleware.js`):** Centralized global exception catcher formatting semantic JSON error logs for client consumption while handling async router rejections natively.

---

## 🚦 Core API Endpoint Map

### 👤 User & Authentication (`/api/v1/users`)

- `POST /login` | `POST /register` — Secure auth entryways returning state tokens.

### 📦 Product Management (`/api/v1/products`)

- `GET /` — Cached catalog retrieval.
- `POST /` | `PUT /:id` | `DELETE /:id` — Protected admin routes backed by immediate Redis eviction triggers.

### 🛒 Shopping Cart (`/api/v1/cart`)

- `GET /` — Sub-millisecond extraction of the active user's cached cart data.
- `PUT /` — Validates incoming request quantities against live DB stock tables and sets the new unified cart state in cache memory.

### 💳 Order Processing (`/api/v1/orders`)

- `POST /` — Converts a verified Redis cart state into a permanent, structured document inside MongoDB, adjusting item inventory records atomically.

### 🔒 Administration Panel (`/api/v1/admin`)

- Administrative dashboard analytics, system overrides, and specialized store management queries.

---

## 💻 Local Quickstart

### Prerequisites

- Node.js v18+
- MongoDB URI
- Redis Server instance running locally or via Docker (`redis-server`)

### Setup

1. Clone the repository and install packages:
   ```bash
   npm install
   ```
2. Configure your environment variables inside `.env`:
   ```env
   APP_PORT=port
   MONGO_URI=your-mongo-url
   JWT_SECRET=jwt-secret
   NODE_ENV=development
   REDIS_URL=redis-url
   ```
3. Populate your development database with dummy data using the custom seeder tool:
   ```bash
   node src/seeder.js -import
   ```
4. Run the API server under live reload configuration:
   ```bash
   npm run dev
   ```
