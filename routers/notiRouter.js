const express = require('express');
const postController = require('../controllers/postController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const roomController =  require('../controllers/roomController');
const reportController = require('../controllers/reportController');
const notificationController = require('./../controllers/notificationController');
const userRouter = require('./userRouter');
const postRouter = require('./postRouter');

const router = express.Router({ mergeParams: true});

router.use(userController.isLogin);

router.get('/', userController.restrictedTo('renter','owner','admin'), notificationController.getNotifications);

router.get('/get-all-notification', userController.restrictedTo('admin'), notificationController.getAllNotifications);

router.get('/:id', userController.restrictedTo('renter','owner','admin'), notificationController.seenNotification);

router.post('/read-all', userController.restrictedTo('renter','owner','admin'), notificationController.seenAllNotification);

//router.use(userController.isLogin);

//router.get('/:id/authenticate-review',userController.restrictedTo('admin'), reviewController.authenticateReview);

module.exports = router;