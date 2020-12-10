const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Post = require('./../models/post');
const Room = require('./../models/room');

exports.getPost = catchAsync(async (req, res, next) => {
    const posts = await Post.find({}).populated('Room');
    
    res.status(200).json({
        status: "success",
        data: {
            posts
        }
    });
});

exports.getPost = catchAsync(async (req, res, next) => {
    const post = await (await Post.findOne({_id: req.params.id})).populated('Room');

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

    
})