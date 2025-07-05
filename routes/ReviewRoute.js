const express = require('express');
const router = express.Router();
const { addReview, getReviewsByBook } = require('../controllers/ReviewController');
const { isAuthenticated } = require('../middleware/authController');

router.post('/reviews', isAuthenticated, addReview);
router.get('/reviews/:bookId', getReviewsByBook);

module.exports = router;
