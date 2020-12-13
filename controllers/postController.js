const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Post = require('./../models/post');
const Room = require('./../models/room');
const roomController = require('./../controllers/roomController');

exports.getPosts = catchAsync(async (req, res, next) => {
    const posts = await Post.find({}).populate('author').populate('rooms');
    
    res.status(200).json({
        status: "success",
        data: {
            posts
        }
    });
});

exports.getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findOne({_id: req.params.id}).populate('author').populate('rooms');

    res.status(200).json({
        status: "success",
        data: {
            post
        }
    });
});

exports.createPost = catchAsync(async (req, res, next) => {
    let post = new Post(req.body);
    post = await post.save();

    res.status(200).json({
        status: "success"
    });
   
});
