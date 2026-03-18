# DropIt 🛵 — Quick Delivery for Sawantwadi

## How to run (3 steps)

### Step 1 — Install dependencies
Open terminal in VS Code and run:
```
cd server
npm install
cd ../client
npm install
```

### Step 2 — Start MongoDB and seed database
In Administrator PowerShell:
```
net start MongoDB
```
Then in VS Code terminal:
```
cd server
node seed.js
```

### Step 3 — Run backend + frontend

Terminal 1 (backend):
```
cd server
npm run dev
```

Terminal 2 (frontend):
```
cd client
npm run dev
```

Open browser: http://localhost:5173

---

## Admin Login
Email: admin@dropit.com
Password: admin123

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT tokens

## Pages
- / — Home (browse products)
- /product/:id — Product detail
- /cart — Cart & checkout
- /orders — Track orders by phone
- /admin — Admin dashboard
- /login — Login
- /register — Register
