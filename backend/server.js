const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDb = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const setupSubscriptionNotifier = require('./utils/notificationScheduler');
const paymentRoutes = require('./routes/paymentRoutes');
const seatRoutes = require('./routes/seatRoutes');
const adminSeatRoutes = require('./routes/adminSeatRoutes');

dotenv.config();

// Connect DB
connectDb();

// Setup notification scheduler
setupSubscriptionNotifier();

const app = express();

// CORS
app.use(cors());

// Middleware to accept JSON data
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running... 💹');
});

// Mount the routes
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/admin/seats', adminSeatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});