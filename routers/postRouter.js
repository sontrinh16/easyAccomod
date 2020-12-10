const express = require('express');
const reviewRouter = require('./reviewRouter');
const postController = require('../controllers/postController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');


const router = express.Router({ mergeParams: true});

// router.get('/', postController.getPosts);

// router.get('/:id', postController.getPost);

// router.post('/new-post', postController.createPost);

// router.put('/editPost', postController.editPost);

// router.post('/prolongTimePost', postController.prolongTimePost);

// router.get('/reportRoom', postController.reportRoom);

// router.post('/search', postController.searchPost);

// router.get('/add-favorite', userController.addFavorite);

// router.put('/toggleActivePost', postController.toggleActivePost)

// router.delete('/deletePost', postController.deletePost);

// router.use('/review', reviewRouter);

// router.get('/reiews', reviewController.getReviews);

module.exports = router;