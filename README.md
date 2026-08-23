# 📚 Digital Library Subscription

A full-stack **MERN** (MongoDB, Express, React, Node.js) application for managing a physical/digital library's seat subscriptions — students can register, pick a seat from a visual seating chart, subscribe to a plan, and pay online via Razorpay. Admins get a dashboard to manage users, seats, subscriptions, and payments.

---

## ✨ Features

- 🔐 **User Authentication** — Register with email OTP verification, login, forgot/reset password (JWT-based sessions)
- 🪑 **Visual Seating Plan** — Interactive seat grid showing available / booked (male / female) / blocked seats in real time
- 💳 **Online Payments** — Razorpay integration with signature verification and server-side amount validation
- 📅 **Subscription Plans** — 1 / 3 / 6 / 12-month plans with automatic expiry tracking
- 🪪 **Virtual ID Card** — Auto-generated dashboard card showing plan, seat, and days remaining
- 🛠️ **Admin Dashboard** — Manage users, seats, subscriptions, and view payment history
- 📧 **Automated Emails** — OTP verification, payment confirmation, and expiry-reminder notifications (via `node-cron`)

---

## 🧰 Tech Stack

| Layer      | Technology                                                             |
|------------|-------------------------------------------------------------------------|
| Frontend   | React 19, Vite, Redux Toolkit, React Router, Tailwind CSS v4           |
| Backend    | Node.js, Express 5, Mongoose                                           |
| Database   | MongoDB (Atlas)                                                        |
| Payments   | Razorpay                                                               |
| Email      | Nodemailer                                                             |
| Scheduling | node-cron (subscription expiry reminders)                             |

---

## 📁 Project Structure

```
DigitalLibrarySubscription/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic (auth, seats, subscriptions, payments, admin)
│   ├── middlewares/     # Auth & admin route protection
│   ├── models/          # Mongoose schemas (User, Seat, Subscription)
│   ├── routes/          # Express routers
│   ├── utils/           # Email service, JWT helper, expiry-reminder cron job
│   └── server.js        # App entry point
└── frontend/
    ├── src/
    │   ├── components/  # Header, AuthLayout, PlanCard, route guards, admin menu
    │   ├── pages/        # Login, Register, Dashboard, Seating Plan, Plans, Admin pages
    │   ├── store/        # Redux slices
    │   └── main.jsx      # App entry point
    └── vite.config.js
```

---

## ⚙️ Environment Variables

### `backend/.env`

| Variable              | Description                                              |
|-----------------------|------------------------------------------------------------|
| `PORT`                | Port the backend runs on (e.g. `5000`)                      |
| `MONGO_URI`           | MongoDB Atlas connection string                             |
| `JWT_SECRET`          | Any long random string used to sign auth tokens             |
| `RAZORPAY_KEY_ID`     | Razorpay API key ID                                          |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret                                      |
| `EMAIL_USER`          | Email address used to send OTP/notification emails           |
| `EMAIL_PASS`          | App password for the email account (not your regular password)|
| `ADMIN_EMAIL`         | Email address that receives new-payment notifications         |

### `frontend/.env`

| Variable               | Description                                                                 |
|------------------------|-------------------------------------------------------------------------------|
| `VITE_API_URL`         | Base URL of the deployed backend (leave unset for local dev — uses Vite proxy)|
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key ID (same as backend's `RAZORPAY_KEY_ID`)                  |

Copy `.env.example` → `.env` in both folders and fill in your own values. **Never commit your real `.env` file.**

---

## 🚀 Running Locally

### 1. Clone and install

```bash
git clone https://github.com/Hritik2611/DigitalLibrarySubscription.git
cd DigitalLibrarySubscription

cd backend && npm install
cd ../frontend && npm install
```

### 2. Set up environment variables

Create `backend/.env` and `frontend/.env` as described above.

### 3. Run the backend

```bash
cd backend
npm start        # or: npm run dev (with nodemon auto-reload)
```

Backend runs on `http://localhost:5000`.

### 4. Run the frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` requests to the backend automatically (see `vite.config.js`).

---

## 🔑 Default Admin Access

There's no seeded admin account — promote a user to admin manually by setting their `role` field to `"admin"` directly in the MongoDB `users` collection (via Atlas's Data Explorer or MongoDB Compass).


