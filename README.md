# DropIt 🛵 — Quick Delivery for Sawantwadi

Welcome to **DropIt**, a hyperlocal delivery platform featuring seller/store-owner dashboards, customer order tracking, campus canteen pickups, and Uber-style nearby store order routing.

---

## 🚀 Quick Start (Development)

You can run both the frontend and backend simultaneously using the root workspace scripts.

### Step 1: Install Dependencies
From the project root directory, run:
```bash
npm run install:all
```
This will automatically install dependencies in both the `client/` and `server/` directories.

### Step 2: Set Up Environment Variables
Create `.env` files in both components using the templates provided:
- In `server/`, create `.env` using [server/.env.example](file:///c:/Users/Prashant%20Dubey/OneDrive/Desktop/Dropit%20Project/server/.env.example)
- In `client/`, create `.env` using [client/.env.example](file:///c:/Users/Prashant%20Dubey/OneDrive/Desktop/Dropit%20Project/client/.env.example)

### Step 3: Run Database Seed
Ensure your local MongoDB instance is running:
- **Windows**: Run `net start MongoDB` in Administrator PowerShell.
- Run the database seeder from the root folder:
```bash
npm run seed
```

### Step 4: Start Dev Server
Run the following command at the root directory:
```bash
npm run dev
```
This starts:
- 🛵 **Backend server**: [http://localhost:5000](http://localhost:5000)
- 💻 **Frontend client**: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Login Credentials

### Admin Account
- **Email**: `prashantdubey2306@gmail.com`
- **Password**: `123456789`

### Test Customer Account
- **Email**: `user@test.com`
- **Password**: `user123`

---

## 🛠️ Project Structure

- **`client/`**: React + Vite frontend application.
  - `src/components/`: Shared React UI components.
  - `src/components/seller/`: Dashboard controls for merchants.
  - `src/context/`: Authentication, Cart, Location, and Socket contexts.
  - `src/pages/`: Page containers (Home, Deals, Cart, Admin, Canteen, Seller).
- **`server/`**: Express + Socket.IO backend API.
  - `config/`: Database connection configurations.
  - `middleware/`: Authentication and Seller validations.
  - `models/`: Mongoose schemas (User, Product, Order, Store, Canteen).
  - `routes/`: Express endpoint route handlers.
  - `scripts/`: Seeding and image management tasks.
- **`render.yaml`**: Configuration file for SPA deployment to Render.
