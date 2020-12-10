const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true});

//router.post('/new-review', reviewController.newReview);

module.exports = router;