const express = require('express');
const postController = require('../controllers/postController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const roomController =  require('../controllers/roomController');
const reportController = require('../controllers/reportController');

const router = express.Router({ mergeParams: true});

router.use(userController.isLogin);

module.exports = router;