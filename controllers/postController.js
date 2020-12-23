const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Post = require('./../models/post');
const Room = require('./../models/room');
const User = require('../models/user');
const roomController = require('./../controllers/roomController');

exports.getPosts = catchAsync(async (req, res, next) => {
    let posts = await Post.find({}).populate('author').populate('rooms');
    if (req.user.role !== 'admin'){
        //posts = posts.filter(post => { post.authenticate == true});
    }
    if (posts.length !== 0){
        posts = posts.map(post => {
            delete post.authenticate;
            return post;
        });
        res.status(200).json({
            status: "success",
            data: {
                posts
            }
        });
    }
    else {
        return next(new appError(404, 'No posts found'));
    }
});

exports.getUserPost = catchAsync(async (req, res, next) => {
    let posts = await Post.find({author: req.user._id}).populate('author').populate('rooms');
    //posts = posts.filter(post => { post.authenticate == true});
    if (posts.length !== 0){
        posts = posts.map(post => {
            delete post.authenticate;
            return post;
        });
        res.status(200).json({
            status: "success",
            data: {
                posts
            }
        });
    }
    else {
        return next(new appError(404, 'No posts found'));
    }
});

exports.getPost = catchAsync(async (req, res, next) => {
    let post = await Post.findOne({_id: req.params.id}).populate('author').populate('rooms');
    if (post !== null)
    {
        delete post.authenticate;
        res.status(200).json({
            status: "success",
            data: {
                post
            }
        });
    }
    else {
        return next(new appError(404, 'Post not found!'));
    }
});

exports.createPost = catchAsync(async (req, res, next) => {
    let post = new Post(req.body);
    post.author = req.user._id;
    if( req.user.role === 'admin'){
        post.authenticate = true;
    }
    post = await post.save();

    res.status(200).json({
        status: "success"
    });
   
});

exports.editPost = catchAsync(async (req, res, next) => {
    let post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true
    });
    res.status(200).json({
        status: 'success'
    });
});

exports.addFavorite = catchAsync(async (req, res, next) => {
    let user = await User.findOneAndUpdate({ _id: req.user._id }, {favoriteRoom: req.user.favoriteRoom}, {
        new: true
    });
    res.status(200).json({
        status: 'success'
    });
});

exports.authenticatePost = catchAsync(async(req, res, next) => {
    let post = await Post.findOneAndUpdate({_id: req.params.id}, {authenticate: true}, {
        new: true
    });
    res.status(200).json({
        status: 'success'
    });
})