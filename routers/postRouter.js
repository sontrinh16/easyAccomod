const express = require('express');
const multer  = require('multer');
const axios = require('axios');
const upload = multer();
const FormData = require('form-data');
const reviewRouter = require('./reviewRouter');
const postController = require('../controllers/postController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const roomController =  require('../controllers/roomController');
const reportController = require('../controllers/reportController');
const Post = require('./../models/post');
const e = require('express');
const appError = require('../utils/appError');

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

router.post('/:id/upload-image',upload.single('image') , async (req, res, next) => {
    try{
        let post = await Post.findOne({_id: req.params.id});
        if(post){
            //console.log(req.file.buffer)
            let data = new FormData();
            data.append('image', req.file.buffer.toString('base64'));
            data.append('type','base64')
            console.log(data)
            const imgurData = await axios.post(
                'https://api.imgur.com/3/image',
                data,
                {
                    headers: {
                        'Authorization': 'Client-ID 546c25a59c58ad7',
                        'content-type': 'multipart/form-data',
                        ...data.getHeaders()
                    }
                }
            ) 
            console.log(imgurData.data.data.link);
            let links = post.images;
            links.push(imgurData.data.data.link);
            post = await Post.findByIdAndUpdate({_id: post._id}, {images: links},{new: true});
            res.status(200).json({
                status: 'success',
                data:{
                    post
                }
            });
        }
        else {
            return next(new appError(404, 'Post not found'));
        }
    }
    catch(err){
        console.log(err.response ? err.response.data.data : err);
        return next(err);
    }
})

module.exports = router;