const express = require('express');
const postController = require('../controllers/postController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const roomController =  require('../controllers/roomController');
const reportController = require('../controllers/reportController');

const router = express.Router({ mergeParams: true});

router.get('/:id', postController.getPost);

router.get('/',postController.getPosts);

router.use(userController.isLogin);

router.post('/new-post', roomController.createRoom, postController.createPost);

router.put('/:id/editPost', postController.editPost);

router.get('/get-user-post', postController.getUserPost);

//router.put('/:id/prolongTimePost', postController.prolongTimePost);

router.post('/:id/reportRoom', reportController.createReport);

// router.post('/search', postController.searchPost);

router.get('/:id/add-favorite', postController.addFavorite);

//router.put('/:id/toggleActivePost', postController.toggleActivePost)

// router.delete('/deletePost', postController.deletePost);

router.post('/:id/new-review', reviewController.createReview);

//router.get('/:id/reiews', reviewController.getReviews);

module.exports = router;