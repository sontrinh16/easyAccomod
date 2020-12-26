const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Post = require('./../models/post');
const Room = require('./../models/room');
const User = require('../models/user');
const Review = require('../models/review');
const roomController = require('./../controllers/roomController');

exports.getPosts = catchAsync(async (req, res, next) => {
    let posts = await Post.find({authenticate: true}).populate('author').populate('rooms');
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

exports.getAllPosts = catchAsync(async (req, res, next) => {
    let posts = await Post.find({}).populate('author').populate('rooms');
    if (posts.length !== 0){
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
    console.log(req.user);
    if (posts.length !== 0){
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

exports.check = (req, res, next) => {
    console.log(req.user);
    return next();
};

exports.getPost = catchAsync(async (req, res, next) => {
    let post = await Post.findOne({_id: req.params.id}).populate('author').populate('rooms');
    if (post !== null)
    {
        delete post.authenticate;
        let reviews = await Review.find({belongTo: req.params.id}).populate('author');
        res.status(200).json({
            status: "success",
            data: {
                post,
                reviews
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
    let post = await Post.findOne({ _id: req.params.id });
    let user = req.user;
    if (post){
        user.favoriteRoom.push(post._id);
        user = await user.save();
        post = await Post.findOneAndUpdate({_id: post._id}, {saved: post.saved + 1},{
            new: true
        });
    res.status(200).json({
        status: 'success'
    });
    }
    else {
        return next(new appError(404, 'Post not found'))
    }
});

exports.removeFavorite = catchAsync(async (req, res, next) => {
    let post = await Post.findOne({ _id: req.params.id });
    let user = req.user;
    if (post){
        if (user.favoriteRoom.includes(post._id)){
            user.favoriteRoom.splice(user.favoriteRoom.indexOf(post._id),1);
            user = await user.save();
            post = await Post.findOneAndUpdate({_id: post._id}, {saved: post.saved - 1},{
                new: true
            });
            res.status(200).json({
                status: 'success'
            });
        }
    return next(new appError(404, ' Post not found in user favorite list'));
    }
    else {
        return next(new appError(404, 'Post not found'))
    }
});

exports.prolongTimePost = catchAsync(async (req, res, next) => {
    let post = await User.findOneAndUpdate({ _id: req.params.id }, {
        expiredAt: Date.parse(req.body.expiredAt),
        postPrice: req.body.postPrice
    });
    res.status(200).json({
        status: 'success'
    });
});

exports.toggleActivePost = catchAsync(async (req, res, next) => {
    let post = await Post.findOne({_id: req.params.id});
    if(post){
        if(post.status === 'active'){
            post.status = 'inactive';
        }
        else {
            post.status = 'active';
        }
        post = await post.save();

        res.status(200).json({
            status: 'success'
        });
    }
    else{
        return next(new appError(404, 'Post not found'));
    }
});

exports.authenticatePost = catchAsync(async(req, res, next) => {
    let post = await Post.findOneAndUpdate({_id: req.params.id}, {authenticate: true}, {
        new: true
    });
    res.status(200).json({
        status: 'success'
    });
});