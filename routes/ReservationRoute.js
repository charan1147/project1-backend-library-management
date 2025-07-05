const express = require('express');
const router = express.Router();
const { reserveBook, cancelReservation, getUserReservations, getAllReservations, notifyUser, getOverdueBooks } = require('../controllers/ReservationController');
const { isAuthenticated, isAdmin } = require('../middleware/authController');

router.post('/', isAuthenticated, reserveBook);
router.delete('/:reservationId', isAuthenticated, cancelReservation);
router.get('/user', isAuthenticated, getUserReservations); 
router.get('/', isAuthenticated, isAdmin, getAllReservations);
router.post('/notify/:reservationId', isAuthenticated, isAdmin, notifyUser);
router.get('/overdue', isAuthenticated, isAdmin, getOverdueBooks);

module.exports = router;
