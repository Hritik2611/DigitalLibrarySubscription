const express = require('express');
const {
getAllSeatsAdmin,
toggleSeatBlock,
releaseSeat,
assignSeat,
initializeSeats
} = require('../controllers/adminSeatController');
const {protect, admin} = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, admin);

router.get('/', getAllSeatsAdmin);

// Initialize seats (run once)
router.post('/initialize', initializeSeats);

// Block/Unblock seat
router.patch('/:seatNumber/toggle-block', toggleSeatBlock);

// Release seat
router.post('/:seatNumber/release', releaseSeat);

// Assign seat manually
router.post('/assign', assignSeat);

module.exports = router;