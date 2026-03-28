const express = require('express');

const{getAllSeats, selectSeat, getMySeat, releaseExpiredSeats} = require('../controllers/seatController');
const {protect, admin} = require('../middlewares/authMiddleware')

const router = express.Router();

router.get('/', protect, getAllSeats);

router.post('/select', protect, selectSeat);

router.get('/my-seat', protect, getMySeat);

router.post('/release-expired', protect, admin, releaseExpiredSeats);

module.exports = router;
