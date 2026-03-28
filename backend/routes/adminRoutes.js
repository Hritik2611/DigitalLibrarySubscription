// src/routes/adminRoutes.js
const express = require("express");
const {
  getAllUsers,
  deleteUser,
  getAllSubscriptions,
  getAdminStats,
} = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/stats").get(protect, admin, getAdminStats);

router.route("/users").get(protect, admin, getAllUsers);
router.route("/users/:id").delete(protect, admin, deleteUser);

//subscriptio management route
router.route("/subscriptions").get(protect, admin, getAllSubscriptions);

module.exports = router;
