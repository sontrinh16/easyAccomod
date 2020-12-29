const express = require('express');
const reviewRouter = require('./reviewRouter');
const postController = require('../controllers/postController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const roomController =  require('../controllers/roomController');
const reportController = require('../controllers/reportController');

const router = express.Router({ mergeParams: true});

router.get('/:id', postController.getPost);

router.get('/',postController.getPosts);

router.post('/search', postController.searchPost);

router.use(userController.isLogin);

router.get('/get-all-posts', userController.restrictedTo('admin'), postController.getAllPosts);

//router.get('/',postController.getUserPost);

router.post('/get-user-post',userController.restrictedTo('owner','admin'), postController.getUserPost);

router.post('/new-post',userController.restrictedTo('owner','admin'), roomController.createRoom, postController.createPost);

router.put('/:id/edit-post',userController.restrictedTo('owner','admin'), postController.editPost);

router.put('/:id/edit-room',userController.restrictedTo('owner','admin'), roomController.editRoom);

router.put('/:id/prolong-time-post',userController.restrictedTo('admin'), postController.prolongTimePost);

router.post('/:id/reportRoom',userController.restrictedTo('renter'), reportController.createReport);

//router.post('/search', postController.searchPost);

router.get('/:id/add-favorite',userController.restrictedTo('renter'), postController.addFavorite);

router.get('/:id/remove-favorite',userController.restrictedTo('renter'), postController.removeFavorite);

router.put('/:id/toggle-active-post',userController.restrictedTo('owner','admin'), postController.toggleActivePost)

// router.delete('/deletePost', postController.deletePost);

router.get('/:id/authenticate-post', userController.restrictedTo('admin'), postController.authenticatePost);

router.post('/:id/new-review',userController.restrictedTo('renter','admin'), reviewController.createReview);

router.use('/:post-id/reiews', reviewRouter);

module.exports = router;