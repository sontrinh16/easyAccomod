const express = require('express');
const reviewRouter = require('./reviewRouter');
const postController = require('../controllers/postController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const roomController =  require('../controllers/roomController');


const router = express.Router({ mergeParams: true});

//router.use(userController.isLogin)

router.get('/',postController.getPosts);

router.get('/:id', postController.getPost);

router.post('/new-post', roomController.createRoom, postController.createPost);

// router.put('/:id/editPost', postController.editPost);

// router.put('/:id/prolongTimePost', postController.prolongTimePost);

// router.get('/:id/reportRoom', postController.reportRoom);

// router.post('/search', postController.searchPost);

// router.get('/:id/add-favorite', userController.addFavorite);

// router.put('/:id/toggleActivePost', postController.toggleActivePost)

// router.delete('/deletePost', postController.deletePost);

// router.use('/:id/review', reviewRouter);

// router.get('/:id/reiews', reviewController.getReviews);

module.exports = router;