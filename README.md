# DigitalLibrary
A full-stack MERN (MongoDB, Express, React, Node.js) Library Management System featuring user authentication, subscription plans, payment integration (Razorpay with UPI), admin dashboard, visual seating chart for boys and girls, and real-time seat booking.

## Free Hosting

Use MongoDB Atlas for the database, Render for the backend, and Vercel for the frontend.

### 1. Deploy the backend on Render

Create a new **Web Service** from this repository with:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Add these environment variables in Render. Copy the values from your local `backend/.env`; never commit that file:

`MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `ADMIN_EMAIL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `FRONTEND_URL`

Set `FRONTEND_URL` to the final Vercel URL after deploying the frontend. Render's free service sleeps when unused, so the first request may take a little longer.

### 2. Deploy the frontend on Vercel

Import the repository as a Vercel project with:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Add this environment variable in Vercel:

`VITE_API_URL=https://your-render-service.onrender.com`

Redeploy after adding it. The frontend uses the local Vite proxy when this value is empty, and the public Render URL when deployed.

### 3. Update CORS and reset links

After Vercel gives you the final URL, update Render's `FRONTEND_URL` to that URL and redeploy the backend. Password reset links will then open on the hosted frontend.

The backend automatically creates 100 seats when the connected database has no seats.
